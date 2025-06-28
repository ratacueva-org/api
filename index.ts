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
import pcBuildRoutes from './modules/pc-build/pc-build.routes';

dotenv.config();

const app = express();
const PORT: number = parseInt(process.env.PORT || '3000', 10);

applySecurityMiddleware(app);
app.use(express.json());
connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes)
app.use('/api/cart', cartRoutes);
app.use('/api/pc-build', pcBuildRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

app.use(errorHandler as express.ErrorRequestHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});