import { Controller, Get, Body, Post, Param, Patch  } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Post()
create(@Body() productData: Partial<Product>): Promise<Product> {
  return this.productService.create(productData);
}

@Patch(':id/stock')
updateStock(@Param('id') id: number, @Body('stock') stock: number): Promise<Product> {
  return this.productService.updateStock(id, stock);
}

}
