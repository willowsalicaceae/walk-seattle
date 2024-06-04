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
  CardActions
} from '@mui/material';
import FavoriteButton from '../FavoriteButton';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { calculateDistance } from '../../utils/distance';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import DirectionsIcon from '@mui/icons-material/Directions';

const Link = styled(RouterLink)({
  textDecoration: 'none',
});

const TrailCard = ({ trail, userLocation }) => {
  const difficultyColor = {
    easy: 'success',
    moderate: 'info',
    hard: 'warning',
  };

  const difficulty = trail.difficulty ? trail.difficulty.toLowerCase() : 'unknown';

  const distance = userLocation && trail && trail.latitude && trail.longitude
    ? calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        trail.latitude,
        trail.longitude
      ).toFixed(1)
    : null;

  // Ensure rating is a number
  const ratingValue = Number(trail.rating);

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <CardActionArea component={Link} to={`/trail/${trail.id}`} sx={{ flexGrow: 1 }}>
        <CardMedia
          component="img"
          height="200"
          image={trail.image}
          alt={trail.name}
        />
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: '2',
              WebkitBoxOrient: 'vertical',
            }}
          >
            {trail.name}
          </Typography>
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="body2" color="text.secondary">
                <DirectionsWalkIcon sx={{ fontSize: 14, mr: 0.5 }}/>
                {trail.length} miles long
              </Typography>
              {distance && (
                <Typography variant="body2" color="text.secondary">
                  <DirectionsIcon sx={{ fontSize: 14, mr: 0.5 }}/>
                  {distance} miles away
                </Typography>
              )}
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Rating value={ratingValue} precision={0.5} readOnly />
              <Typography variant="body2" color="text.secondary" ml={1}>
                ({trail.numReviews} reviews)
              </Typography>
              <Chip
                label={difficulty}
                color={difficultyColor[difficulty] || 'default'}
                size="small"
              />
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <FavoriteButton trailId={trail.id} />
      </CardActions>
    </Card>
  );
};

export default TrailCard;
