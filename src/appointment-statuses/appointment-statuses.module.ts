import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentStatusesService } from './appointment-statuses.service';
import { AppointmentStatusesController } from './appointment-statuses.controller';
import { AppointmentStatus } from '../models/entities/appointmentStatus.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppointmentStatus]),
    AuthModule,
  ],
  controllers: [AppointmentStatusesController],
  providers: [AppointmentStatusesService],
  exports: [AppointmentStatusesService] // Exportamos si otros módulos necesitan usar este servicio
})
export class AppointmentStatusesModule {}
