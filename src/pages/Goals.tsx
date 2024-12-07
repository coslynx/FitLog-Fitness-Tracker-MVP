import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, CircularProgress, Alert, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import GoalCard from '../components/GoalCard';
import GoalForm from '../components/GoalForm';
import { fetchGoals, Goal } from '../services/api/goals';
import '../styles/index.css';

const Goals: React.FC = () => {
  const { userId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    const fetchGoalData = async () => {
      try {
        if (userId) {
          const fetchedGoals = await fetchGoals(userId);
          setGoals(fetchedGoals);
        } else {
          setError('User ID not found.');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoalData();
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

  return (
    <Box className="goals-container">
      <Typography variant="h4" component="h1" className="goals-title">
        Your Goals
      </Typography>
      <GoalForm onGoalCreate={fetchGoalData} />
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {goals.length > 0 ? (
          goals.map((goal) => (
            <Grid item xs={12} sm={6} md={4} key={goal._id}>
              <GoalCard goal={goal} />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body1">No goals yet. Create one above!</Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Goals;