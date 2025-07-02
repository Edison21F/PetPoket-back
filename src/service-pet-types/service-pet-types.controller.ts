// src/service-pet-types/service-pet-types.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ServicePetTypesService } from './service-pet-types.service';
import { CreateServicePetTypeDto } from './dto/create-service-pet-type.dto';
import { UpdateServicePetTypeDto } from './dto/update-service-pet-type.dto';
import { BulkAssignServicePetTypeDto } from './dto/bulk-assign.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';

@Controller('service-pet-types')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ServicePetTypesController {
  constructor(private readonly servicePetTypesService: ServicePetTypesService) {}

  @Post()
  @Roles('ADMIN', 'VETERINARIO')
  create(@Body() createServicePetTypeDto: CreateServicePetTypeDto) {
    return this.servicePetTypesService.create(createServicePetTypeDto);
  }

  @Post('bulk-assign')
  @Roles('ADMIN', 'VETERINARIO')
  bulkAssign(@Body() bulkAssignDto: BulkAssignServicePetTypeDto) {
    return this.servicePetTypesService.bulkAssign(bulkAssignDto);
  }

  @Get()
  @Roles('ADMIN', 'VETERINARIO')
  findAll() {
    return this.servicePetTypesService.findAll();
  }

  @Get('compatibility-matrix')
  @Roles('ADMIN', 'VETERINARIO')
  getCompatibilityMatrix() {
    return this.servicePetTypesService.getServiceCompatibilityMatrix();
  }

  @Get('stats')
  @Roles('ADMIN', 'VETERINARIO')
  getStats() {
    return this.servicePetTypesService.getServiceStats();
  }

  @Get('service/:serviceId')
  @Public()
  findByService(@Param('serviceId', ParseIntPipe) serviceId: number) {
    return this.servicePetTypesService.findByService(serviceId);
  }

  @Get('pet-type/:petTypeId')
  @Public()
  findByPetType(@Param('petTypeId', ParseIntPipe) petTypeId: number) {
    return this.servicePetTypesService.findByPetType(petTypeId);
  }

  @Get('services-for-pet/:petTypeId')
  @Public()
  findServicesForPetType(@Param('petTypeId', ParseIntPipe) petTypeId: number) {
    return this.servicePetTypesService.findServicesForPetType(petTypeId);
  }

  @Get('pet-types-for-service/:serviceId')
  @Public()
  findPetTypesForService(@Param('serviceId', ParseIntPipe) serviceId: number) {
    return this.servicePetTypesService.findPetTypesForService(serviceId);
  }

  @Post('seed')
  @Roles('ADMIN')
  async seedRelations() {
    await this.servicePetTypesService.seedDefaultRelations();
    return { message: 'Relaciones por defecto entre servicios y tipos de mascotas creadas exitosamente' };
  }

  @Get(':id')
  @Roles('ADMIN', 'VETERINARIO')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.servicePetTypesService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'VETERINARIO')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateServicePetTypeDto: UpdateServicePetTypeDto,
  ) {
    return this.servicePetTypesService.update(id, updateServicePetTypeDto);
  }

  @Delete(':id')
  @Roles('ADMIN', 'VETERINARIO')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.servicePetTypesService.remove(id);
  }

  @Delete('service/:serviceId/pet-type/:petTypeId')
  @Roles('ADMIN', 'VETERINARIO')
  removeByServiceAndPetType(
    @Param('serviceId', ParseIntPipe) serviceId: number,
    @Param('petTypeId', ParseIntPipe) petTypeId: number,
  ) {
    return this.servicePetTypesService.removeByServiceAndPetType(serviceId, petTypeId);
  }
}