import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { OwnersService } from './owners.service';
import { OwnersController } from './owners.controller';
import { User } from '../models/entities/user.entity';
import { Pet } from '../models/entities/pet.entity';
import { Appointment } from '../models/entities/appointment.entity';
import { Service } from '../models/entities/service.entity';
import { PetNotes, PetNotesSchema } from '../models/schemas/pet-notes.schema';
import { UserProfile, UserProfileSchema } from '../models/schemas/user-profile.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Pet, Appointment, Service]),
    MongooseModule.forFeature([
      { name: PetNotes.name, schema: PetNotesSchema },
      { name: UserProfile.name, schema: UserProfileSchema }
    ]),
  ],
  controllers: [OwnersController],
  providers: [OwnersService],
  exports: [OwnersService],
})
export class OwnersModule {}