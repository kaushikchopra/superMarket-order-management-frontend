// NotFoundPage.js
import React from 'react';
import { Typography, Container, Box } from '@mui/material';

const NotFoundPage = () => {
  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <Typography variant="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h5" component="div" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="textSecondary">
          The requested page could not be found.
        </Typography>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
