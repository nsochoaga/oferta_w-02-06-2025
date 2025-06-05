import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

describe('ProductService', () => {
  let service: ProductService;
  let repo: jest.Mocked<Repository<Product>>;

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repo = module.get(getRepositoryToken(Product));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debería crear un producto', async () => {
      const data = { name: 'Product 1', price: 100 };
      const created = { id: 1, ...data };

      repo.create.mockReturnValue(created as Product);
      repo.save.mockResolvedValue(created as Product);

      const result = await service.create(data);
      expect(result).toEqual(created);
      expect(repo.create).toHaveBeenCalledWith(data);
      expect(repo.save).toHaveBeenCalledWith(created);
    });
  });

  describe('findAll', () => {
    it('debería retornar todos los productos', async () => {
      const products = [{ id: 1 }, { id: 2 }] as Product[];
      repo.find.mockResolvedValue(products);

      const result = await service.findAll();
      expect(result).toEqual(products);
      expect(repo.find).toHaveBeenCalled();
    });
  });

  describe('updateStock', () => {
    it('debería actualizar el stock de un producto', async () => {
      const product = { id: 1, stock: 5 } as Product;
      repo.findOneBy.mockResolvedValue(product);
      repo.save.mockResolvedValue({ ...product, stock: 10 });

      const result = await service.updateStock(1, 10);
      expect(result.stock).toBe(10);
      expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(repo.save).toHaveBeenCalledWith({ ...product, stock: 10 });
    });

    it('debería lanzar error si el producto no existe', async () => {
      repo.findOneBy.mockResolvedValue(null);
      await expect(service.updateStock(999, 5)).rejects.toThrow('Producto no encontrado');
    });
  });

  describe('checkStock', () => {
    it('debería retornar true si hay suficiente stock', async () => {
      repo.findOneBy.mockResolvedValue({ id: 1, stock: 10 } as Product);
      const result = await service.checkStock(1, 5);
      expect(result).toBe(true);
    });

    it('debería retornar false si no hay suficiente stock', async () => {
      repo.findOneBy.mockResolvedValue({ id: 1, stock: 3 } as Product);
      const result = await service.checkStock(1, 5);
      expect(result).toBe(false);
    });

    it('debería lanzar error si el producto no existe', async () => {
      repo.findOneBy.mockResolvedValue(null);
      await expect(service.checkStock(999, 1)).rejects.toThrow('Producto no encontrado');
    });
  });
});
