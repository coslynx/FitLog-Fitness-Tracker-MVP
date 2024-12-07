import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Alert,
} from '@mui/material';
import axios from 'axios';
import { Goal } from '../types/Goal';
import { NewGoal } from '../types/NewGoal';
import '../styles/index.css';

interface GoalFormProps {
  onGoalCreate: () => void;
}

const GoalForm: React.FC<GoalFormProps> = ({ onGoalCreate }) => {
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState<number | ''>('');
  const [goalUnit, setGoalUnit] = useState<string>('kg');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Input validation
    if (!goalName || goalName.length > 50) {
      setError('Goal name must be between 1 and 50 characters.');
      return;
    }
    if (!goalTarget || isNaN(Number(goalTarget)) || Number(goalTarget) <= 0) {
      setError('Target must be a positive number.');
      return;
    }
    if (!startDate || !endDate || new Date(startDate) >= new Date(endDate)) {
      setError('Please select valid start and end dates.');
      return;
    }

    const newGoal: NewGoal = {
      name: goalName,
      target: Number(goalTarget),
      unit: goalUnit,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    };


    try {
      await axios.post('/api/goals', newGoal);
      setSuccess(true);
      onGoalCreate();
      setGoalName('');
      setGoalTarget('');
      setGoalUnit('kg');
      setStartDate('');
      setEndDate('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} className="goal-form">
      {success && (
        <Alert severity="success">Goal created successfully!</Alert>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        label="Goal Name"
        variant="outlined"
        value={goalName}
        onChange={(e) => setGoalName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Target Value"
        variant="outlined"
        type="number"
        value={goalTarget}
        onChange={(e) => setGoalTarget(e.target.value)}
        fullWidth
        margin="normal"
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Unit</InputLabel>
        <Select
          value={goalUnit}
          onChange={(e) => setGoalUnit(e.target.value)}
        >
          <MenuItem value="kg">kg</MenuItem>
          <MenuItem value="lbs">lbs</MenuItem>
          <MenuItem value="steps">steps</MenuItem>
        </Select>
        <FormHelperText>Select the unit for your goal.</FormHelperText>
      </FormControl>
      <TextField
        label="Start Date"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="End Date"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary">
        Create Goal
      </Button>
    </Box>
  );
};

export default GoalForm;