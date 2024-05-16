import React, { useEffect, useState } from 'react';
import { Grid, Skeleton } from '@mui/material';
import { ref, onValue } from 'firebase/database';
import { db } from '../../firebase/firebase';
import TrailCard from './TrailCard';

const TrailList = ({ sortBy, sortOrder }) => {
  const [trails, setTrails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrails = () => {
      const cachedTrails = localStorage.getItem('trails');
      if (cachedTrails) {
        setTrails(JSON.parse(cachedTrails));
        setLoading(false);
      } else {
        const trailsRef = ref(db, 'trails');
        onValue(trailsRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const trailsData = Object.entries(data).map(([id, trail]) => ({
              id,
              ...trail,
            }));
            setTrails(trailsData);
            localStorage.setItem('trails', JSON.stringify(trailsData));
          }
          setLoading(false);
        });
      }
    };

    fetchTrails();
  }, []);

  const sortTrails = (a, b) => {
    const multiplier = sortOrder === 'asc' ? 1 : -1;

    if (sortBy === 'numReviews') {
      return multiplier * (a.numReviews - b.numReviews);
    } else if (sortBy === 'rating') {
      return multiplier * (a.rating - b.rating);
    } else if (sortBy === 'difficulty') {
      return multiplier * a.difficulty.localeCompare(b.difficulty);
    } else if (sortBy === 'length') {
      return multiplier * (a.length - b.length);
    }
    return 0;
  };

  const sortedTrails = trails.sort(sortTrails);

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