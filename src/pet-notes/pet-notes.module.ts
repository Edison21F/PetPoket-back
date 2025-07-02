import { Module } from '@nestjs/common';
import { PetNotesService } from './pet-notes.service';
import { PetNotesController } from './pet-notes.controller';

@Module({
  controllers: [PetNotesController],
  providers: [PetNotesService],
})
export class PetNotesModule {}
