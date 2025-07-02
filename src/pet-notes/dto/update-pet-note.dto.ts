import { PartialType } from '@nestjs/mapped-types';
import { CreatePetNoteDto } from './create-pet-note.dto';

export class UpdatePetNoteDto extends PartialType(CreatePetNoteDto) {}
