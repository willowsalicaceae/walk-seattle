// src/pages/Home.js
import { useLocation } from 'react-router-dom';
import { Alert, Typography, Box, Container } from '@mui/material';

const Home = () => {
  const location = useLocation();

  return (
    <>
      {location.state?.alert && <Alert severity="success">{location.state.alert}</Alert>}
      <Container>
        <Box pb={7}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome to WalkSeattle
          </Typography>
          <Typography variant="body1">
            Discover urban hiking trails in Seattle and connect with fellow hikers.
          </Typography>
        </Box>
      </Container>
    </>
  );
};

export default Home;