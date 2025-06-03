import { Controller, Post, Body, Get, Patch, Param } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto'; // Asegúrate de que este DTO esté definido correctamente

@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Post()
  create(@Body() body: CreateDeliveryDto) {
    return this.deliveryService.create(body);
  }

   @Get()
  findAll() {
    return this.deliveryService.findAll();
  }

  @Patch(':id')
  updateStatus(
    @Param('id') id: number,
    @Body('status') status: string
  ) {
    return this.deliveryService.updateStatus(id, status);
  }
}