import { Module } from '@nestjs/common';
import { ProductPetTypesService } from './product-pet-types.service';
import { ProductPetTypesController } from './product-pet-types.controller';

@Module({
  controllers: [ProductPetTypesController],
  providers: [ProductPetTypesService],
})
export class ProductPetTypesModule {}
