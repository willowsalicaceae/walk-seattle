import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { useNavigate, useLocation } from 'react-router-dom';
import { TextField, Button, Container, Typography, Alert } from '@mui/material';
import { Link } from 'react-router-dom';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/', { state: { alert: 'Login successful!' } });
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      {location.state?.alert && <Alert severity="info">{location.state.alert}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
      <Container maxWidth="xs">
        <Typography variant="h4" align="center" gutterBottom>
          Sign In
        </Typography>
        <form onSubmit={handleSignIn}>
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
            Sign In
          </Button>
        </form>
        <Typography variant='body1' sx={{ pt: "20px" }}>Don't have an account yet? <Link to="/signup">Sign up here</Link></Typography>
      </Container>
    </>
  );
};

export default SignIn;