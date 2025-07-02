// src/service-pet-types/service-pet-types.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServicePetType } from '../models/entities/ServicePetType.entity';
import { Service } from '../models/entities/service.entity';
import { PetType } from '../models/entities/petType.entity';
import { CreateServicePetTypeDto } from './dto/create-service-pet-type.dto';
import { UpdateServicePetTypeDto } from './dto/update-service-pet-type.dto';
import { BulkAssignServicePetTypeDto } from './dto/bulk-assign.dto';

@Injectable()
export class ServicePetTypesService {
  constructor(
    @InjectRepository(ServicePetType)
    private readonly servicePetTypeRepository: Repository<ServicePetType>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(PetType)
    private readonly petTypeRepository: Repository<PetType>,
  ) {}

  async create(createServicePetTypeDto: CreateServicePetTypeDto): Promise<ServicePetType> {
    // Verificar que el servicio existe
    const service = await this.serviceRepository.findOne({
      where: { id: createServicePetTypeDto.serviceId, estado: true }
    });

    if (!service) {
      throw new BadRequestException('El servicio especificado no existe');
    }

    // Verificar que el tipo de mascota existe
    const petType = await this.petTypeRepository.findOne({
      where: { id: createServicePetTypeDto.petTypeId, estado: true }
    });

    if (!petType) {
      throw new BadRequestException('El tipo de mascota especificado no existe');
    }

    // Verificar que la relación no existe ya
    const existingRelation = await this.servicePetTypeRepository.findOne({
      where: {
        service: { id: createServicePetTypeDto.serviceId },
        petType: { id: createServicePetTypeDto.petTypeId },
        estado: true
      }
    });

    if (existingRelation) {
      throw new BadRequestException('La relación ya existe entre este servicio y tipo de mascota');
    }

    const newRelation = this.servicePetTypeRepository.create({
      service,
      petType,
      observaciones: createServicePetTypeDto.observaciones
    });

    return await this.servicePetTypeRepository.save(newRelation);
  }

  async bulkAssign(bulkAssignDto: BulkAssignServicePetTypeDto): Promise<ServicePetType[]> {
    // Verificar que el servicio existe
    const service = await this.serviceRepository.findOne({
      where: { id: bulkAssignDto.serviceId, estado: true }
    });

    if (!service) {
      throw new BadRequestException('El servicio especificado no existe');
    }

    // Verificar que todos los tipos de mascotas existen
    const petTypes = await this.petTypeRepository.findByIds(bulkAssignDto.petTypeIds);
    
    if (petTypes.length !== bulkAssignDto.petTypeIds.length) {
      throw new BadRequestException('Uno o más tipos de mascota especificados no existen');
    }

    // Eliminar relaciones existentes para este servicio
    await this.servicePetTypeRepository.update(
      { service: { id: bulkAssignDto.serviceId } },
      { estado: false }
    );

    // Crear nuevas relaciones
    const newRelations: ServicePetType[] = [];
    
    for (const petType of petTypes) {
      const relation = this.servicePetTypeRepository.create({
        service,
        petType
      });
      const savedRelation = await this.servicePetTypeRepository.save(relation);
      newRelations.push(savedRelation);
    }

    return newRelations;
  }

  async findAll(): Promise<ServicePetType[]> {
    return await this.servicePetTypeRepository.find({
      where: { estado: true },
      relations: ['service', 'service.categoria', 'petType'],
      order: { id: 'ASC' }
    });
  }

  async findByService(serviceId: number): Promise<ServicePetType[]> {
    return await this.servicePetTypeRepository.find({
      where: { service: { id: serviceId }, estado: true },
      relations: ['petType'],
      order: { petType: { nombre: 'ASC' } }
    });
  }

  async findByPetType(petTypeId: number): Promise<ServicePetType[]> {
    return await this.servicePetTypeRepository.find({
      where: { petType: { id: petTypeId }, estado: true },
      relations: ['service', 'service.categoria'],
      order: { service: { nombre: 'ASC' } }
    });
  }

  async findServicesForPetType(petTypeId: number): Promise<Service[]> {
    // Obtener servicios que están disponibles para el tipo de mascota específico
    // O servicios que no tienen restricciones de tipo de mascota
    const queryBuilder = this.serviceRepository.createQueryBuilder('service')
      .leftJoinAndSelect('service.categoria', 'categoria')
      .leftJoinAndSelect('service.tiposMascota', 'servicePetType')
      .leftJoinAndSelect('servicePetType.petType', 'petType')
      .where('service.estado = :estado', { estado: true });

    // Incluir servicios que no tienen restricciones O que están específicamente para este tipo
    queryBuilder.andWhere(
      '(servicePetType.id IS NULL OR (petType.id = :petTypeId AND servicePetType.estado = :estado))',
      { petTypeId, estado: true }
    );

    return await queryBuilder
      .orderBy('categoria.nombre', 'ASC')
      .addOrderBy('service.nombre', 'ASC')
      .getMany();
  }

  async findPetTypesForService(serviceId: number): Promise<PetType[]> {
    const relations = await this.servicePetTypeRepository.find({
      where: { service: { id: serviceId }, estado: true },
      relations: ['petType']
    });

    return relations.map(relation => relation.petType);
  }

  async findOne(id: number): Promise<ServicePetType> {
    const relation = await this.servicePetTypeRepository.findOne({
      where: { id },
      relations: ['service', 'service.categoria', 'petType']
    });

    if (!relation) {
      throw new NotFoundException(`Relación servicio-tipo de mascota con ID ${id} no encontrada`);
    }

    return relation;
  }

