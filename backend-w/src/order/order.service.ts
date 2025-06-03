// src/order/order.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order.item.entity';
import { Product } from '../product/entities/product.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private orderItemRepo: Repository<OrderItem>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}

  async createOrder(reference: string, customerEmail: string,
    items: { productId: number; quantity: number }[],
  ) {
    const existing = await this.orderRepo.findOne({
    where: { reference },
    relations: ["items", "items.product"],
  });

  if (existing) {
    console.warn(`⚠️ Ya existe una orden con referencia ${reference}`);
    return existing;
  }
    const order = this.orderRepo.create({
    reference, customerEmail});
    const savedOrder = await this.orderRepo.save(order);

    const orderItems: OrderItem[] = [];
    for (const item of items) {
      const product = await this.productRepo.findOne({
        where: { id: item.productId },
      });

      if (!product) {
        throw new NotFoundException(`Producto ${item.productId} no existe`);
      }
      
      if (product.stock < item.quantity) {
  throw new Error(`No hay suficiente stock para el producto ${product.name}`);
}

product.stock -= item.quantity;
await this.productRepo.save(product); 


      const orderItem = this.orderItemRepo.create({
        order: savedOrder,
        product,
        quantity: item.quantity,
        price: product.price,
      });

      orderItems.push(orderItem);
    }

    await this.orderItemRepo.save(orderItems);

    return {
      ...savedOrder,
      items: orderItems,
    };
  }

async findAll() {
  return this.orderRepo.find({
    relations: ["items", "items.product"],
    order: { id: "DESC" },
  });
}

}
