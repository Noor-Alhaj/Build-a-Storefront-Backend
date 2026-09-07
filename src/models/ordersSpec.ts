import { OrderStore } from './order';
import { UserStore } from './user';
import { ProductStore } from './product';
import { cleanupTestData } from '../tests/helpers';

const orderStore = new OrderStore();
const userStore = new UserStore();
const productStore = new ProductStore();

describe('Orders API Business Logic', () => {
  let testUserId: number;
  let testProductId: number;
  let testOrderId: number;

  beforeAll(async () => {
    await cleanupTestData();
  });

  afterAll(async () => {
    await cleanupTestData();
  });

  it('should create an order successfully', async () => {
    // Create test data inside the test
    const user = await userStore.create({
      username: `testorderuser_${Date.now()}`,
      first_name: 'Order',
      last_name: 'Test',
      password: 'password123'
    });

    const product = await productStore.create({
      name: `Test Order Product ${Date.now()}`,
      price: 29.99,
      category: 'Test Order Category'
    });

    const order = await orderStore.create({
      user_id: user.id!,
      status: 'active'
    });

    testOrderId = order.id!;
    testUserId = user.id!;

    expect(order.user_id).toEqual(testUserId);
    expect(order.status).toEqual('active');
  });

  it('should get all orders', async () => {
    // Create fresh data for this test
    const user = await userStore.create({
      username: `testorderuser2_${Date.now()}`,
      first_name: 'Order2',
      last_name: 'Test2',
      password: 'password123'
    });

    await orderStore.create({
      user_id: user.id!,
      status: 'active'
    });

    const orders = await orderStore.index();
    expect(orders.length).toBeGreaterThan(0);
  });

  it('should get a specific order by id', async () => {
    // Create fresh data for this test
    const user = await userStore.create({
      username: `testorderuser3_${Date.now()}`,
      first_name: 'Order3',
      last_name: 'Test3',
      password: 'password123'
    });

    const order = await orderStore.create({
      user_id: user.id!,
      status: 'completed'
    });

    const orderId = order.id!;
    const foundOrder = await orderStore.show(orderId);

    expect(foundOrder.id).toEqual(orderId);
    expect(foundOrder.user_id).toEqual(user.id!);
    expect(foundOrder.status).toEqual('completed');
  });
});