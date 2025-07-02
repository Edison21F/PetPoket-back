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
import { PetTypesService } from './pet-types.service';
import { CreatePetTypeDto } from './dto/create-pet-type.dto';
import { UpdatePetTypeDto } from './dto/update-pet-type.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';

@Controller('pet-types')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PetTypesController {
  constructor(private readonly petTypesService: PetTypesService) {}

  @Post()
  @Roles('ADMIN', 'VETERINARIO')
  create(@Body() createPetTypeDto: CreatePetTypeDto) {
    return this.petTypesService.create(createPetTypeDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.petTypesService.findAll();
  }

  @Post('seed')
  @Roles('ADMIN')
  async seedPetTypes() {
    await this.petTypesService.seedDefaultPetTypes();
    return { message: 'Tipos de mascotas por defecto creados exitosamente' };
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.petTypesService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'VETERINARIO')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePetTypeDto: UpdatePetTypeDto,
  ) {
    return this.petTypesService.update(id, updatePetTypeDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.petTypesService.remove(id);
  }
}
