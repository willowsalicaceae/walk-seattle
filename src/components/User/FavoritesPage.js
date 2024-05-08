import React, { useState, useEffect } from 'react';
import { ref, onValue, get } from 'firebase/database';
import { db, auth } from '../../firebase/firebase';
import TrailCard from '../../components/TrailDiscovery/TrailCard';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const favoritesRef = ref(db, `favorites/${user.uid}`);
      onValue(favoritesRef, async (snapshot) => {
        const favoritesData = snapshot.val();
        if (favoritesData) {
          const favoriteTrailIds = Object.keys(favoritesData);
          const trailDataPromises = favoriteTrailIds.map((trailId) =>
            get(ref(db, `trails/${trailId}`))
          );
          const trailDataSnapshots = await Promise.all(trailDataPromises);
          const favoriteTrails = trailDataSnapshots.map((snapshot) => ({
            id: snapshot.key,
            ...snapshot.val(),
          }));
          setFavorites(favoriteTrails);
        } else {
          setFavorites([]);
        }
      });
    }
  }, []);

  return (
    <div>
      <h2>Favorite Trails</h2>
      {favorites.map((trail) => (
        <TrailCard key={trail.id} trail={trail} />
      ))}
    </div>
  );
};

export default FavoritesPage;