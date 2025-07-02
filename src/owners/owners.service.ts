// src/owners/owners.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Repository, MoreThanOrEqual, Between, In } from 'typeorm';
import { Model } from 'mongoose';
import { User } from '../models/entities/user.entity';
import { Pet } from '../models/entities/pet.entity';
import { Appointment } from '../models/entities/appointment.entity';
import { Service } from '../models/entities/service.entity';
import { PetNotes } from '../models/schemas/pet-notes.schema';
import { UserProfile } from '../models/schemas/user-profile.schema';

@Injectable()
export class OwnersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Pet)
    private readonly petRepository: Repository<Pet>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectModel(PetNotes.name)
    private petNotesModel: Model<PetNotes>,
    @InjectModel(UserProfile.name)
    private userProfileModel: Model<UserProfile>,
  ) {}

  async getOwnerDashboard(ownerId: number): Promise<any> {
    // Verificar que el usuario existe y es cliente
    const owner = await this.userRepository.findOne({
      where: { id: ownerId },
      relations: ['rol']
    });

    if (!owner || owner.rol.nombre !== 'CLIENTE') {
      throw new ForbiddenException('Solo los clientes pueden acceder a este dashboard');
    }

    // Obtener estadísticas básicas
    const totalPets = await this.petRepository.count({
      where: { propietario: { id: ownerId }, estado: true }
    });

    const totalAppointments = await this.appointmentRepository.count({
      where: { cliente: { id: ownerId }, estado: true }
    });

    // Próximas citas (siguientes 30 días)
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setDate(today.getDate() + 30);

    const upcomingAppointments = await this.appointmentRepository.find({
      where: {
        cliente: { id: ownerId },
        fecha: Between(today.toISOString().split('T')[0], nextMonth.toISOString().split('T')[0]),
        estadoCita: { codigo: In(['PROGRAMADA', 'CONFIRMADA']) }
      },
      relations: ['mascota', 'servicio', 'estadoCita'],
      order: { fecha: 'ASC', hora: 'ASC' },
      take: 5
    });

    // Citas pendientes de confirmación
    const pendingAppointments = await this.appointmentRepository.count({
      where: {
        cliente: { id: ownerId },
        estadoCita: { codigo: 'PROGRAMADA' }
      }
    });

    // Mascotas con citas recientes
    const recentAppointments = await this.appointmentRepository.find({
      where: {
        cliente: { id: ownerId },
        estadoCita: { codigo: 'COMPLETADA' }
      },
      relations: ['mascota', 'servicio'],
      order: { fecha: 'DESC', hora: 'DESC' },
      take: 3
    });

    // Perfil del usuario
    const userProfile = await this.userProfileModel.findOne({ userId: ownerId });

    return {
      owner: {
        id: owner.id,
        nombres: owner.nombres,
        apellidos: owner.apellidos,
        correo: owner.correo,
        profile: userProfile
      },
      stats: {
        totalPets,
        totalAppointments,
        pendingAppointments,
        upcomingAppointmentsCount: upcomingAppointments.length
      },
      upcomingAppointments,
      recentAppointments: recentAppointments.map(apt => ({
        id: apt.id,
        fecha: apt.fecha,
        servicio: apt.servicio.nombre,
        mascota: apt.mascota.nombre,
        precio: apt.precioFinal
      }))
    };
  }

  async getOwnerPets(ownerId: number): Promise<Pet[]> {
    return await this.petRepository.find({
      where: { propietario: { id: ownerId }, estado: true },
      relations: ['tipo'],
      order: { nombre: 'ASC' }
    });
  }

  async getOwnerAppointments(ownerId: number, filters?: any): Promise<Appointment[]> {
    const queryBuilder = this.appointmentRepository.createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.mascota', 'mascota')
      .leftJoinAndSelect('mascota.tipo', 'tipoMascota')
      .leftJoinAndSelect('appointment.servicio', 'servicio')
      .leftJoinAndSelect('servicio.categoria', 'categoria')
      .leftJoinAndSelect('appointment.estadoCita', 'estadoCita')
      .where('appointment.cliente = :ownerId', { ownerId })
      .andWhere('appointment.estado = :estado', { estado: true });

    if (filters?.status) {
      queryBuilder.andWhere('estadoCita.codigo = :status', { status: filters.status });
    }

    if (filters?.startDate && filters?.endDate) {
      queryBuilder.andWhere('appointment.fecha BETWEEN :startDate AND :endDate', {
        startDate: filters.startDate,
        endDate: filters.endDate
      });
    }

    return await queryBuilder.orderBy('appointment.fecha', 'DESC')
      .addOrderBy('appointment.hora', 'DESC')
      .getMany();
  }

  async getAvailableServicesForPet(petId: number, ownerId: number): Promise<Service[]> {
    // Verificar que la mascota pertenece al dueño
    const pet = await this.petRepository.findOne({
      where: { id: petId, propietario: { id: ownerId }, estado: true },
      relations: ['tipo']
    });

    if (!pet) {
      throw new NotFoundException('Mascota no encontrada o no te pertenece');
    }

    // Obtener servicios disponibles para el tipo de mascota
    const queryBuilder = this.serviceRepository.createQueryBuilder('service')
      .leftJoinAndSelect('service.categoria', 'categoria')
      .leftJoinAndSelect('service.tiposMascota', 'servicePetType')
      .leftJoinAndSelect('servicePetType.petType', 'petType')
      .where('service.estado = :estado', { estado: true });

    // Si el servicio tiene tipos de mascota específicos, filtrar
    queryBuilder.andWhere(
      '(servicePetType.petType IS NULL OR petType.id = :petTypeId)',
      { petTypeId: pet.tipo.id }
    );

    return await queryBuilder.orderBy('categoria.nombre', 'ASC')
      .addOrderBy('service.nombre', 'ASC')
      .getMany();
  }

  async getAppointmentHistory(ownerId: number): Promise<any> {
    const appointments = await this.appointmentRepository.find({
      where: {
        cliente: { id: ownerId },
        estadoCita: { codigo: 'COMPLETADA' }
      },
      relations: ['mascota', 'servicio', 'servicio.categoria'],
      order: { fecha: 'DESC', hora: 'DESC' }
    });

    // Agrupar por mascota
    const appointmentsByPet = appointments.reduce((acc, appointment) => {
      const petId = appointment.mascota.id;
      if (!acc[petId]) {
        acc[petId] = {
          pet: {
            id: appointment.mascota.id,
            nombre: appointment.mascota.nombre,
            tipo: appointment.mascota.tipo
          },
          appointments: []
        };
      }
      acc[petId].appointments.push({
        id: appointment.id,
        fecha: appointment.fecha,
        hora: appointment.hora,
        servicio: appointment.servicio.nombre,
        categoria: appointment.servicio.categoria.nombre,
        precio: appointment.precioFinal,
        observaciones: appointment.observaciones
      });
      return acc;
    }, {});

    return Object.values(appointmentsByPet);
  }

  async getPetNotes(petId: number, ownerId: number): Promise<any[]> {
    // Verificar que la mascota pertenece al dueño
    const pet = await this.petRepository.findOne({
      where: { id: petId, propietario: { id: ownerId }, estado: true }
    });

    if (!pet) {
      throw new NotFoundException('Mascota no encontrada o no te pertenece');
    }

    const notes = await this.petNotesModel.find({ petId }).sort({ fecha: -1 });

    return notes.map(note => ({
      id: note._id,
      observaciones: note.observaciones,
      diagnostico: note.diagnostico,
      tratamiento: note.tratamiento,
      medicamentos: note.medicamentos,
      proximaVisita: note.proximaVisita,
      fecha: note.fecha,
      veterinarioId: note.veterinarioId
    }));
  }

  async getUpcomingAppointments(ownerId: number): Promise<Appointment[]> {
    const today = new Date().toISOString().split('T')[0];

    return await this.appointmentRepository.find({
      where: {
        cliente: { id: ownerId },
        fecha: MoreThanOrEqual(today),
        estadoCita: { codigo: In(['PROGRAMADA', 'CONFIRMADA']) }
      },
      relations: ['mascota', 'mascota.tipo', 'servicio', 'estadoCita'],
      order: { fecha: 'ASC', hora: 'ASC' }
    });
  }

  async getAvailableProductsForPet(petId: number, ownerId: number): Promise<Service[]> {
  // Verificar que la mascota pertenece al dueño
  const pet = await this.petRepository.findOne({
    where: { id: petId, propietario: { id: ownerId }, estado: true },
    relations: ['tipo']
  });

  if (!pet) {
    throw new NotFoundException('Mascota no encontrada o no te pertenece');
  }

  // Obtener productos disponibles para el tipo de mascota
  const queryBuilder = this.serviceRepository.createQueryBuilder('product')
    .leftJoinAndSelect('product.categoria', 'categoria')
    .leftJoinAndSelect('product.tiposMascota', 'productPetType')
    .leftJoinAndSelect('productPetType.petType', 'petType')
    .where('product.estado = :estado', { estado: true })
    .andWhere('product.stock > 0');

  // Si el producto tiene tipos de mascota específicos, filtrar
  queryBuilder.andWhere(
    '(productPetType.petType IS NULL OR petType.id = :petTypeId)',
    { petTypeId: pet.tipo.id }
  );

  return await queryBuilder.orderBy('categoria.nombre', 'ASC')
    .addOrderBy('product.nombre', 'ASC')
    .getMany();
}

