import { IsNotEmpty, IsString, IsOptional, MaxLength } from 'class-validator';
import { CreateAppointmentDto } from './create-appointment.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
  @IsNotEmpty()
  @IsString()
  estadoCodigo: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  comentario?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  motivoCambio?: string;
}

export class UpdateAppointmentStatusDto {
  @IsNotEmpty()
  @IsString()
  estadoCodigo: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  comentario?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  motivoCambio?: string;
}
