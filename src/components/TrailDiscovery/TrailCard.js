import React from 'react';
import { Card, CardMedia, CardContent, Typography, CardActions, Button } from '@mui/material';

const TrailCard = ({ trail }) => {
  return (
    <Card>
      <CardMedia
        component="img"
        height="140"
        image={trail.image}
        alt={trail.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {trail.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {trail.description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
};

export default TrailCard;