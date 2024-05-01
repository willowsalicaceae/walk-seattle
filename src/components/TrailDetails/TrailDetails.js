import React from 'react';
import { Typography, Box } from '@mui/material';
import TrailInfo from './TrailInfo';
import TrailReviews from './TrailReviews';
import TransportationOptions from './TransportationOptions';

const TrailDetails = ({ trail }) => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {trail.name}
      </Typography>
      <TrailInfo trail={trail} />
      <TrailReviews trail={trail} />
      <TransportationOptions trail={trail} />
    </Box>
  );
};

export default TrailDetails;