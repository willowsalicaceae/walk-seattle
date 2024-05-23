import React, { useEffect, useState } from 'react';
import { Grid, Skeleton } from '@mui/material';
import { ref, onValue } from 'firebase/database';
import { db } from '../../firebase/firebase';
import TrailCard from './TrailCard';
import getUserLocation from '../../utils/location';
import { calculateDistance } from '../../utils/distance';

const TrailList = ({ sortBy, sortOrder, searchQuery, onSortChange, onSortOrderChange }) => {
  const [trails, setTrails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const cachedLocation = localStorage.getItem('userLocation');
        if (cachedLocation) {
          const location = JSON.parse(cachedLocation);
          setUserLocation(location);
          if (sortBy === '') {
            onSortChange('distance');
            onSortOrderChange('asc');
          }
        } else {
          const location = await getUserLocation();
          setUserLocation(location);
          localStorage.setItem('userLocation', JSON.stringify(location));
          if (sortBy === '') {
            onSortChange('distance');
            onSortOrderChange('asc');
          }
        }
      } catch (error) {
        console.error('Error fetching user location:', error);
      }
    };

    fetchUserLocation();
  }, [onSortChange, onSortOrderChange, sortBy]);

  useEffect(() => {
    const fetchTrails = () => {
      const cachedTrails = localStorage.getItem('trails');
      if (cachedTrails) {
        const parsedTrails = JSON.parse(cachedTrails);
        setTrails(parsedTrails);
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

  useEffect(() => {
    if (sortBy) {
      onSortChange(sortBy);
    }
    if (sortOrder) {
      onSortOrderChange(sortOrder);
    }
  }, [sortBy, sortOrder, onSortChange, onSortOrderChange]);

  const sortTrails = (a, b) => {
    const multiplier = sortOrder === 'asc' ? 1 : -1;

    if (sortBy === 'distance' && userLocation) {
      const distanceA = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        a.latitude,
        a.longitude
      );
      const distanceB = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        b.latitude,
        b.longitude
      );
      return multiplier * (distanceA - distanceB);
    } else if (sortBy === 'numReviews') {
      return multiplier * (a.numReviews - b.numReviews);
    } else if (sortBy === 'rating') {
      return multiplier * (a.rating - b.rating);
    } else if (sortBy === 'difficulty') {
      const difficultyOrder = ['Easy', 'Moderate', 'Hard'];
      return multiplier * (difficultyOrder.indexOf(a.difficulty) - difficultyOrder.indexOf(b.difficulty));
    } else if (sortBy === 'length') {
      return multiplier * (a.length - b.length);
    }
    // Default sorting by number of reviews (high to low)
    return b.numReviews - a.numReviews;
  };

  const filteredTrails = trails.filter((trail) =>
    trail.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedTrails = filteredTrails.sort(sortTrails);

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
            <TrailCard trail={trail} userLocation={userLocation} />
          </Grid>
        ))
      )}
    </Grid>
  );
};

export default TrailList;