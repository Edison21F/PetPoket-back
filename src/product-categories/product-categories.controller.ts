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
import { ProductCategoriesService } from './product-categories.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';

@Controller('product-categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductCategoriesController {
  constructor(private readonly productCategoriesService: ProductCategoriesService) {}

  @Post()
  @Roles('ADMIN', 'VETERINARIO')
  create(@Body() createProductCategoryDto: CreateProductCategoryDto) {
    return this.productCategoriesService.create(createProductCategoryDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.productCategoriesService.findAll();
  }

  @Post('seed')
  @Roles('ADMIN')
  async seedCategories() {
    await this.productCategoriesService.seedDefaultCategories();
    return { message: 'Categorías de productos por defecto creadas exitosamente' };
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productCategoriesService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'VETERINARIO')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductCategoryDto: UpdateProductCategoryDto,
  ) {
    return this.productCategoriesService.update(id, updateProductCategoryDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productCategoriesService.remove(id);
  }
}