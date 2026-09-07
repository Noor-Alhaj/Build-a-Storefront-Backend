import express from 'express';
import userRoutes from './handlers/users';
import productRoutes from './handlers/products';
import orderRoutes from './handlers/orders';

const app = express();
app.use(express.json());

// Routes
userRoutes(app);
productRoutes(app);
orderRoutes(app);

// Only start server if not in test mode and if this file is run directly
if (process.env.NODE_ENV !== 'test' && require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
app.get('/', (req, res) => {
  res.json({ message: 'Online Store API', version: '1.0.0' });
});

export default app;