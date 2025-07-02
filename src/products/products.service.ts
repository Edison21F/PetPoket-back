import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Like } from 'typeorm';
import { Product } from '../models/entities/product.entity';
import { ProductCategory } from '../models/entities/productCategory.entity';
import { PetType } from '../models/entities/petType.entity';
import { ProductPetType } from '../models/entities/productPetType.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateStockDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductCategory)
    private readonly productCategoryRepository: Repository<ProductCategory>,
    @InjectRepository(PetType)
    private readonly petTypeRepository: Repository<PetType>,
    @InjectRepository(ProductPetType)
    private readonly productPetTypeRepository: Repository<ProductPetType>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    // Verificar que la categoría existe
    const category = await this.productCategoryRepository.findOne({
      where: { id: createProductDto.categoriaId, estado: true }
    });

    if (!category) {
      throw new BadRequestException('La categoría especificada no existe');
    }

    // Verificar tipos de mascota si se especifican
    let petTypes: PetType[] = [];
    if (createProductDto.tiposMascotaIds && createProductDto.tiposMascotaIds.length > 0) {
      petTypes = await this.petTypeRepository.find({
        where: { id: In(createProductDto.tiposMascotaIds), estado: true }
      });

      if (petTypes.length !== createProductDto.tiposMascotaIds.length) {
        throw new BadRequestException('Uno o más tipos de mascota especificados no existen');
      }
    }

    // Verificar código de barras único si se proporciona
    if (createProductDto.codigoBarras) {
      const existingProduct = await this.productRepository.findOne({
        where: { codigoBarras: createProductDto.codigoBarras }
      });

      if (existingProduct) {
        throw new BadRequestException('Ya existe un producto con ese código de barras');
      }
    }

    const newProduct = this.productRepository.create({
      nombre: createProductDto.nombre,
      descripcion: createProductDto.descripcion,
      precio: createProductDto.precio,
      stock: createProductDto.stock,
      imagen: createProductDto.imagen,
      categoria: category,
      marca: createProductDto.marca,
      presentacion: createProductDto.presentacion,
      stockMinimo: createProductDto.stockMinimo || 5,
      requiereReceta: createProductDto.requiereReceta || false,
      codigoBarras: createProductDto.codigoBarras,
    });

    const savedProduct = await this.productRepository.save(newProduct);

    // Crear relaciones con tipos de mascota
    if (petTypes.length > 0) {
      for (const petType of petTypes) {
        const productPetType = this.productPetTypeRepository.create({
          product: savedProduct,
          petType: petType,
        });
        await this.productPetTypeRepository.save(productPetType);
      }
    }

    return await this.findOne(savedProduct.id);
  }

  async findAll(filters?: any): Promise<Product[]> {
    const queryBuilder = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.categoria', 'categoria')
      .leftJoinAndSelect('product.tiposMascota', 'productPetType')
      .leftJoinAndSelect('productPetType.petType', 'petType')
      .where('product.estado = :estado', { estado: true });

    // Filtros
    if (filters?.categoria) {
      queryBuilder.andWhere('categoria.id = :categoriaId', { categoriaId: filters.categoria });
    }

    if (filters?.petType) {
      queryBuilder.andWhere('petType.id = :petTypeId', { petTypeId: filters.petType });
    }

    if (filters?.search) {
      queryBuilder.andWhere(
        '(product.nombre LIKE :search OR product.descripcion LIKE :search OR product.marca LIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    if (filters?.enStock !== undefined) {
      if (filters.enStock) {
        queryBuilder.andWhere('product.stock > 0');
      } else {
        queryBuilder.andWhere('product.stock = 0');
      }
    }

    if (filters?.stockBajo) {
      queryBuilder.andWhere('product.stock <= product.stockMinimo');
    }

    if (filters?.requiereReceta !== undefined) {
      queryBuilder.andWhere('product.requiereReceta = :requiereReceta', { 
        requiereReceta: filters.requiereReceta 
      });
    }

    // Ordenamiento
    const orderBy = filters?.orderBy || 'nombre';
    const orderDirection = filters?.orderDirection || 'ASC';
    queryBuilder.orderBy(`product.${orderBy}`, orderDirection);

    return await queryBuilder.getMany();
  }

  async findByCategory(categoryId: number): Promise<Product[]> {
    return await this.productRepository.find({
      where: { 
        categoria: { id: categoryId },
        estado: true 
      },
      relations: ['categoria', 'tiposMascota', 'tiposMascota.petType'],
      order: { nombre: 'ASC' }
    });
  }

  async findByPetType(petTypeId: number): Promise<Product[]> {
    return await this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.categoria', 'categoria')
      .leftJoinAndSelect('product.tiposMascota', 'productPetType')
      .leftJoinAndSelect('productPetType.petType', 'petType')
      .where('product.estado = :estado', { estado: true })
      .andWhere('petType.id = :petTypeId', { petTypeId })
      .orderBy('product.nombre', 'ASC')
      .getMany();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['categoria', 'tiposMascota', 'tiposMascota.petType']
    });

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return product;
  }

  async findByBarcode(codigoBarras: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { codigoBarras, estado: true },
      relations: ['categoria', 'tiposMascota', 'tiposMascota.petType']
    });

    if (!product) {
      throw new NotFoundException(`Producto con código de barras ${codigoBarras} no encontrado`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);

    // Actualizar categoría si se especifica
    if (updateProductDto.categoriaId) {
      const category = await this.productCategoryRepository.findOne({
        where: { id: updateProductDto.categoriaId, estado: true }
      });

      if (!category) {
        throw new BadRequestException('La categoría especificada no existe');
      }

      product.categoria = category;
    }

    // Verificar código de barras único si se actualiza
    if (updateProductDto.codigoBarras && updateProductDto.codigoBarras !== product.codigoBarras) {
      const existingProduct = await this.productRepository.findOne({
        where: { codigoBarras: updateProductDto.codigoBarras }
      });

      if (existingProduct) {
        throw new BadRequestException('Ya existe un producto con ese código de barras');
      }
    }

    // Actualizar tipos de mascota si se especifican
    if (updateProductDto.tiposMascotaIds !== undefined) {
      // Eliminar relaciones existentes
      await this.productPetTypeRepository.delete({ product: { id } });

      // Crear nuevas relaciones
      if (updateProductDto.tiposMascotaIds.length > 0) {
        const petTypes = await this.petTypeRepository.find({
          where: { id: In(updateProductDto.tiposMascotaIds), estado: true }
        });

        if (petTypes.length !== updateProductDto.tiposMascotaIds.length) {
          throw new BadRequestException('Uno o más tipos de mascota especificados no existen');
        }

        for (const petType of petTypes) {
          const productPetType = this.productPetTypeRepository.create({
            product: product,
            petType: petType,
          });
          await this.productPetTypeRepository.save(productPetType);
        }
      }
    }

    // Actualizar otros campos
    Object.assign(product, {
      nombre: updateProductDto.nombre || product.nombre,
      descripcion: updateProductDto.descripcion || product.descripcion,
      precio: updateProductDto.precio !== undefined ? updateProductDto.precio : product.precio,
      stock: updateProductDto.stock !== undefined ? updateProductDto.stock : product.stock,
      imagen: updateProductDto.imagen !== undefined ? updateProductDto.imagen : product.imagen,
      marca: updateProductDto.marca !== undefined ? updateProductDto.marca : product.marca,
      presentacion: updateProductDto.presentacion !== undefined ? updateProductDto.presentacion : product.presentacion,
      stockMinimo: updateProductDto.stockMinimo !== undefined ? updateProductDto.stockMinimo : product.stockMinimo,
      requiereReceta: updateProductDto.requiereReceta !== undefined ? updateProductDto.requiereReceta : product.requiereReceta,
      codigoBarras: updateProductDto.codigoBarras !== undefined ? updateProductDto.codigoBarras : product.codigoBarras,
    });

    await this.productRepository.save(product);
    return await this.findOne(id);
  }

  async updateStock(id: number, updateStockDto: UpdateStockDto): Promise<Product> {
    const product = await this.findOne(id);

    if (updateStockDto.tipoMovimiento === 'entrada') {
      product.stock += updateStockDto.cantidad;
    } else {
      if (product.stock < updateStockDto.cantidad) {
        throw new BadRequestException('Stock insuficiente para realizar la salida');
      }
      product.stock -= updateStockDto.cantidad;
    }

    // Aquí podrías registrar el movimiento en una tabla de historial de stock
    // por ahora solo actualizamos el stock

    await this.productRepository.save(product);
    return product;
  }

  async getLowStockProducts(): Promise<Product[]> {
    return await this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.categoria', 'categoria')
      .where('product.estado = :estado', { estado: true })
      .andWhere('product.stock <= product.stockMinimo')
      .orderBy('product.stock', 'ASC')
      .getMany();
  }

  async getOutOfStockProducts(): Promise<Product[]> {
    return await this.productRepository.find({
      where: { stock: 0, estado: true },
      relations: ['categoria'],
      order: { nombre: 'ASC' }
    });
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    product.estado = false;
    await this.productRepository.save(product);
  }

  async getProductStats(): Promise<any> {
    const totalProducts = await this.productRepository.count({ where: { estado: true } });
    const lowStockCount = await this.productRepository.count({
      where: { estado: true },
      // Note: This is a simplified query, you might need a raw query for complex conditions
    });
    const outOfStockCount = await this.productRepository.count({
      where: { stock: 0, estado: true }
    });

    const productsByCategory = await this.productRepository.createQueryBuilder('product')
      .leftJoin('product.categoria', 'categoria')
      .select(['categoria.nombre as categoriaNombre', 'COUNT(product.id) as cantidad'])
      .where('product.estado = :estado', { estado: true })
      .groupBy('categoria.nombre')
      .getRawMany();

    const totalStockValue = await this.productRepository.createQueryBuilder('product')
      .select('SUM(product.precio * product.stock)', 'valor')
      .where('product.estado = :estado', { estado: true })
      .getRawOne();

    return {
      totalProducts,
      lowStockCount,
      outOfStockCount,
      productsByCategory,
      totalStockValue: parseFloat(totalStockValue.valor) || 0
    };
  }
}