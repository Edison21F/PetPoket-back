import { IsNotEmpty, IsNumber, IsArray, ArrayNotEmpty } from 'class-validator';

export class BulkAssignServicePetTypeDto {
  @IsNotEmpty()
  @IsNumber()
  serviceId: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  petTypeIds: number[];
}