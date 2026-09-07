import client from '../database';

export async function cleanupTestData() {
  const sql = `
    DELETE FROM order_products;
    DELETE FROM orders;
    DELETE FROM products;
    DELETE FROM users WHERE username LIKE 'test%' OR username LIKE 'testuser%';
  `;
  
  try {
    await client.query(sql);
  } catch (error) {
    // Ignore errors if tables don't exist yet
    console.log('Cleanup completed (some tables might not exist)');
  }
}