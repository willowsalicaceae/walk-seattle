import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme/theme';
import AppBarComponent from './components/Navigation/AppBar';
import BottomNavigationComponent from './components/Navigation/BottomNavigation';
import Home from './pages/Home';
import TrailDiscoveryPage from './pages/TrailDiscoveryPage';
import TrailDetailsPage from './pages/TrailDetailsPage';
import CommunityPage from './pages/CommunityPage';
import ProfilePage from './pages/ProfilePage';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppBarComponent />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/discover" element={<TrailDiscoveryPage />} />
          <Route path="/trail/:id" element={<TrailDetailsPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
        <BottomNavigationComponent />
      </Router>
    </ThemeProvider>
  );
};

export default App;