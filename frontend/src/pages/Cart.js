import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Typography,
  IconButton,
  TextField,
  List,
  ListItem,
  Avatar,
  Snackbar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';

import { CartContext } from '../context/CartContext';
import { checkout, updateCart } from '../api';
import CustomButton from '../components/CustomButton';

const Cart = () => {
  const { cart, setCart, removeFromCart, loading } = useContext(CartContext);

  const [address, setAddress] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!cart || cart.products.length === 0)) {
      setSnackbarMessage('Your cart is empty');
      setSnackbarOpen(true);
    }
  }, [cart, loading]);

  const handleIncrement = async (cartItem) => {
    try {
      const { data } = await updateCart(
        cartItem.product._id,
        cartItem.quantity + 1
      );
      setCart(data);
    } catch (error) {
      setSnackbarMessage('Error incrementing product quantity');
      setSnackbarOpen(true);
    }
  };

  const handleDecrement = async (cartItem) => {
    try {
      if (cartItem.quantity > 1) {
        const { data } = await updateCart(
          cartItem.product._id,
          cartItem.quantity - 1
        );
        setCart(data);
      } else {
        setSnackbarMessage('Quantity cannot be less than 1');
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage('Error decrementing product quantity');
      setSnackbarOpen(true);
    }
  };

  const handleRemove = async (cartItem) => {
    try {
      const { data } = await removeFromCart(cartItem.product._id);
      setCart(data);
      setSnackbarMessage('Item removed from cart');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage('Error removing product');
      setSnackbarOpen(true);
    }
  };

  const handleCheckout = async () => {
    try {
      await checkout(address);
      setSnackbarMessage('Checkout successful');
      setSnackbarOpen(true);
      setCart(null);
    } catch (error) {
      setSnackbarMessage('Error during checkout');
      setSnackbarOpen(true);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Typography variant='h6'>Loading cart...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant='h4' sx={{ mb: 4 }}>
        Shopping Bag
      </Typography>

      {!cart || cart.products.length === 0 ? (
        <Typography variant='h6' color='textSecondary'>
          Your cart is empty
        </Typography>
      ) : (
        <>
          <List>
            {cart.products?.map((cartItem) => (
              <ListItem
                key={cartItem._id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                  borderBottom: '1px solid #eee',
                }}>
                <IconButton onClick={() => handleRemove(cartItem)}>
                  <CloseIcon />
                </IconButton>

                <Avatar
                  variant='square'
                  src={cartItem.product.images[0]}
                  sx={{ width: 80, height: 80, mr: 2 }}
                />

                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant='subtitle1'>
                    {cartItem.product.name}
                  </Typography>
                  <Typography variant='body2' color='textSecondary'>
                    {cartItem.product.color}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton onClick={() => handleDecrement(cartItem)}>
                    <RemoveIcon />
                  </IconButton>
                  <Typography sx={{ mx: 2 }}>{cartItem.quantity}</Typography>
                  <IconButton onClick={() => handleIncrement(cartItem)}>
                    <AddIcon />
                  </IconButton>
                </Box>

                <Typography variant='h6' sx={{ ml: 2 }}>
                  ${cartItem.totalPrice.toFixed(2)}
                </Typography>
              </ListItem>
            ))}
          </List>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Typography variant='h6'>Total</Typography>
            <Typography variant='h6'>${cart.price.toFixed(2)}</Typography>
          </Box>

          <TextField
            label='Shipping Address'
            fullWidth
            value={cart.address || address}
            onChange={(e) => setAddress(e.target.value)}
            sx={{ mt: 3 }}
          />

          <CustomButton
            onClick={handleCheckout}
            color='primary'
            label='Checkout'
            variant='contained'
            sx={{
              mt: 3,
              width: '100%',
              padding: '12px',
              fontSize: '1.1rem',
              borderRadius: '25px',
            }}
          />
        </>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default Cart;
