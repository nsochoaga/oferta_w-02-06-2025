// src/order/order.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto'; // Asegúrate de que este DTO esté definido correctamente

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
createOrder(@Body() body: CreateOrderDto) {
  const { transactionId, items } = body;
  return this.orderService.createOrder(items);
}
}
