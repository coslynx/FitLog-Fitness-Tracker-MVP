import axios from 'axios';
import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { Goal, GoalDocument } from '../db/models';
import { Goal as GoalType, NewGoal } from '../../types/api';

const createGoal = async (req: Request<{}, {}, NewGoal>, res: Response<GoalType | { error: string }>) => {
    try {
        const { name, target, unit, startDate, endDate } = req.body;
        const userId = req.body.userId; // Assumed to be extracted from authentication middleware

        // Input validation
        if (!name || !target || !unit || !startDate || !endDate || !userId) {
            return res.status(400).json({ error: 'All fields are required.' });
        }
        if (typeof target !== 'number' || target <= 0) {
            return res.status(400).json({ error: 'Target must be a positive number.' });
        }
        if (new Date(startDate) >= new Date(endDate)) {
            return res.status(400).json({ error: 'Start date must be before end date.' });
        }

        const newGoal = new Goal({ name, target, unit, startDate, endDate, userId });
        const savedGoal = await newGoal.save();
        return res.json(savedGoal);
    } catch (err: any) {
        console.error('Error creating goal:', err);
        return res.status(500).json({ error: 'Failed to create goal.' });
    }
};

const getGoals = async (req: Request<{ userId: string }>, res: Response<GoalType[] | { error: string }>) => {
    try {
        const userId = req.params.userId;
        const goals = await Goal.find({ userId });
        return res.json(goals);
    } catch (err: any) {
        console.error('Error fetching goals:', err);
        return res.status(500).json({ error: 'Failed to fetch goals.' });
    }
};


const updateGoal = async (req: Request<{ id: string; }, {}, GoalDocument>, res: Response<GoalType | { error: string }>) => {
    try {
        const goalId = req.params.id;
        const userId = req.body.userId; // Assumed to be from authentication middleware
        const updates = req.body;
        delete updates.userId; // Prevent accidental userId modification


        const updatedGoal = await Goal.findByIdAndUpdate(
            goalId,
            { $set: updates },
            { new: true }
        );

        if (!updatedGoal) {
            return res.status(404).json({ error: 'Goal not found.' });
        }

        //Authorization Check.  userId from token should match userId from the goal being updated. (Implement your authentication/authorization logic here)
        if(updatedGoal.userId !== userId){
            return res.status(403).json({ error: 'Unauthorized to update this goal.' });
        }

        return res.json(updatedGoal);

    } catch (err: any) {
        console.error('Error updating goal:', err);
        return res.status(500).json({ error: 'Failed to update goal.' });
    }
};

const deleteGoal = async (req: Request<{ id: string; }>, res: Response<{ message: string } | { error: string }>) => {
    try {
        const goalId = req.params.id;
        const userId = req.body.userId; // Assumed from authentication middleware

        const deletedGoal = await Goal.findByIdAndDelete(goalId);

        if (!deletedGoal) {
            return res.status(404).json({ error: 'Goal not found.' });
        }

        //Authorization Check. (Implement your authentication/authorization logic here)
        if(deletedGoal.userId !== userId){
            return res.status(403).json({ error: 'Unauthorized to delete this goal.' });
        }

        return res.json({ message: 'Goal deleted successfully.' });
    } catch (err: any) {
        console.error('Error deleting goal:', err);
        return res.status(500).json({ error: 'Failed to delete goal.' });
    }
};

export { createGoal, getGoals, updateGoal, deleteGoal };