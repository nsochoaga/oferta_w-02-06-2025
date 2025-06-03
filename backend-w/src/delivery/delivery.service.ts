import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Delivery } from './entities/delivery.entity';
import { Order } from '../order/entities/order.entity';
import { CreateDeliveryDto } from './dto/create-delivery.dto';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(Delivery)
    private readonly deliveryRepo: Repository<Delivery>,

    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  async create(dto: CreateDeliveryDto): Promise<Delivery> {
    const order = await this.orderRepo.findOne({ where: { id: dto.orderId } });

    if (!order) {
      throw new NotFoundException(`La orden con id ${dto.orderId} no existe`);
    }

    const delivery = this.deliveryRepo.create({
      order,
      address: dto.address,
      status: dto.status,
    });

    return this.deliveryRepo.save(delivery);
  }

  async findAll(): Promise<Delivery[]> {
  return this.deliveryRepo.find({
    relations: ['order'], // para ver el ID de la orden relacionada
  });
}

async updateStatus(id: number, status: string): Promise<Delivery> {
  const delivery = await this.deliveryRepo.findOne({ where: { id } });

  if (!delivery) {
    throw new NotFoundException(`Entrega con ID ${id} no existe`);
  }

  delivery.status = status;
  return this.deliveryRepo.save(delivery);
}
}
