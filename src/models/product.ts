import client from '../database';
import { Product } from '../types';

export class ProductStore {
  async index(): Promise<Product[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM products';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get products. Error: ${err}`);
    }
  }

  async show(id: number): Promise<Product> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM products WHERE id=($1)';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find product ${id}. Error: ${err}`);
    }
  }

  async create(p: Product): Promise<Product> {
    try {
      const conn = await client.connect();
      const sql = 'INSERT INTO products (name, price, category, description) VALUES($1, $2, $3, $4) RETURNING *';
      const result = await conn.query(sql, [p.name, p.price, p.category, p.description]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not add new product ${p.name}. Error: ${err}`);
    }
  }

  async update(id: number, p: Product): Promise<Product> {
    try {
      const conn = await client.connect();
      const sql = 'UPDATE products SET name=$1, price=$2, category=$3, description=$4 WHERE id=$5 RETURNING *';
      const result = await conn.query(sql, [p.name, p.price, p.category, p.description, id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not update product ${id}. Error: ${err}`);
    }
  }

  async delete(id: number): Promise<Product> {
    try {
      const conn = await client.connect();
      const sql = 'DELETE FROM products WHERE id=($1) RETURNING *';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not delete product ${id}. Error: ${err}`);
    }
  }

  async popular(limit: number = 5): Promise<Product[]> {
    try {
      const conn = await client.connect();
      const sql = `
        SELECT p.*, SUM(op.quantity) as total_ordered
        FROM products p
        INNER JOIN order_products op ON p.id = op.product_id
        INNER JOIN orders o ON op.order_id = o.id
        WHERE o.status = 'complete'
        GROUP BY p.id
        ORDER BY total_ordered DESC
        LIMIT $1
      `;
      const result = await conn.query(sql, [limit]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get popular products. Error: ${err}`);
    }
  }
}