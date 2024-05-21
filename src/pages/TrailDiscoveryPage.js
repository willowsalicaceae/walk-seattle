import React, { useState } from 'react';
import { Container } from '@mui/material';
import TrailList from '../components/TrailDiscovery/TrailList';
import SearchFilter from '../components/TrailDiscovery/SearchFilter';

const TrailDiscoveryPage = () => {
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const handleSortOrderChange = (value) => {
    setSortOrder(value);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <SearchFilter
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        onSortOrderChange={handleSortOrderChange}
        onSearch={handleSearch}
      />
      <TrailList
        sortBy={sortBy}
        sortOrder={sortOrder}
        searchQuery={searchQuery}
        onSortChange={handleSortChange}
        onSortOrderChange={handleSortOrderChange}
      />
    </Container>
  );
};

export default TrailDiscoveryPage;