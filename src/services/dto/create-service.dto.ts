import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsPositive,
  MaxLength,
  IsOptional,
  Min,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateServiceDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  nombre: string;

  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  precio: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  imagen?: string;

  @IsOptional()
  @IsNumber()
  @Min(15)
  duracionMinutos?: number;

  @IsNotEmpty()
  @IsNumber()
  categoriaId: number;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  tiposMascotaIds?: number[];
}
