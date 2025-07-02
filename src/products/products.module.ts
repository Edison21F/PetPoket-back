import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from '../models/entities/product.entity';
import { ProductCategory } from '../models/entities/productCategory.entity';
import { PetType } from '../models/entities/petType.entity';
import { ProductPetType } from '../models/entities/productPetType.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductCategory, PetType, ProductPetType])],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}