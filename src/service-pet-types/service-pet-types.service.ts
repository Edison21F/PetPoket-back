import { Injectable } from '@nestjs/common';
import { CreateServicePetTypeDto } from './dto/create-service-pet-type.dto';
import { UpdateServicePetTypeDto } from './dto/update-service-pet-type.dto';

@Injectable()
export class ServicePetTypesService {
  create(createServicePetTypeDto: CreateServicePetTypeDto) {
    return 'This action adds a new servicePetType';
  }

  findAll() {
    return `This action returns all servicePetTypes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} servicePetType`;
  }

  update(id: number, updateServicePetTypeDto: UpdateServicePetTypeDto) {
    return `This action updates a #${id} servicePetType`;
  }

  remove(id: number) {
    return `This action removes a #${id} servicePetType`;
  }
}
