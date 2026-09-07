import request from 'supertest';
import app from '../../server';
import { cleanupTestData } from '../helpers';

describe('Orders API Endpoints', () => {
  let authToken: string;
  let userId: number;
  let productId: number;
  let orderId: number;

  beforeAll(async () => {
    await cleanupTestData();
    
    // Create a user
    const userResponse = await request(app)
      .post('/api/users/register')
      .send({
        username: `testorderuser_${Date.now()}`,
        first_name: 'Order',
        last_name: 'Test',
        password: 'password123'
      });
    
    authToken = userResponse.body.token;
    userId = userResponse.body.user.id;

    // Create a product
    const productResponse = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Order Test Product',
        price: 39.99,
        category: 'Order Category'
      });
    
    productId = productResponse.body.id;
  });

  afterAll(async () => {
    await cleanupTestData();
  });

  describe('POST /api/orders', () => {
    it('should require authentication', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send({
          status: 'active'
        });

      expect(response.status).toBe(401);
    });

    it('should create order with valid token', async () => {
      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          status: 'active'
        });

      expect(response.status).toBe(200);
      expect(response.body.user_id).toBe(userId);
      expect(response.body.status).toBe('active');
      
      orderId = response.body.id;
    });
  });

  describe('GET /api/orders', () => {
    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/orders');

      expect(response.status).toBe(401);
    });

    it('should return orders with valid token', async () => {
      const response = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/orders/:id', () => {
    it('should require authentication', async () => {
      const response = await request(app)
        .get(`/api/orders/${orderId}`);

      expect(response.status).toBe(401);
    });

    it('should return specific order with valid token', async () => {
      const response = await request(app)
        .get(`/api/orders/${orderId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(orderId);
    });
  });
});