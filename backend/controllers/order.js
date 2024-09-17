import Order from '../models/order.js';
import Product from '../models/product.js';
import Cart from '../models/cart.js';
import { clearCart } from './cart.js';

// Update an existing order (only by Admin)
export const updateOrder = async (req, res) => {
  const { products, status, shippingInfo } = req.body;

  try {
    const order = await Order.findById(req.params.id).populate(
      'products.product'
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    if (products) {
      // Check stock availability for each product in the update
      for (const productOrder of products) {
        const product = await Product.findById(productOrder.product);

        if (!product) {
          return res.status(404).json({
            message: `Product with ID ${productOrder.product} not found.`,
          });
        }

        const originalProductOrder = order.products.find(
          (p) => p.product.toString() === productOrder.product
        );

        const quantityDifference =
          productOrder.quantity -
          (originalProductOrder ? originalProductOrder.quantity : 0);

        // Check if the quantity difference is valid (i.e., the new quantity doesn't exceed stock)
        if (quantityDifference > 0 && product.stock < quantityDifference) {
          return res.status(400).json({
            message: `Requested quantity (${productOrder.quantity}) for product '${product.name}' exceeds available stock (${product.stock}).`,
          });
        }
      }

      // If quantities are valid, update the order and adjust stock
      for (const productOrder of products) {
        const originalProductOrder = order.products.find(
          (p) => p.product.toString() === productOrder.product
        );
        const quantityDifference =
          productOrder.quantity -
          (originalProductOrder ? originalProductOrder.quantity : 0);

        // Adjust product stock based on the quantity difference
        await Product.findByIdAndUpdate(productOrder.product, {
          $inc: { stock: -quantityDifference },
        });
      }

      order.products = products;
    }

    // Update the order status and shipping info if provided
    if (status) order.status = status;
    if (shippingInfo) order.shippingInfo = shippingInfo;

    await order.save();
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get orders (users can only see their own orders)
export const getOrders = async (req, res) => {
  try {
    let orders;

    if (req.user.role === 'admin') {
      orders = await Order.find().populate('products.product');
    } else {
      orders = await Order.find({ userId: req.user.id }).populate(
        'products.product'
      );
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'products.product'
    );

    if (
      !order ||
      (order.userId.toString() !== req.user.id && req.user.role !== 'admin')
    ) {
      return res
        .status(403)
        .json({ message: 'You do not have access to this order.' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel an order (only the owner of the order can cancel it)
export const deleteOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res
        .status(403)
        .json({ message: 'You can only cancel your own orders' });
    }

    if (req.user.role === 'admin') {
      await order.deleteOne();
      return res.status(200).json({ message: 'Order deleted successfully' });
    }

    order.status = 'canceled';
    await order.save();
    res.status(200).json({ message: 'Order canceled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Checkout: Convert cart to an order
export const checkout = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      'products.product'
    );
    if (!cart) {
      return res.status(404).json({ message: 'Cart is empty' });
    }

    // Check stock availability for each product
    for (let item of cart.products) {
      if (item.product.stock < item.quantity) {
        return res
          .status(400)
          .json({ message: `Not enough stock for ${item.product.name}` });
      }
    }

    // Create a new order
    const order = new Order({
      userId: req.user.id,
      products: cart.products,
      shippingInfo: {
        address: req.body.address || req.user.address,
      },
      price: cart.price,
    });

    await order.save();

    // Deduct stock from the products
    for (let item of cart.products) {
      const product = await Product.findById(item.product.id);
      product.stock -= item.quantity;
      await product.save();
    }

    // Clear the cart after checkout
    await clearCart(req.user.id);

    res.status(200).json(order);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};
