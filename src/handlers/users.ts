import express, { Request, Response } from 'express';
import { UserStore } from '../models/user';
import jwt from 'jsonwebtoken';
import { verifyAuthToken } from '../middleware/auth';

const store = new UserStore();
const { JWT_SECRET } = process.env;

const userRoutes = (app: express.Application) => {
  app.post('/api/users/register', register);
  app.post('/api/users/login', login);
  app.get('/api/users/:id', verifyAuthToken, show);
  app.get('/api/users/:id/recent-orders', verifyAuthToken, recentOrders);
};

const register = async (req: Request, res: Response) => {
  console.log('Registration attempt:', req.body); // Debug log
  
  try {
    // Validate required fields
    if (!req.body.username || !req.body.first_name || !req.body.last_name || !req.body.password) {
      return res.status(400).json({ 
        error: 'Missing required fields: username, first_name, last_name, password' 
      });
    }

    const user = await store.create({
      username: req.body.username,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      password: req.body.password,
    });

    console.log('User created successfully:', user); // Debug log

    const token = jwt.sign({ user: user }, JWT_SECRET as string);
    res.json({ user, token });
  } catch (err) {
    console.error('Registration error:', err); // Detailed error log
    res.status(400).json({ error: (err as Error).message });
  }
};


const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await store.authenticate(username, password);
    
    if (user) {
      const token = jwt.sign({ user: user }, JWT_SECRET as string);
      res.json({ 
        user: { 
          id: user.id, 
          username: user.username, 
          first_name: user.first_name, 
          last_name: user.last_name 
        }, 
        token 
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const user = await store.show(parseInt(req.params.id));
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

const recentOrders = async (req: Request, res: Response) => {
  try {
    const OrderStore = (await import('../models/order')).OrderStore;
    const orderStore = new OrderStore();
    const orders = await orderStore.getRecentUserOrders(parseInt(req.params.id));
    res.json(orders);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

export default userRoutes;