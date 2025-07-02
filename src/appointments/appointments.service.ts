// src/appointments/appointments.service.ts
import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Appointment } from '../models/entities/appointment.entity';
import { Pet } from '../models/entities/pet.entity';
import { Service } from '../models/entities/service.entity';
import { User } from '../models/entities/user.entity';
import { AppointmentStatus } from '../models/entities/appointmentStatus.entity';
import { AppointmentLog } from '../models/schemas/appointment-logs.schema';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { UpdateAppointmentStatusDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Pet)
    private readonly petRepository: Repository<Pet>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(AppointmentStatus)
    private readonly appointmentStatusRepository: Repository<AppointmentStatus>,
    @InjectModel(AppointmentLog.name)
    private appointmentLogModel: Model<AppointmentLog>,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto, currentUserId: number, userRole: string): Promise<Appointment> {
    // Verificar que la mascota existe
    const pet = await this.petRepository.findOne({
      where: { id: createAppointmentDto.mascotaId, estado: true },
      relations: ['propietario', 'tipo']
    });

    if (!pet) {
      throw new BadRequestException('La mascota especificada no existe');
    }

    // Verificar permisos sobre la mascota
    let clienteId = currentUserId;
    if (createAppointmentDto.clienteId && ['ADMIN', 'VETERINARIO'].includes(userRole)) {
      clienteId = createAppointmentDto.clienteId;
      
      // Verificar que el cliente especificado es el propietario de la mascota
      if (pet.propietario.id !== clienteId) {
        throw new BadRequestException('La mascota no pertenece al cliente especificado');
      }
    } else if (userRole === 'CLIENTE' && pet.propietario.id !== currentUserId) {
      throw new ForbiddenException('No puedes crear citas para mascotas que no te pertenecen');
    }

    // Verificar que el servicio existe
    const service = await this.serviceRepository.findOne({
      where: { id: createAppointmentDto.servicioId, estado: true },
      relations: ['tiposMascota', 'tiposMascota.petType']
    });

    if (!service) {
      throw new BadRequestException('El servicio especificado no existe');
    }

    // Verificar que el servicio está disponible para el tipo de mascota
    if (service.tiposMascota && service.tiposMascota.length > 0) {
      const isServiceAvailable = service.tiposMascota.some(
        spt => spt.petType.id === pet.tipo.id
      );

      if (!isServiceAvailable) {
        throw new BadRequestException('El servicio no está disponible para este tipo de mascota');
      }
    }

    // Verificar disponibilidad de horario
    await this.validateTimeSlot(createAppointmentDto.fecha, createAppointmentDto.hora, service.duracionMinutos);

    // Obtener estado inicial
    const initialStatus = await this.appointmentStatusRepository.findOne({
      where: { codigo: 'PROGRAMADA', estado: true }
    });

    if (!initialStatus) {
      throw new BadRequestException('Estado inicial de cita no configurado');
    }

    // Obtener cliente
    const cliente = await this.userRepository.findOne({
      where: { id: clienteId },
      relations: ['rol']
    });

    if (!cliente) {
      throw new BadRequestException('El cliente especificado no existe');
    }

    const newAppointment = this.appointmentRepository.create({
      cliente: cliente,
      mascota: pet,
      servicio: service,
      fecha: createAppointmentDto.fecha,
      hora: createAppointmentDto.hora,
      observaciones: createAppointmentDto.observaciones,
      precioFinal: service.precio,
      estadoCita: initialStatus,
    });

    const savedAppointment = await this.appointmentRepository.save(newAppointment);

    // Registrar en logs
    await this.appointmentLogModel.create({
      appointmentId: savedAppointment.id,
      usuarioId: currentUserId,
      estadoNuevo: 'PROGRAMADA',
      comentario: 'Cita creada',
    });

    return await this.findOne(savedAppointment.id, currentUserId, userRole);
  }

  private async validateTimeSlot(fecha: string, hora: string, duracionMinutos: number): Promise<void> {
    const appointmentDate = new Date(`${fecha}T${hora}:00`);
    const endTime = new Date(appointmentDate.getTime() + duracionMinutos * 60000);

    // Verificar que la fecha no sea en el pasado
    if (appointmentDate < new Date()) {
      throw new BadRequestException('No se pueden programar citas en el pasado');
    }

    // Verificar horario de atención (ejemplo: 8:00 a 18:00)
    const hour = appointmentDate.getHours();
    if (hour < 8 || hour >= 18) {
      throw new BadRequestException('Horario fuera del rango de atención (8:00 - 18:00)');
    }

    // Verificar conflictos con otras citas
    const existingAppointments = await this.appointmentRepository.createQueryBuilder('appointment')
      .leftJoin('appointment.estadoCita', 'status')
      .where('appointment.fecha = :fecha', { fecha })
      .andWhere('status.codigo IN (:...estados)', { estados: ['PROGRAMADA', 'CONFIRMADA', 'EN_CURSO'] })
      .getMany();

    for (const existing of existingAppointments) {
      const existingStart = new Date(`${existing.fecha}T${existing.hora}:00`);
      const existingEnd = new Date(existingStart.getTime() + 60 * 60000); // Asumiendo 60 min por defecto

      // Verificar solapamiento
      if (
        (appointmentDate >= existingStart && appointmentDate < existingEnd) ||
        (endTime > existingStart && endTime <= existingEnd) ||
        (appointmentDate <= existingStart && endTime >= existingEnd)
      ) {
        throw new BadRequestException('Ya existe una cita programada en ese horario');
      }
    }
  }

  async findAll(currentUserId: number, userRole: string, filters?: any): Promise<Appointment[]> {
    const queryBuilder = this.appointmentRepository.createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.cliente', 'cliente')
      .leftJoinAndSelect('appointment.mascota', 'mascota')
      .leftJoinAndSelect('mascota.tipo', 'tipoMascota')
      .leftJoinAndSelect('appointment.servicio', 'servicio')
      .leftJoinAndSelect('appointment.estadoCita', 'estadoCita')
      .where('appointment.estado = :estado', { estado: true });

    // Filtrar por usuario si es cliente
    if (userRole === 'CLIENTE') {
      queryBuilder.andWhere('cliente.id = :clienteId', { clienteId: currentUserId });
    }

    // Aplicar filtros adicionales
    if (filters?.fecha) {
      queryBuilder.andWhere('appointment.fecha = :fecha', { fecha: filters.fecha });
    }

    if (filters?.estadoCodigo) {
      queryBuilder.andWhere('estadoCita.codigo = :codigo', { codigo: filters.estadoCodigo });
    }

    if (filters?.mascotaId) {
      queryBuilder.andWhere('mascota.id = :mascotaId', { mascotaId: filters.mascotaId });
    }

    return await queryBuilder.orderBy('appointment.fecha', 'DESC')
      .addOrderBy('appointment.hora', 'DESC')
      .getMany();
  }

  async findOne(id: number, currentUserId: number, userRole: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: [
        'cliente',
        'mascota',
        'mascota.tipo',
        'mascota.propietario',
        'servicio',
        'servicio.categoria',
        'estadoCita'
      ]
    });

    if (!appointment) {
      throw new NotFoundException(`Cita con ID ${id} no encontrada`);
    }

    // Verificar permisos
    if (userRole === 'CLIENTE' && appointment.cliente.id !== currentUserId) {
      throw new ForbiddenException('No tienes permisos para ver esta cita');
    }

    return appointment;
  }

  async updateStatus(
    id: number,
    updateStatusDto: UpdateAppointmentStatusDto,
    currentUserId: number,
    userRole: string
  ): Promise<Appointment> {
    const appointment = await this.findOne(id, currentUserId, userRole);

    // Solo admins y veterinarios pueden cambiar estados
    if (!['ADMIN', 'VETERINARIO'].includes(userRole)) {
      throw new ForbiddenException('No tienes permisos para cambiar el estado de la cita');
    }

    const newStatus = await this.appointmentStatusRepository.findOne({
      where: { codigo: updateStatusDto.estadoCodigo.toUpperCase(), estado: true }
    });

    if (!newStatus) {
      throw new BadRequestException('Estado de cita inválido');
    }

    const previousStatus = appointment.estadoCita.codigo;
    appointment.estadoCita = newStatus;

    const updatedAppointment = await this.appointmentRepository.save(appointment);

    // Registrar cambio en logs
    await this.appointmentLogModel.create({
      appointmentId: id,
      usuarioId: currentUserId,
      estadoAnterior: previousStatus,
      estadoNuevo: newStatus.codigo,
      comentario: updateStatusDto.comentario,
      motivoCambio: updateStatusDto.motivoCambio,
    });

    return updatedAppointment;
  }

  async cancel(id: number, currentUserId: number, userRole: string, motivo?: string): Promise<Appointment> {
    const appointment = await this.findOne(id, currentUserId, userRole);

    // Verificar permisos de cancelación
    if (userRole === 'CLIENTE' && appointment.cliente.id !== currentUserId) {
      throw new ForbiddenException('No tienes permisos para cancelar esta cita');
    }

    // Verificar que se puede cancelar
    if (['COMPLETADA', 'CANCELADA'].includes(appointment.estadoCita.codigo)) {
      throw new BadRequestException('No se puede cancelar una cita que ya está completada o cancelada');
    }

    // Verificar tiempo mínimo para cancelación (24 horas antes)
    const appointmentDateTime = new Date(`${appointment.fecha}T${appointment.hora}:00`);
    const now = new Date();
    const hoursUntilAppointment = (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilAppointment < 24 && userRole === 'CLIENTE') {
      throw new BadRequestException('Las citas solo pueden cancelarse con al menos 24 horas de anticipación');
    }

    return await this.updateStatus(id, {
      estadoCodigo: 'CANCELADA',
      comentario: motivo || 'Cita cancelada',
      motivoCambio: userRole === 'CLIENTE' ? 'Cancelación por cliente' : 'Cancelación por clínica'
    }, currentUserId, userRole);
  }

  async getAppointmentStats(startDate?: string, endDate?: string): Promise<any> {
    const queryBuilder = this.appointmentRepository.createQueryBuilder('appointment')
      .leftJoin('appointment.estadoCita', 'status');

    if (startDate && endDate) {
      queryBuilder.where('appointment.fecha BETWEEN :startDate AND :endDate', { startDate, endDate });
    }

    const totalAppointments = await queryBuilder.getCount();

    const appointmentsByStatus = await this.appointmentRepository.createQueryBuilder('appointment')
      .leftJoin('appointment.estadoCita', 'status')
      .select(['status.nombre as estadoNombre', 'COUNT(appointment.id) as cantidad'])
      .groupBy('status.nombre')
      .getRawMany();

    const appointmentsByService = await this.appointmentRepository.createQueryBuilder('appointment')
      .leftJoin('appointment.servicio', 'service')
      .select(['service.nombre as servicioNombre', 'COUNT(appointment.id) as cantidad'])
      .groupBy('service.nombre')
      .getRawMany();

    return {
      totalAppointments,
      appointmentsByStatus,
      appointmentsByService
    };
  }

  

   async getAvailableSlots(fecha: string, servicioId: number): Promise<string[]> {
    const service = await this.serviceRepository.findOne({
      where: { id: servicioId, estado: true }
    });
    if (!service) {
      throw new BadRequestException('Servicio no encontrado');
    }
    // Obtener citas existentes para esa fecha
    const existingAppointments = await this.appointmentRepository.find({
      where: { 
        fecha,
        estadoCita: { codigo: In(['PROGRAMADA', 'CONFIRMADA', 'EN_CURSO']) }
      }
    });
    const occupiedSlots = existingAppointments.map(apt => apt.hora);
    // Generar slots disponibles (cada 30 minutos de 8:00 a 18:00)
    const availableSlots: string[] = [];
    for (let hour = 8; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeSlot = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        if (!occupiedSlots.includes(timeSlot)) {
          availableSlots.push(timeSlot);
        }
      }
    }
    return availableSlots;
  }

  // Añade esto al AppointmentsService (dentro de la clase)
