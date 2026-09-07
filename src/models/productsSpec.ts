import { ProductStore } from './product';
import { cleanupTestData } from '../tests/helpers';

const store = new ProductStore();

describe('Products API Business Logic', () => {
  let testProductId: number;

  beforeAll(async () => {
    await cleanupTestData();
  });

  afterAll(async () => {
    await cleanupTestData();
  });

  it('should create a product successfully', async () => {
    const product = await store.create({
      name: 'Test Product',
      price: 19.99,
      category: 'Test Category'
    });

    testProductId = product.id!;

    expect(product.name).toEqual('Test Product');
    
    // Handle both string and number prices
    const priceValue = typeof product.price === 'string' 
      ? parseFloat(product.price) 
      : product.price;
    expect(priceValue).toEqual(19.99);
    
    expect(product.category).toEqual('Test Category');
  });

  it('should get all products', async () => {
    // Create a product first to ensure there's data
    await store.create({
      name: 'Another Test Product',
      price: 29.99,
      category: 'Test Category 2'
    });

    const products = await store.index();
    expect(products.length).toBeGreaterThan(0);
  });

  it('should get a specific product by id', async () => {
    // Create a fresh product for this test to avoid dependency on previous test
    const newProduct = await store.create({
      name: 'Specific Test Product',
      price: 39.99,
      category: 'Specific Category'
    });

    const productId = newProduct.id!;
    const product = await store.show(productId);

    expect(product.id).toEqual(productId);
    expect(product.name).toEqual('Specific Test Product');
    
    // Handle both string and number prices
    const priceValue = typeof product.price === 'string' 
      ? parseFloat(product.price) 
      : product.price;
    expect(priceValue).toEqual(39.99);
  });
});