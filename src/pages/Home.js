import React from 'react';
import { Typography, Box } from '@mui/material';

const Home = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to WalkSeattle
      </Typography>
      <Typography variant="body1">
        Discover urban hiking trails in Seattle and connect with fellow hikers.
      </Typography>
      {/* Add more content or components for the home page */}
    </Box>
  );
};

export default Home;