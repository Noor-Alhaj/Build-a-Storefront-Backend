import request from 'supertest';
import app from '../../server';
import { cleanupTestData } from '../helpers';

describe('Users API Endpoints', () => {
  let authToken: string;
  let userId: number;

  beforeAll(async () => {
    await cleanupTestData();
  });

  afterAll(async () => {
    await cleanupTestData();
  });

  describe('POST /api/users/register', () => {
    it('should create a new user', async () => {
      const response = await request(app)
        .post('/api/users/register')
        .send({
          username: `testapiuser_${Date.now()}`,
          first_name: 'API',
          last_name: 'Test',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body.user.username).toContain('testapiuser');
      expect(response.body.user.first_name).toBe('API');
      expect(response.body.token).toBeDefined();
      
      authToken = response.body.token;
      userId = response.body.user.id;
    });

    it('should reject duplicate username', async () => {
      const username = `duplicateuser_${Date.now()}`;
      
      // Create first user
      await request(app)
        .post('/api/users/register')
        .send({
          username: username,
          first_name: 'First',
          last_name: 'User',
          password: 'password123'
        });

      // Try to create duplicate
      const response = await request(app)
        .post('/api/users/register')
        .send({
          username: username, // Same username
          first_name: 'Duplicate',
          last_name: 'User',
          password: 'password123'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/users/login', () => {
    it('should authenticate with valid credentials', async () => {
      const username = `testauth_${Date.now()}`;
      const password = 'password123';
      
      // First create user
      await request(app)
        .post('/api/users/register')
        .send({
          username: username,
          first_name: 'Auth',
          last_name: 'Test',
          password: password
        });

      // Then login
      const response = await request(app)
        .post('/api/users/login')
        .send({
          username: username,
          password: password
        });

      expect(response.status).toBe(200);
      expect(response.body.user.username).toBe(username);
      expect(response.body.token).toBeDefined();
    });

    it('should reject invalid credentials', async () => {
      const username = `testinvalid_${Date.now()}`;
      
      // Create user
      await request(app)
        .post('/api/users/register')
        .send({
          username: username,
          first_name: 'Invalid',
          last_name: 'Test',
          password: 'correctpassword'
        });

      // Try to login with wrong password
      const response = await request(app)
        .post('/api/users/login')
        .send({
          username: username,
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should require authentication', async () => {
      const response = await request(app)
        .get(`/api/users/${userId}`);

      expect(response.status).toBe(401);
    });

    it('should return user with valid token', async () => {
      const response = await request(app)
        .get(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(userId);
      expect(response.body.username).toContain('testapiuser');
    });
  });
});