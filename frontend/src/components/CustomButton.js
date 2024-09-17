import React from 'react';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

const CustomButton = ({
  to,
  label,
  color = 'inherit',
  variant,
  sx = {},
  onClick,
  fullWidth,
  type,
}) => {
  return (
    <Button
      color={color}
      component={Link}
      to={to}
      sx={sx}
      onClick={onClick}
      variant={variant}
      fullWidth={fullWidth}
      type={type}>
      {label}
    </Button>
  );
};

export default CustomButton;
