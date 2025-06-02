import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(productData: Partial<Product>): Promise<Product> {
  const product = this.productRepository.create(productData);
  return this.productRepository.save(product);
}


  findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async updateStock(id: number, quantity: number): Promise<Product> {
  const product = await this.productRepository.findOneBy({ id });
  if (!product) throw new Error('Producto no encontrado');
  
  product.stock = quantity;
  return this.productRepository.save(product);
}

async checkStock(productId: number, quantity: number): Promise<boolean> {
  const product = await this.productRepository.findOneBy({ id: productId });
  if (!product) throw new Error('Producto no encontrado');
  return product.stock >= quantity;
}


}
