import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  CardActionArea,
  Button,
  Rating,
  Chip,
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
        <CardMedia component="img" height="140" image={trail.image} alt={trail.name} />
        <CardContent>
          <Typography gutterBottom variant="h5">
            {trail.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Length: {trail.length} miles
          </Typography>
          <Chip label={trail.difficulty} color="success"/>
          <Rating value={trail.rating} precision={0.5} readOnly />
          <Typography variant="body2" color="text.secondary">
            ({trail.numReviews} reviews)
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <FavoriteButton trailId={trail.id}/>
      </CardActions>
    </Card>
  );
};

export default TrailCard;