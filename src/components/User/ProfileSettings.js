import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ref, update, get } from 'firebase/database';
import { db } from '../../firebase/firebase';
import { TextField, Button } from '@mui/material';

const ProfileSettings = () => {
  const { currentUser } = useAuth();
  const [newUsername, setNewUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');

  const handleUsernameChange = async (e) => {
    e.preventDefault();

    if (!newUsername.trim()) {
      setUsernameError('Username is required');
      return;
    }

    try {
      // Check if the new username already exists
      const usernamesRef = ref(db, 'usernames');
      const snapshot = await get(usernamesRef);
      const usernames = snapshot.val();

      if (usernames && usernames[newUsername]) {
        setUsernameError('Username is already taken');
        return;
      }

      // Update the username in the 'users' node
      await update(ref(db, `users/${currentUser.uid}`), {
        username: newUsername,
      });

      // Update the 'usernames' node
      await update(ref(db, `usernames`), {
        [newUsername]: currentUser.uid,
        [currentUser.displayName]: null,
      });

      // Show success message or redirect to profile page
    } catch (error) {
      console.error('Error updating username:', error);
    }
  };

  return (
    <form onSubmit={handleUsernameChange}>
      <TextField
        label="New Username"
        value={newUsername}
        onChange={(e) => setNewUsername(e.target.value)}
      />
      <Button type="submit" variant="contained">
        Change Username
      </Button>
    </form>
  );
};

export default ProfileSettings;