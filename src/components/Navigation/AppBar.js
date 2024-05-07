import React from 'react';
import { AppBar, Toolbar, Avatar } from '@mui/material';
import { ReactComponent as Logo } from '../../img/logo.svg';
import { Link } from 'react-router-dom';
import profileImage from '../../img/placeholder.png'; // Import the profile image

const AppBarComponent = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: 'white' }}>
      <Toolbar>
        <Logo style={{ height: '40px', width: 'auto', marginRight: '16px' }} />
        <Link to="/profile" style={{ marginLeft: 'auto' }}>
          <Avatar
            alt="User Profile"
            src={profileImage}
            sx={{ width: 40, height: 40 }}
          />
        </Link>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarComponent;