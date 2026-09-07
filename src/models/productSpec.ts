import { ProductStore } from './product';
import { cleanupTestData } from '../tests/helpers';

const store = new ProductStore();

describe('Product Model', () => {
  let testProductId: number;

  beforeAll(async () => {
    await cleanupTestData();
  });

  afterAll(async () => {
    await cleanupTestData();
  });

  it('should have an index method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(store.show).toBeDefined();
  });

  it('should have a create method', () => {
    expect(store.create).toBeDefined();
  });

  it('create method should add a product', async () => {
    const result = await store.create({
      name: 'Test Product',
      price: 19.99,
      category: 'Test Category'
    });

    testProductId = result.id!;

    expect(result.name).toEqual('Test Product');
    expect(parseFloat(result.price as any)).toEqual(19.99); // Handle both string and number
    expect(result.category).toEqual('Test Category');
  });

  it('index method should return a list of products', async () => {
    const result = await store.index();

    expect(result.length).toBeGreaterThan(0);
  });

  it('show method should return the correct product', async () => {
    const result = await store.show(testProductId);

    expect(result.id).toEqual(testProductId);
    expect(result.name).toEqual('Test Product');
    expect(parseFloat(result.price as any)).toEqual(19.99);
    expect(result.category).toEqual('Test Category');
  });
});