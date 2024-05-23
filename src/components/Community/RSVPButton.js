import React, { useState, useEffect } from 'react';
import { ref, set, remove, onValue } from 'firebase/database';
import { db, auth } from '../../firebase/firebase';
import { IconButton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

const RSVPButton = ({ postId }) => {
  const [isRSVP, setIsRSVP] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const rsvpRef = ref(db, `eventRSVPs/${postId}/${user.uid}`);
      onValue(rsvpRef, (snapshot) => {
        setIsRSVP(snapshot.exists());
      });
    }
  }, [postId]);

  const handleRSVP = () => {
    const user = auth.currentUser;
    if (user) {
      const rsvpRef = ref(db, `eventRSVPs/${postId}/${user.uid}`);
      if (isRSVP) {
        remove(rsvpRef);
      } else {
        set(rsvpRef, true);
      }
    }
  };

  return (
    <IconButton onClick={handleRSVP} color={isRSVP ? 'primary' : ''}>
      {isRSVP ? <CheckIcon /> : <CheckBoxOutlineBlankIcon />}
    </IconButton>
  );
};

export default RSVPButton;