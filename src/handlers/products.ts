import express, { Request, Response } from 'express';
import { ProductStore } from '../models/product';
import { verifyAuthToken } from '../middleware/auth';

const store = new ProductStore();

const productRoutes = (app: express.Application) => {
  app.get('/api/products', index);
  app.get('/api/products/:id', show);
  app.post('/api/products', verifyAuthToken, create);
  app.put('/api/products/:id', verifyAuthToken, update);
  app.delete('/api/products/:id', verifyAuthToken, destroy);
  app.get('/api/products/popular', popular);
};

const index = async (_req: Request, res: Response) => {
  try {
    const products = await store.index();
    res.json(products);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const product = await store.show(parseInt(req.params.id));
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};


const create = async (req: Request, res: Response) => {
  try {
    const product = await store.create({
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      description: req.body.description,
    });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const product = await store.update(parseInt(req.params.id), {
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      description: req.body.description,
    });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

const destroy = async (req: Request, res: Response) => {
  try {
    const product = await store.delete(parseInt(req.params.id));
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

const popular = async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
    const products = await store.popular(limit);
    res.json(products);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

export default productRoutes;