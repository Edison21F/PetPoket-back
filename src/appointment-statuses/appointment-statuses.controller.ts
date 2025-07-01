import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AppointmentStatusesService } from './appointment-statuses.service';
import { CreateAppointmentStatusDto } from './dto/create-appointment-status.dto';
import { UpdateAppointmentStatusDto } from './dto/update-appointment-status.dto';

@Controller('appointment-statuses')
export class AppointmentStatusesController {
  constructor(private readonly appointmentStatusesService: AppointmentStatusesService) {}

  @Post()
  create(@Body() createAppointmentStatusDto: CreateAppointmentStatusDto) {
    return this.appointmentStatusesService.create(createAppointmentStatusDto);
  }

  @Get()
  findAll() {
    return this.appointmentStatusesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentStatusesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAppointmentStatusDto: UpdateAppointmentStatusDto) {
    return this.appointmentStatusesService.update(+id, updateAppointmentStatusDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentStatusesService.remove(+id);
  }
}
