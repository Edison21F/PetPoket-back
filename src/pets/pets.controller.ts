import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('pets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post()
  @Roles('CLIENTE', 'ADMIN', 'VETERINARIO')
  create(@Body() createPetDto: CreatePetDto, @Request() req) {
    return this.petsService.create(createPetDto, req.user.id, req.user.rol.nombre);
  }

  @Get()
  @Roles('ADMIN', 'VETERINARIO', 'CLIENTE')
  findAll(@Request() req) {
    return this.petsService.findAll(req.user.rol.nombre, req.user.id);
  }

  @Get('my-pets')
  @Roles('CLIENTE')
  getMyPets(@Request() req) {
    return this.petsService.findByOwner(req.user.id, req.user.id, req.user.rol.nombre);
  }

  @Get('stats')
  @Roles('ADMIN', 'VETERINARIO')
  getPetStats(@Query('ownerId') ownerId?: string) {
    const ownerIdNumber = ownerId ? parseInt(ownerId) : undefined;
    return this.petsService.getPetStats(ownerIdNumber);
  }

  @Get('owner/:ownerId')
  @Roles('ADMIN', 'VETERINARIO', 'CLIENTE')
  findByOwner(
    @Param('ownerId', ParseIntPipe) ownerId: number,
    @Request() req
  ) {
    return this.petsService.findByOwner(ownerId, req.user.id, req.user.rol.nombre);
  }

  @Get(':id')
  @Roles('ADMIN', 'VETERINARIO', 'CLIENTE')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.petsService.findOne(id, req.user.id, req.user.rol.nombre);
  }

  @Patch(':id')
  @Roles('CLIENTE', 'ADMIN', 'VETERINARIO')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePetDto: UpdatePetDto,
    @Request() req
  ) {
    return this.petsService.update(id, updatePetDto, req.user.id, req.user.rol.nombre);
  }

  @Delete(':id')
  @Roles('CLIENTE', 'ADMIN')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.petsService.remove(id, req.user.id, req.user.rol.nombre);
  }
}

