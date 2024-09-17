import React, { useContext, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Badge,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import { CartContext } from '../context/CartContext';
import CustomButton from './CustomButton';

const Header = ({ user, setUser }) => {
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  const { role } = user || {};

  const logout = useCallback(() => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/', { replace: true });
  }, [setUser, navigate]);

  const cartItemsCount = useMemo(() => cart?.products?.length || 0, [cart]);

  return (
    <AppBar position='static'>
      <Toolbar>
        <Typography
          variant='h6'
          color='inherit'
          component={Link}
          to='/'
          sx={{ flexGrow: 1, textDecoration: 'none' }}>
          Reebelo
        </Typography>
        <Box>
          {user ? (
            <>
              <CustomButton to='/orders' label='Orders' component={Link} />

              {role !== 'admin' && (
                <IconButton
                  color='inherit'
                  component={Link}
                  to='/cart'
                  sx={{ ml: 2 }}>
                  <Badge badgeContent={cartItemsCount} color='error'>
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
              )}

              <CustomButton to='/' label='Logout' onClick={logout} />
            </>
          ) : (
            <>
              <CustomButton to='/login' label='Login' />
              <CustomButton to='/signup' label='Signup' />
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
