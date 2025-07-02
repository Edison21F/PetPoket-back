import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../models/entities/user.entity';
import { Role } from '../models/entities/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Verificar que el rol existe
    const role = await this.roleRepository.findOne({ 
      where: { id: createUserDto.rolId } 
    });
    
    if (!role) {
      throw new BadRequestException('El rol especificado no existe');
    }

    // Verificar email único
    const existingEmail = await this.userRepository.findOne({
      where: { correo: createUserDto.correo }
    });
    
    if (existingEmail) {
      throw new BadRequestException('El correo ya está registrado');
    }

    // Verificar cédula única
    const existingCedula = await this.userRepository.findOne({
      where: { cedula: createUserDto.cedula }
    });
    
    if (existingCedula) {
      throw new BadRequestException('La cédula ya está registrada');
    }

    const newUser = this.userRepository.create({
      ...createUserDto,
      rol: role
    });
    
    return await this.userRepository.save(newUser);
  }

  async findAll(includeInactive: boolean = false): Promise<User[]> {
    const queryBuilder = this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.rol', 'rol');
    
    if (!includeInactive) {
      queryBuilder.where('user.estado = :estado', { estado: true });
    }
    
    return await queryBuilder.getMany();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ 
      where: { id },
      relations: ['rol']
    });
    
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    
    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ 
      where: { correo: email },
      relations: ['rol']
    });
    return user ?? undefined;
  }

  async findByCedula(cedula: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ 
      where: { cedula },
      relations: ['rol']
    });
    return user ?? undefined;
  }

  async findByRole(roleName: string): Promise<User[]> {
    return await this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.rol', 'rol')
      .where('rol.nombre = :roleName', { roleName })
      .andWhere('user.estado = :estado', { estado: true })
      .getMany();
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    
    // Si se está actualizando el rol
    if (updateUserDto.rolId) {
      const role = await this.roleRepository.findOne({ 
        where: { id: updateUserDto.rolId } 
      });
      
      if (!role) {
        throw new BadRequestException('El rol especificado no existe');
      }
      
      user.rol = role;
    }

    // Si se está actualizando el email, verificar que sea único
    if (updateUserDto.correo && updateUserDto.correo !== user.correo) {
      const existingEmail = await this.userRepository.findOne({
        where: { correo: updateUserDto.correo }
      });
      
      if (existingEmail) {
        throw new BadRequestException('El correo ya está registrado');
      }
    }

    // Si se está actualizando la cédula, verificar que sea única
    if (updateUserDto.cedula && updateUserDto.cedula !== user.cedula) {
      const existingCedula = await this.userRepository.findOne({
        where: { cedula: updateUserDto.cedula }
      });
      
      if (existingCedula) {
        throw new BadRequestException('La cédula ya está registrada');
      }
    }

    // Si se está actualizando la contraseña
    if (updateUserDto.contrasenaNueva) {
      const saltRounds = 10;
      user.contrasena = await bcrypt.hash(updateUserDto.contrasenaNueva, saltRounds);
    }

    // Actualizar otros campos
    Object.assign(user, {
      nombres: updateUserDto.nombres || user.nombres,
      apellidos: updateUserDto.apellidos || user.apellidos,
      correo: updateUserDto.correo || user.correo,
      cedula: updateUserDto.cedula || user.cedula,
    });

    return await this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    
    // Soft delete: cambiar estado a false en lugar de eliminar
    user.estado = false;
    await this.userRepository.save(user);
  }

  async restore(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    
    user.estado = true;
    return await this.userRepository.save(user);
  }

  async changePassword(id: number, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar contraseña actual
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.contrasena);
    
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('La contraseña actual es incorrecta');
    }

    // Hashear nueva contraseña
    const saltRounds = 10;
    user.contrasena = await bcrypt.hash(newPassword, saltRounds);
    
    await this.userRepository.save(user);
  }

  async getUserStats(): Promise<any> {
    const totalUsers = await this.userRepository.count();
    const activeUsers = await this.userRepository.count({ where: { estado: true } });
    const inactiveUsers = await this.userRepository.count({ where: { estado: false } });
    
    const usersByRole = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.rol', 'rol')
      .select(['rol.nombre as rolNombre', 'COUNT(user.id) as cantidad'])
      .where('user.estado = :estado', { estado: true })
      .groupBy('rol.nombre')
      .getRawMany();

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      usersByRole
    };
  }
}