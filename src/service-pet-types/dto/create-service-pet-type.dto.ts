// src/service-pet-types/dto/create-service-pet-type.dto.ts
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateServicePetTypeDto {
  @IsNotEmpty()
  @IsNumber()
  serviceId: number;

  @IsNotEmpty()
  @IsNumber()
  petTypeId: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  observaciones?: string;
}
