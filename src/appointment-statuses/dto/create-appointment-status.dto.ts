import { IsNotEmpty, IsString, MaxLength, IsOptional } from 'class-validator';

export class CreateAppointmentStatusDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  nombre: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  codigo: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  descripcion?: string;
}