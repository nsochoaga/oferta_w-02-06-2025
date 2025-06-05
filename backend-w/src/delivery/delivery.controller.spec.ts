import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryController } from './delivery.controller';
import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';

describe('DeliveryController', () => {
  let controller: DeliveryController;
  let service: DeliveryService;

  const mockDeliveryService = {
    create: jest.fn((dto: CreateDeliveryDto) => ({
      id: 1,
      ...dto,
      status: dto.status || 'PENDING',
    })),
    findAll: jest.fn(() => [
      { id: 1, orderId: 1, address: 'Calle 123', status: 'PENDING' },
    ]),
    updateStatus: jest.fn((id: number, status: string) => ({
      id,
      status,
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveryController],
      providers: [
        {
          provide: DeliveryService,
          useValue: mockDeliveryService,
        },
      ],
    }).compile();

    controller = module.get<DeliveryController>(DeliveryController);
    service = module.get<DeliveryService>(DeliveryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a delivery', async () => {
    const dto: CreateDeliveryDto = {
      orderId: 1,
      address: 'Calle 123',
      status: 'PENDING',
    };

    const result = await controller.create(dto);
    expect(result).toEqual({
      id: 1,
      ...dto,
    });
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return all deliveries', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([
      { id: 1, orderId: 1, address: 'Calle 123', status: 'PENDING' },
    ]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should update delivery status', async () => {
    const result = await controller.updateStatus(1, 'DELIVERED');
    expect(result).toEqual({ id: 1, status: 'DELIVERED' });
    expect(service.updateStatus).toHaveBeenCalledWith(1, 'DELIVERED');
  });
});
