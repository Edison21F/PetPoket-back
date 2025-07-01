import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ServicePetTypesService } from './service-pet-types.service';
import { CreateServicePetTypeDto } from './dto/create-service-pet-type.dto';
import { UpdateServicePetTypeDto } from './dto/update-service-pet-type.dto';

@Controller('service-pet-types')
export class ServicePetTypesController {
  constructor(private readonly servicePetTypesService: ServicePetTypesService) {}

  @Post()
  create(@Body() createServicePetTypeDto: CreateServicePetTypeDto) {
    return this.servicePetTypesService.create(createServicePetTypeDto);
  }

  @Get()
  findAll() {
    return this.servicePetTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicePetTypesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServicePetTypeDto: UpdateServicePetTypeDto) {
    return this.servicePetTypesService.update(+id, updateServicePetTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicePetTypesService.remove(+id);
  }
}
