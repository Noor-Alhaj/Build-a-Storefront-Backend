import client from '../database';
import { UserStore } from '../models/user';
import { ProductStore } from '../models/product';
import { OrderStore } from '../models/order';
import { cleanupTestData } from './helpers';

describe('Database Integration Tests', () => {
  const userStore = new UserStore();
  const productStore = new ProductStore();
  const orderStore = new OrderStore();

  beforeAll(async () => {
    await cleanupTestData();
  });

  afterAll(async () => {
    await cleanupTestData();
  });

  it('should create and retrieve a user', async () => {
    const username = `integrationuser_${Date.now()}`;
    const user = await userStore.create({
      username: username,
      first_name: 'Integration',
      last_name: 'Test',
      password: 'password123'
    });

    const foundUser = await userStore.show(user.id!);
    
    expect(foundUser.username).toBe(username);
    expect(foundUser.first_name).toBe('Integration');
  });

  it('should create and retrieve a product', async () => {
    const product = await productStore.create({
      name: `Integration Product ${Date.now()}`,
      price: 49.99,
      category: 'Integration Category'
    });

    const foundProduct = await productStore.show(product.id!);
    
    expect(foundProduct.name).toContain('Integration Product');
    
    // Handle both string and number prices
    const priceValue = typeof foundProduct.price === 'string' 
      ? parseFloat(foundProduct.price) 
      : foundProduct.price;
    expect(priceValue).toBe(49.99);
  });

  it('should create and retrieve an order', async () => {
    const username = `orderintegrationuser_${Date.now()}`;
    const user = await userStore.create({
      username: username,
      first_name: 'Order',
      last_name: 'Integration',
      password: 'password123'
    });

    const order = await orderStore.create({
      user_id: user.id!,
      status: 'completed'
    });

    const foundOrder = await orderStore.show(order.id!);
    
    expect(foundOrder.user_id).toBe(user.id);
    expect(foundOrder.status).toBe('completed');
  });
});