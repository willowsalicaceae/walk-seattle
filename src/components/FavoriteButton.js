import React, { useState, useEffect } from 'react';
import { ref, set, remove, onValue } from 'firebase/database';
import { db, auth } from '../firebase/firebase';
import { IconButton } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

const FavoriteButton = ({ trailId }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const favoriteRef = ref(db, `users/${user.uid}/favorites/${trailId}`);
      onValue(favoriteRef, (snapshot) => {
        setIsFavorite(snapshot.exists());
      });
    }
  }, [trailId]);

  const handleFavorite = () => {
    const user = auth.currentUser;
    if (user) {
      const favoriteRef = ref(db, `users/${user.uid}/favorites/${trailId}`);
      if (isFavorite) {
        remove(favoriteRef)
          .then(() => {
            console.log('Favorite removed from the database');
          })
          .catch((error) => {
            console.error('Error removing favorite:', error);
          });
      } else {
        set(favoriteRef, true)
          .then(() => {
            console.log('Favorite added to the database');
          })
          .catch((error) => {
            console.error('Error adding favorite:', error);
          });
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