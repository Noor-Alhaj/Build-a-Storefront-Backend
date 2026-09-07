import client from '../database';
import { Order, OrderWithProducts, Product, OrderProduct } from '../types';

export class OrderStore {
  async index(): Promise<Order[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM orders';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get orders. Error: ${err}`);
    }
  }

  async show(id: number): Promise<OrderWithProducts> {
    try {
      const conn = await client.connect();
      
      // Get order details
      const orderSql = 'SELECT * FROM orders WHERE id=($1)';
      const orderResult = await conn.query(orderSql, [id]);
      const order = orderResult.rows[0];

      // Get products for this order
      const productsSql = `
        SELECT p.*, op.quantity 
        FROM products p 
        INNER JOIN order_products op ON p.id = op.product_id 
        WHERE op.order_id=($1)
      `;
      const productsResult = await conn.query(productsSql, [id]);
      
      conn.release();

      return {
        ...order,
        products: productsResult.rows
      };
    } catch (err) {
      throw new Error(`Could not find order ${id}. Error: ${err}`);
    }
  }

  async create(o: Order): Promise<Order> {
    try {
      const conn = await client.connect();
      const sql = 'INSERT INTO orders (user_id, status) VALUES($1, $2) RETURNING *';
      const result = await conn.query(sql, [o.user_id, o.status]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not add new order. Error: ${err}`);
    }
  }

  async update(id: number, o: Order): Promise<Order> {
    try {
      const conn = await client.connect();
      const sql = 'UPDATE orders SET user_id=$1, status=$2 WHERE id=$3 RETURNING *';
      const result = await conn.query(sql, [o.user_id, o.status, id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not update order ${id}. Error: ${err}`);
    }
  }

  async delete(id: number): Promise<Order> {
    try {
      const conn = await client.connect();
      const sql = 'DELETE FROM orders WHERE id=($1) RETURNING *';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not delete order ${id}. Error: ${err}`);
    }
  }

  async addProduct(orderId: number, productId: number, quantity: number): Promise<OrderProduct> {
    try {
      const conn = await client.connect();
      const sql = 'INSERT INTO order_products (order_id, product_id, quantity) VALUES($1, $2, $3) RETURNING *';
      const result = await conn.query(sql, [orderId, productId, quantity]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not add product ${productId} to order ${orderId}. Error: ${err}`);
    }
  }

  async getUserOrders(userId: number): Promise<OrderWithProducts[]> {
    try {
      const conn = await client.connect();
      const ordersSql = 'SELECT * FROM orders WHERE user_id=($1) ORDER BY created_at DESC';
      const ordersResult = await conn.query(ordersSql, [userId]);
      
      const ordersWithProducts: OrderWithProducts[] = [];
      
      for (const order of ordersResult.rows) {
        const productsSql = `
          SELECT p.*, op.quantity 
          FROM products p 
          INNER JOIN order_products op ON p.id = op.product_id 
          WHERE op.order_id=($1)
        `;
        const productsResult = await conn.query(productsSql, [order.id]);
        
        ordersWithProducts.push({
          ...order,
          products: productsResult.rows
        });
      }
      
      conn.release();
      return ordersWithProducts;
    } catch (err) {
      throw new Error(`Could not get orders for user ${userId}. Error: ${err}`);
    }
  }

  async getRecentUserOrders(userId: number, limit: number = 5): Promise<OrderWithProducts[]> {
    try {
      const orders = await this.getUserOrders(userId);
      return orders.slice(0, limit);
    } catch (err) {
      throw new Error(`Could not get recent orders for user ${userId}. Error: ${err}`);
    }
  }
}