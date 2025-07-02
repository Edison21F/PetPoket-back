// src/pets/pets.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetsService } from './pets.service';
import { PetsController } from './pets.controller';
import { Pet } from '../models/entities/pet.entity';
import { PetType } from '../models/entities/petType.entity';
import { User } from '../models/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pet, PetType, User])],
  controllers: [PetsController],
  providers: [PetsService],
  exports: [PetsService],
})
export class PetsModule {}