async getProductRecommendations(ownerId: number): Promise<any> {
  // Obtener mascotas del cliente
  const pets = await this.petRepository.find({
    where: { propietario: { id: ownerId }, estado: true },
    relations: ['tipo']
  });

  if (pets.length === 0) {
    return { recommendations: [] };
  }

  const petTypeIds = pets.map(pet => pet.tipo.id);

  // Productos más vendidos para los tipos de mascotas del cliente
  const recommendations = await this.serviceRepository.createQueryBuilder('product')
    .leftJoinAndSelect('product.categoria', 'categoria')
    .leftJoinAndSelect('product.tiposMascota', 'productPetType')
    .leftJoinAndSelect('productPetType.petType', 'petType')
    .where('product.estado = :estado', { estado: true })
    .andWhere('product.stock > 0')
    .andWhere('petType.id IN (:...petTypeIds)', { petTypeIds })
    .orderBy('RAND()') // Recomendaciones aleatorias por ahora
    .limit(10)
    .getMany();

  return {
    pets: pets.map(pet => ({
      id: pet.id,
      nombre: pet.nombre,
      tipo: pet.tipo.nombre
    })),
    recommendations: recommendations.map(product => ({
      id: product.id,
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio,
      imagen: product.imagen,
      categoria: product.categoria.nombre,
      // stock: product.stock // Remove or replace this line if 'stock' is not a property of Service
    }))
  };
}

  async getPetHealthSummary(petId: number, ownerId: number): Promise<any> {
    // Verificar que la mascota pertenece al dueño
    const pet = await this.petRepository.findOne({
      where: { id: petId, propietario: { id: ownerId }, estado: true },
      relations: ['tipo']
    });

    if (!pet) {
      throw new NotFoundException('Mascota no encontrada o no te pertenece');
    }

    // Obtener últimas citas completadas
    const recentAppointments = await this.appointmentRepository.find({
      where: {
        mascota: { id: petId },
        estadoCita: { codigo: 'COMPLETADA' }
      },
      relations: ['servicio', 'servicio.categoria'],
      order: { fecha: 'DESC', hora: 'DESC' },
      take: 5
    });

    // Obtener notas veterinarias
    const vetNotes = await this.petNotesModel.find({ petId }).sort({ fecha: -1 }).limit(3);

    // Próxima cita programada
    const nextAppointment = await this.appointmentRepository.findOne({
      where: {
        mascota: { id: petId },
        fecha: MoreThanOrEqual(new Date().toISOString().split('T')[0]),
      },
      relations: ['servicio', 'estadoCita'],
      order: { fecha: 'ASC', hora: 'ASC' }
    });

    // Filtrar por estadoCita.codigo manualmente para 'PROGRAMADA' o 'CONFIRMADA'
    let filteredNextAppointment: Appointment | null = null;
    if (nextAppointment && ['PROGRAMADA', 'CONFIRMADA'].includes(nextAppointment.estadoCita.codigo)) {
      filteredNextAppointment = nextAppointment;
    }

    return {
      pet: {
        id: pet.id,
        nombre: pet.nombre,
        raza: pet.raza,
        edad: pet.edad,
        peso: pet.peso,
        tipo: pet.tipo.nombre
      },
      recentAppointments: recentAppointments.map(apt => ({
        fecha: apt.fecha,
        servicio: apt.servicio.nombre,
        categoria: apt.servicio.categoria.nombre,
        precio: apt.precioFinal
      })),
      vetNotes: vetNotes.map(note => ({
        fecha: note.fecha,
        observaciones: note.observaciones,
        diagnostico: note.diagnostico,
        proximaVisita: note.proximaVisita
      })),
      nextAppointment: nextAppointment ? {
        fecha: nextAppointment.fecha,
        hora: nextAppointment.hora,
        servicio: nextAppointment.servicio.nombre,
        estado: nextAppointment.estadoCita.nombre
      } : null
    };
  }
}

