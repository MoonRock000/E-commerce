import React, { useState } from 'react';
import {
  Box,
  Typography,
  Modal,
  TextField,
  Avatar,
  List,
  ListItem,
  Chip,
  Divider,
} from '@mui/material';

import { updateOrder, deleteOrder } from '../api';
import { STATUS_COLOR_MAP } from '../enums/status_color';
import CustomButton from './CustomButton';

const OrderModal = ({ order, open, onClose, user, onUpdate }) => {
  const [shippingInfo, setShippingInfo] = useState({
    company: order.shippingInfo.company || '',
    trackingNumber: order.shippingInfo.trackingNumber || '',
    address: order.shippingInfo.address || '',
  });

  const [status, setStatus] = useState(order.status);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (field, value) => {
    setShippingInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const hasChanges = () => {
    return (
      shippingInfo.company !== order.shippingInfo.company ||
      shippingInfo.trackingNumber !== order.shippingInfo.trackingNumber ||
      shippingInfo.address !== order.shippingInfo.address ||
      (user?.role === 'admin' && status !== order.status)
    );
  };

  const handleUpdate = async () => {
    if (
      user?.role === 'admin' &&
      (!shippingInfo.company || !shippingInfo.trackingNumber)
    ) {
      setErrorMessage('Company and Tracking Number are required.');
      return;
    }

    if (!shippingInfo.address) {
      setErrorMessage('Address is required.');
      return;
    }

    if (!hasChanges()) {
      onClose();
      return;
    }

    const updatedOrder = {
      shippingInfo,
    };

    if (user?.role === 'admin') {
      updatedOrder.status = status;
    }

    const { data } = await updateOrder(order._id, updatedOrder);
    onUpdate(data);
    onClose();
  };

  const handleCancelOrder = async () => {
    const updatedOrder = { status: 'canceled' };
    const result = await updateOrder(order._id, updatedOrder);
    onUpdate(result.data);
    onClose();
  };

  const handleDeleteOrder = async () => {
    await deleteOrder(order._id);
    onUpdate(null);
    onClose();
  };

  const getStatusColor = (status) => STATUS_COLOR_MAP[status];

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          p: 4,
          bgcolor: 'background.paper',
          borderRadius: 2,
          width: '90%',
          maxWidth: 700,
          maxHeight: '80vh',
          mx: 'auto',
          mt: '5%',
          overflow: 'auto',
        }}>
        {/* Order Header */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant='h6' sx={{ mb: 1 }}>
            Order Detail
          </Typography>
          <Typography variant='body2'>
            <b>{new Date(order.createdAt).toDateString()}</b>
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Typography variant='body2' component='span' color='textSecondary'>
              Order #{order._id} is currently
            </Typography>
            <Chip
              label={status}
              color={getStatusColor(status)}
              size='small'
              sx={{ ml: 1 }}
            />
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Product List */}
        <Box sx={{ mb: 3 }}>
          <Typography variant='h6'>Products</Typography>
          <List>
            {order.products.map((product) => (
              <ListItem
                key={product._id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 1,
                }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar
                    src={product.product.images[0]}
                    sx={{ mr: 2, width: 40, height: 40 }}
                  />
                  <Typography variant='body2'>
                    {product.quantity}x {product.product.name}
                  </Typography>
                </Box>
                <Typography variant='body2'>
                  ${order.price.toFixed(2)}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Shipping Info */}
        <Box>
          <Typography variant='h6' sx={{ mb: 2 }}>
            Shipping Information
          </Typography>

          <TextField
            fullWidth
            required
            label='Shipping Address'
            value={shippingInfo.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            sx={{ mb: 2 }}
            error={!shippingInfo.address}
            helperText={!shippingInfo.address ? 'Address is required' : ''}
          />

          {/* Admin: Editable fields for tracking company and tracking number */}
          {user?.role === 'admin' ? (
            <>
              <TextField
                fullWidth
                required
                label='Tracking Company'
                value={shippingInfo.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                sx={{ mb: 2 }}
                error={!shippingInfo.company}
                helperText={!shippingInfo.company ? 'Company is required' : ''}
              />
              <TextField
                fullWidth
                required
                label='Tracking Number'
                value={shippingInfo.trackingNumber}
                onChange={(e) =>
                  handleInputChange('trackingNumber', e.target.value)
                }
                sx={{ mb: 2 }}
                error={!shippingInfo.trackingNumber}
                helperText={
                  !shippingInfo.trackingNumber
                    ? 'Tracking Number is required'
                    : ''
                }
              />
              <TextField
                fullWidth
                select
                label='Order Status'
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                sx={{ mb: 2 }}
                SelectProps={{ native: true }}>
                <option value='processing'>Processing</option>
                <option value='shipped'>Shipped</option>
                <option value='delivered'>Delivered</option>
                <option value='canceled'>Canceled</option>
              </TextField>
            </>
          ) : (
            <>
              {/* Regular User: Display tracking info */}
              <Typography variant='body2' sx={{ mb: 1 }}>
                <strong>Tracking Company:</strong>{' '}
                {shippingInfo.company || 'N/A'}
              </Typography>
              <Typography variant='body2' sx={{ mb: 2 }}>
                <strong>Tracking Number:</strong>{' '}
                {shippingInfo.trackingNumber || 'N/A'}
              </Typography>
            </>
          )}
        </Box>

        <Divider sx={{ mt: 3, mb: 3 }} />

        {/* Total Price */}
        <Box sx={{ mb: 3 }}>
          <Typography variant='h6' sx={{ mb: 1 }}>
            Today's Total
          </Typography>
          <Typography variant='h5'>${order.price.toFixed(2)}</Typography>
        </Box>

        {/* Error Message */}
        {errorMessage && (
          <Typography color='error' sx={{ mb: 2 }}>
            {errorMessage}
          </Typography>
        )}

        {/* Action Buttons */}
        {user?.role === 'admin' ? (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <CustomButton
              variant='contained'
              color='primary'
              onClick={handleUpdate}
              label='Update Order'
              sx={{
                mt: 3,
                width: '35%',
                padding: '12px',
                fontSize: '1rem',
                borderRadius: '25px',
              }}
            />

            <CustomButton
              variant='contained'
              color='error'
              onClick={handleDeleteOrder}
              label='Delete Order'
              sx={{
                mt: 3,
                width: '35%',
                padding: '12px',
                fontSize: '1rem',
                borderRadius: '25px',
              }}
            />
          </Box>
        ) : (
          <>
            {order.status !== 'canceled' && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mt: 3,
                }}>
                <CustomButton
                  variant='contained'
                  color='primary'
                  onClick={handleUpdate}
                  label='Update Address'
                  sx={{
                    mt: 3,
                    width: '35%',
                    padding: '12px',
                    fontSize: '1rem',
                    borderRadius: '25px',
                  }}
                />
                <CustomButton
                  variant='contained'
                  color='error'
                  onClick={handleCancelOrder}
                  label='Cancel Order'
                  sx={{
                    mt: 3,
                    width: '35%',
                    padding: '12px',
                    fontSize: '1rem',
                    borderRadius: '25px',
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </Modal>
  );
};

export default OrderModal;
