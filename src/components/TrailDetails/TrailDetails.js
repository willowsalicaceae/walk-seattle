// src/components/TrailDetails/TrailDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box, Container, Card, CardMedia, CardContent, Rating, Chip } from '@mui/material';
import { Map, GeoJson } from 'pigeon-maps';
import { ref, onValue } from 'firebase/database';
import { db } from '../../firebase/firebase';
import TrailInfo from './TrailInfo';
import TrailReviews from './TrailReviews';
import TransportationOptions from './TransportationOptions';

const calculateCentroid = (coordinates) => {
  let sumLat = 0;
  let sumLng = 0;
  let count = 0;

  coordinates.forEach((lineString) => {
    lineString.forEach((coord) => {
      sumLat += coord[1];
      sumLng += coord[0];
      count++;
    });
  });

  const avgLat = sumLat / count;
  const avgLng = sumLng / count;

  return [avgLat, avgLng];
};

const TrailDetails = () => {
  const { id } = useParams();
  const [trail, setTrail] = useState(null);
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [centroid, setCentroid] = useState(null);

  useEffect(() => {
    const fetchTrail = () => {
      const trailRef = ref(db, `trails/${id}`);
      onValue(trailRef, (snapshot) => {
        const trailData = snapshot.val();
        setTrail(trailData);
      });
    };

    const fetchTrailTrack = () => {
      const trackRef = ref(db, `trailTracks/${id}`);
      onValue(trackRef, (snapshot) => {
        const trackData = snapshot.val();
        setGeoJsonData(trackData);

        if (trackData && trackData.features && trackData.features.length > 0) {
          const coordinates = trackData.features[0].geometry.coordinates;
          const centroid = calculateCentroid(coordinates);
          setCentroid(centroid);
        }
      });
    };

    fetchTrail();
    fetchTrailTrack();
  }, [id]);

  if (!trail || !centroid) {
    return <div>Loading...</div>;
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
        <Typography variant="h5">{trail.name}</Typography>
          <Box display="flex" alignItems="center" mb={1}>
            <Typography variant="body2" color="text.secondary">
              {trail.length} miles
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Rating value={trail.rating} precision={0.5} readOnly />
            <Typography variant="body2" color="text.secondary" ml={1}>
              ({trail.numReviews} reviews)
            </Typography>
            <Chip
              label={trail.difficulty}
              color={getDifficultyColor(trail.difficulty)}
              size="small"
            />
          </Box>
          <TrailInfo trail={trail} />
          <TrailReviews trail={trail} />
          <TransportationOptions trail={trail} />
        </CardContent>
      </Card>

      <Box mt={4}>
        <Map center={centroid} zoom={15} width="100%" height={400}>
          {geoJsonData && (
            <GeoJson
              data={geoJsonData}
              styleCallback={(feature, hover) => {
                if (feature.geometry.type === 'LineString') {
                  return { strokeWidth: '40', stroke: '#FF0000' };
                }
                return {
                  strokeWidth: "5",
                  stroke: "red",
                };
              }}
            />
          )}
        </Map>
      </Box>
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