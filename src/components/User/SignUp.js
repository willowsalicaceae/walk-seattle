import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase/firebase';
import { ref, set } from 'firebase/database';
import { TextField, Button, Container, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;

      // Store user data in the Realtime Database
      await set(ref(db, `users/${user.uid}`), {
        email: user.email,
        // Add more user data as needed
      });

      console.log('User signed up successfully');
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" align="center" gutterBottom>
        Sign Up
      </Typography>
      <form onSubmit={handleSignUp}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Sign Up
        </Button>
      </form>
      <Typography variant='body1' sx={{ pt: "20px" }}>Already have an account? <Link to="/signin">Sign in here</Link></Typography>
    </Container>
  );
};

export default SignUp;