async update(
  id: number,
  updateAppointmentDto: UpdateAppointmentDto,
  currentUserId: number,
  userRole: string
): Promise<Appointment> {
  const appointment = await this.findOne(id, currentUserId, userRole);
  // Verificar permisos de edición
  if (userRole === 'CLIENTE' && appointment.cliente.id !== currentUserId) {
    throw new ForbiddenException('No tienes permisos para editar esta cita');
  }
  // Verificar que se puede editar (solo citas PROGRAMADAS o CONFIRMADAS)
  if (!['PROGRAMADA', 'CONFIRMADA'].includes(appointment.estadoCita.codigo)) {
    throw new BadRequestException('Solo se pueden editar citas en estado PROGRAMADA o CONFIRMADA');
  }
  // Verificar cambios en mascota si se especifica
  if (updateAppointmentDto.mascotaId) {
    const newPet = await this.petRepository.findOne({
      where: { id: updateAppointmentDto.mascotaId, estado: true },
      relations: ['propietario']
    });
    if (!newPet) {
      throw new BadRequestException('La nueva mascota especificada no existe');
    }
    appointment.mascota = newPet;
  }

  // Verificar cambios en servicio si se especifica
  if (updateAppointmentDto.servicioId) {
    const newService = await this.serviceRepository.findOne({
      where: { id: updateAppointmentDto.servicioId, estado: true }
    });
    if (!newService) {
      throw new BadRequestException('El nuevo servicio especificado no existe');
    }
    appointment.servicio = newService;
    appointment.precioFinal = newService.precio;
  }

  // Verificar cambios en fecha/hora si se especifica
  if (updateAppointmentDto.fecha || updateAppointmentDto.hora) {
    const fecha = updateAppointmentDto.fecha || appointment.fecha;
    const hora = updateAppointmentDto.hora || appointment.hora;
    const duracionMinutos = appointment.servicio.duracionMinutos;
    await this.validateTimeSlot(fecha, hora, duracionMinutos);
    appointment.fecha = fecha;
    appointment.hora = hora;
  }

  // Actualizar observaciones si se especifica
  if (updateAppointmentDto.observaciones !== undefined) {
    appointment.observaciones = updateAppointmentDto.observaciones;
  }

  const updatedAppointment = await this.appointmentRepository.save(appointment);

  // Registrar en logs
  await this.appointmentLogModel.create({
    appointmentId: updatedAppointment.id,
    usuarioId: currentUserId,
    estadoNuevo: appointment.estadoCita.codigo,
    comentario: 'Cita editada',
  });

  return updatedAppointment;
}
}

