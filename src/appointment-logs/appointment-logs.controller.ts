import { Controller, Post, Get, Param, Query, Body } from '@nestjs/common';
import { AppointmentLogsService } from './appointment-logs.service';
import { AppointmentLog } from '../models/schemas/appointment-logs.schema';

@Controller('appointment-logs')
export class AppointmentLogsController {
  constructor(private readonly appointmentLogsService: AppointmentLogsService) {}

  @Post()
  async create(@Body() logData: any): Promise<AppointmentLog> {
    return this.appointmentLogsService.create(logData);
  }

  @Get('appointment/:id')
  async findByAppointmentId(@Param('id') appointmentId: number): Promise<AppointmentLog[]> {
    return this.appointmentLogsService.findByAppointmentId(appointmentId);
  }

  @Get()
  async findAll(): Promise<AppointmentLog[]> {
    return this.appointmentLogsService.findAll();
  }

  @Get('date-range')
  async findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<AppointmentLog[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return this.appointmentLogsService.findByDateRange(start, end);
  }
}
