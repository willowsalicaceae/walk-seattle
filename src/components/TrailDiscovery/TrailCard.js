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

const Link = styled(RouterLink)({
  textDecoration: 'none',
});

const TrailCard = ({ trail }) => {
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
            <Chip label={trail.difficulty} color="primary" size="small" />

          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default TrailCard;