import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Service } from '../models/entities/service.entity';
import { ServiceCategory } from '../models/entities/serviceCategory.entity';
import { PetType } from '../models/entities/petType.entity';
import { ServicePetType } from '../models/entities/ServicePetType.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(ServiceCategory)
    private readonly serviceCategoryRepository: Repository<ServiceCategory>,
    @InjectRepository(PetType)
    private readonly petTypeRepository: Repository<PetType>,
    @InjectRepository(ServicePetType)
    private readonly servicePetTypeRepository: Repository<ServicePetType>,
  ) {}

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    // Verificar que la categoría existe
    const category = await this.serviceCategoryRepository.findOne({
      where: { id: createServiceDto.categoriaId, estado: true }
    });

    if (!category) {
      throw new BadRequestException('La categoría especificada no existe');
    }

    // Verificar tipos de mascota si se especifican
    let petTypes: PetType[] = [];
    if (createServiceDto.tiposMascotaIds && createServiceDto.tiposMascotaIds.length > 0) {
      petTypes = await this.petTypeRepository.find({
        where: { id: In(createServiceDto.tiposMascotaIds), estado: true }
      });

      if (petTypes.length !== createServiceDto.tiposMascotaIds.length) {
        throw new BadRequestException('Uno o más tipos de mascota especificados no existen');
      }
    }

    const newService = this.serviceRepository.create({
      nombre: createServiceDto.nombre,
      descripcion: createServiceDto.descripcion,
      precio: createServiceDto.precio,
      imagen: createServiceDto.imagen,
      duracionMinutos: createServiceDto.duracionMinutos || 60,
      categoria: category,
    });

    const savedService = await this.serviceRepository.save(newService);

    // Crear relaciones con tipos de mascota
    if (petTypes.length > 0) {
      for (const petType of petTypes) {
        const servicePetType = this.servicePetTypeRepository.create({
          service: savedService,
          petType: petType,
        });
        await this.servicePetTypeRepository.save(servicePetType);
      }
    }

    return await this.findOne(savedService.id);
  }

  async findAll(): Promise<Service[]> {
    return await this.serviceRepository.find({
      where: { estado: true },
      relations: ['categoria', 'tiposMascota', 'tiposMascota.petType'],
      order: { nombre: 'ASC' }
    });
  }

  async findByCategory(categoryId: number): Promise<Service[]> {
    return await this.serviceRepository.find({
      where: { 
        categoria: { id: categoryId },
        estado: true 
      },
      relations: ['categoria', 'tiposMascota', 'tiposMascota.petType'],
      order: { nombre: 'ASC' }
    });
  }

  async findByPetType(petTypeId: number): Promise<Service[]> {
    return await this.serviceRepository.createQueryBuilder('service')
      .leftJoinAndSelect('service.categoria', 'categoria')
      .leftJoinAndSelect('service.tiposMascota', 'servicePetType')
      .leftJoinAndSelect('servicePetType.petType', 'petType')
      .where('service.estado = :estado', { estado: true })
      .andWhere('petType.id = :petTypeId', { petTypeId })
      .orderBy('service.nombre', 'ASC')
      .getMany();
  }

  async findOne(id: number): Promise<Service> {
    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: ['categoria', 'tiposMascota', 'tiposMascota.petType']
    });

    if (!service) {
      throw new NotFoundException(`Servicio con ID ${id} no encontrado`);
    }

    return service;
  }

  async update(id: number, updateServiceDto: UpdateServiceDto): Promise<Service> {
    const service = await this.findOne(id);

    // Actualizar categoría si se especifica
    if (updateServiceDto.categoriaId) {
      const category = await this.serviceCategoryRepository.findOne({
        where: { id: updateServiceDto.categoriaId, estado: true }
      });

      if (!category) {
        throw new BadRequestException('La categoría especificada no existe');
      }

      service.categoria = category;
    }

    // Actualizar tipos de mascota si se especifican
    if (updateServiceDto.tiposMascotaIds !== undefined) {
      // Eliminar relaciones existentes
      await this.servicePetTypeRepository.delete({ service: { id } });

      // Crear nuevas relaciones
      if (updateServiceDto.tiposMascotaIds.length > 0) {
        const petTypes = await this.petTypeRepository.find({
          where: { id: In(updateServiceDto.tiposMascotaIds), estado: true }
        });

        if (petTypes.length !== updateServiceDto.tiposMascotaIds.length) {
          throw new BadRequestException('Uno o más tipos de mascota especificados no existen');
        }

        for (const petType of petTypes) {
          const servicePetType = this.servicePetTypeRepository.create({
            service: service,
            petType: petType,
          });
          await this.servicePetTypeRepository.save(servicePetType);
        }
      }
    }

    // Actualizar otros campos
    Object.assign(service, {
      nombre: updateServiceDto.nombre || service.nombre,
      descripcion: updateServiceDto.descripcion || service.descripcion,
      precio: updateServiceDto.precio !== undefined ? updateServiceDto.precio : service.precio,
      imagen: updateServiceDto.imagen !== undefined ? updateServiceDto.imagen : service.imagen,
      duracionMinutos: updateServiceDto.duracionMinutos !== undefined ? updateServiceDto.duracionMinutos : service.duracionMinutos,
    });

    await this.serviceRepository.save(service);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const service = await this.findOne(id);

    // Verificar que no tenga citas programadas
    const appointmentsCount = await this.serviceRepository.createQueryBuilder('service')
      .leftJoin('service.citas', 'appointment')
      .leftJoin('appointment.estadoCita', 'status')
      .where('service.id = :id', { id })
      .andWhere('status.codigo IN (:...estados)', { estados: ['PROGRAMADA', 'CONFIRMADA'] })
      .getCount();

    if (appointmentsCount > 0) {
      throw new BadRequestException('No se puede eliminar el servicio porque tiene citas programadas');
    }

    service.estado = false;
    await this.serviceRepository.save(service);
  }

  async getServiceStats(): Promise<any> {
    const totalServices = await this.serviceRepository.count({ where: { estado: true } });

    const servicesByCategory = await this.serviceRepository.createQueryBuilder('service')
      .leftJoin('service.categoria', 'categoria')
      .select(['categoria.nombre as categoriaNombre', 'COUNT(service.id) as cantidad'])
      .where('service.estado = :estado', { estado: true })
      .groupBy('categoria.nombre')
      .getRawMany();

    const avgPrice = await this.serviceRepository.createQueryBuilder('service')
      .select('AVG(service.precio)', 'promedio')
      .where('service.estado = :estado', { estado: true })
      .getRawOne();

    return {
      totalServices,
      servicesByCategory,
      averagePrice: parseFloat(avgPrice.promedio) || 0
    };
  }
}
