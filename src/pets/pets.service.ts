import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pet } from '../models/entities/pet.entity';
import { PetType } from '../models/entities/petType.entity';
import { User } from '../models/entities/user.entity';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';

@Injectable()
export class PetsService {
  constructor(
    @InjectRepository(Pet)
    private readonly petRepository: Repository<Pet>,
    @InjectRepository(PetType)
    private readonly petTypeRepository: Repository<PetType>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createPetDto: CreatePetDto, currentUserId: number, userRole: string): Promise<Pet> {
    // Verificar que el tipo de mascota existe
    const petType = await this.petTypeRepository.findOne({
      where: { id: createPetDto.tipoId, estado: true }
    });

    if (!petType) {
      throw new BadRequestException('El tipo de mascota especificado no existe');
    }

    // Determinar el propietario
    let ownerId = currentUserId;
    
    // Solo admins y veterinarios pueden crear mascotas para otros usuarios
    if (createPetDto.propietarioId && ['ADMIN', 'VETERINARIO'].includes(userRole)) {
      ownerId = createPetDto.propietarioId;
    }

    // Verificar que el propietario existe y es un cliente
    const owner = await this.userRepository.findOne({
      where: { id: ownerId },
      relations: ['rol']
    });

    if (!owner) {
      throw new BadRequestException('El propietario especificado no existe');
    }

    if (owner.rol.nombre !== 'CLIENTE' && userRole !== 'ADMIN') {
      throw new BadRequestException('Solo los clientes pueden ser propietarios de mascotas');
    }

    const newPet = this.petRepository.create({
      nombre: createPetDto.nombre,
      raza: createPetDto.raza,
      edad: createPetDto.edad,
      sexo: createPetDto.sexo,
      color: createPetDto.color,
      peso: createPetDto.peso,
      tipo: petType,
      propietario: owner,
    });

    return await this.petRepository.save(newPet);
  }

  async findAll(userRole: string, userId?: number): Promise<Pet[]> {
    const queryBuilder = this.petRepository.createQueryBuilder('pet')
      .leftJoinAndSelect('pet.tipo', 'tipo')
      .leftJoinAndSelect('pet.propietario', 'propietario')
      .leftJoinAndSelect('propietario.rol', 'rol')
      .where('pet.estado = :estado', { estado: true });

    // Si es cliente, solo puede ver sus propias mascotas
    if (userRole === 'CLIENTE') {
      queryBuilder.andWhere('propietario.id = :userId', { userId });
    }

    return await queryBuilder.orderBy('pet.nombre', 'ASC').getMany();
  }

  async findByOwner(ownerId: number, currentUserId: number, userRole: string): Promise<Pet[]> {
    // Solo admins, veterinarios o el mismo propietario pueden ver las mascotas
    if (userRole === 'CLIENTE' && ownerId !== currentUserId) {
      throw new ForbiddenException('No tienes permisos para ver las mascotas de otro usuario');
    }

    return await this.petRepository.find({
      where: { 
        propietario: { id: ownerId },
        estado: true 
      },
      relations: ['tipo', 'propietario'],
      order: { nombre: 'ASC' }
    });
  }

  async findOne(id: number, currentUserId: number, userRole: string): Promise<Pet> {
    const pet = await this.petRepository.findOne({
      where: { id },
      relations: ['tipo', 'propietario', 'propietario.rol']
    });

    if (!pet) {
      throw new NotFoundException(`Mascota con ID ${id} no encontrada`);
    }

    // Verificar permisos
    if (userRole === 'CLIENTE' && pet.propietario.id !== currentUserId) {
      throw new ForbiddenException('No tienes permisos para ver esta mascota');
    }

    return pet;
  }

