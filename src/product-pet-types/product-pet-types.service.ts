import { Injectable } from '@nestjs/common';
import { CreateProductPetTypeDto } from './dto/create-product-pet-type.dto';
import { UpdateProductPetTypeDto } from './dto/update-product-pet-type.dto';

@Injectable()
export class ProductPetTypesService {
  create(createProductPetTypeDto: CreateProductPetTypeDto) {
    return 'This action adds a new productPetType';
  }

  findAll() {
    return `This action returns all productPetTypes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productPetType`;
  }

  update(id: number, updateProductPetTypeDto: UpdateProductPetTypeDto) {
    return `This action updates a #${id} productPetType`;
  }

  remove(id: number) {
    return `This action removes a #${id} productPetType`;
  }
}
