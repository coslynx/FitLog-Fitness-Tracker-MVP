import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useParams } from 'react-router-dom';
import ProgressChart from '../components/ProgressChart';
import { fetchAggregatedProgress } from '../services/api/progress';
import '../styles/index.css';

interface AggregatedProgress {
  totalProgress: number;
  weightLoss: number;
  stepsTaken: number;
  // Add other metrics as needed
}

const Dashboard: React.FC = () => {
  const { userId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progressData, setProgressData] = useState<AggregatedProgress | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (userId) {
          const data = await fetchAggregatedProgress(userId);
          setProgressData(data);
        } else {
          setError('User ID not found.');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [userId]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!progressData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6">No progress data available.</Typography>
      </Box>
    );
  }


  return (
    <Box className="dashboard-container">
      <Typography variant="h4" component="h1" className="dashboard-title">
        Your Progress
      </Typography>
      <Box sx={{ mt: 2 }}>
        <ProgressChart progressData={progressData} />
      </Box>
    </Box>
  );
};

export default Dashboard;