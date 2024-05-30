import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ref, update, get } from 'firebase/database';
import { db } from '../../firebase/firebase';
import { TextField, Button } from '@mui/material';
import { moderateText, sanitizeInput } from '../../utils/moderation';

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

    const sanitizedUsername = sanitizeInput(newUsername);
    const moderatedUsername = moderateText(sanitizedUsername);

    try {
      // Check if the new username is already taken by another user
      const usersRef = ref(db, 'users');
      const snapshot = await get(usersRef);
      const users = snapshot.val();

      const existingUser = Object.values(users).find(
        (user) => user.username === moderatedUsername && user.uid !== currentUser.uid
      );

      if (existingUser) {
        setUsernameError('Username is already taken');
        return;
      }

      // Update the username in the 'users' node using the UID
      await update(ref(db, `users/${currentUser.uid}`), {
        username: moderatedUsername,
      });

      // Show success message or redirect to profile page
      setUsernameError('');
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
        error={!!usernameError}
        helperText={usernameError}
      />
      <Button type="submit" variant="contained">
        Change Username
      </Button>
    </form>
  );
};

export default ProfileSettings;
