import { PartialType } from '@nestjs/mapped-types';
import { CreateProductPetTypeDto } from './create-product-pet-type.dto';

export class UpdateProductPetTypeDto extends PartialType(CreateProductPetTypeDto) {}
