import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase/firebase';
import { ref, set, get } from 'firebase/database';
import { Alert, TextField, Button, Container, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      setUsernameError('Username is required');
      return;
    }

    try {
      // Check if the username is already taken
      const usersRef = ref(db, 'users');
      const snapshot = await get(usersRef);
      const users = snapshot.val();

      const existingUser = Object.values(users).find(
        (user) => user.username === username
      );

      if (existingUser) {
        setUsernameError('Username is already taken');
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;

      // Store user data using the UID as the key
      await set(ref(db, `users/${user.uid}`), {
        username,
      });

      navigate('/', { state: { alert: 'Sign up successful! You are now logged in.' } });
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      {error && <Alert severity="error">{error}</Alert>}
      <Container maxWidth="xs">
        <Typography variant="h4" align="center" gutterBottom>
          Sign Up
        </Typography>
        <form onSubmit={handleSignUp}>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={!!usernameError}
            helperText={usernameError}
            required
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Sign Up
          </Button>
        </form>
        <Typography variant='body1' sx={{ pt: "20px" }}>Already have an account? <Link to="/signin">Sign in here</Link></Typography>
      </Container>
    </>
  );
};

export default SignUp;