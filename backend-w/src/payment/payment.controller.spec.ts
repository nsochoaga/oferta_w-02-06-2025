import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { HttpService } from '@nestjs/axios';
import { TransactionService } from '../transaction/transaction.service';
import { of } from 'rxjs';

describe('PaymentController', () => {
  let controller: PaymentController;
  let paymentService: PaymentService;
  let httpService: HttpService;
  let transactionService: TransactionService;

  const mockPaymentService = {
    generateIntegrityHash: jest.fn(),
    createTransaction: jest.fn(),
  };

  const mockHttpService = {
    get: jest.fn(),
  };

  const mockTransactionService = {
    updateOrCreate: jest.fn(),
    findByReference: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
        { provide: PaymentService, useValue: mockPaymentService },
        { provide: HttpService, useValue: mockHttpService },
        { provide: TransactionService, useValue: mockTransactionService },
      ],
    }).compile();

    controller = module.get<PaymentController>(PaymentController);
    paymentService = module.get(PaymentService);
    httpService = module.get(HttpService);
    transactionService = module.get(TransactionService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getIntegrityHash', () => {
    it('debería retornar el hash correctamente', () => {
      mockPaymentService.generateIntegrityHash.mockReturnValue('mockedHash');

      const result = controller.getIntegrityHash('ref123', '10000', '2025-06-01');
      expect(result).toEqual({ hash: 'mockedHash' });
      expect(mockPaymentService.generateIntegrityHash).toHaveBeenCalled();
    });
  });

  describe('getTransactionStatus', () => {
    it('debería retornar status y actualizar transacción', async () => {
      const mockResponse = {
        data: {
          data: {
            id: 'tx_123',
            reference: 'ref123',
            amount_in_cents: 10000,
            currency: 'COP',
            status: 'APPROVED',
            merchant: { email: 'test@email.com' },
          },
        },
      };

      mockHttpService.get.mockReturnValue(of(mockResponse));

      const result = await controller.getTransactionStatus('tx_123');

      expect(result).toEqual({
        status: 'APPROVED',
        email: 'test@email.com',
        reference: 'ref123',
      });
      expect(transactionService.updateOrCreate).toHaveBeenCalled();
    });
  });

  describe('createTransaction', () => {
    it('debería evitar duplicados y retornar transacción existente', async () => {
      (transactionService.findByReference as jest.Mock).mockResolvedValue({ id: 42 });

      const result = await controller.createTransaction('ref42', 10000, 'COP', 'cliente@test.com');

      expect(result).toEqual({
        message: 'Transaction already exists',
        transactionId: 42,
      });
    });

    it('debería crear nueva transacción si no existe', async () => {
      (transactionService.findByReference as jest.Mock).mockResolvedValue(null);
      (paymentService.createTransaction as jest.Mock).mockResolvedValue({ id: 99 });

      const result = await controller.createTransaction('ref99', 5000, 'COP', 'new@test.com');

      expect(result).toEqual({ transactionId: 99 });
      expect(paymentService.createTransaction).toHaveBeenCalled();
    });
  });

  describe('getAllTransactions', () => {
    it('debería retornar todas las transacciones', async () => {
      (transactionService.findAll as jest.Mock).mockResolvedValue([{ id: 1 }, { id: 2 }]);

      const result = await controller.getAllTransactions();
      expect(result).toEqual([{ id: 1 }, { id: 2 }]);
    });
  });
});
