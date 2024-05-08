// src/components/TrailForm.js
import React, { useState } from 'react';
import { ref, push } from 'firebase/database';
import { db } from '../firebase/firebase';

const TrailForm = () => {
  const [jsonInput, setJsonInput] = useState('');

  const handleChange = (e) => {
    setJsonInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const trails = JSON.parse(jsonInput);
      const trailsRef = ref(db, 'trails');

      // Upload each trail to the database
      trails.forEach(async (trail) => {
        await push(trailsRef, trail);
      });

      console.log('Trails added successfully');
      // Reset the form
      setJsonInput('');
    } catch (error) {
      console.error('Error adding trails:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        name="jsonInput"
        placeholder="Paste JSON object here"
        value={jsonInput}
        onChange={handleChange}
        rows={10}
        cols={50}
      />
      <button type="submit">Upload Trails</button>
    </form>
  );
};

export default TrailForm;