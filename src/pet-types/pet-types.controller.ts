import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PetTypesService } from './pet-types.service';
import { CreatePetTypeDto } from './dto/create-pet-type.dto';
import { UpdatePetTypeDto } from './dto/update-pet-type.dto';

@Controller('pet-types')
export class PetTypesController {
  constructor(private readonly petTypesService: PetTypesService) {}

  @Post()
  create(@Body() createPetTypeDto: CreatePetTypeDto) {
    return this.petTypesService.create(createPetTypeDto);
  }

  @Get()
  findAll() {
    return this.petTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.petTypesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePetTypeDto: UpdatePetTypeDto) {
    return this.petTypesService.update(+id, updatePetTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.petTypesService.remove(+id);
  }
}
