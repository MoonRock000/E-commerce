import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Input,
} from '@mui/material';
import CustomButton from './CustomButton';

const ProductModal = ({ open, handleClose, handleSubmit, product }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    images: [],
  });
  const [errorMessage, setErrorMessage] = useState('');

  const validateForm = () => {
    const { name, description, price, stock } = formData;
    if (!name || !description || !price || !stock) {
      setErrorMessage('All fields are required.');
      return false;
    }
    return true;
  };

  const handleImageChange = (files) => {
    setFormData((prevData) => ({
      ...prevData,
      images: [...files],
    }));
  };

  const onFormSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const data = new FormData();

    data.append('name', formData.name);
    data.append('price', formData.price);
    data.append('description', formData.description);
    data.append('stock', formData.stock);

    if (formData.images?.length > 0) {
      formData.images.forEach((image) => {
        data.append('images', image);
      });
    }

    handleSubmit(data);
    handleClose();
  };

  const initializeFormData = (product = {}) => {
    return {
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || 0,
      stock: product?.stock || 0,
      images: product?.images || [],
    };
  };

  useEffect(() => {
    if (open) {
      setFormData(initializeFormData(product));
      setErrorMessage('');
    }
  }, [product, open]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{product ? 'Edit Product' : 'Add Product'}</DialogTitle>
      <DialogContent>
        <TextField
          label='Product Name'
          fullWidth
          required
          margin='normal'
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <TextField
          label='Description'
          fullWidth
          required
          margin='normal'
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        <TextField
          label='Price'
          type='number'
          fullWidth
          required
          margin='normal'
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        />
        <TextField
          label='Stock'
          type='number'
          fullWidth
          required
          margin='normal'
          value={formData.stock}
          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
        />

        <Input
          type='file'
          label='Add file'
          inputProps={{ multiple: true }}
          onChange={(e) => handleImageChange(e.target.files)}
          sx={{ mt: 2, mb: 2 }}
        />

        {errorMessage && (
          <Typography color='error' variant='body2'>
            {errorMessage}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <CustomButton
          onClick={handleClose}
          color='error'
          label='Cancel'
          variant='contained'
          sx={{
            mt: 3,
            width: '35%',
            padding: '12px',
            fontSize: '1rem',
            borderRadius: '25px',
          }}
        />
        <CustomButton
          onClick={onFormSubmit}
          color='primary'
          variant='contained'
          label={product ? 'Update Product' : 'Add Product'}
          sx={{
            mt: 3,
            width: '35%',
            padding: '12px',
            fontSize: '1rem',
            borderRadius: '25px',
          }}
        />
      </DialogActions>
    </Dialog>
  );
};

export default ProductModal;
