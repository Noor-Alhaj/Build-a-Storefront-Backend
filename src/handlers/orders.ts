import express, { Request, Response } from 'express';
import { OrderStore } from '../models/order';
import { verifyAuthToken } from '../middleware/auth';

const store = new OrderStore();

const orderRoutes = (app: express.Application) => {
  app.get('/api/orders', verifyAuthToken, index);
  app.get('/api/orders/:id', verifyAuthToken, show);
  app.post('/api/orders', verifyAuthToken, create);
  app.post('/api/orders/:id/products', verifyAuthToken, addProduct);
};

const index = async (req: Request, res: Response) => {
  try {
    const orders = await store.getUserOrders((req as any).user.user.id);
    res.json(orders);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const order = await store.show(parseInt(req.params.id));
    
    // Check if the order belongs to the authenticated user
    if (order.user_id !== (req as any).user.user.id) {
      return res.status(403).json({ error: 'Not authorized to view this order' });
    }
    
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const order = await store.create({
      user_id: (req as any).user.user.id,
      status: req.body.status || 'active',
    });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

const addProduct = async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.id);
    const productId = req.body.product_id;
    const quantity = parseInt(req.body.quantity);

    const order = await store.show(orderId);
    
    // Check if the order belongs to the authenticated user
    if (order.user_id !== (req as any).user.user.id) {
      return res.status(403).json({ error: 'Not authorized to modify this order' });
    }

    const addedProduct = await store.addProduct(orderId, productId, quantity);
    res.json(addedProduct);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

export default orderRoutes;