import { PartialType } from '@nestjs/mapped-types';
import { CreateServicePetTypeDto } from './create-service-pet-type.dto';

export class UpdateServicePetTypeDto extends PartialType(CreateServicePetTypeDto) {}
