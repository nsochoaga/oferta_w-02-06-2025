import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

  const mockOrderService = {
    createOrder: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('debería delegar createOrder al servicio', async () => {
    const dto = {
      reference: 'abc123',
      customerEmail: 'test@example.com',
      items: [{ productId: 1, quantity: 2 }],
    };

    mockOrderService.createOrder.mockResolvedValue({ id: 1, ...dto });

    const result = await controller.createOrder(dto);

    expect(mockOrderService.createOrder).toHaveBeenCalledWith(
      dto.reference,
      dto.customerEmail,
      dto.items,
    );
    expect(result).toHaveProperty('id');
  });

  it('debería retornar todas las órdenes', async () => {
    const orders = [{ id: 1 }, { id: 2 }];
    mockOrderService.findAll.mockResolvedValue(orders);

    const result = await controller.findAll();
    expect(result).toEqual(orders);
    expect(mockOrderService.findAll).toHaveBeenCalled();
  });
});
