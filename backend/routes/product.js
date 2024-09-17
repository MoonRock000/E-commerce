import express from 'express';
import multer from 'multer';

import { authenticate, isAdmin } from '../middlewares/auth.js';

import {
  createProduct,
  updateProduct,
  getAllProducts,
  getProductById,
  deleteProductById,
} from '../controllers/product.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Admin routes
router.post(
  '/',
  authenticate,
  isAdmin,
  upload.array('images', 5),
  createProduct
);
router.patch(
  '/:id',
  authenticate,
  isAdmin,
  upload.array('images', 5),
  updateProduct
);
router.delete('/:id', authenticate, isAdmin, deleteProductById);

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);

export default router;
