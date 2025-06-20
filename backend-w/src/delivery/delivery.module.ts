import { Module } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { DeliveryController } from './delivery.controller'
import { TypeOrmModule } from '@nestjs/typeorm';
import { Delivery } from './entities/delivery.entity';
import { Order } from '../order/entities/order.entity'; // Asegúrate de que la ruta sea correcta

@Module({
  imports: [
    TypeOrmModule.forFeature([Delivery, Order]), // ambos deben estar acá
  ],
  providers: [DeliveryService],
  controllers: [DeliveryController]
})
export class DeliveryModule {}