  async update(id: number, updateServicePetTypeDto: UpdateServicePetTypeDto): Promise<ServicePetType> {
    const relation = await this.findOne(id);

    // Solo permitir actualizar observaciones por ahora
    if (updateServicePetTypeDto.observaciones !== undefined) {
      relation.observaciones = updateServicePetTypeDto.observaciones;
    }

    return await this.servicePetTypeRepository.save(relation);
  }

  async remove(id: number): Promise<void> {
    const relation = await this.findOne(id);
    relation.estado = false;
    await this.servicePetTypeRepository.save(relation);
  }

  async removeByServiceAndPetType(serviceId: number, petTypeId: number): Promise<void> {
    const relation = await this.servicePetTypeRepository.findOne({
      where: {
        service: { id: serviceId },
        petType: { id: petTypeId },
        estado: true
      }
    });

    if (relation) {
      relation.estado = false;
      await this.servicePetTypeRepository.save(relation);
    }
  }

  async getServiceCompatibilityMatrix(): Promise<any> {
    // Obtener todos los servicios y tipos de mascotas
    const services = await this.serviceRepository.find({
      where: { estado: true },
      relations: ['categoria'],
      order: { nombre: 'ASC' }
    });

    const petTypes = await this.petTypeRepository.find({
      where: { estado: true },
      order: { nombre: 'ASC' }
    });

    // Obtener todas las relaciones activas
    const relations = await this.servicePetTypeRepository.find({
      where: { estado: true },
      relations: ['service', 'petType']
    });

    // Crear matriz de compatibilidad
    const matrix = services.map(service => {
      const serviceRelations = relations.filter(rel => rel.service.id === service.id);
      const compatiblePetTypes = serviceRelations.map(rel => rel.petType.id);

      return {
        service: {
          id: service.id,
          nombre: service.nombre,
          categoria: service.categoria.nombre
        },
        petTypes: petTypes.map(petType => ({
          id: petType.id,
          nombre: petType.nombre,
          compatible: compatiblePetTypes.includes(petType.id) || compatiblePetTypes.length === 0
        }))
      };
    });

    return {
      services,
      petTypes,
      matrix
    };
  }

  async getServiceStats(): Promise<any> {
    // Servicios más versátiles (compatibles con más tipos de mascotas)
    const serviceStats = await this.servicePetTypeRepository.createQueryBuilder('spt')
      .leftJoin('spt.service', 'service')
      .leftJoin('service.categoria', 'categoria')
      .select([
        'service.id as serviceId',
        'service.nombre as serviceName',
        'categoria.nombre as categoryName',
        'COUNT(spt.id) as petTypeCount'
      ])
      .where('spt.estado = :estado', { estado: true })
      .groupBy('service.id')
      .orderBy('petTypeCount', 'DESC')
      .getRawMany();

    // Tipos de mascotas con más servicios disponibles
    const petTypeStats = await this.servicePetTypeRepository.createQueryBuilder('spt')
      .leftJoin('spt.petType', 'petType')
      .select([
        'petType.id as petTypeId',
        'petType.nombre as petTypeName',
        'COUNT(spt.id) as serviceCount'
      ])
      .where('spt.estado = :estado', { estado: true })
      .groupBy('petType.id')
      .orderBy('serviceCount', 'DESC')
      .getRawMany();

    return {
      serviceStats,
      petTypeStats
    };
  }

  async seedDefaultRelations(): Promise<void> {
    console.log('🔗 Creando relaciones por defecto entre servicios y tipos de mascotas...');

    // Obtener servicios y tipos de mascotas
    const services = await this.serviceRepository.find({ where: { estado: true } });
    const petTypes = await this.petTypeRepository.find({ where: { estado: true } });

    const perro = petTypes.find(pt => pt.nombre === 'perro');
    const gato = petTypes.find(pt => pt.nombre === 'gato');
    const ave = petTypes.find(pt => pt.nombre === 'ave');
    const reptil = petTypes.find(pt => pt.nombre === 'reptil');

    // Relaciones por defecto basadas en el nombre del servicio
    const defaultRelations = [
      // Servicios generales para perros y gatos
      { serviceName: 'consulta general', petTypes: [perro, gato, ave, reptil] },
      { serviceName: 'vacunación', petTypes: [perro, gato] },
      { serviceName: 'desparasitación', petTypes: [perro, gato] },
      { serviceName: 'esterilización', petTypes: [perro, gato] },
      { serviceName: 'castración', petTypes: [perro, gato] },
      
      // Servicios específicos para perros
      { serviceName: 'corte de uñas', petTypes: [perro, gato] },
      { serviceName: 'limpieza dental', petTypes: [perro, gato] },
      { serviceName: 'baño medicado', petTypes: [perro] },
      
      // Servicios para aves
      { serviceName: 'corte de alas', petTypes: [ave] },
      { serviceName: 'sexado', petTypes: [ave] },
      
      // Servicios de emergencia (todos)
      { serviceName: 'emergencia', petTypes: [perro, gato, ave, reptil] },
      { serviceName: 'cirugía general', petTypes: [perro, gato] },
    ];

    for (const relation of defaultRelations) {
      const service = services.find(s => s.nombre.toLowerCase().includes(relation.serviceName));
      
      if (service && relation.petTypes) {
        for (const petType of relation.petTypes) {
          if (petType) {
            try {
              await this.create({
                serviceId: service.id,
                petTypeId: petType.id
              });
            } catch (error) {
              // Relación ya existe, continuar
            }
          }
        }
      }
    }

    console.log('✅ Relaciones servicios-tipos de mascotas creadas');
  }
}