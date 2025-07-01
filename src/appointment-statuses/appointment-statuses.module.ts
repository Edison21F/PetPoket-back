import { Module } from '@nestjs/common';
import { AppointmentStatusesService } from './appointment-statuses.service';
import { AppointmentStatusesController } from './appointment-statuses.controller';

@Module({
  controllers: [AppointmentStatusesController],
  providers: [AppointmentStatusesService],
})
export class AppointmentStatusesModule {}
