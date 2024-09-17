import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import Grid from '@mui/material/Grid2';

import { fetchOrders, deleteOrder } from '../api';
import OrderModal from '../components/OrderModal';

const Orders = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleDelete = async (orderId) => {
    await deleteOrder(orderId);
    setOrders(orders.filter((order) => order._id !== orderId));
  };

  const getOrders = async () => {
    const { data } = await fetchOrders();
    setOrders(data);
  };

  useEffect(() => {
    getOrders();
  }, []);

  const handleUpdateOrder = (updatedOrder) => {
    if (updatedOrder) {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
    } else {
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== selectedOrder._id)
      );
    }
    setSelectedOrder(null);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant='h4' sx={{ mb: 4 }}>
        {user?.role === 'admin' ? 'All Orders' : 'My Orders'}
      </Typography>

      <Grid container spacing={3}>
        {orders.length === 0 ? (
          <Typography variant='h6' color='textSecondary'>
            No orders found
          </Typography>
        ) : (
          orders.map((order) => (
            <Grid xs={12} md={6} lg={4} key={order._id}>
              <Card>
                <CardContent>
                  <Typography variant='h6'>Order ID: {order._id}</Typography>
                  <Typography>Status: {order.status}</Typography>
                  <Typography>Total Price: ${order.price}</Typography>
                  <Typography>
                    Shipping Address: {order.shippingInfo.address}
                  </Typography>
                  <Button
                    variant='contained'
                    sx={{
                      p: '7px 20px',
                      fontSize: '1rem',
                      backgroundColor: '#1976d2',
                      borderRadius: '30px',
                    }}
                    onClick={() => setSelectedOrder(order)}>
                    View Details
                  </Button>
                  {user?.role === 'admin' && (
                    <Button
                      variant='contained'
                      color='error'
                      sx={{ mt: 2, ml: 2 }}
                      onClick={() => handleDelete(order._id)}>
                      Delete Order
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          open={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          user={user}
          onUpdate={handleUpdateOrder}
        />
      )}
    </Box>
  );
};

export default Orders;
