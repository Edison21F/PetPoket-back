import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateStockDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';

@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles('ADMIN', 'VETERINARIO')
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @Public()
  findAll(
    @Query('categoria') categoria?: string,
    @Query('petType') petType?: string,
    @Query('search') search?: string,
    @Query('enStock') enStock?: string,
    @Query('stockBajo') stockBajo?: string,
    @Query('requiereReceta') requiereReceta?: string,
    @Query('orderBy') orderBy?: string,
    @Query('orderDirection') orderDirection?: 'ASC' | 'DESC'
  ) {
    const filters = {
      categoria: categoria ? parseInt(categoria) : undefined,
      petType: petType ? parseInt(petType) : undefined,
      search,
      enStock: enStock ? enStock === 'true' : undefined,
      stockBajo: stockBajo === 'true',
      requiereReceta: requiereReceta ? requiereReceta === 'true' : undefined,
      orderBy,
      orderDirection
    };
    return this.productsService.findAll(filters);
  }

  @Get('stats')
  @Roles('ADMIN', 'VETERINARIO')
  getProductStats() {
    return this.productsService.getProductStats();
  }

  @Get('low-stock')
  @Roles('ADMIN', 'VETERINARIO')
  getLowStockProducts() {
    return this.productsService.getLowStockProducts();
  }

  @Get('out-of-stock')
  @Roles('ADMIN', 'VETERINARIO')
  getOutOfStockProducts() {
    return this.productsService.getOutOfStockProducts();
  }

  @Get('category/:categoryId')
  @Public()
  findByCategory(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.productsService.findByCategory(categoryId);
  }

  @Get('pet-type/:petTypeId')
  @Public()
  findByPetType(@Param('petTypeId', ParseIntPipe) petTypeId: number) {
    return this.productsService.findByPetType(petTypeId);
  }

  @Get('barcode/:codigoBarras')
  @Roles('ADMIN', 'VETERINARIO', 'RECEPCIONISTA')
  findByBarcode(@Param('codigoBarras') codigoBarras: string) {
    return this.productsService.findByBarcode(codigoBarras);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'VETERINARIO')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Patch(':id/stock')
  @Roles('ADMIN', 'VETERINARIO', 'RECEPCIONISTA')
  updateStock(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStockDto: UpdateStockDto,
  ) {
    return this.productsService.updateStock(id, updateStockDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
