import React from 'react';
import { Typography, Box } from '@mui/material';

const TrailInfo = ({ trail }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Description
      </Typography>
      <Typography variant="body1">{trail.description}</Typography>
      <Typography variant="h6" gutterBottom>
        Difficulty
      </Typography>
      <Typography variant="body1">{trail.difficulty}</Typography>
      {/* Add more trail information */}
    </Box>
  );
};

export default TrailInfo;