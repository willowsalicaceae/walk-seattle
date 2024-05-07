import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Rating,
} from '@mui/material';

const TrailCard = ({ trail }) => {
  return (
    <Card>
      <CardMedia component="img" height="140" image={trail.image} alt={trail.name} />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {trail.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {trail.description}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Length: {trail.length} miles
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Difficulty: {trail.difficulty}
        </Typography>
        <Rating value={trail.rating} precision={0.5} readOnly />
        <Typography variant="body2" color="text.secondary">
          ({trail.numReviews} reviews)
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
};

export default TrailCard;