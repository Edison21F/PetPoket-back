import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['contrasena'] as const)) {
  @IsOptional()
  @IsString()
  contrasenaNueva?: string;
}