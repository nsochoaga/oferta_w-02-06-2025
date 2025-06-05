import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { Transaction } from './entities/transaction.entity';

describe('TransactionController', () => {
  let controller: TransactionController;
  let service: TransactionService;

  const mockTransactions: Transaction[] = [
    { id: '1', reference: 'ref1', amountInCents: 1000, currency: 'COP', status: 'APPROVED', customerEmail: 'a@a.com', wompiId: 'w123' },
    { id: '2', reference: 'ref2', amountInCents: 2000, currency: 'COP', status: 'DECLINED', customerEmail: 'b@b.com', wompiId: 'w456' },
  ] as Transaction[];

  const mockTransactionService = {
    findAll: jest.fn().mockResolvedValue(mockTransactions),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionService,
          useValue: mockTransactionService,
        },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
    service = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('debería retornar todas las transacciones', async () => {
      const result = await controller.findAll();
      expect(result).toEqual(mockTransactions);
      expect(service.findAll).toHaveBeenCalled();
    });
  });
});
