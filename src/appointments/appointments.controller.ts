import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { UpdateAppointmentStatusDto } from './dto/update-appointment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Appointment } from '../models/entities/appointment.entity';

@Controller('appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @Roles('ADMIN', 'VETERINARIO', 'CLIENTE')
  async create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @Request() req,
  ): Promise<Appointment> {
    return this.appointmentsService.create(
      createAppointmentDto,
      req.user.id,
      req.user.role,
    );
  }

  @Get()
  async findAll(
    @Request() req,
    @Query('fecha') fecha?: string,
    @Query('estado') estadoCodigo?: string,
    @Query('mascotaId') mascotaId?: number,
  ): Promise<Appointment[]> {
    return this.appointmentsService.findAll(req.user.id, req.user.role, {
      fecha,
      estadoCodigo,
      mascotaId,
    });
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<Appointment> {
    return this.appointmentsService.findOne(id, req.user.id, req.user.role);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
    @Request() req,
  ): Promise<Appointment> {
    return this.appointmentsService.update(
      id,
      updateAppointmentDto,
      req.user.id,
      req.user.role,
    );
  }

  @Patch(':id/status')
  @Roles('ADMIN', 'VETERINARIO')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateAppointmentStatusDto,
    @Request() req,
  ): Promise<Appointment> {
    return this.appointmentsService.updateStatus(
      id,
      updateStatusDto,
      req.user.id,
      req.user.role,
    );
  }

  @Delete(':id/cancel')
  async cancel(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Query('motivo') motivo?: string,
  ): Promise<Appointment> {
    return this.appointmentsService.cancel(id, req.user.id, req.user.role, motivo);
  }

  @Get('stats')
  @Roles('ADMIN', 'VETERINARIO')
  async getAppointmentStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.appointmentsService.getAppointmentStats(startDate, endDate);
  }

  @Get('availability/slots')
  @Roles('ADMIN', 'VETERINARIO', 'CLIENTE')
  async getAvailableSlots(
    @Query('fecha') fecha: string,
    @Query('servicioId') servicioId: number,
  ): Promise<string[]> {
    return this.appointmentsService.getAvailableSlots(fecha, Number(servicioId));
  }
}
