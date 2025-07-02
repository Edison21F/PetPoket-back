import { Module } from '@nestjs/common';
import { AppointmentLogsService } from './appointment-logs.service';
import { AppointmentLogsController } from './appointment-logs.controller';

@Module({
  controllers: [AppointmentLogsController],
  providers: [AppointmentLogsService],
})
export class AppointmentLogsModule {}
