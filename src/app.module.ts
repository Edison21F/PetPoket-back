import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { typeOrmConfig } from './config/database.orm';
import { mongoOptions, mongoUri } from './config/database.mongo';

// Guards
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';

// Módulos de autenticación y usuarios
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';

// Módulos de mascotas
import { PetTypesModule } from './pet-types/pet-types.module';
import { PetsModule } from './pets/pets.module';

// Módulos de servicios
import { ServiceCategoriesModule } from './service-categories/service-categories.module';
import { ServicesModule } from './services/services.module';
import { ServicePetTypesModule } from './service-pet-types/service-pet-types.module';

// Módulos de productos (para futuro)
import { ProductCategoriesModule } from './product-categories/product-categories.module';
import { ProductsModule } from './products/products.module';
import { ProductPetTypesModule } from './product-pet-types/product-pet-types.module';

// Módulos de citas
import { AppointmentStatusesModule } from './appointment-statuses/appointment-statuses.module';
import { AppointmentsModule } from './appointments/appointments.module';

// Módulos específicos para dueños
import { OwnersModule } from './owners/owners.module';

// Módulos MongoDB para perfiles y logs
import { UserProfilesModule } from './user-profiles/user-profiles.module';

@Module({
  imports: [
    // Configuración de bases de datos
    TypeOrmModule.forRoot(typeOrmConfig),
    MongooseModule.forRoot(mongoUri),

    // Módulos de autenticación y autorización
    AuthModule,
    UsersModule,
    RolesModule,

    // Módulos de mascotas
    PetTypesModule,
    PetsModule,

    // Módulos de servicios
    ServiceCategoriesModule,
    ServicesModule,
    ServicePetTypesModule,

    // Módulos de productos (para futuro desarrollo)
    ProductCategoriesModule,
    ProductsModule,
    ProductPetTypesModule,

    // Módulos de citas
    AppointmentStatusesModule,
    AppointmentsModule,

    // Módulos específicos para dueños
    OwnersModule,

    // Módulos MongoDB
    UserProfilesModule,
  ],
  providers: [
    // Guards globales
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}