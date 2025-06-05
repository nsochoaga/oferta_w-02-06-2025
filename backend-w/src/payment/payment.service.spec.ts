import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transaction } from '../transaction/entities/transaction.entity';
import { Repository } from 'typeorm';

describe('PaymentService', () => {
  let service: PaymentService;
  let transactionRepo: jest.Mocked<Repository<Transaction>>;

  const mockTransactionRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: mockTransactionRepo,
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    transactionRepo = module.get(getRepositoryToken(Transaction));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateIntegrityHash', () => {
    it('debería generar un hash correcto sin expiration', () => {
      const hash = service.generateIntegrityHash('ref123', 10000, 'COP');
      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(64); // SHA256
    });

    it('debería generar un hash diferente si cambia el expiration', () => {
      const hash1 = service.generateIntegrityHash('ref123', 10000, 'COP', '2025-06-01');
      const hash2 = service.generateIntegrityHash('ref123', 10000, 'COP');
      expect(hash1).not.toEqual(hash2);
    });
  });

  describe('createTransaction', () => {
    it('debería actualizar una transacción existente', async () => {
      const existingTx = {
        id: '1',
        wompiId: 'wompi123',
        reference: 'ref123',
        amountInCents: 20000,
        currency: 'COP',
        status: 'APPROVED',
        customerEmail: '4@4.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        save: jest.fn(),
      };

      transactionRepo.findOne.mockResolvedValue(existingTx as unknown as Transaction);
      transactionRepo.save.mockResolvedValue({ ...existingTx, status: 'PENDING' });

      const result = await service.createTransaction('ref123', 20000, 'COP', 'test@email.com');

      expect(transactionRepo.findOne).toHaveBeenCalledWith({ where: { reference: 'ref123' } });
      expect(transactionRepo.save).toHaveBeenCalled();
      expect(result.status).toBe('PENDING');
    });

    it('debería crear una nueva transacción si no existe', async () => {
      transactionRepo.findOne.mockResolvedValue(null);

      const createdTx = {
        id: '2',
        wompiId: 'wompi123',
        reference: 'ref123456',
        amountInCents: 20000,
        currency: 'COP',
        status: 'PENDING',
        customerEmail: '4@4.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        save: jest.fn(),
      };

      transactionRepo.create.mockReturnValue(createdTx as Transaction);
      transactionRepo.save.mockResolvedValue({  ...createdTx });

      const result = await service.createTransaction(
        'ref123',
        10000,
        'COP',
        'test@email.com'
      );

      expect(transactionRepo.create).toHaveBeenCalled();
      expect(transactionRepo.save).toHaveBeenCalled();
      expect(result).toHaveProperty('id');
    });
  });

  describe('findAll', () => {
    it('debería retornar todas las transacciones', async () => {
      const transactions = [
        {
          id: '1',
          wompiId: 'wompi1',
          reference: 'ref1',
          amountInCents: 1000,
          currency: 'COP',
          status: 'APPROVED',
          customerEmail: 'test1@email.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          wompiId: 'wompi2',
          reference: 'ref2',
          amountInCents: 2000,
          currency: 'COP',
          status: 'PENDING',
          customerEmail: 'test2@email.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ] as Transaction[];
      transactionRepo.find.mockResolvedValue(transactions);

      const result = await service.findAll();

      expect(result).toEqual(transactions);
      expect(transactionRepo.find).toHaveBeenCalled();
    });
  });
});
