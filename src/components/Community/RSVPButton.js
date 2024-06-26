// src/components/Community/RSVPButton.js
import React from 'react';
import { ref, set, remove } from 'firebase/database';
import { db, auth } from '../../firebase/firebase';
import { Button } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const RSVPButton = ({ postId, isRSVP, onRSVPChange }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleRSVP = () => {
    if (!currentUser) {
      navigate('/signin', { state: { alert: 'Please log in to RSVP to events.' } });
      return;
    }

    const user = auth.currentUser;
    if (user) {
      const userRsvpRef = ref(db, `users/${user.uid}/rsvps/${postId}`);
      const postRsvpRef = ref(db, `communityPosts/${postId}/rsvps/${user.uid}`);

      if (isRSVP) {
        Promise.all([remove(userRsvpRef), remove(postRsvpRef)])
          .then(() => {
            onRSVPChange(false);
            console.log('RSVP removed from the database');
          })
          .catch((error) => {
            console.error('Error removing RSVP:', error);
          });
      } else {
        Promise.all([set(userRsvpRef, true), set(postRsvpRef, true)])
          .then(() => {
            onRSVPChange(true);
            console.log('RSVP added to the database');
          })
          .catch((error) => {
            console.error('Error adding RSVP:', error);
          });
      }
      console.log('User UID:', user.uid);
      console.log('Post ID:', postId);
      console.log('Is RSVP:', isRSVP);
    } else {
      console.log('User not authenticated');
    }
  };

  return (
    <Button onClick={handleRSVP} variant={isRSVP ? 'contained' : 'outlined'} startIcon={isRSVP ? <CheckIcon /> : <AddIcon />}>
      {isRSVP ? 'RSVP\'d' : 'RSVP'}
    </Button>
  );
};

export default RSVPButton;