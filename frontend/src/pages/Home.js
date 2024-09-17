import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Box,
  Typography,
  Dialog,
} from '@mui/material';
import Carousel from 'react-material-ui-carousel';

import {
  getAllProducts,
  deleteProduct,
  updateProduct,
  createProduct,
} from '../api';
import ProductModal from '../components/ProductModal';
import { CartContext } from '../context/CartContext';
import CustomButton from '../components/CustomButton';

const Home = ({ user }) => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [productDetailModalOpen, setProductDetailModalOpen] = useState(false);

  const handleAddToCart = (product) => {
    try {
      if (!user) {
        console.log(user);
        navigate('/login', {
          state: { redirectTo: '/', productToAdd: product },
        });
      } else {
        addToCart(product._id);
        setSnackbarMessage('Added to cart successfully');
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarOpen(true);
    }
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setOpenModal(true);
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      setProducts(products.filter((product) => product._id !== id));
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarOpen(true);
    }
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setOpenModal(true);
  };

  const handleSubmitProduct = async (formData) => {
    try {
      if (selectedProduct) {
        const { data } = await updateProduct(selectedProduct._id, formData);
        setProducts(products.map((p) => (p._id === data._id ? data : p)));
      } else {
        const { data } = await createProduct(formData);
        setProducts([...products, data]);
      }
      setSelectedProduct(null);
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarOpen(true);
    }
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setProductDetailModalOpen(true);
  };

  const getProducts = async () => {
    try {
      const { data } = await getAllProducts();
      setProducts(data);
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
      }}>
      {user?.role === 'admin' && (
        <CustomButton
          onClick={handleAddProduct}
          color='primary'
          label='Add Product'
          variant='contained'
          sx={{
            width: 'auto',
            mb: 4,
            mt: 4,
            padding: '12px',
            fontSize: '1.1rem',
            borderRadius: '25px',
          }}
        />
      )}

      {products.length === 0 ? (
        <Typography variant='h6' color='textSecondary'>
          No products available
        </Typography>
      ) : (
        <TableContainer
          sx={{ width: '100%', maxWidth: '1200px', mx: 'auto', px: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell onClick={() => handleProductClick(product)}>
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      style={{ cursor: 'pointer' }}
                    />
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    {user?.role === 'admin' ? (
                      <>
                        <CustomButton
                          onClick={() => handleEditProduct(product)}
                          label='Edit'
                          variant='contained'
                          color='primary'
                          sx={{
                            mr: 2,
                            borderRadius: '25px',
                            padding: '10px 20px',
                            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                          }}
                        />

                        <CustomButton
                          onClick={() => handleDeleteProduct(product._id)}
                          label='Delete'
                          variant='contained'
                          color='error'
                          sx={{
                            borderRadius: '25px',
                            padding: '10px 20px',
                            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                          }}
                        />
                      </>
                    ) : (
                      <CustomButton
                        onClick={() => handleAddToCart(product)}
                        label='Add to Cart'
                        variant='contained'
                        color='primary'
                        disabled={product.stock <= 0}
                        sx={{
                          borderRadius: '25px',
                          padding: '10px 20px',
                          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                        }}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />

      {user?.role === 'admin' && (
        <ProductModal
          open={openModal}
          handleClose={() => setOpenModal(false)}
          handleSubmit={handleSubmitProduct}
          product={selectedProduct}
        />
      )}

      <Dialog
        open={productDetailModalOpen}
        onClose={() => setProductDetailModalOpen(false)}
        fullWidth
        maxWidth='md'
        sx={{ backgroundColor: 'transparent', p: 0 }}>
        {selectedProduct && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 4,
              backgroundColor: '#f9f9f9',
              position: 'relative',
            }}>
            {selectedProduct.images.length > 0 && (
              <Carousel
                navButtonsAlwaysVisible={true}
                sx={{ width: '100%', height: '450px' }}>
                {selectedProduct.images.map((image, index) => (
                  <Paper key={index}>
                    <Box
                      sx={{
                        height: '450px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        p: 2,
                      }}>
                      <img
                        src={image}
                        alt={`Carousel  ${index + 1}`}
                        style={{
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </Box>
                  </Paper>
                ))}
              </Carousel>
            )}
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography
                variant='h3'
                fontWeight='bold'
                sx={{ color: '#000', fontSize: '2.5rem' }}>
                {selectedProduct.name}
              </Typography>
              <Typography sx={{ mt: 2, color: '#555', fontSize: '1.1rem' }}>
                {selectedProduct.description}
              </Typography>
              <Typography
                variant='h4'
                fontWeight='bold'
                color='primary'
                sx={{ mt: 2 }}>
                ${selectedProduct.price.toFixed(2)}
              </Typography>
              <Typography sx={{ color: '#777', fontSize: '1rem', mt: 1 }}>
                Stock: {selectedProduct.stock}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              {user?.role === 'admin' ? (
                <>
                  <CustomButton
                    onClick={() => handleEditProduct(selectedProduct)}
                    label='Edit'
                    variant='contained'
                    color='primary'
                    sx={{
                      p: '12px 20px',
                      fontSize: '1rem',
                      backgroundColor: '#1976d2',
                      borderRadius: '30px',
                    }}
                  />

                  <CustomButton
                    variant='contained'
                    color='error'
                    onClick={() => handleDeleteProduct(selectedProduct._id)}
                    label='Delete'
                    sx={{
                      p: '12px 20px',
                      fontSize: '1rem',
                      borderRadius: '30px',
                    }}
                  />
                </>
              ) : (
                <CustomButton
                  variant='contained'
                  onClick={() => handleAddToCart(selectedProduct)}
                  disabled={selectedProduct.stock <= 0}
                  label='Add to Cart'
                  sx={{
                    mt: 3,
                    p: '12px 40px',
                    fontSize: '1.1rem',
                    backgroundColor: '#000',
                    color: '#fff',
                    borderRadius: '30px',
                    '&:hover': {
                      backgroundColor: '#333',
                    },
                  }}
                />
              )}
            </Box>
          </Box>
        )}
      </Dialog>
    </Box>
  );
};

export default Home;
