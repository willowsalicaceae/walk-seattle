// src/components/TrailDiscovery/TrailList.js
import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../../firebase/firebase';
import TrailCard from './TrailCard';

const TrailList = () => {
  const [trails, setTrails] = useState([]);

  useEffect(() => {
    const fetchTrails = () => {
      const trailsRef = ref(db, 'trails');
      onValue(trailsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const trailsData = Object.entries(data).map(([id, trail]) => ({
            id,
            ...trail,
          }));
          setTrails(trailsData);
        }
      });
    };

    fetchTrails();
  }, []);

  return (
    <div>
      {trails.map((trail) => (
        <TrailCard key={trail.id} trail={trail} />
      ))}
    </div>
  );
};

export default TrailList;