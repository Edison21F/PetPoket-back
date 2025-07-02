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
import { ServiceCategoriesService } from './service-categories.service';
import { CreateServiceCategoryDto } from './dto/create-service-category.dto';
import { UpdateServiceCategoryDto } from './dto/update-service-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';

@Controller('service-categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ServiceCategoriesController {
  constructor(private readonly serviceCategoriesService: ServiceCategoriesService) {}

  @Post()
  @Roles('ADMIN', 'VETERINARIO')
  create(@Body() createServiceCategoryDto: CreateServiceCategoryDto) {
    return this.serviceCategoriesService.create(createServiceCategoryDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.serviceCategoriesService.findAll();
  }

  @Post('seed')
  @Roles('ADMIN')
  async seedCategories() {
    await this.serviceCategoriesService.seedDefaultCategories();
    return { message: 'Categorías de servicios por defecto creadas exitosamente' };
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.serviceCategoriesService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'VETERINARIO')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateServiceCategoryDto: UpdateServiceCategoryDto,
  ) {
    return this.serviceCategoriesService.update(id, updateServiceCategoryDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.serviceCategoriesService.remove(id);
  }
}
