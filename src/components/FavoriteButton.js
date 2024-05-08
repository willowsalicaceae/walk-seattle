import React, { useState, useEffect } from 'react';
import { ref, set, remove, onValue } from 'firebase/database';
import { db, auth } from '../firebase/firebase';

const FavoriteButton = ({ trailId }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const favoriteRef = ref(db, `favorites/${user.uid}/${trailId}`);
      onValue(favoriteRef, (snapshot) => {
        setIsFavorite(snapshot.exists());
      });
    }
  }, [trailId]);

  const handleFavorite = () => {
    const user = auth.currentUser;
    if (user) {
      const favoriteRef = ref(db, `favorites/${user.uid}/${trailId}`);
      if (isFavorite) {
        remove(favoriteRef);
      } else {
        set(favoriteRef, true);
      }
    }
  };

  return (
    <button onClick={handleFavorite}>
      {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
    </button>
  );
};

export default FavoriteButton;