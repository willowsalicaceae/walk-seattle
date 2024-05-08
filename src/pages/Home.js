import React from 'react';
import { Typography, Box, Container } from '@mui/material';

const Home = () => {
  return (
    <Container>
      <Box pb={7}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to WalkSeattle
        </Typography>
        <Typography variant="body1">
          Discover urban hiking trails in Seattle and connect with fellow hikers.
        </Typography>
      </Box>
    </Container>
  );
};

export default Home;