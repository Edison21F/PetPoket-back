import { IsEmail, IsNotEmpty, IsString, MinLength, IsNumber } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  nombres: string;

  @IsNotEmpty()
  @IsString()
  apellidos: string;

  @IsNotEmpty()
  @IsString()
  cedula: string;

  @IsNotEmpty()
  @IsEmail()
  correo: string;

  @IsNotEmpty()
  @MinLength(6)
  contrasena: string;

  @IsNumber()
  rolId: number;
}