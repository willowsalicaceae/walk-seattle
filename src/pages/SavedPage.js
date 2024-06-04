import React, { useState, useEffect } from 'react';
import { Grid, Container, Typography, CircularProgress } from '@mui/material';
import { ref, onValue, get } from 'firebase/database';
import { db } from '../firebase/firebase';
import TrailCard from '../components/TrailDiscovery/TrailCard';
import CommunityPostCard from '../components/Community/CommunityPostCard';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const SavedPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [rsvpEvents, setRsvpEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/signin', { state: { alert: 'Please log in to view your saved items.' } });
      return;
    }

    const fetchData = async () => {
      // Fetch favorited trails
      const favoritesRef = ref(db, `users/${currentUser.uid}/favorites`);
      onValue(favoritesRef, async (snapshot) => {
        const favoritesData = snapshot.val();
        if (favoritesData) {
          const favoriteTrailIds = Object.keys(favoritesData);
          const trailDataPromises = favoriteTrailIds.map((trailId) =>
            get(ref(db, `trails/${trailId}`))
          );
          const trailDataSnapshots = await Promise.all(trailDataPromises);
          const favoriteTrails = trailDataSnapshots.map((snapshot) => ({
            id: snapshot.key,
            ...snapshot.val(),
          }));
          setFavorites(favoriteTrails);
        } else {
          setFavorites([]);
        }
        setLoading(false);
      });

      // Fetch RSVP'd events
      const rsvpsRef = ref(db, `users/${currentUser.uid}/rsvps`);
      onValue(rsvpsRef, async (snapshot) => {
        const rsvpsData = snapshot.val();
        if (rsvpsData) {
          const rsvpEventIds = Object.keys(rsvpsData);
          const eventDataPromises = rsvpEventIds.map((eventId) =>
            get(ref(db, `communityPosts/${eventId}`))
          );
          const eventDataSnapshots = await Promise.all(eventDataPromises);
          const rsvpEvents = eventDataSnapshots.map((snapshot) => ({
            id: snapshot.key,
            ...snapshot.val(),
          }));
          setRsvpEvents(rsvpEvents);
        } else {
          setRsvpEvents([]);
        }
      });
    };

    fetchData();
  }, [currentUser, navigate]);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Saved
      </Typography>
      <Typography variant="h6" gutterBottom>
        Favorite Trails
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {favorites.map((trail) => (
          <Grid item xs={12} sm={6} md={4} key={trail.id}>
            <TrailCard trail={trail} />
          </Grid>
        ))}
      </Grid>
      <Typography variant="h6" gutterBottom>
        RSVP'd Events
      </Typography>
      <Grid container spacing={2}>
        {rsvpEvents.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event.id}>
            <CommunityPostCard post={event} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SavedPage;
