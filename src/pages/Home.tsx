import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import AuthButton from '../components/AuthButton';
import '../styles/index.css';

const Home: React.FC = () => {
  return (
    <Box className="home-container">
      <Box className="home-hero">
        <Typography variant="h1" component="h1" className="home-title">
          FitLog
        </Typography>
        <Typography variant="h5" component="h2" className="home-subtitle">
          Your Simple Fitness Journey Starts Here
        </Typography>
      </Box>
      <Box className="home-actions">
        <Typography variant="body1" className="home-description">
          Track your progress, set goals, and share your achievements.  Simple,
          effective fitness tracking for everyone.
        </Typography>
        <Box sx={{ mt: 2 }}>
          <AuthButton />
        </Box>
        <Box sx={{ mt: 2 }}>
          <Link to="/goals" style={{ textDecoration: 'none' }}>
            <Button variant="outlined">View Goals</Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;