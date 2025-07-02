import { IsNotEmpty, IsString, MaxLength, IsOptional } from 'class-validator';

export class CreateProductCategoryDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  nombre: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  descripcion?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  imagen?: string;
}