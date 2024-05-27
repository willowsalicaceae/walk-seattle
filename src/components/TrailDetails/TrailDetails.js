import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box, Container, Card, CardMedia, CardContent, Rating, Chip } from '@mui/material';
import { Map, GeoJson } from 'pigeon-maps';
import { ref, onValue } from 'firebase/database';
import { db } from '../../firebase/firebase';
import TrailInfo from './TrailInfo';
import TrailReviews from './TrailReviews';
import TransportationOptions from './TransportationOptions';

const TrailDetails = () => {
  const { id } = useParams();
  const [trail, setTrail] = useState(null);
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [bbox, setBbox] = useState(null);

  useEffect(() => {
    const fetchTrail = () => {
      const trailRef = ref(db, `trails/${id}`);
      onValue(trailRef, (snapshot) => {
        const trailData = snapshot.val();
        console.log('Trail data:', trailData);
        setTrail(trailData);
      });
    };

    const fetchTrailTrack = () => {
      const trackRef = ref(db, `trailTracks/${id}`);
      onValue(trackRef, (snapshot) => {
        const trackData = snapshot.val();
        console.log('Track data:', trackData);
        setGeoJsonData(trackData);

        if (trackData && trackData.geometry) {
          console.log('Geometry:', trackData.geometry.bbox);
          const bbox = trackData.geometry.bbox;
          console.log('Bounding box:', bbox);
          setBbox(bbox);
        } else {
          console.log('Track data does not have the expected structure');
        }
      });
    };

    console.log('Fetching trail data for ID:', id);
    fetchTrail();
    console.log('Fetching trail track data for ID:', id);
    fetchTrailTrack();
  }, [id]);

  console.log('Trail:', trail);
  console.log('Bounding box:', bbox);

  if (!trail || !bbox) {
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
  {bbox && geoJsonData && (
    <Map
      center={[(bbox[1] + bbox[3]) / 2, (bbox[0] + bbox[2]) / 2]}
      zoom={12}
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