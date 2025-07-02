import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AppointmentStatusesService } from './appointment-statuses.service';
import { CreateAppointmentStatusDto } from './dto/create-appointment-status.dto';
import { UpdateAppointmentStatusDto } from './dto/update-appointment-status.dto';
import { AppointmentStatus } from '../models/entities/appointmentStatus.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('appointment-statuses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentStatusesController {
  constructor(private readonly appointmentStatusesService: AppointmentStatusesService) {}

  @Post()
  @Roles('ADMIN')
  async create(@Body() createAppointmentStatusDto: CreateAppointmentStatusDto): Promise<AppointmentStatus> {
    return this.appointmentStatusesService.create(createAppointmentStatusDto);
  }

  @Get()
  async findAll(): Promise<AppointmentStatus[]> {
    return this.appointmentStatusesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<AppointmentStatus> {
    return this.appointmentStatusesService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  async update(
    @Param('id') id: number,
    @Body() updateAppointmentStatusDto: UpdateAppointmentStatusDto,
  ): Promise<AppointmentStatus> {
    return this.appointmentStatusesService.update(id, updateAppointmentStatusDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  async remove(@Param('id') id: number): Promise<void> {
    return this.appointmentStatusesService.remove(id);
  }

  @Post('seed')
  @Roles('ADMIN')
  async seedDefaultStatuses(): Promise<{ message: string }> {
    await this.appointmentStatusesService.seedDefaultStatuses();
    return { message: 'Estados de cita por defecto creados exitosamente' };
  }
}
