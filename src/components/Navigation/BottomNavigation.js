import React from 'react';
import { BottomNavigation, BottomNavigationAction, Box, Paper } from '@mui/material';
import { Home, Explore, Group, Person } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

const BottomNavigationComponent = () => {
  const location = useLocation();

  return (
    <Box sx={{ pb: 7 }}>
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation value={location.pathname} showLabels>
          <BottomNavigationAction
            label="Home"
            icon={<Home />}
            component={Link}
            to="/"
            value="/"
          />
          <BottomNavigationAction
            label="Discover"
            icon={<Explore />}
            component={Link}
            to="/discover"
            value="/discover"
          />
          <BottomNavigationAction
            label="Community"
            icon={<Group />}
            component={Link}
            to="/community"
            value="/community"
          />
          <BottomNavigationAction
            label="Profile"
            icon={<Person />}
            component={Link}
            to="/profile"
            value="/profile"
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default BottomNavigationComponent;