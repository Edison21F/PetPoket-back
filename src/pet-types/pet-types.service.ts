import { Injectable } from '@nestjs/common';
import { CreatePetTypeDto } from './dto/create-pet-type.dto';
import { UpdatePetTypeDto } from './dto/update-pet-type.dto';

@Injectable()
export class PetTypesService {
  create(createPetTypeDto: CreatePetTypeDto) {
    return 'This action adds a new petType';
  }

  findAll() {
    return `This action returns all petTypes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} petType`;
  }

  update(id: number, updatePetTypeDto: UpdatePetTypeDto) {
    return `This action updates a #${id} petType`;
  }

  remove(id: number) {
    return `This action removes a #${id} petType`;
  }
}
