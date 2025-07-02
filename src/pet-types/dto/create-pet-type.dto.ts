import { IsNotEmpty, IsString, MaxLength, IsOptional } from 'class-validator';

export class CreatePetTypeDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  nombre: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  descripcion?: string;
}