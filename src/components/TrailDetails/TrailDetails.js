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
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {trail.name}
      </Typography>
      <TrailInfo trail={trail} />
      <TrailReviews trail={trail} />
      <TransportationOptions trail={trail} />

      <Map center={centroid} zoom={15} width={600} height={400}>
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
  );
};

export default TrailDetails;