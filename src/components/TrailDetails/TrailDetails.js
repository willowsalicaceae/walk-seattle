// src/components/TrailDetails/TrailDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Typography, Box, Container, Card, CardMedia, CardContent, Rating, Chip } from '@mui/material';
import { Map, GeoJson } from 'pigeon-maps';
import { ref, onValue } from 'firebase/database';
import { db } from '../../firebase/firebase';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import DirectionsIcon from '@mui/icons-material/Directions';
import { calculateDistance } from '../../utils/distance';
import { getUserLocation } from '../../utils/location';
import FavoriteButton from '../FavoriteButton';
import CircularProgress from '@mui/material/CircularProgress';

const TrailDetails = () => {
  const { id } = useParams();
  const [trail, setTrail] = useState(null);
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [bbox, setBbox] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const cachedLocation = localStorage.getItem('userLocation');
      const deniedLocation = localStorage.getItem('locationDenied');

      if (cachedLocation) {
        setUserLocation(JSON.parse(cachedLocation));
      } else if (!deniedLocation) {
        const location = await getUserLocation();
        if (location) {
          setUserLocation(location);
          localStorage.setItem('userLocation', JSON.stringify(location));
        } else {
          localStorage.setItem('locationDenied', 'true');
        }
      }

      const fetchTrail = () => {
        const trailRef = ref(db, `trails/${id}`);
        onValue(trailRef, (snapshot) => {
          const trailData = snapshot.val();
          setTrail(trailData);
          setLoading(false);
        });
      };

      const fetchTrailTrack = () => {
        const trackRef = ref(db, `trailTracks/${id}`);
        onValue(trackRef, (snapshot) => {
          const trackData = snapshot.val();
          setGeoJsonData(trackData);

          if (trackData && trackData.geometry) {
            const bbox = trackData.geometry.bbox;
            setBbox(bbox);
          }
        });
      };

      fetchTrail();
      fetchTrailTrack();
    };

    fetchData();
  }, [id]);

  const distance = userLocation && trail
    ? calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        trail.latitude,
        trail.longitude
      ).toFixed(1)
    : null;

  const openGoogleMaps = () => {
    if (trail && trail.latitude && trail.longitude) {
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${trail.latitude},${trail.longitude}`;
      window.open(mapsUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container>
      <Card>
        <CardMedia
          component="img"
          height="300"
          image={trail.image}
          alt={trail.name}
        />
        <CardContent>
          <Typography variant="h4">{trail.name}</Typography>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="body1" color="text.secondary">
              <DirectionsWalkIcon sx={{ fontSize: 14, mr: 0.5 }}/>
              {trail.length} miles long
            </Typography>
            {distance && (
              <Typography variant="body1" color="text.secondary">
                <DirectionsIcon sx={{ fontSize: 14, mr: 0.5 }}/>
                {distance} miles away
              </Typography>
            )}
            <Button variant="text" color="primary" onClick={openGoogleMaps} sx={{ ml: 1 }}>
              Get Directions
            </Button>
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex">
              <Rating value={trail.rating} precision={0.5} readOnly />
              <Typography variant="body2" color="text.secondary" ml={1}>
                ({trail.numReviews} reviews)
              </Typography>
            </Box>
            <Chip
              label={trail.difficulty}
              color={getDifficultyColor(trail.difficulty)}
              size="small"
            />
          </Box>
          <FavoriteButton trailId={id} />
          <Typography variant="h6" gutterBottom>
            Description
          </Typography>
          <Typography variant="body1">{trail.description}</Typography>
          <Box mt={4}>
            {bbox && geoJsonData && (
              <Map
                center={[(bbox[1] + bbox[3]) / 2, (bbox[0] + bbox[2]) / 2]}
                zoom={15}
                width="100%"
                height={400}
              >
                {geoJsonData && (
                  <GeoJson
                    data={{
                      type: 'FeatureCollection',
                      features: [
                        {
                          type: 'Feature',
                          geometry: geoJsonData.geometry,
                          properties: geoJsonData.properties,
                        },
                      ],
                    }}
                    styleCallback={(feature, hover) => ({
                      stroke: 'green',
                      strokeWidth: 5,
                      fill: 'none',
                      r: feature.geometry.type === 'Point' ? 8 : undefined,
                      fillOpacity: feature.geometry.type === 'Point' ? 1 : undefined,
                    })}
                  />
                )}
              </Map>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

const getDifficultyColor = (difficulty) => {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 'success';
    case 'moderate':
      return 'info';
    case 'hard':
      return 'warning';
    default:
      return 'default';
  }
};

export default TrailDetails;