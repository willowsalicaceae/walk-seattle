import React from 'react';
import { Card, CardContent, CardActions, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const CommunityPostCard = ({ post }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="div">
          {post.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {post.description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button component={RouterLink} to={`/post/${post.id}`} size="small">
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default CommunityPostCard;