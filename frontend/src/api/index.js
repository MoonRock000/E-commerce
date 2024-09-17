import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }
  return req;
});

// Auth APIs
export const login = async (formData) => {
  try {
    const response = await API.post('/auth/login', formData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const signup = async (formData) => {
  try {
    const response = await API.post('/auth/signup', formData);
    return response;
  } catch (error) {
    throw error;
  }
};

// Product APIs
export const getAllProducts = async () => {
  try {
    const response = await API.get('/products');
    return response;
  } catch (error) {
    throw new Error('Error fetching products.');
  }
};

export const createProduct = async (data) => {
  try {
    const response = await API.post('/products', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response;
  } catch (error) {
    throw new Error('Error creating product. ');
  }
};

export const updateProduct = async (id, data) => {
  try {
    const response = await API.patch(`/products/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response;
  } catch (error) {
    throw new Error('Error updating product.');
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await API.delete(`/products/${id}`);
    return response;
  } catch (error) {
    throw new Error('Error deleting product.');
  }
};

// Order APIs
export const fetchOrders = async () => {
  try {
    const response = await API.get('/orders');
    return response;
  } catch (error) {
    throw new Error('Error fetching orders.');
  }
};

export const updateOrder = async (id, data) => {
  try {
    const response = await API.patch(`/orders/${id}`, data);
    return response;
  } catch (error) {
    throw new Error('Error updating order.');
  }
};

export const deleteOrder = async (id) => {
  try {
    const response = await API.delete(`/orders/${id}`);
    return response;
  } catch (error) {
    throw new Error('Error deleting order.');
  }
};

// Cart APIs
export const addToCartApi = async (productId, quantity = 1) => {
  try {
    const response = await API.post('/cart/add', { productId, quantity });
    return response;
  } catch (error) {
    throw new Error('Error adding product to cart.');
  }
};

export const fetchCart = async () => {
  try {
    const response = await API.get('/cart');
    return response;
  } catch (error) {
    throw new Error('Error fetching cart.');
  }
};

export const removeFromCartApi = async (productId) => {
  try {
    const response = await API.patch('/cart/remove', { productId });
    return response;
  } catch (error) {
    throw new Error('Error removing product from cart.');
  }
};

export const checkout = async (address) => {
  try {
    const response = await API.post('/cart/checkout', { address });
    return response;
  } catch (error) {
    throw new Error('Error placing order.');
  }
};

export const updateCart = async (productId, quantity) => {
  try {
    const response = await API.patch('/cart', { productId, quantity });
    return response;
  } catch (error) {
    throw new Error('Error upating cart.');
  }
};
