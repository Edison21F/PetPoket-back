import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppointmentLog } from '../models/schemas/appointment-logs.schema';

@Injectable()
export class AppointmentLogsService {
  constructor(
    @InjectModel(AppointmentLog.name)
    private appointmentLogModel: Model<AppointmentLog>,
  ) {}

  async create(logData: any): Promise<AppointmentLog> {
    const newLog = new this.appointmentLogModel(logData);
    return await newLog.save();
  }

  async findByAppointmentId(appointmentId: number): Promise<AppointmentLog[]> {
    return await this.appointmentLogModel
      .find({ appointmentId })
      .sort({ fechaCambio: -1 })
      .exec();
  }

  async logStatusChange(
    appointmentId: number,
    usuarioId: number,
    estadoAnterior: string,
    estadoNuevo: string,
    comentario?: string,
    motivoCambio?: string
  ): Promise<AppointmentLog> {
    return await this.create({
      appointmentId,
      usuarioId,
      estadoAnterior,
      estadoNuevo,
      comentario,
      motivoCambio,
    });
  }

  async findAll(): Promise<AppointmentLog[]> {
    return await this.appointmentLogModel
      .find()
      .sort({ fechaCambio: -1 })
      .exec();
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<AppointmentLog[]> {
    return await this.appointmentLogModel
      .find({
        fechaCambio: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .sort({ fechaCambio: -1 })
      .exec();
  }
}