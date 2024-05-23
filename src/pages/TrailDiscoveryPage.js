import React, { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import TrailList from '../components/TrailDiscovery/TrailList';
import SearchFilter from '../components/TrailDiscovery/SearchFilter';
import { useLocation } from 'react-router-dom';

const TrailDiscoveryPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || '');
  const [sortOrder, setSortOrder] = useState(searchParams.get('order') || 'desc');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setSortBy(searchParams.get('sort') || '');
    setSortOrder(searchParams.get('order') || 'desc');
  }, [location.search]);

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