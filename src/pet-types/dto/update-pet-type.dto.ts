import { PartialType } from '@nestjs/mapped-types';
import { CreatePetTypeDto } from './create-pet-type.dto';

export class UpdatePetTypeDto extends PartialType(CreatePetTypeDto) {}
