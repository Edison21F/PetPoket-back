// src/appointments/appointments.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { Appointment } from '../models/entities/appointment.entity';
import { Pet } from '../models/entities/pet.entity';
import { Service } from '../models/entities/service.entity';
import { User } from '../models/entities/user.entity';
import { AppointmentStatus } from '../models/entities/appointmentStatus.entity';
import { AppointmentLog, AppointmentLogSchema } from '../models/schemas/appointment-logs.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, Pet, Service, User, AppointmentStatus]),
    MongooseModule.forFeature([{ name: AppointmentLog.name, schema: AppointmentLogSchema }]),
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