  async update(id: number, updatePetDto: UpdatePetDto, currentUserId: number, userRole: string): Promise<Pet> {
    const pet = await this.findOne(id, currentUserId, userRole);

    // Verificar permisos de edición
    if (userRole === 'CLIENTE' && pet.propietario.id !== currentUserId) {
      throw new ForbiddenException('No tienes permisos para editar esta mascota');
    }

    // Si se está actualizando el tipo
    if (updatePetDto.tipoId) {
      const petType = await this.petTypeRepository.findOne({
        where: { id: updatePetDto.tipoId, estado: true }
      });

      if (!petType) {
        throw new BadRequestException('El tipo de mascota especificado no existe');
      }

      pet.tipo = petType;
    }

    // Si se está cambiando el propietario (solo admins)
    if (updatePetDto.propietarioId && userRole === 'ADMIN') {
      const newOwner = await this.userRepository.findOne({
        where: { id: updatePetDto.propietarioId },
        relations: ['rol']
      });

      if (!newOwner) {
        throw new BadRequestException('El nuevo propietario no existe');
      }

      if (newOwner.rol.nombre !== 'CLIENTE') {
        throw new BadRequestException('Solo los clientes pueden ser propietarios de mascotas');
      }

      pet.propietario = newOwner;
    }

    // Actualizar otros campos
    Object.assign(pet, {
      nombre: updatePetDto.nombre || pet.nombre,
      raza: updatePetDto.raza || pet.raza,
      edad: updatePetDto.edad !== undefined ? updatePetDto.edad : pet.edad,
      sexo: updatePetDto.sexo || pet.sexo,
      color: updatePetDto.color || pet.color,
      peso: updatePetDto.peso !== undefined ? updatePetDto.peso : pet.peso,
    });

    return await this.petRepository.save(pet);
  }

  async remove(id: number, currentUserId: number, userRole: string): Promise<void> {
    const pet = await this.findOne(id, currentUserId, userRole);

    // Solo admins o el propietario pueden eliminar
    if (userRole === 'CLIENTE' && pet.propietario.id !== currentUserId) {
      throw new ForbiddenException('No tienes permisos para eliminar esta mascota');
    }

    // Verificar que no tenga citas pendientes
    const pendingAppointments = await this.petRepository.createQueryBuilder('pet')
      .leftJoin('pet.citas', 'cita')
      .leftJoin('cita.estadoCita', 'estado')
      .where('pet.id = :petId', { petId: id })
      .andWhere('estado.codigo IN (:...estados)', { estados: ['PROGRAMADA', 'CONFIRMADA'] })
      .getCount();

    if (pendingAppointments > 0) {
      throw new BadRequestException('No se puede eliminar la mascota porque tiene citas pendientes');
    }

    pet.estado = false;
    await this.petRepository.save(pet);
  }

  async getPetStats(ownerId?: number): Promise<any> {
    const queryBuilder = this.petRepository.createQueryBuilder('pet')
      .leftJoin('pet.tipo', 'tipo')
      .leftJoin('pet.propietario', 'propietario')
      .where('pet.estado = :estado', { estado: true });

    if (ownerId) {
      queryBuilder.andWhere('propietario.id = :ownerId', { ownerId });
    }

    const totalPets = await queryBuilder.getCount();

    const petsByType = await this.petRepository.createQueryBuilder('pet')
      .leftJoin('pet.tipo', 'tipo')
      .leftJoin('pet.propietario', 'propietario')
      .select(['tipo.nombre as tipoNombre', 'COUNT(pet.id) as cantidad'])
      .where('pet.estado = :estado', { estado: true })
      .groupBy('tipo.nombre')
      .getRawMany();

    const petsBySex = await this.petRepository.createQueryBuilder('pet')
      .leftJoin('pet.propietario', 'propietario')
      .select(['pet.sexo as sexo', 'COUNT(pet.id) as cantidad'])
      .where('pet.estado = :estado', { estado: true })
      .groupBy('pet.sexo')
      .getRawMany();

    return {
      totalPets,
      petsByType,
      petsBySex
    };
  }
}