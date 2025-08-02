import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import { applySecurityMiddleware } from './core/middlewares/security.middleware';
import { errorHandler } from './core/middlewares/error.middleware';
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/user.routes';
import productRoutes from './modules/products/product.routes';
import reviewRoutes from './modules/reviews/review.routes';
import cartRoutes from './modules/cart/cart.routes';
import orderRoutes from './modules/orders/order.routes';
import buildPcRoutes from './modules/pc-build/build-pc.routes';
import favoritesRoutes from './modules/favorites/favorites.routes';
import shippingRoutes from './modules/shipping/shipping.routes';
import swaggerUi from 'swagger-ui-express';
import swaggerSetup from './docs/swagger';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);

const PORT: number = parseInt(process.env.PORT || '3001', 10);

applySecurityMiddleware(app);
app.use(express.json());
connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/build-pc', buildPcRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/shipping', shippingRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSetup));

app.get('/', (req: Request, res: Response) => {
  res.send('API Rest del e-commerce gamer Ratacueva');
});

app.use(errorHandler as express.ErrorRequestHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
