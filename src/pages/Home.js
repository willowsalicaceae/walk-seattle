import React, { useEffect, useState } from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Alert, Typography, Box, Container, Grid, Card, CardContent, CardActionArea, Skeleton, Button } from '@mui/material';
import TrailCard from '../components/TrailDiscovery/TrailCard';
import CommunityPostCard from '../components/Community/CommunityPostCard';
import { getUserLocation } from '../utils/location';
import { fetchTrailsData, fetchCommunityPostsData, sortTrailsData } from '../utils/dataUtils';
import LoadingButton from '@mui/lab/LoadingButton';
import ShareLocationIcon from '@mui/icons-material/ShareLocation';

const Home = () => {
  const location = useLocation();
  const [nearbyTrails, setNearbyTrails] = useState([]);
  const [popularTrails, setPopularTrails] = useState([]);
  const [topRatedTrails, setTopRatedTrails] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationDenied, setLocationDenied] = useState(false);

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
        } else {
          setLocationDialogOpen(true);
        }

        const trails = await fetchTrailsData(userLocation);
        const posts = await fetchCommunityPostsData();

        const sortedByDistance = sortTrailsData(trails, 'distance', 'asc');
        const sortedByPopularity = sortTrailsData(trails, 'numReviews', 'desc');
        const sortedByRating = sortTrailsData(trails, 'rating', 'desc');

        setNearbyTrails(sortedByDistance.slice(0, 10));
        setPopularTrails(sortedByPopularity.slice(0, 10));
        setTopRatedTrails(sortedByRating.slice(0, 10));

        const filteredEvents = posts.filter((post) => post.type === 'event' && new Date(post.date) > new Date());
        const sortedByDate = filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
        setUpcomingEvents(sortedByDate.slice(0, 10));

        setLoading(false);
      }
    };

    fetchData();
  }, [isMounted, userLocation]);

  const handleGetLocation = async () => {
    try {
      setLocationLoading(true);
      const location = await getUserLocation();
      if (location) {
        setUserLocation(location);
        localStorage.setItem('userLocation', JSON.stringify(location));
        localStorage.removeItem('locationDenied');
        setLocationDenied(false);
        setLocationError(''); // Clear any previous error
      }
      setLocationDialogOpen(false);
    } catch (error) {
      console.log('Error getting location:', error);
      setLocationError(`Failed to get location: ${error.message}`);
    } finally {
      setLocationLoading(false);
    }
  };

  const handleLocationDenied = () => {
    setLocationDialogOpen(false);
    setLocationDenied(true);
    localStorage.setItem('locationDenied', 'true');
  };


  return (
    <>
      {location.state?.alert && <Alert severity="success">{location.state.alert}</Alert>}
      {locationError && <Alert severity="error">{locationError}</Alert>}
      <Container sx={{ mt: 4, mb: 2 }}>
        <Box pb={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome to WalkSeattle!
          </Typography>
          <Typography variant="body1">
            Discover urban hiking trails in Seattle and connect with fellow hikers.
          </Typography>
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
        </Box>
        <Section
          title="Upcoming events"
          link="/community"
          events={upcomingEvents}
          loading={loading}
        />
        <Section
          title="Trails near me"
          link="/discover?sort=distance&order=asc"
          trails={nearbyTrails}
          loading={loading}
          userLocation={userLocation}
        />
        <Section
          title="Popular trails"
          link="/discover?sort=numReviews&order=desc"
          trails={popularTrails}
          loading={loading}
          userLocation={userLocation}
        />
        <Section
          title="Top rated trails"
          link="/discover?sort=rating&order=desc"
          trails={topRatedTrails}
          loading={loading}
          userLocation={userLocation}
        />
      </Container>
      <Dialog open={locationDialogOpen} onClose={handleLocationDenied}>
        <DialogTitle>WalkSeattle works better with your location</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enable your location to view nearby trails.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLocationDenied} color="primary">
            No thanks
          </Button>
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
        </DialogActions>
      </Dialog>
    </>
  );
};

const Section = ({ title, link, trails, events, loading, userLocation }) => (
  <Box mb={4}>
    <Card>
      <CardActionArea component={RouterLink} to={link}>
        <CardContent>
          <Typography variant="h5" component="div">
            {title}
          </Typography>
        </CardContent>
      </CardActionArea>
      <Box sx={{ overflowX: 'auto', pb: 2 }}>
        <Grid container spacing={2} sx={{ pl: 2, flexWrap: 'nowrap' }}>
          {loading ? (
            Array.from(new Array(4)).map((_, index) => (
              <Grid item key={index}>
                <Skeleton variant="rectangular" width={210} height={118} />
                <Skeleton variant="text" />
                <Skeleton variant="text" width="60%" />
              </Grid>
            ))
          ) : (
            <>
              {trails && trails.map((trail) => (
                <Grid item key={trail.id}>
                  <TrailCard trail={trail} userLocation={userLocation} />
                </Grid>
              ))}
              {events && events.map((event) => (
                <Grid item key={event.id} sx={{ minWidth: 300 }}>
                  <CommunityPostCard post={event} />
                </Grid>
              ))}
            </>
          )}
        </Grid>
      </Box>
    </Card>
  </Box>
);

export default Home;