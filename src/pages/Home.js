// src/pages/Home.js

import { useEffect, useState } from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { Alert, Button, Typography, Box, Container, Grid, Card, CardContent, CardActionArea, Skeleton } from '@mui/material';
import TrailCard from '../components/TrailDiscovery/TrailCard';
import CommunityPostCard from '../components/Community/CommunityPostCard';
import getUserLocation from '../utils/location';
import { fetchTrailsData, fetchCommunityPostsData, sortTrailsData } from '../utils/dataUtils';

const Home = () => {
  const location = useLocation();
  const [nearbyTrails, setNearbyTrails] = useState([]);
  const [popularTrails, setPopularTrails] = useState([]);
  const [topRatedTrails, setTopRatedTrails] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationDeclined, setLocationDeclined] = useState(false);
  const [getLocation, setGetLocation] = useState(null);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (isMounted) {
        const cachedLocation = localStorage.getItem('userLocation');
        let userLocation;

        if (cachedLocation) {
          userLocation = JSON.parse(cachedLocation);
        } else {
          const result = await getUserLocation();
          if (result && result.getLocation) {
            setGetLocation(() => result.getLocation);
          } else if (result && result.declined) {
            setLocationDeclined(true);
          } else {
            setUserLocation(null);
          }
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
  }, [isMounted]);

  const handleGetLocation = () => {
    if (getLocation) {
      getLocation();
    }
  };

  return (
    <>
      {location.state?.alert && <Alert severity="success">{location.state.alert}</Alert>}
      {locationDeclined && (
        <Button variant="contained" color="primary" onClick={handleGetLocation}>
          Enable Location
        </Button>
      )}
      <Container sx={{ mt: 4, mb: 2 }}>
        <Box pb={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome to WalkSeattle!
          </Typography>
          <Typography variant="body1">
            Discover urban hiking trails in Seattle and connect with fellow hikers.
          </Typography>
        </Box>

        {!locationDeclined && (
          <Section
            title="Trails near me"
            link="/discover?sort=distance&order=asc"
            trails={nearbyTrails}
            loading={loading}
            userLocation={userLocation}
            locationDeclined={locationDeclined}
          />
        )}
        <Section
          title="Popular trails"
          link="/discover?sort=numReviews&order=desc"
          trails={popularTrails}
          loading={loading}
          userLocation={userLocation}
          locationDeclined={locationDeclined}
        />
        <Section
          title="Top rated trails"
          link="/discover?sort=rating&order=desc"
          trails={topRatedTrails}
          loading={loading}
          userLocation={userLocation}
          locationDeclined={locationDeclined}
        />
        <Section
          title="Upcoming events"
          link="/community"
          events={upcomingEvents}
          loading={loading}
        />
      </Container>
    </>
  );
};

const Section = ({ title, link, trails, events, loading, userLocation, locationDeclined }) => (
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
              {trails &&
                trails.map((trail) => (
                  <Grid item key={trail.id}>
                    <TrailCard
                      trail={trail}
                      userLocation={locationDeclined ? null : userLocation}
                    />
                  </Grid>
                ))}
              {events &&
                events.map((event) => (
                  <Grid item key={event.id}>
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