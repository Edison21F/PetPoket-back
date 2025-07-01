import { Module } from '@nestjs/common';
import { ServicePetTypesService } from './service-pet-types.service';
import { ServicePetTypesController } from './service-pet-types.controller';

@Module({
  controllers: [ServicePetTypesController],
  providers: [ServicePetTypesService],
})
export class ServicePetTypesModule {}
