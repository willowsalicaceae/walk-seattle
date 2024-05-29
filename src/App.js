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
import SignUp from './components/User/SignUp';
import SignIn from './components/User/SignIn';
import SavedPage from './pages/SavedPage';
import { AuthProvider } from './contexts/AuthContext';
import CreatePostPage from './pages/CreatePostPage';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import PostDetailsPage from './components/Community/PostDetailsPage';

const App = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <Router>
            <AppBarComponent />
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route path="/discover" element={<TrailDiscoveryPage />} />
              <Route path="/trail/:id" element={<TrailDetailsPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/community/create-post" element={<CreatePostPage />} />
              <Route path="/post/:id" element={<PostDetailsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/saved" element={<SavedPage />} />
            </Routes>
            <BottomNavigationComponent />
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </LocalizationProvider>
  );
};

export default App;