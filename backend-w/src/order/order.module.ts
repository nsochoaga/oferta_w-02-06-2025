// src/order/order.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order.item.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { ProductModule } from '../product/product.module'; // para verificar stock, si es necesario
import { Product } from '../product/entities/product.entity';
import { Delivery } from 'src/delivery/entities/delivery.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Product, Delivery]), ProductModule],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
