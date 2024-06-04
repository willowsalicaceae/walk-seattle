import React, { useState, useEffect } from 'react';
import { ref, set, remove, onValue } from 'firebase/database';
import { db, auth } from '../firebase/firebase';
import { IconButton } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const FavoriteButton = ({ trailId }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      const favoriteRef = ref(db, `users/${currentUser.uid}/favorites/${trailId}`);
      onValue(favoriteRef, (snapshot) => {
        setIsFavorite(snapshot.exists());
      });
    }
  }, [trailId, currentUser]);

  const handleFavorite = () => {
    if (!currentUser) {
      navigate('/signin', { state: { alert: 'Please log in to favorite trails.' } });
      return;
    }

    const user = auth.currentUser;
    if (user) {
      const favoriteRef = ref(db, `users/${user.uid}/favorites/${trailId}`);
      if (isFavorite) {
        remove(favoriteRef);
      } else {
        set(favoriteRef, true);
      }
    }
  };

  return (
    <IconButton onClick={handleFavorite} color={isFavorite ? 'secondary' : ''}>
      {isFavorite ? (<FavoriteIcon />) : (<FavoriteBorderIcon />)}
    </IconButton>
  );
};

export default FavoriteButton;