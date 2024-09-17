import React, { createContext, useState, useEffect } from 'react';

import { addToCartApi, fetchCart, removeFromCartApi } from '../api';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCartFromDb = async () => {
    try {
      const { data } = await fetchCart();
      setCart(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId) => {
    try {
      const { data } = await addToCartApi(productId);
      setCart(data);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const { data } = await removeFromCartApi(productId);
      setCart(data);
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser && storedUser.role !== 'admin') {
      fetchCartFromDb();
    }
  }, [loading]);

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        removeFromCart,
        fetchCartFromDb,
        loading,
      }}>
      {children}
    </CartContext.Provider>
  );
};
