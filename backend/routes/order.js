import express from 'express';
import { authenticate, isAdmin } from '../middlewares/auth.js';
import {
  getOrderById,
  updateOrder,
  deleteOrderById,
  getOrders,
} from '../controllers/order.js';

const router = express.Router();

router.get('/', authenticate, getOrders);
router.get('/:id', authenticate, getOrderById);
router.delete('/:id', authenticate, deleteOrderById);
router.patch('/:id', authenticate, updateOrder);

export default router;
