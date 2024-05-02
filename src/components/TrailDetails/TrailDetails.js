import React, { useEffect, useState } from 'react';
import { Typography, Box } from '@mui/material';
import TrailInfo from './TrailInfo';
import TrailReviews from './TrailReviews';
import TransportationOptions from './TransportationOptions';
import axios from 'axios';

const TrailDetails = ({ trail }) => {
  const [transitOptions, setTransitOptions] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const fetchTransitOptions = async () => {
      if (!userLocation) return;

      try {
        const response = await axios.get('/otp/plan', {
          params: {
            fromPlace: `${userLocation.latitude},${userLocation.longitude}`,
            toPlace: `${trail.latitude},${trail.longitude}`,
            mode: 'TRANSIT,WALK',
            // Add other necessary parameters
          },
        });

        setTransitOptions(response.data);
      } catch (error) {
        console.error('Error fetching transit options:', error);
      }
    };

    if (userLocation) {
      fetchTransitOptions();
    }
  }, [trail, userLocation]);

  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ latitude, longitude });
          },
          (error) => {
            console.error('Error getting user location:', error);
            // Handle the case when user denies location permission or if there's an error
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
        // Handle the case when the browser doesn't support geolocation
      }
    };

    getUserLocation();
  }, []);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {trail.name}
      </Typography>
      <TrailInfo trail={trail} />
      <TrailReviews trail={trail} />
      <TransportationOptions transitOptions={transitOptions} />
    </Box>
  );
};

export default TrailDetails;