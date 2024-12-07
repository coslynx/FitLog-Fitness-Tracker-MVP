import * as React from 'react';
import { Card, CardContent, Typography, LinearProgress } from '@mui/material';
import { Goal } from '../types/Goal';
import '../styles/index.css';

interface GoalCardProps {
  goal: Goal | null;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal }) => {
  if (!goal) {
    return <Card className="goal-card">
      <CardContent>
        <Typography variant="body2">No goal data available.</Typography>
      </CardContent>
    </Card>;
  }

  const progressPercentage = goal.progress / goal.target * 100;


  return (
    <Card className="goal-card">
      <CardContent>
        <Typography variant="h6" component="h2">
          {goal.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Target: {goal.target} {goal.unit}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={progressPercentage}
          className="goal-progress"
        />
        <Typography variant="body2">
          Progress: {goal.progress} {goal.unit} ({progressPercentage.toFixed(0)}%)
        </Typography>
      </CardContent>
    </Card>
  );
};

export default GoalCard;