import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order.item.entity';
import { Product } from '../product/entities/product.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('OrderService', () => {
  let service: OrderService;
  let orderRepo: jest.Mocked<Repository<Order>>;
  let orderItemRepo: jest.Mocked<Repository<OrderItem>>;
  let productRepo: jest.Mocked<Repository<Product>>;

  const mockOrderRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockOrderItemRepo = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockProductRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: getRepositoryToken(Order), useValue: mockOrderRepo },
        { provide: getRepositoryToken(OrderItem), useValue: mockOrderItemRepo },
        { provide: getRepositoryToken(Product), useValue: mockProductRepo },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    orderRepo = module.get(getRepositoryToken(Order));
    orderItemRepo = module.get(getRepositoryToken(OrderItem));
    productRepo = module.get(getRepositoryToken(Product));

    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    it('debería crear una orden correctamente', async () => {
      const reference = 'abc123';
      const email = 'test@email.com';
      const items = [
        { productId: 1, quantity: 2 },
        { productId: 2, quantity: 1 },
      ];

      orderRepo.findOne.mockResolvedValue(null);
      const orderMock = { id: 1, reference, customerEmail: email };
      orderRepo.create.mockReturnValue(orderMock as Order);
      orderRepo.save.mockResolvedValue(orderMock as Order);

      const product1 = { id: 1, name: 'Producto 1', stock: 10, price: 100 };
      const product2 = { id: 2, name: 'Producto 2', stock: 5, price: 200 };
      productRepo.findOne
        .mockResolvedValueOnce(product1 as Product)
        .mockResolvedValueOnce(product2 as Product);

      mockProductRepo.save.mockResolvedValue(undefined);

      const orderItem1 = { id: 1 };
      const orderItem2 = { id: 2 };
      orderItemRepo.create.mockReturnValueOnce(orderItem1 as OrderItem);
      orderItemRepo.create.mockReturnValueOnce(orderItem2 as OrderItem);
      orderItemRepo.save
        .mockImplementation(async (item: OrderItem) => item);

      const result = await service.createOrder(reference, email, items);

      expect(result).toHaveProperty('id');
      expect(orderRepo.create).toHaveBeenCalled();
      expect(orderRepo.save).toHaveBeenCalled();
      expect(productRepo.findOne).toHaveBeenCalledTimes(2);
      expect(orderItemRepo.save).toHaveBeenCalled();
    });

    it('debería lanzar error si un producto no existe', async () => {
      productRepo.findOne.mockResolvedValue(null);

      await expect(
        service.createOrder('ref', 'email@test.com', [{ productId: 99, quantity: 1 }]),
      ).rejects.toThrow(NotFoundException);
    });

    it('debería lanzar error si stock es insuficiente', async () => {
      productRepo.findOne.mockResolvedValue({
        id: 1,
        name: 'Producto',
        stock: 0,
        price: 100,
      } as Product);

      await expect(
        service.createOrder('ref', 'email@test.com', [{ productId: 1, quantity: 5 }]),
      ).rejects.toThrow('No hay suficiente stock para el producto Producto');
    });
  });

  describe('findAll', () => {
    it('debería retornar todas las órdenes', async () => {
      const orders = [{ id: 1 }, { id: 2 }] as Order[];
      orderRepo.find.mockResolvedValue(orders);

      const result = await service.findAll();
      expect(result).toEqual(orders);
      expect(orderRepo.find).toHaveBeenCalled();
    });
  });
});
