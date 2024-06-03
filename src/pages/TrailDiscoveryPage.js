import React, { useState, useEffect } from 'react';
import { Container, Box } from '@mui/material';
import TrailList from '../components/TrailDiscovery/TrailList';
import SearchFilter from '../components/TrailDiscovery/SearchFilter';
import { fetchTrailsData } from '../utils/dataUtils';
import getUserLocation from '../utils/location';
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import ShareLocationIcon from '@mui/icons-material/ShareLocation';

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
  const [locationDenied, setLocationDenied] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (isMounted) {
        const cachedLocation = localStorage.getItem('userLocation');
        const deniedLocation = localStorage.getItem('locationDenied');

        if (cachedLocation) {
          setUserLocation(JSON.parse(cachedLocation));
        } else if (deniedLocation) {
          setLocationDenied(true);
        }

        const trailsData = await fetchTrailsData(userLocation);
        setTrails(trailsData);
        setLoading(false);
      }
    };

    fetchData();
  }, [isMounted, sortBy, sortOrder, userLocation]);

  const handleGetLocation = async () => {
    try {
      setLocationLoading(true);
      const location = await getUserLocation();
      if (location) {
        setUserLocation(location);
        localStorage.setItem('userLocation', JSON.stringify(location));
        localStorage.removeItem('locationDenied');
        setLocationDenied(false);
      }
    } catch (error) {
      console.log('Error getting location:', error);
    } finally {
      setLocationLoading(false);
    }
  };

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
      {locationDenied && (
        <Box mt={2}>
          <LoadingButton
            onClick={handleGetLocation}
            color="primary"
            variant="contained"
            loadingPosition="start"
            startIcon={<ShareLocationIcon />}
            loading={locationLoading}
          >
            Share my location
          </LoadingButton>
        </Box>
      )}
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