import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PetType } from '../models/entities/petType.entity';
import { CreatePetTypeDto } from './dto/create-pet-type.dto';
import { UpdatePetTypeDto } from './dto/update-pet-type.dto';

@Injectable()
export class PetTypesService {
  constructor(
    @InjectRepository(PetType)
    private readonly petTypeRepository: Repository<PetType>,
  ) {}

  async create(createPetTypeDto: CreatePetTypeDto): Promise<PetType> {
    const existingType = await this.petTypeRepository.findOne({
      where: { nombre: createPetTypeDto.nombre.toLowerCase() }
    });

    if (existingType) {
      throw new BadRequestException('Ya existe un tipo de mascota con ese nombre');
    }

    const newPetType = this.petTypeRepository.create({
      ...createPetTypeDto,
      nombre: createPetTypeDto.nombre.toLowerCase()
    });

    return await this.petTypeRepository.save(newPetType);
  }

  async findAll(): Promise<PetType[]> {
    return await this.petTypeRepository.find({
      where: { estado: true },
      order: { nombre: 'ASC' }
    });
  }

  async findOne(id: number): Promise<PetType> {
    const petType = await this.petTypeRepository.findOne({ where: { id } });
    
    if (!petType) {
      throw new NotFoundException(`Tipo de mascota con ID ${id} no encontrado`);
    }
    
    return petType;
  }

  async update(id: number, updatePetTypeDto: UpdatePetTypeDto): Promise<PetType> {
    const petType = await this.findOne(id);

    if (updatePetTypeDto.nombre && updatePetTypeDto.nombre.toLowerCase() !== petType.nombre) {
      const existingType = await this.petTypeRepository.findOne({
        where: { nombre: updatePetTypeDto.nombre.toLowerCase() }
      });

      if (existingType) {
        throw new BadRequestException('Ya existe un tipo de mascota con ese nombre');
      }
    }

    Object.assign(petType, {
      nombre: updatePetTypeDto.nombre ? updatePetTypeDto.nombre.toLowerCase() : petType.nombre,
      descripcion: updatePetTypeDto.descripcion !== undefined ? updatePetTypeDto.descripcion : petType.descripcion,
    });

    return await this.petTypeRepository.save(petType);
  }

  async remove(id: number): Promise<void> {
    const petType = await this.findOne(id);
    petType.estado = false;
    await this.petTypeRepository.save(petType);
  }

  async seedDefaultPetTypes(): Promise<void> {
    const defaultTypes = [
      { nombre: 'perro', descripcion: 'Perros de todas las razas' },
      { nombre: 'gato', descripcion: 'Gatos de todas las razas' },
      { nombre: 'ave', descripcion: 'Aves domésticas y exóticas' },
      { nombre: 'reptil', descripcion: 'Reptiles y anfibios' },
      { nombre: 'roedor', descripcion: 'Roedores pequeños' },
      { nombre: 'pez', descripcion: 'Peces de acuario' }
    ];

    for (const typeData of defaultTypes) {
      const existing = await this.petTypeRepository.findOne({
        where: { nombre: typeData.nombre }
      });
      if (!existing) {
        await this.create(typeData);
      }
    }
  }
}