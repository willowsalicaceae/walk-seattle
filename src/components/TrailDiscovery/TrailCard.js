import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActionArea,
  Rating,
  Chip,
  Box,
} from '@mui/material';
import FavoriteButton from '../FavoriteButton';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { calculateDistance } from '../../utils/distance';

const Link = styled(RouterLink)({
  textDecoration: 'none',
});

const TrailCard = ({ trail, userLocation }) => {
  const difficultyColor = {
    easy: 'success',
    moderate: 'info',
    hard: 'warning',
  };

  const distance = userLocation
    ? calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        trail.latitude,
        trail.longitude
      ).toFixed(1)
    : null;

  return (
    <Card>
      <CardActionArea component={Link} to={`/trail/${trail.id}`}>
        <CardMedia component="img" height="200" image={trail.image} alt={trail.name} />
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography gutterBottom variant="h5" component="div">
              {trail.name}
            </Typography>
            <FavoriteButton trailId={trail.id} />
          </Box>
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
              color={difficultyColor[trail.difficulty.toLowerCase()]}
              size="small"
            />
          </Box>
          {distance && (
          <Typography variant="body2" color="text.secondary" mt={1}>
            Distance: {distance} miles
          </Typography>
        )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default TrailCard;