import React from 'react';
import { Container } from '@mui/material';
import TrailDetails from '../components/TrailDetails/TrailDetails';

const TrailDetailsPage = ({ trail, userLocation }) => {
  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <TrailDetails trail={trail} userLocation={userLocation} />
    </Container>
  );
};

export default TrailDetailsPage;