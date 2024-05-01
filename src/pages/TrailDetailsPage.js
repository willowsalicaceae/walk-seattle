import React from 'react';
import { Container } from '@mui/material';
import TrailDetails from '../components/TrailDetails/TrailDetails';

const TrailDetailsPage = ({ trail }) => {
  return (
    <Container>
      <TrailDetails trail={trail} />
    </Container>
  );
};

export default TrailDetailsPage;