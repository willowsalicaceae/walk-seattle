import React from 'react';
import { Container } from '@mui/material';
import TrailList from '../components/TrailDiscovery/TrailList';
import SearchFilter from '../components/TrailDiscovery/SearchFilter';

const TrailDiscoveryPage = () => {
  return (
    <Container>
      <SearchFilter />
      <TrailList />
    </Container>
  );
};

export default TrailDiscoveryPage;