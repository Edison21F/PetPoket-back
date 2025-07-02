import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategory } from '../models/entities/productCategory.entity';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';

@Injectable()
export class ProductCategoriesService {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly productCategoryRepository: Repository<ProductCategory>,
  ) {}

  async create(createProductCategoryDto: CreateProductCategoryDto): Promise<ProductCategory> {
    const existingCategory = await this.productCategoryRepository.findOne({
      where: { nombre: createProductCategoryDto.nombre.toLowerCase() }
    });

    if (existingCategory) {
      throw new BadRequestException('Ya existe una categoría de producto con ese nombre');
    }

    const newCategory = this.productCategoryRepository.create({
      ...createProductCategoryDto,
      nombre: createProductCategoryDto.nombre.toLowerCase()
    });

    return await this.productCategoryRepository.save(newCategory);
  }

  async findAll(): Promise<ProductCategory[]> {
    return await this.productCategoryRepository.find({
      where: { estado: true },
      relations: ['productos'],
      order: { nombre: 'ASC' }
    });
  }

  async findOne(id: number): Promise<ProductCategory> {
    const category = await this.productCategoryRepository.findOne({
      where: { id },
      relations: ['productos']
    });

    if (!category) {
      throw new NotFoundException(`Categoría de producto con ID ${id} no encontrada`);
    }

    return category;
  }

  async update(id: number, updateProductCategoryDto: UpdateProductCategoryDto): Promise<ProductCategory> {
    const category = await this.findOne(id);

    if (updateProductCategoryDto.nombre && updateProductCategoryDto.nombre.toLowerCase() !== category.nombre) {
      const existingCategory = await this.productCategoryRepository.findOne({
        where: { nombre: updateProductCategoryDto.nombre.toLowerCase() }
      });

      if (existingCategory) {
        throw new BadRequestException('Ya existe una categoría con ese nombre');
      }
    }

    Object.assign(category, {
      nombre: updateProductCategoryDto.nombre ? updateProductCategoryDto.nombre.toLowerCase() : category.nombre,
      descripcion: updateProductCategoryDto.descripcion !== undefined ? updateProductCategoryDto.descripcion : category.descripcion,
      imagen: updateProductCategoryDto.imagen !== undefined ? updateProductCategoryDto.imagen : category.imagen,
    });

    return await this.productCategoryRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    
    // Verificar que no tenga productos asociados
    const productsCount = await this.productCategoryRepository.createQueryBuilder('category')
      .leftJoin('category.productos', 'product')
      .where('category.id = :id', { id })
      .andWhere('product.estado = :estado', { estado: true })
      .getCount();

    if (productsCount > 0) {
      throw new BadRequestException('No se puede eliminar la categoría porque tiene productos asociados');
    }

    category.estado = false;
    await this.productCategoryRepository.save(category);
  }

  async seedDefaultCategories(): Promise<void> {
    const defaultCategories = [
      { 
        nombre: 'alimento', 
        descripcion: 'Alimentos para mascotas de todas las edades',
        imagen: 'alimento.jpg'
      },
      { 
        nombre: 'medicamentos', 
        descripcion: 'Medicamentos veterinarios y suplementos',
        imagen: 'medicamentos.jpg'
      },
      { 
        nombre: 'juguetes', 
        descripcion: 'Juguetes y entretenimiento para mascotas',
        imagen: 'juguetes.jpg'
      },
      { 
        nombre: 'accesorios', 
        descripcion: 'Collares, correas, camas y accesorios',
        imagen: 'accesorios.jpg'
      },
      { 
        nombre: 'higiene', 
        descripcion: 'Productos de higiene y cuidado personal',
        imagen: 'higiene.jpg'
      },
      { 
        nombre: 'casa y transporte', 
        descripcion: 'Casas, jaulas, transportadoras y similares',
        imagen: 'casa-transporte.jpg'
      }
    ];

    for (const categoryData of defaultCategories) {
      const existing = await this.productCategoryRepository.findOne({
        where: { nombre: categoryData.nombre }
      });
      if (!existing) {
        await this.create(categoryData);
      }
    }
  }
}
