import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetTypesService } from './pet-types.service';
import { PetTypesController } from './pet-types.controller';
import { PetType } from '../models/entities/petType.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PetType])],
  controllers: [PetTypesController],
  providers: [PetTypesService],
  exports: [PetTypesService],
})
export class PetTypesModule {}