import { UserStore } from './user';
import { cleanupTestData } from '../tests/helpers';

const userStore = new UserStore();

describe('Users API Business Logic', () => {
  beforeAll(async () => {
    await cleanupTestData();
  });

  afterAll(async () => {
    await cleanupTestData();
  });

  it('should create a user successfully', async () => {
    const user = await userStore.create({
      username: `testapiuser_${Date.now()}`,
      first_name: 'API',
      last_name: 'Test',
      password: 'password123'
    });

    expect(user.username).toContain('testapiuser');
    expect(user.first_name).toEqual('API');
    expect(user.last_name).toEqual('Test');
  });

  it('should authenticate user with correct credentials', async () => {
    const username = `testauth_${Date.now()}`;
    const password = 'password123';
    
    // Create user
    await userStore.create({
      username,
      first_name: 'Auth',
      last_name: 'Test',
      password
    });

    // Authenticate
    const authenticatedUser = await userStore.authenticate(username, password);
    
    expect(authenticatedUser).not.toBeNull();
    expect(authenticatedUser?.username).toEqual(username);
  });

  it('should return null with wrong password', async () => {
    const username = `testwrongpass_${Date.now()}`;
    
    await userStore.create({
      username,
      first_name: 'Wrong',
      last_name: 'Pass',
      password: 'correctpassword'
    });

    const result = await userStore.authenticate(username, 'wrongpassword');
    expect(result).toBeNull();
  });
});