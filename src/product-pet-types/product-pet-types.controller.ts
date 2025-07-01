import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductPetTypesService } from './product-pet-types.service';
import { CreateProductPetTypeDto } from './dto/create-product-pet-type.dto';
import { UpdateProductPetTypeDto } from './dto/update-product-pet-type.dto';

@Controller('product-pet-types')
export class ProductPetTypesController {
  constructor(private readonly productPetTypesService: ProductPetTypesService) {}

  @Post()
  create(@Body() createProductPetTypeDto: CreateProductPetTypeDto) {
    return this.productPetTypesService.create(createProductPetTypeDto);
  }

  @Get()
  findAll() {
    return this.productPetTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productPetTypesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductPetTypeDto: UpdateProductPetTypeDto) {
    return this.productPetTypesService.update(+id, updateProductPetTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productPetTypesService.remove(+id);
  }
}
