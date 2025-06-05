import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';

describe('TransactionService', () => {
  let service: TransactionService;
  let repo: jest.Mocked<Repository<Transaction>>;

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    repo = module.get(getRepositoryToken(Transaction));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('crea una nueva transacción si no existe una con la misma referencia', async () => {
      repo.findOne.mockResolvedValue(null);
      repo.create.mockReturnValue({ reference: 'ref1' } as Transaction);
      repo.save.mockResolvedValue({ id: '1', reference: 'ref1' } as Transaction);

      const result = await service.create({ reference: 'ref1' });
      expect(repo.findOne).toHaveBeenCalledWith({ where: { reference: 'ref1' } });
      expect(repo.create).toHaveBeenCalled();
      expect(repo.save).toHaveBeenCalled();
      expect(result).toHaveProperty('id');
    });

    it('lanza error si ya existe una transacción con la misma referencia', async () => {
      repo.findOne.mockResolvedValue({ reference: 'ref1' } as Transaction);

      await expect(service.create({ reference: 'ref1' })).rejects.toThrow(
        'Ya existe una transacción con la referencia ref1',
      );
    });
  });

  describe('findAll', () => {
    it('retorna todas las transacciones', async () => {
      const transactions = [{ id: '1' }, { id: '2' }] as Transaction[];
      repo.find.mockResolvedValue(transactions);

      const result = await service.findAll();
      expect(result).toEqual(transactions);
      expect(repo.find).toHaveBeenCalled();
    });
  });

  describe('updateOrCreate', () => {
    const txData = {
      wompiId: 'w123',
      reference: 'ref1',
      amountInCents: 1000,
      currency: 'COP',
      status: 'APPROVED',
      customerEmail: 'a@a.com',
    };

    it('actualiza si existe la transacción', async () => {
      const existingTx = { id: '1', ...txData } as Transaction;
      repo.findOne.mockResolvedValue(existingTx);
      repo.save.mockResolvedValue(existingTx);

      const result = await service.updateOrCreate(txData);
      expect(repo.save).toHaveBeenCalled();
      expect(result).toEqual(existingTx);
    });

    it('crea una nueva si no existe', async () => {
      repo.findOne.mockResolvedValue(null);
      repo.create.mockReturnValue(txData as Transaction);
      repo.save.mockResolvedValue({ id: '99', ...txData } as Transaction);

      const result = await service.updateOrCreate(txData);
      expect(repo.create).toHaveBeenCalled();
      expect(repo.save).toHaveBeenCalled();
      expect(result).toHaveProperty('id');
    });
  });

  describe('findByReference', () => {
    it('retorna la transacción con la referencia indicada', async () => {
      const tx = { id: '1', reference: 'ref1' } as Transaction;
      repo.findOne.mockResolvedValue(tx);

      const result = await service.findByReference('ref1');
      expect(result).toEqual(tx);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { reference: 'ref1' } });
    });
  });
});
