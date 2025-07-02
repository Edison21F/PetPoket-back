import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductPetType } from '../models/entities/productPetType.entity';
import { Product } from '../models/entities/product.entity';
import { PetType } from '../models/entities/petType.entity';
import { CreateProductPetTypeDto } from './dto/create-product-pet-type.dto';
import { UpdateProductPetTypeDto } from './dto/update-product-pet-type.dto';

@Injectable()
export class ProductPetTypesService {
  constructor(
    @InjectRepository(ProductPetType)
    private readonly productPetTypeRepository: Repository<ProductPetType>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(PetType)
    private readonly petTypeRepository: Repository<PetType>,
  ) {}

  async create(createProductPetTypeDto: CreateProductPetTypeDto): Promise<ProductPetType> {
    // Verificar que el producto existe
    const product = await this.productRepository.findOne({
      where: { id: createProductPetTypeDto.productId, estado: true }
    });

    if (!product) {
      throw new BadRequestException('El producto especificado no existe');
    }

    // Verificar que el tipo de mascota existe
    const petType = await this.petTypeRepository.findOne({
      where: { id: createProductPetTypeDto.petTypeId, estado: true }
    });

    if (!petType) {
      throw new BadRequestException('El tipo de mascota especificado no existe');
    }

    // Verificar que la relación no existe ya
    const existingRelation = await this.productPetTypeRepository.findOne({
      where: {
        product: { id: createProductPetTypeDto.productId },
        petType: { id: createProductPetTypeDto.petTypeId }
      }
    });

    if (existingRelation) {
      throw new BadRequestException('La relación ya existe');
    }

    const newRelation = this.productPetTypeRepository.create({
      product,
      petType
    });

    return await this.productPetTypeRepository.save(newRelation);
  }

  async findAll(): Promise<ProductPetType[]> {
    return await this.productPetTypeRepository.find({
      where: { estado: true },
      relations: ['product', 'petType'],
      order: { id: 'ASC' }
    });
  }

  async findByProduct(productId: number): Promise<ProductPetType[]> {
    return await this.productPetTypeRepository.find({
      where: { product: { id: productId }, estado: true },
      relations: ['petType']
    });
  }

  async findByPetType(petTypeId: number): Promise<ProductPetType[]> {
    return await this.productPetTypeRepository.find({
      where: { petType: { id: petTypeId }, estado: true },
      relations: ['product']
    });
  }

  async findOne(id: number): Promise<ProductPetType> {
    const relation = await this.productPetTypeRepository.findOne({
      where: { id },
      relations: ['product', 'petType']
    });

    if (!relation) {
      throw new NotFoundException(`Relación producto-tipo de mascota con ID ${id} no encontrada`);
    }

    return relation;
  }

  async remove(id: number): Promise<void> {
    const relation = await this.findOne(id);
    relation.estado = false;
    await this.productPetTypeRepository.save(relation);
  }

  async removeByProductAndPetType(productId: number, petTypeId: number): Promise<void> {
    const relation = await this.productPetTypeRepository.findOne({
      where: {
        product: { id: productId },
        petType: { id: petTypeId }
      }
    });

    if (relation) {
      relation.estado = false;
      await this.productPetTypeRepository.save(relation);
    }
  }
}