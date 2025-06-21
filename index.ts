import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import { applySecurityMiddleware } from './middlewares/security.middleware';
import { errorHandler } from './middlewares/error.middleware';
import authRoutes from './routes/auth.routes';
import clientRoutes from './routes/client.routes';

dotenv.config();

const app = express();
const PORT: number = parseInt(process.env.PORT || '3000', 10);

applySecurityMiddleware(app);
app.use(express.json());
connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/client', clientRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

app.use(errorHandler as express.ErrorRequestHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});