import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../models/entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    // Verificar que el nombre del rol sea único
    const existingRole = await this.roleRepository.findOne({
      where: { nombre: createRoleDto.nombre.toUpperCase() }
    });

    if (existingRole) {
      throw new BadRequestException('Ya existe un rol con ese nombre');
    }

    const newRole = this.roleRepository.create({
      ...createRoleDto,
      nombre: createRoleDto.nombre.toUpperCase()
    });

    return await this.roleRepository.save(newRole);
  }

  async findAll(includeInactive: boolean = false): Promise<Role[]> {
    const queryBuilder = this.roleRepository.createQueryBuilder('role');
    
    if (!includeInactive) {
      queryBuilder.where('role.estado = :estado', { estado: true });
    }
    
    return await queryBuilder.getMany();
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { id } });
    
    if (!role) {
      throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    }
    
    return role;
  }

  async findByName(nombre: string): Promise<Role | undefined> {
    const role = await this.roleRepository.findOne({ 
      where: { nombre: nombre.toUpperCase() } 
    });
    return role === null ? undefined : role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);

    // Si se está actualizando el nombre, verificar que sea único
    if (updateRoleDto.nombre && updateRoleDto.nombre.toUpperCase() !== role.nombre) {
      const existingRole = await this.roleRepository.findOne({
        where: { nombre: updateRoleDto.nombre.toUpperCase() }
      });

      if (existingRole) {
        throw new BadRequestException('Ya existe un rol con ese nombre');
      }
    }

    Object.assign(role, {
      nombre: updateRoleDto.nombre ? updateRoleDto.nombre.toUpperCase() : role.nombre,
      descripcion: updateRoleDto.descripcion !== undefined ? updateRoleDto.descripcion : role.descripcion,
    });

    return await this.roleRepository.save(role);
  }

  async remove(id: number): Promise<void> {
    const role = await this.findOne(id);
    
    // Verificar que no haya usuarios asociados con este rol
    const usersWithRole = await this.roleRepository.createQueryBuilder('role')
      .leftJoin('role.users', 'user')
      .where('role.id = :id', { id })
      .andWhere('user.estado = :estado', { estado: true })
      .getCount();

    if (usersWithRole > 0) {
      throw new BadRequestException('No se puede eliminar el rol porque tiene usuarios asociados');
    }

    // Soft delete
    role.estado = false;
    await this.roleRepository.save(role);
  }

  async restore(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { id } });
    
    if (!role) {
      throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    }
    
    role.estado = true;
    return await this.roleRepository.save(role);
  }

  async seedDefaultRoles(): Promise<void> {
    const defaultRoles = [
      { nombre: 'ADMIN', descripcion: 'Administrador del sistema' },
      { nombre: 'VETERINARIO', descripcion: 'Veterinario' },
      { nombre: 'CLIENTE', descripcion: 'Cliente/Propietario de mascotas' },
      { nombre: 'RECEPCIONISTA', descripcion: 'Recepcionista' }
    ];

    for (const roleData of defaultRoles) {
      const existingRole = await this.findByName(roleData.nombre);
      if (!existingRole) {
        await this.create(roleData);
      }
    }
  }
}
