import Cart from '../models/cart.js';
import Product from '../models/product.js';

// Add product to the cart
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate(
      'products.product'
    );

    // If the cart doesn't exist, create a new one
    if (!cart) {
      cart = new Cart({ user: req.user.id, products: [] });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock <= 0) {
      return res.status(400).json({ message: 'Product is out of stock' });
    }

    if (product.stock < quantity) {
      return res
        .status(400)
        .json({ message: 'Insufficient stock for the requested quantity' });
    }

    // Check if the product is already in the cart
    const productIndex = cart.products.findIndex(
      (p) => p.product.id.toString() === productId
    );

    const productTotalPrice = product.price * quantity;

    if (productIndex > -1) {
      // If product exists, update the quantity
      cart.products[productIndex].quantity += quantity;
      cart.products[productIndex].totalPrice += productTotalPrice;
    } else {
      // Otherwise, add the product to the cart
      cart.products.push({
        product,
        quantity,
        totalPrice: productTotalPrice,
      });
    }

    cart.price = cart.products.reduce((acc, item) => acc + item.totalPrice, 0);

    await cart.save();

    product.stock = product.stock - quantity;
    await product.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// View the cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      'products.product'
    );
    console.log(cart);

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove a product from the cart
export const removeFromCart = async (req, res) => {
  const { productId } = req.body;

  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      'products.product'
    );
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const productInCart = cart.products.find(
      (p) => p.product.id.toString() === productId
    );

    const product = await Product.findById(productId);
    product.stock += productInCart.quantity;

    cart.products = cart.products.filter(
      (p) => p.product.id.toString() !== productId
    );

    cart.price = cart.products.reduce((acc, item) => acc + item.totalPrice, 0);

    await cart.save();

    await product.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Clear the cart after checkout
export const clearCart = async (userId) => {
  try {
    const cart = await Cart.findOne({ user: userId });
    console.log({ cart });
    if (cart) {
      await cart.deleteOne();
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

// Update product quantity in the cart
export const updateCart = async (req, res) => {
  const { productId, quantity } = req.body; // quantity is the new quantity to be set

  try {
    // Find the user's cart
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      'products.product'
    );

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find the product in the cart
    const productInCart = cart.products.find(
      (p) => p.product.id.toString() === productId
    );

    if (!productInCart) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    // Find the product in the database to check stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Handle increment case: check if new quantity exceeds available stock
    if (quantity > productInCart.quantity) {
      const increment = quantity - productInCart.quantity;

      if (product.stock < increment) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }

      // Update product stock
      product.stock -= increment;
    } else {
      // Handle decrement case: check if quantity is at least 1
      if (quantity < 1) {
        return res
          .status(400)
          .json({ message: 'Quantity cannot be less than 1' });
      }

      // Update product stock by adding back the difference
      const decrement = productInCart.quantity - quantity;
      product.stock += decrement;
    }

    // Update the product quantity in the cart
    productInCart.quantity = quantity;
    productInCart.totalPrice = product.price * quantity;

    // Recalculate the total cart price
    cart.price = cart.products.reduce((acc, item) => acc + item.totalPrice, 0);

    // Save the updated cart and product
    await cart.save();
    await product.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
