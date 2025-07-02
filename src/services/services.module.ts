import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { Service } from '../models/entities/service.entity';
import { ServiceCategory } from '../models/entities/serviceCategory.entity';
import { PetType } from '../models/entities/petType.entity';
import { ServicePetType } from '../models/entities/ServicePetType.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Service, ServiceCategory, PetType, ServicePetType])],
  controllers: [ServicesController],
  providers: [ServicesService],
  exports: [ServicesService],
})
export class ServicesModule {}