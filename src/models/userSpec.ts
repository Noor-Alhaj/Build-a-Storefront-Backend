import { UserStore } from './user';

const store = new UserStore();

describe('User Model', () => {
  let testUser: any;

  it('should have an index method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(store.show).toBeDefined();
  });

  it('should have a create method', () => {
    expect(store.create).toBeDefined();
  });

  it('should have an authenticate method', () => {
    expect(store.authenticate).toBeDefined();
  });

  it('create method should add a user', async () => {
    const result = await store.create({
      username: 'testuser',
      first_name: 'Test',
      last_name: 'User',
      
      password: 'password123'
    });
    
    testUser = result;
    expect(result.username).toEqual('testuser');
    expect(result.first_name).toEqual('Test');
    expect(result.last_name).toEqual('User');
  });

  it('index method should return a list of users', async () => {
    const result = await store.index();
    expect(result.length).toBeGreaterThan(0);
  });

  it('show method should return the correct user', async () => {
    const result = await store.show(testUser.id);
    expect(result.id).toEqual(testUser.id);
    expect(result.username).toEqual('testuser');
  });

  it('authenticate method should return user with valid credentials', async () => {
    const result = await store.authenticate('testuser', 'password123');
    expect(result).not.toBeNull();
    expect(result?.username).toEqual('testuser');
  });

  it('authenticate method should return null with invalid credentials', async () => {
    const result = await store.authenticate('testuser', 'wrongpassword');
    expect(result).toBeNull();
  });
});