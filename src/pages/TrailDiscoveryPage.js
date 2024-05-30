import React, { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import TrailList from '../components/TrailDiscovery/TrailList';
import SearchFilter from '../components/TrailDiscovery/SearchFilter';
import { fetchTrailsData } from '../utils/dataUtils';
import getUserLocation from '../utils/location';
import { useLocation, useNavigate } from 'react-router-dom';

const TrailDiscoveryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || '');
  const [sortOrder, setSortOrder] = useState(searchParams.get('order') || 'desc');
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
  }, [isMounted, sortBy, sortOrder]);

  const handleSortChange = (value) => {
    setSortBy(value);
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.set('sort', value);
    navigate(`${location.pathname}?${newSearchParams.toString()}`);
  };

  const handleSortOrderChange = (value) => {
    setSortOrder(value);
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.set('order', value);
    navigate(`${location.pathname}?${newSearchParams.toString()}`);
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