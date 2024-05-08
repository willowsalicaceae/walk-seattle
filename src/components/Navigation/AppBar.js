import profileImage from '../../img/placeholder.png'; // Import the profile image
import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Avatar, Button, Menu, MenuItem } from '@mui/material';
import { ReactComponent as Logo } from '../../img/logo.svg';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebase';

const AppBarComponent = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: 'white' }}>
      <Toolbar>
        <Logo style={{ height: '40px', width: 'auto', marginRight: '16px' }} />
        {currentUser ? (
          <>
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, marginLeft: 'auto' }}>
              <Avatar alt="User Profile" src={profileImage} sx={{ width: 40, height: 40 }} />
            </IconButton>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem component={Link} to="/profile" onClick={handleCloseUserMenu}>
                <Typography textAlign="center">Profile</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <Button component={Link} to="/signin" variant="outlined" sx={{ marginRight: '8px', marginLeft: 'auto' }}>
              Sign In
            </Button>
            <Button component={Link} to="/signup" variant="contained">
              Sign Up
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default AppBarComponent;