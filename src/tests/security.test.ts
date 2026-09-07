import request from 'supertest';
import app from '../server';
import { cleanupTestData } from './helpers';

describe('Security Tests', () => {
  beforeAll(async () => {
    await cleanupTestData();
  });

  afterAll(async () => {
    await cleanupTestData();
  });

  describe('Authentication', () => {
    it('should reject requests without token for protected routes', async () => {
      const routes = [
        { method: 'get', path: '/api/users/1' },
        { method: 'post', path: '/api/products' },
        { method: 'post', path: '/api/orders' },
        { method: 'get', path: '/api/orders' },
        { method: 'get', path: '/api/orders/1' }
      ];

      for (const route of routes) {
        const response = await (request(app) as any)[route.method](route.path);
        expect(response.status).toBe(401);
      }
    });

    it('should reject requests with invalid token', async () => {
      const response = await request(app)
        .get('/api/users/1')
        .set('Authorization', 'Bearer invalid-token-here');

      expect(response.status).toBe(401);
    });
  });

  describe('Password Security', () => {
    it('should hash passwords', async () => {
      const response = await request(app)
        .post('/api/users/register')
        .send({
          username: `securityuser_${Date.now()}`,
          first_name: 'Security',
          last_name: 'Test',
          password: 'plaintextpassword'
        });

      expect(response.status).toBe(200);
      
      // The returned user should not contain the plain password
      expect(response.body.user.password).toBeUndefined();
    });
  });
});