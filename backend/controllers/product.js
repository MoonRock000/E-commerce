import Product from '../models/product.js';
import { uploadToBucket } from '../services/storage/index.js';

// Create product
export const createProduct = async (req, res) => {
  try {
    const { name, price, description, stock } = req.body;
    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      const uploads = await uploadToBucket(req.files);
      imageUrls = uploads.map((upload) => upload.Location);
    }

    const product = new Product({
      name,
      price,
      description,
      stock,
      images: imageUrls, // Store S3 image URLs
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { name, price, description, stock } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let imageUrls = product.images;

    // Check if new images are being sent
    if (req.files && req.files.length > 0) {
      const uploads = await uploadToBucket(req.files); // Upload new files to S3
      imageUrls.push(...uploads.map((upload) => upload.Location)); // Append new S3 URLs
    }

    // Update product fields
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.stock = stock || product.stock;
    product.images = imageUrls; // Keep old images and add new ones

    await product.save();
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete product by ID
export const deleteProductById = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
