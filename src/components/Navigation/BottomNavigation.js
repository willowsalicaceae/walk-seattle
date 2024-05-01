import React from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Home, Explore, Group, Person } from '@mui/icons-material';

const BottomNavigationComponent = () => {
  const [value, setValue] = React.useState(0);

  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      showLabels
    >
      <BottomNavigationAction label="Home" icon={<Home />} />
      <BottomNavigationAction label="Discover" icon={<Explore />} />
      <BottomNavigationAction label="Community" icon={<Group />} />
      <BottomNavigationAction label="Profile" icon={<Person />} />
    </BottomNavigation>
  );
};

export default BottomNavigationComponent;