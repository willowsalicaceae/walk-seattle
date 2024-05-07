// src/components/TrailDiscovery/TrailList.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import TrailCard from './TrailCard';

const TrailList = () => {
  const [trails, setTrails] = useState([]);

  useEffect(() => {
    const fetchTrails = async () => {
      const trailsCollection = collection(db, 'trails');
      const trailsSnapshot = await getDocs(trailsCollection);
      const trailsData = trailsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTrails(trailsData);
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