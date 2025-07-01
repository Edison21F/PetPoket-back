import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { sqlConfig } from './database.sql';
import { User } from '../models/entities/user.entity';
import { Role } from '../models/entities/role.entity';
import { PetType } from '../models/entities/petType.entity';
import { Pet } from '../models/entities/pet.entity';
import { ServiceCategory } from '../models/entities/serviceCategory.entity';
import { Service } from '../models/entities/service.entity';
import { ServicePetType } from '../models/entities/ServicePetType.entity';
import { ProductCategory } from '../models/entities/productCategory.entity';
import { Product } from '../models/entities/product.entity';
import { ProductPetType } from '../models/entities/productPetType.entity';
import { AppointmentStatus } from '../models/entities/appointmentStatus.entity';
import { Appointment } from '../models/entities/appointment.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: sqlConfig.host,
  port: sqlConfig.port,
  username: sqlConfig.username,
  password: sqlConfig.password,
  database: sqlConfig.database,
  entities: [
    User,
    Role,
    PetType,
    Pet,
    ServiceCategory,
    Service,
    ServicePetType,
    ProductCategory,
    Product,
    ProductPetType,
    AppointmentStatus,
    Appointment,
  ],
  synchronize: true,
  
};
