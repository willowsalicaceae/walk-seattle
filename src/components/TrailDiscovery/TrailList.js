import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { ref, onValue } from 'firebase/database';
import { db } from '../../firebase/firebase';
import TrailCard from './TrailCard';

const TrailList = () => {
  const [trails, setTrails] = useState([]);

  useEffect(() => {
    const fetchTrails = () => {
      const trailsRef = ref(db, 'trails');
      onValue(trailsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const trailsData = Object.entries(data).map(([id, trail]) => ({
            id,
            ...trail,
          }));
          setTrails(trailsData);
        }
      });
    };

    fetchTrails();
  }, []);

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