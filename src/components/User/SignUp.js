import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase/firebase';
import { ref, set, get } from 'firebase/database';
import { Alert, TextField, Button, Container, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

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
      const usernamesRef = ref(db, 'usernames');
      const snapshot = await get(usernamesRef);
      const usernames = snapshot.val();

      if (usernames && usernames[username]) {
        setUsernameError('Username is already taken');
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;

      await set(ref(db, `users/${user.uid}`), {
        username,
        email: user.email,
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