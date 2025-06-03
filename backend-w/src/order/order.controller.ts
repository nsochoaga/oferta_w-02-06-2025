import { Controller, Post, Body, Get } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto'; // Asegúrate de que este DTO esté definido correctamente

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
createOrder(@Body() body: CreateOrderDto) {
  const { reference,customerEmail,  items } = body;
  return this.orderService.createOrder(reference,customerEmail,items);
}

 @Get()
  findAll() {
    return this.orderService.findAll();
  }

}
