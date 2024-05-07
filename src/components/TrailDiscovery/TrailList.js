import React from 'react';
import { Grid } from '@mui/material';
import TrailCard from './TrailCard';

const TrailList = () => {
  const trails = [
    {
      id: 1,
      name: 'Trail 1',
      description: 'Description of Trail 1',
      rating: 4.5,
      numReviews: 10,
      length: 3.2,
      difficulty: 'Easy',
      image: 'path/to/trail1-image.jpg',
    },
    // Add more trail objects here...
  ];

  return (
    <Grid container spacing={2}>
      {trails.map((trail) => (
        <Grid item xs={12} sm={6} md={4} key={trail.id}>
          <TrailCard trail={trail} />
        </Grid>
      ))}
    </Grid>
  );
};

export default TrailList;