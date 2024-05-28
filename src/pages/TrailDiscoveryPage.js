import React, { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import TrailList from '../components/TrailDiscovery/TrailList';
import SearchFilter from '../components/TrailDiscovery/SearchFilter';
import { fetchTrailsData } from '../utils/dataUtils';
import getUserLocation from '../utils/location';

const TrailDiscoveryPage = () => {
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [trails, setTrails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (isMounted) {
        const cachedLocation = localStorage.getItem('userLocation');
        let location;

        if (cachedLocation) {
          location = JSON.parse(cachedLocation);
        } else {
          location = await getUserLocation();
          localStorage.setItem('userLocation', JSON.stringify(location));
        }

        setUserLocation(location);

        const trailsData = await fetchTrailsData(location);
        setTrails(trailsData);
        setLoading(false);
      }
    };

    fetchData();
  }, [isMounted]);

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
        trails={trails}
        loading={loading}
        sortBy={sortBy}
        sortOrder={sortOrder}
        searchQuery={searchQuery}
        userLocation={userLocation}
      />
    </Container>
  );
};

export default TrailDiscoveryPage;