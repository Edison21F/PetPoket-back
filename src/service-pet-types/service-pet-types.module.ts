// src/service-pet-types/service-pet-types.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicePetTypesService } from './service-pet-types.service';
import { ServicePetTypesController } from './service-pet-types.controller';
import { ServicePetType } from '../models/entities/ServicePetType.entity';
import { Service } from '../models/entities/service.entity';
import { PetType } from '../models/entities/petType.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServicePetType, Service, PetType])],
  controllers: [ServicePetTypesController],
  providers: [ServicePetTypesService],
  exports: [ServicePetTypesService],
})
export class ServicePetTypesModule {}