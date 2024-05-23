import { ref, onValue } from 'firebase/database';
import { db } from '../firebase/firebase';
import { calculateDistance } from './distance';

export const fetchTrailsData = async (userLocation) => {
  const cachedTrails = localStorage.getItem('trails');
  if (cachedTrails) {
    return JSON.parse(cachedTrails);
  } else {
    const trailsRef = ref(db, 'trails');
    const snapshot = await onValue(trailsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const trails = Object.entries(data).map(([id, trail]) => ({
          id,
          ...trail,
          distance: calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            trail.latitude,
            trail.longitude
          ),
        }));
        localStorage.setItem('trails', JSON.stringify(trails));
        return trails;
      }
      return [];
    });
    return snapshot.val();
  }
};

export const fetchCommunityPostsData = async () => {
  const cachedPosts = localStorage.getItem('communityPosts');
  if (cachedPosts) {
    return JSON.parse(cachedPosts);
  } else {
    const postsRef = ref(db, 'communityPosts');
    const snapshot = await onValue(postsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const posts = Object.entries(data).map(([id, post]) => ({
          id,
          ...post,
        }));
        localStorage.setItem('communityPosts', JSON.stringify(posts));
        return posts;
      }
      return [];
    });
    return snapshot.val();
  }
};

export const sortTrailsData = (trails, sortBy, sortOrder) => {
  const sortedTrails = [...trails];
  const multiplier = sortOrder === 'asc' ? 1 : -1;

  switch (sortBy) {
    case 'distance':
      sortedTrails.sort((a, b) => multiplier * (a.distance - b.distance));
      break;
    case 'numReviews':
      sortedTrails.sort((a, b) => multiplier * (a.numReviews - b.numReviews));
      break;
    case 'rating':
      sortedTrails.sort((a, b) => multiplier * (a.rating - b.rating));
      break;
    case 'difficulty':
      const difficultyOrder = ['Easy', 'Moderate', 'Hard'];
      sortedTrails.sort(
        (a, b) => multiplier * (difficultyOrder.indexOf(a.difficulty) - difficultyOrder.indexOf(b.difficulty))
      );
      break;
    case 'length':
      sortedTrails.sort((a, b) => multiplier * (a.length - b.length));
      break;
    default:
      sortedTrails.sort((a, b) => b.numReviews - a.numReviews);
  }

  return sortedTrails;
};