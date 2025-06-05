import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  const mockProductService = {
    findAll: jest.fn(),
    create: jest.fn(),
    updateStock: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: mockProductService,
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('debería retornar todos los productos', async () => {
      const products = [{ id: 1 }, { id: 2 }] as Product[];
      mockProductService.findAll.mockResolvedValue(products);

      const result = await controller.findAll();
      expect(result).toEqual(products);
      expect(mockProductService.findAll).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('debería crear un nuevo producto', async () => {
      const productData = { name: 'Producto 1', price: 100 };
      const created = { id: 1, ...productData } as Product;

      mockProductService.create.mockResolvedValue(created);

      const result = await controller.create(productData);
      expect(result).toEqual(created);
      expect(mockProductService.create).toHaveBeenCalledWith(productData);
    });
  });

  describe('updateStock', () => {
    it('debería actualizar el stock de un producto', async () => {
      const productId = 1;
      const stock = 5;
      const updated = { id: productId, stock } as Product;

      mockProductService.updateStock.mockResolvedValue(updated);

      const result = await controller.updateStock(productId, stock);
      expect(result).toEqual(updated);
      expect(mockProductService.updateStock).toHaveBeenCalledWith(productId, stock);
    });
  });
});
