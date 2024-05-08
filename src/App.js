import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme/theme';
import AppBarComponent from './components/Navigation/AppBar';
import BottomNavigationComponent from './components/Navigation/BottomNavigation';
import Home from './pages/Home';
import TrailDiscoveryPage from './pages/TrailDiscoveryPage';
import TrailDetailsPage from './pages/TrailDetailsPage';
import CommunityPage from './pages/CommunityPage';
import ProfilePage from './pages/ProfilePage';
import SignUp from './components/User/SignUp';
import SignIn from './components/User/SignIn';
import FavoritesPage from './components/User/FavoritesPage';
import { AuthProvider } from './contexts/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <Router>
          <AppBarComponent />
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/discover" element={<TrailDiscoveryPage />} />
            <Route path="/trail/:id" element={<TrailDetailsPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/favorites" element={<FavoritesPage />} />
          </Routes>
          <BottomNavigationComponent />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;