import { OrderStore } from './order';
import { UserStore } from './user';
import { ProductStore } from './product';
import { cleanupTestData } from '../tests/helpers';

const orderStore = new OrderStore();
const userStore = new UserStore();
const productStore = new ProductStore();

describe('Order Model', () => {
  let testUserId: number;
  let testProductId: number;
  let testOrderId: number;

  beforeAll(async () => {
    await cleanupTestData();
    
    // Create a user for testing with unique username
    const user = await userStore.create({
      username: `testuser_${Date.now()}`,
      first_name: 'Test',
      last_name: 'User',
      password: 'password123'
    });

    testUserId = user.id!;

    // Create a product for testing
    const product = await productStore.create({
      name: `Test Product ${Date.now()}`,
      price: 19.99,
      category: 'Test Category'
    });

    testProductId = product.id!;
  });

  afterAll(async () => {
    await cleanupTestData();
  });

  it('should have an index method', () => {
    expect(orderStore.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(orderStore.show).toBeDefined();
  });

  it('should have a create method', () => {
    expect(orderStore.create).toBeDefined();
  });

  it('create method should add an order', async () => {
    const result = await orderStore.create({
      user_id: testUserId,
      status: 'active'
    });

    testOrderId = result.id!;

    expect(result.user_id).toEqual(testUserId);
    expect(result.status).toEqual('active');
  });

  it('index method should return a list of orders', async () => {
    const result = await orderStore.index();

    expect(result.length).toBeGreaterThan(0);
  });

  it('show method should return the correct order', async () => {
    const result = await orderStore.show(testOrderId);

    expect(result.id).toEqual(testOrderId);
    expect(result.user_id).toEqual(testUserId);
    expect(result.status).toEqual('active');
  });
});

