import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsPositive,
  IsIn,
  MaxLength,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

export class CreatePetDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  nombre: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  raza: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(50)
  edad: number;

  @IsNotEmpty()
  @IsString()
  @IsIn(['macho', 'hembra'])
  sexo: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  color: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  peso: number;

  @IsNotEmpty()
  @IsNumber()
  tipoId: number;

  @IsOptional()
  @IsNumber()
  propietarioId?: number; // Solo para admins/veterinarios

  @IsOptional()
  @IsString()
  @MaxLength(500)
  observaciones?: string;
}