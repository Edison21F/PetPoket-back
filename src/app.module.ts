import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { typeOrmConfig } from './config/database.orm';
import {  mongoOptions, mongoUri  } from './config/database.mongo';

// Módulos funcionales
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { PetTypesModule } from './pet-types/pet-types.module';
import { PetsModule } from './pets/pets.module';
import { ServiceCategoriesModule } from './service-categories/service-categories.module';
import { ServicesModule } from './services/services.module';
import { ServicePetTypesModule } from './service-pet-types/service-pet-types.module';
import { ProductCategoriesModule } from './product-categories/product-categories.module';
import { ProductsModule } from './products/products.module';
import { ProductPetTypesModule } from './product-pet-types/product-pet-types.module';
import { AppointmentStatusesModule } from './appointment-statuses/appointment-statuses.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    MongooseModule.forRoot(mongoUri),



    // Módulos de dominio
    UsersModule,
    RolesModule,
    PetTypesModule,
    PetsModule,
    ServiceCategoriesModule,
    ServicesModule,
    ServicePetTypesModule,
    ProductCategoriesModule,
    ProductsModule,
    ProductPetTypesModule,
    AppointmentStatusesModule,
    AppointmentsModule,
    AuthModule,
  ],
})
export class AppModule {}
