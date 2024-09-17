import React, { useState } from 'react';
import { signup } from '../api';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography } from '@mui/material';

const Signup = ({ setUser }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await signup(formData);
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <Container>
      <Typography variant='h4' gutterBottom>
        Signup
      </Typography>
      {error && <Typography color='error'>{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          label='Name'
          fullWidth
          margin='normal'
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <TextField
          label='Address'
          fullWidth
          margin='normal'
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
        />
        <TextField
          label='Username'
          type='username'
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
          Signup
        </Button>
      </form>
    </Container>
  );
};

export default Signup;
