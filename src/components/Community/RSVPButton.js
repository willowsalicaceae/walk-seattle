import React from 'react';
import { ref, set, remove } from 'firebase/database';
import { db, auth } from '../../firebase/firebase';
import { Button } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

const RSVPButton = ({ postId, isRSVP }) => {
  const handleRSVP = () => {
    const user = auth.currentUser;
    if (user) {
      const rsvpRef = ref(db, `users/${user.uid}/rsvps/${postId}`);
      if (isRSVP) {
        remove(rsvpRef);
      } else {
        set(rsvpRef, true);
      }
    }
  };

  return (
    <Button onClick={handleRSVP} variant={isRSVP ? 'contained' : 'outlined'} startIcon={isRSVP && <CheckIcon />}>
      {isRSVP ? 'RSVP\'d' : 'RSVP +'}
    </Button>
  );
};

export default RSVPButton;