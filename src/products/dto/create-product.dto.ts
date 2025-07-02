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
  IsBoolean,
} from 'class-validator';

export class CreateProductDto {
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

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  stock: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  imagen?: string;

  @IsNotEmpty()
  @IsNumber()
  categoriaId: number;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  tiposMascotaIds?: number[];

  @IsOptional()
  @IsString()
  @MaxLength(100)
  marca?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  presentacion?: string; // Ej: "1kg", "500ml", "Caja x 12"

  @IsOptional()
  @IsNumber()
  @Min(0)
  stockMinimo?: number;

  @IsOptional()
  @IsBoolean()
  requiereReceta?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  codigoBarras?: string;
}