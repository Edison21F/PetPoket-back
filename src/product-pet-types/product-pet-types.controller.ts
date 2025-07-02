import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductPetTypesService } from './product-pet-types.service';
import { CreateProductPetTypeDto } from './dto/create-product-pet-type.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('product-pet-types')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductPetTypesController {
  constructor(private readonly productPetTypesService: ProductPetTypesService) {}

  @Post()
  @Roles('ADMIN', 'VETERINARIO')
  create(@Body() createProductPetTypeDto: CreateProductPetTypeDto) {
    return this.productPetTypesService.create(createProductPetTypeDto);
  }

  @Get()
  @Roles('ADMIN', 'VETERINARIO')
  findAll() {
    return this.productPetTypesService.findAll();
  }

  @Get('product/:productId')
  @Roles('ADMIN', 'VETERINARIO')
  findByProduct(@Param('productId', ParseIntPipe) productId: number) {
    return this.productPetTypesService.findByProduct(productId);
  }

  @Get('pet-type/:petTypeId')
  @Roles('ADMIN', 'VETERINARIO')
  findByPetType(@Param('petTypeId', ParseIntPipe) petTypeId: number) {
    return this.productPetTypesService.findByPetType(petTypeId);
  }

  @Get(':id')
  @Roles('ADMIN', 'VETERINARIO')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productPetTypesService.findOne(id);
  }

  @Delete(':id')
  @Roles('ADMIN', 'VETERINARIO')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productPetTypesService.remove(id);
  }

  @Delete('product/:productId/pet-type/:petTypeId')
  @Roles('ADMIN', 'VETERINARIO')
  removeByProductAndPetType(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('petTypeId', ParseIntPipe) petTypeId: number,
  ) {
    return this.productPetTypesService.removeByProductAndPetType(productId, petTypeId);
  }
}
