import { useAuth } from '../contexts/AuthContext';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase/firebase';
import { useState, useEffect } from 'react';
import { Typography, Container } from '@mui/material';
import ProfileSettings from '../components/User/ProfileSettings';

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const [userInfo, setUserInfo] = useState({ username: '' });

  useEffect(() => {
    if (currentUser) {
      const userRef = ref(db, `users/${currentUser.uid}`);
      onValue(userRef, (snapshot) => {
        const userData = snapshot.val();
        if (userData) {
          setUserInfo(userData);
        }
      });
    }
  }, [currentUser]);

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        User Profile
      </Typography>
      <Typography variant="h6">Username: {userInfo.username}</Typography>
      <ProfileSettings />
    </Container>
  );
};

export default ProfilePage;