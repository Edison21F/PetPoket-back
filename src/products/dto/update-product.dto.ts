import { IsNotEmpty, IsNumber, IsString, IsOptional, IsIn, MaxLength, IsArray } from 'class-validator';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends CreateProductDto {}

export class UpdateStockDto {
  @IsNotEmpty()
  @IsNumber()
  cantidad: number;

  @IsNotEmpty()
  @IsString()
  @IsIn(['entrada', 'salida'])
  tipoMovimiento: 'entrada' | 'salida';

  @IsOptional()
  @IsString()
  motivo?: string;

  @IsOptional()
  @IsString()
  observaciones?: string;
}