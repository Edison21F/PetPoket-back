import { Controller, Post, Get, Param, Query, Body, Put, Delete } from '@nestjs/common';
import { PetNotesService } from './pet-notes.service';
import { PetNotes } from '../models/schemas/pet-notes.schema';

@Controller('pet-notes')
export class PetNotesController {
  constructor(private readonly petNotesService: PetNotesService) {}

  @Post()
  async create(@Body() createPetNoteData: any): Promise<PetNotes> {
    return this.petNotesService.create(createPetNoteData);
  }

  @Get('pet/:id')
  async findByPetId(@Param('id') petId: number): Promise<PetNotes[]> {
    return this.petNotesService.findByPetId(petId);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<PetNotes | null> {
    return this.petNotesService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: any): Promise<PetNotes | null> {
    return this.petNotesService.update(id, updateData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.petNotesService.delete(id);
  }

  @Get()
  async findAll(): Promise<PetNotes[]> {
    return this.petNotesService.findAll();
  }
}
