import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceCategory } from '../models/entities/serviceCategory.entity';
import { CreateServiceCategoryDto } from './dto/create-service-category.dto';
import { UpdateServiceCategoryDto } from './dto/update-service-category.dto';

@Injectable()
export class ServiceCategoriesService {
  constructor(
    @InjectRepository(ServiceCategory)
    private readonly serviceCategoryRepository: Repository<ServiceCategory>,
  ) {}

  async create(createServiceCategoryDto: CreateServiceCategoryDto): Promise<ServiceCategory> {
    const existingCategory = await this.serviceCategoryRepository.findOne({
      where: { nombre: createServiceCategoryDto.nombre.toLowerCase() }
    });

    if (existingCategory) {
      throw new BadRequestException('Ya existe una categoría con ese nombre');
    }

    const newCategory = this.serviceCategoryRepository.create({
      ...createServiceCategoryDto,
      nombre: createServiceCategoryDto.nombre.toLowerCase()
    });

    return await this.serviceCategoryRepository.save(newCategory);
  }

  async findAll(): Promise<ServiceCategory[]> {
    return await this.serviceCategoryRepository.find({
      where: { estado: true },
      relations: ['servicios'],
      order: { nombre: 'ASC' }
    });
  }

  async findOne(id: number): Promise<ServiceCategory> {
    const category = await this.serviceCategoryRepository.findOne({
      where: { id },
      relations: ['servicios']
    });

    if (!category) {
      throw new NotFoundException(`Categoría de servicio con ID ${id} no encontrada`);
    }

    return category;
  }

  async update(id: number, updateServiceCategoryDto: UpdateServiceCategoryDto): Promise<ServiceCategory> {
    const category = await this.findOne(id);

    if (updateServiceCategoryDto.nombre && updateServiceCategoryDto.nombre.toLowerCase() !== category.nombre) {
      const existingCategory = await this.serviceCategoryRepository.findOne({
        where: { nombre: updateServiceCategoryDto.nombre.toLowerCase() }
      });

      if (existingCategory) {
        throw new BadRequestException('Ya existe una categoría con ese nombre');
      }
    }

    Object.assign(category, {
      nombre: updateServiceCategoryDto.nombre ? updateServiceCategoryDto.nombre.toLowerCase() : category.nombre,
      descripcion: updateServiceCategoryDto.descripcion !== undefined ? updateServiceCategoryDto.descripcion : category.descripcion,
    });

    return await this.serviceCategoryRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    
    // Verificar que no tenga servicios asociados
    const servicesCount = await this.serviceCategoryRepository.createQueryBuilder('category')
      .leftJoin('category.servicios', 'service')
      .where('category.id = :id', { id })
      .andWhere('service.estado = :estado', { estado: true })
      .getCount();

    if (servicesCount > 0) {
      throw new BadRequestException('No se puede eliminar la categoría porque tiene servicios asociados');
    }

    category.estado = false;
    await this.serviceCategoryRepository.save(category);
  }

  async seedDefaultCategories(): Promise<void> {
    const defaultCategories = [
      { nombre: 'consulta general', descripcion: 'Consultas veterinarias generales' },
      { nombre: 'vacunación', descripcion: 'Servicios de vacunación' },
      { nombre: 'cirugía', descripcion: 'Procedimientos quirúrgicos' },
      { nombre: 'odontología', descripcion: 'Cuidado dental veterinario' },
      { nombre: 'emergencias', descripcion: 'Atención de emergencias' },
      { nombre: 'estética', descripcion: 'Servicios de peluquería y estética' },
      { nombre: 'hospitalización', descripcion: 'Servicios de hospitalización' }
    ];

    for (const categoryData of defaultCategories) {
      const existing = await this.serviceCategoryRepository.findOne({
        where: { nombre: categoryData.nombre }
      });
      if (!existing) {
        await this.create(categoryData);
      }
    }
  }
}