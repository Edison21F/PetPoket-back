// src/appointment-statuses/appointment-statuses.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppointmentStatus } from '../models/entities/appointmentStatus.entity';
import { CreateAppointmentStatusDto } from './dto/create-appointment-status.dto';
import { UpdateAppointmentStatusDto } from './dto/update-appointment-status.dto';

@Injectable()
export class AppointmentStatusesService {
  constructor(
    @InjectRepository(AppointmentStatus)
    private readonly appointmentStatusRepository: Repository<AppointmentStatus>,
  ) {}

  async create(createAppointmentStatusDto: CreateAppointmentStatusDto): Promise<AppointmentStatus> {
    const existingStatus = await this.appointmentStatusRepository.findOne({
      where: [
        { nombre: createAppointmentStatusDto.nombre },
        { codigo: createAppointmentStatusDto.codigo.toUpperCase() }
      ]
    });

    if (existingStatus) {
      throw new BadRequestException('Ya existe un estado con ese nombre o código');
    }

    const newStatus = this.appointmentStatusRepository.create({
      ...createAppointmentStatusDto,
      codigo: createAppointmentStatusDto.codigo.toUpperCase()
    });

    return await this.appointmentStatusRepository.save(newStatus);
  }

  async findAll(): Promise<AppointmentStatus[]> {
    return await this.appointmentStatusRepository.find({
      where: { estado: true },
      order: { nombre: 'ASC' }
    });
  }

  async findOne(id: number): Promise<AppointmentStatus> {
    const status = await this.appointmentStatusRepository.findOne({ where: { id } });
    
    if (!status) {
      throw new NotFoundException(`Estado de cita con ID ${id} no encontrado`);
    }
    
    return status;
  }

  async findByCode(codigo: string): Promise<AppointmentStatus | undefined> {
    const result = await this.appointmentStatusRepository.findOne({
      where: { codigo: codigo.toUpperCase(), estado: true }
    });
    return result === null ? undefined : result;
  }

  async update(id: number, updateAppointmentStatusDto: UpdateAppointmentStatusDto): Promise<AppointmentStatus> {
    const status = await this.findOne(id);

    if (updateAppointmentStatusDto.codigo || updateAppointmentStatusDto.nombre) {
      const existingStatus = await this.appointmentStatusRepository.findOne({
        where: [
          { nombre: updateAppointmentStatusDto.nombre },
          { codigo: updateAppointmentStatusDto.codigo?.toUpperCase() }
        ]
      });

      if (existingStatus && existingStatus.id !== id) {
        throw new BadRequestException('Ya existe un estado con ese nombre o código');
      }
    }

    Object.assign(status, {
      nombre: updateAppointmentStatusDto.nombre || status.nombre,
      codigo: updateAppointmentStatusDto.codigo ? updateAppointmentStatusDto.codigo.toUpperCase() : status.codigo,
      descripcion: updateAppointmentStatusDto.descripcion !== undefined ? updateAppointmentStatusDto.descripcion : status.descripcion,
    });

    return await this.appointmentStatusRepository.save(status);
  }

  async remove(id: number): Promise<void> {
    const status = await this.findOne(id);
    status.estado = false;
    await this.appointmentStatusRepository.save(status);
  }

  async seedDefaultStatuses(): Promise<void> {
    const defaultStatuses = [
      { nombre: 'Programada', codigo: 'PROGRAMADA', descripcion: 'Cita programada por el cliente' },
      { nombre: 'Confirmada', codigo: 'CONFIRMADA', descripcion: 'Cita confirmada por la clínica' },
      { nombre: 'En Curso', codigo: 'EN_CURSO', descripcion: 'Cita en proceso de atención' },
      { nombre: 'Completada', codigo: 'COMPLETADA', descripcion: 'Cita finalizada exitosamente' },
      { nombre: 'Cancelada', codigo: 'CANCELADA', descripcion: 'Cita cancelada' },
      { nombre: 'No Asistió', codigo: 'NO_ASISTIO', descripcion: 'Cliente no asistió a la cita' }
    ];

    for (const statusData of defaultStatuses) {
      const existing = await this.findByCode(statusData.codigo);
      if (!existing) {
        await this.create(statusData);
      }
    }
  }
}
