import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateProductPetTypeDto {
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  petTypeId: number;
}