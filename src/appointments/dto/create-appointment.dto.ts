import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDateString,
  Matches,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class CreateAppointmentDto {
  @IsNotEmpty()
  @IsNumber()
  mascotaId: number;

  @IsNotEmpty()
  @IsNumber()
  servicioId: number;

  @IsNotEmpty()
  @IsDateString()
  fecha: string; // Formato YYYY-MM-DD

  @IsNotEmpty()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'La hora debe estar en formato HH:MM (24 horas)'
  })
  hora: string; // Formato HH:MM

  @IsOptional()
  @IsString()
  @MaxLength(500)
  observaciones?: string;

  @IsOptional()
  @IsNumber()
  clienteId?: number; // Solo para admins/veterinarios
}