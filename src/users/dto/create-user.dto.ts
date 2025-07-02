import { IsEmail, IsNotEmpty, IsString, MinLength, IsNumber, IsOptional } from 'class-validator';

export class CreateUserDto {
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