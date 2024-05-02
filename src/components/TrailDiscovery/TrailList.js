import React from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import { Favorite, Share } from '@mui/icons-material';

const TrailList = () => {
  const trails = [
    { id: 1, name: 'Trail 1', description: 'Description of Trail 1' },
    { id: 2, name: 'Trail 2', description: 'Description of Trail 2' },
    { id: 3, name: 'Trail 3', description: 'Description of Trail 3' },
    { id: 4, name: 'Discovery Park', description: 'Cool trail'},
  ];

  return (
    <List>
      {trails.map((trail) => (
        <ListItem key={trail.id}>
          <ListItemText primary={trail.name} secondary={trail.description} />
          <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="favorite">
              <Favorite />
            </IconButton>
            <IconButton edge="end" aria-label="share">
              <Share />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};

export default TrailList;