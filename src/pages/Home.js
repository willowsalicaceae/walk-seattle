import { useEffect, useState } from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { Alert, Typography, Box, Container, Grid, Card, CardContent, CardActionArea, Skeleton } from '@mui/material';
import TrailCard from '../components/TrailDiscovery/TrailCard';
import CommunityPostCard from '../components/Community/CommunityPostCard';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase/firebase';
import getUserLocation from '../utils/location';
import { calculateDistance } from '../utils/distance';

const Home = () => {
  const location = useLocation();
  const [nearbyTrails, setNearbyTrails] = useState([]);
  const [popularTrails, setPopularTrails] = useState([]);
  const [topRatedTrails, setTopRatedTrails] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const cachedLocation = localStorage.getItem('userLocation');
      let userLocation;

      if (cachedLocation) {
        userLocation = JSON.parse(cachedLocation);
      } else {
        userLocation = await getUserLocation();
        localStorage.setItem('userLocation', JSON.stringify(userLocation));
      }

      const cachedTrails = localStorage.getItem('trails');
      let trails;

      if (cachedTrails) {
        trails = JSON.parse(cachedTrails);
      } else {
        const trailsRef = ref(db, 'trails');
        const snapshot = await onValue(trailsRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            trails = Object.entries(data).map(([id, trail]) => ({
              id,
              ...trail,
            }));
            localStorage.setItem('trails', JSON.stringify(trails));
          }
        });
      }

      if (trails) {
        const trailsWithDistance = trails.map((trail) => ({
          ...trail,
          distance: calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            trail.latitude,
            trail.longitude
          ),
        }));

        localStorage.setItem('trails', JSON.stringify(trailsWithDistance));

        const sortedByDistance = [...trailsWithDistance].sort((a, b) => a.distance - b.distance);
        const sortedByPopularity = [...trailsWithDistance].sort((a, b) => b.numReviews - a.numReviews);
        const sortedByRating = [...trailsWithDistance].sort((a, b) => b.rating - a.rating);

        setNearbyTrails(sortedByDistance.slice(0, 4));
        setPopularTrails(sortedByPopularity.slice(0, 4));
        setTopRatedTrails(sortedByRating.slice(0, 4));
      }

      const cachedEvents = localStorage.getItem('communityPosts');
      let events;

      if (cachedEvents) {
        events = JSON.parse(cachedEvents);
      } else {
        const eventsRef = ref(db, 'communityPosts');
        const snapshot = await onValue(eventsRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            events = Object.entries(data).map(([id, post]) => ({
              id,
              ...post,
            }));
            localStorage.setItem('communityPosts', JSON.stringify(events));
          }
        });
      }

      if (events) {
        const filteredEvents = events.filter((post) => post.type === 'event' && new Date(post.date) > new Date());
        const sortedByDate = filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
        setUpcomingEvents(sortedByDate.slice(0, 4));
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <>
      {location.state?.alert && <Alert severity="success">{location.state.alert}</Alert>}
      <Container sx={{ mt: 4, mb: 4 }}>
        <Box pb={7}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome to WalkSeattle
          </Typography>
          <Typography variant="body1">
            Discover urban hiking trails in Seattle and connect with fellow hikers.
          </Typography>
        </Box>

        <Section
          title="Trails near me"
          link="/discover?sort=distance&order=asc"
          trails={nearbyTrails}
          loading={loading}
        />
        <Section
          title="Popular trails"
          link="/discover?sort=numReviews&order=desc"
          trails={popularTrails}
          loading={loading}
        />
        <Section
          title="Top rated trails"
          link="/discover?sort=rating&order=desc"
          trails={topRatedTrails}
          loading={loading}
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

const Section = ({ title, link, trails, events, loading }) => (
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
                  <TrailCard trail={trail} />
                </Grid>
              ))}
              {events && events.map((event) => (
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