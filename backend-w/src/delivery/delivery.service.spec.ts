import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryService } from './delivery.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Delivery } from './entities/delivery.entity';
import { Order } from '../order/entities/order.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

const mockDeliveryRepo = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
};

const mockOrderRepo = {
  findOne: jest.fn(),
};

describe('DeliveryService', () => {
  let service: DeliveryService;
  let deliveryRepo: jest.Mocked<Repository<Delivery>>;
  let orderRepo: jest.Mocked<Repository<Order>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeliveryService,
        {
          provide: getRepositoryToken(Delivery),
          useValue: mockDeliveryRepo,
        },
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepo,
        },
      ],
    }).compile();

    service = module.get<DeliveryService>(DeliveryService);
    deliveryRepo = module.get(getRepositoryToken(Delivery));
    orderRepo = module.get(getRepositoryToken(Order));

    jest.clearAllMocks(); // limpiar los mocks antes de cada test
  });

  describe('create', () => {
    it('debería crear una entrega si la orden existe', async () => {
      const dto = {
        orderId: 1,
        address: 'Calle 123',
        status: 'PENDING',
      };

      const fakeOrder = { id: 1 } as Order;
      const fakeDelivery = { id: 99, status: 'APPROVED',address: 'address_ex', order: fakeOrder } as Delivery;

      orderRepo.findOne.mockResolvedValue(fakeOrder);
      deliveryRepo.create.mockReturnValue(fakeDelivery);
      deliveryRepo.save.mockResolvedValue(fakeDelivery);

      const result = await service.create(dto);
      expect(result).toEqual(fakeDelivery);
      expect(orderRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('debería lanzar NotFoundException si la orden no existe', async () => {
      orderRepo.findOne.mockResolvedValue(null);

      await expect(
        service.create({ orderId: 2, address: 'x', status: 'PENDING' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('debería retornar todas las entregas', async () => {
      const deliveries = [{ id: 1 }, { id: 2 }] as Delivery[];
      deliveryRepo.find.mockResolvedValue(deliveries);

      const result = await service.findAll();
      expect(result).toEqual(deliveries);
      expect(deliveryRepo.find).toHaveBeenCalledWith({
        relations: ['order'],
      });
    });
  });

  describe('updateStatus', () => {
    it('debería actualizar el estado si la entrega existe', async () => {
      const delivery = { id: 1, status: 'PENDING' } as Delivery;
      deliveryRepo.findOne.mockResolvedValue(delivery);
      deliveryRepo.save.mockResolvedValue({ ...delivery, status: 'DELIVERED' });

      const result = await service.updateStatus(1, 'DELIVERED');
      expect(result.status).toBe('DELIVERED');
    });

    it('debería lanzar NotFoundException si no existe la entrega', async () => {
      deliveryRepo.findOne.mockResolvedValue(null);

      await expect(service.updateStatus(99, 'DELIVERED')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
