import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import AWS from 'aws-sdk';

import loggerMiddleware from './middlewares/logger.js';
import { connectDb } from './db/index.js';
import productRoutes from './routes/product.js';
import orderRoutes from './routes/order.js';
import authRoutes from './routes/auth.js';
import cartRoutes from './routes/cart.js';

dotenv.config();

const app = express();
const PORT = process.env.APP_PORT || 8080;

const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

AWS.config.update({
  region,
  accessKeyId,
  secretAccessKey,
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect Database
connectDb();

// Middleware
app.use(loggerMiddleware);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);

app.get('/health', (req, res) => {
  res.status(200).send('API is healthy');
});

app.all('/*', (req, res) => {
  res.status(404).send('404 Not found');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
