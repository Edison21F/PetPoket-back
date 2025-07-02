import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductPetTypesService } from './product-pet-types.service';
import { ProductPetTypesController } from './product-pet-types.controller';
import { ProductPetType } from '../models/entities/productPetType.entity';
import { Product } from '../models/entities/product.entity';
import { PetType } from '../models/entities/petType.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductPetType, Product, PetType])],
  controllers: [ProductPetTypesController],
  providers: [ProductPetTypesService],
  exports: [ProductPetTypesService],
})
export class ProductPetTypesModule {}