import { IsNotEmpty, IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  nombre: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  descripcion?: string;
}