import express from 'express';

import {
  addToCart,
  getCart,
  removeFromCart,
  updateCart,
} from '../controllers/cart.js';
import { checkout } from '../controllers/order.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// Protected routes - user must be logged in
router.post('/add', authenticate, addToCart);
router.patch('/remove', authenticate, removeFromCart);
router.patch('/', authenticate, updateCart);
router.get('/', authenticate, getCart);
router.post('/checkout', authenticate, checkout);

export default router;
