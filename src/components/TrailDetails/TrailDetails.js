// src/components/TrailDetails/TrailDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box } from '@mui/material';
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
      });
    };

    fetchTrail();
    fetchTrailTrack();
  }, [id]);

  if (!trail) {
    return <div>Loading...</div>;
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {trail.name}
      </Typography>
      <TrailInfo trail={trail} />
      <TrailReviews trail={trail} />
      <TransportationOptions trail={trail} />

      <Map center={[trail.latitude, trail.longitude]} zoom={12} width={600} height={400}>
        {geoJsonData && (
          <GeoJson
            data={geoJsonData}
            styleCallback={(feature, hover) => {
              if (feature.geometry.type === 'LineString') {
                return { strokeWidth: '4', stroke: '#FF0000' };
              }
              return {};
            }}
          />
        )}
      </Map>
    </Box>
  );
};

export default TrailDetails;