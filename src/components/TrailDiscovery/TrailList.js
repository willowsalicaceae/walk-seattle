import React from 'react';
import { Grid, Skeleton } from '@mui/material';
import TrailCard from './TrailCard';
import { sortTrailsData } from '../../utils/dataUtils';

const TrailList = ({ trails, loading, sortBy, sortOrder, searchQuery }) => {
  const filteredTrails = trails.filter((trail) =>
    trail.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedTrails = sortTrailsData(filteredTrails, sortBy, sortOrder);

  return (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      {loading ? (
        Array.from(new Array(6)).map((_, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Skeleton variant="rectangular" height={200} />
            <Skeleton variant="text" />
            <Skeleton variant="text" width="60%" />
          </Grid>
        ))
      ) : (
        sortedTrails.map((trail) => (
          <Grid item xs={12} sm={6} md={4} key={trail.id}>
            <TrailCard trail={trail} />
          </Grid>
        ))
      )}
    </Grid>
  );
};

export default TrailList;