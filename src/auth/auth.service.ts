import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(correo: string, pass: string) {
    const user = await this.usersService.findByEmail(correo);
    if (user && await bcrypt.compare(pass, user.contrasena)) {
      const { contrasena, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { sub: user.id, correo: user.correo };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
