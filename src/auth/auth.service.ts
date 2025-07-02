import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    public jwtService: JwtService
  ) {}

  async validateUser(correo: string, pass: string) {
    const user = await this.usersService.findByEmail(correo);
    if (user && await bcrypt.compare(pass, user.contrasena)) {
      const { contrasena, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.correo, loginDto.contrasena);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { 
      sub: user.id, 
      correo: user.correo,
      rol: user.rol.nombre,
      rolId: user.rol.id
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        nombres: user.nombres,
        apellidos: user.apellidos,
        correo: user.correo,
        rol: user.rol.nombre
      }
    };
  }

  async register(registerDto: RegisterDto) {
    // Verificar si el usuario ya existe
    const existingUser = await this.usersService.findByEmail(registerDto.correo);
    if (existingUser) {
      throw new BadRequestException('El correo ya está registrado');
    }

    // Verificar si la cédula ya existe
    const existingCedula = await this.usersService.findByCedula(registerDto.cedula);
    if (existingCedula) {
      throw new BadRequestException('La cédula ya está registrada');
    }

    // Hashear la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(registerDto.contrasena, saltRounds);

    // Crear el usuario
    const newUser = await this.usersService.create({
      ...registerDto,
      contrasena: hashedPassword
    });

    const { contrasena, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async validateToken(payload: any) {
    const user = await this.usersService.findOne(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Token inválido');
    }
    return user;
  }
}