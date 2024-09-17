import React from 'react';
import { Typography, Box } from '@mui/material';

import { footerStyles } from '../styles/footer';

const Footer = () => {
  return (
    <Box sx={footerStyles}>
      <Typography variant='body2'>© 2024 Reebelo</Typography>
    </Box>
  );
};

export default Footer;
