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

  async createOrder(
    items: { productId: number; quantity: number }[],
  ) {
    const order = this.orderRepo.create();
    const savedOrder = await this.orderRepo.save(order);

    const orderItems: OrderItem[] = [];
    console.log("📩 Orden creandose en order.service:", savedOrder.id);
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
}
