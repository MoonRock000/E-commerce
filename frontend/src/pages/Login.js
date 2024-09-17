import React, { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography } from '@mui/material';

import { login } from '../api';
import { CartContext } from '../context/CartContext';
import CustomButton from '../components/CustomButton';

const Login = ({ setUser }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const { addToCart, fetchCartFromDb } = useContext(CartContext);

  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login(formData);
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      fetchCartFromDb();

      // Check if there's a product to add to cart after login
      if (location.state?.productToAdd) {
        addToCart(location.state.productToAdd._id);
      }

      navigate(location.state?.redirectTo || '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Container>
      <Typography variant='h4' gutterBottom>
        Login
      </Typography>
      {error && <Typography color='error'>{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          label='Username'
          fullWidth
          margin='normal'
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
        />
        <TextField
          label='Password'
          type='password'
          fullWidth
          margin='normal'
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        <Button
          variant='contained'
          color='primary'
          type='submit'
          fullWidth
          sx={{
            mt: 3,
            padding: '12px',
            fontSize: '1rem',
            borderRadius: '25px',
          }}>
          Login
        </Button>
      </form>
    </Container>
  );
};

export default Login;
