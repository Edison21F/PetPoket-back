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
  Query,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';

@Controller('services')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @Roles('ADMIN', 'VETERINARIO')
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.servicesService.findAll();
  }

  @Get('stats')
  @Roles('ADMIN', 'VETERINARIO')
  getServiceStats() {
    return this.servicesService.getServiceStats();
  }

  @Get('category/:categoryId')
  @Public()
  findByCategory(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.servicesService.findByCategory(categoryId);
  }

  @Get('pet-type/:petTypeId')
  @Public()
  findByPetType(@Param('petTypeId', ParseIntPipe) petTypeId: number) {
    return this.servicesService.findByPetType(petTypeId);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.servicesService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'VETERINARIO')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    return this.servicesService.update(id, updateServiceDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.servicesService.remove(id);
  }
}