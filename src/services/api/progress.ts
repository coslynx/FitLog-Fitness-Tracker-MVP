import axios from 'axios';
import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { Progress } from '../db/models';
import { Progress as ProgressType, NewProgress, AggregatedProgress } from '../../types/api';

const createProgressEntry = async (req: Request<{}, {}, NewProgress>, res: Response<ProgressType | { error: string }>) => {
    try {
        const { userId, goalId, date, progressValue } = req.body;

        // Input validation
        if (!userId || !goalId || !date || typeof progressValue !== 'number') {
            return res.status(400).json({ error: 'All fields are required and progressValue must be a number.' });
        }

        const newProgressEntry = new Progress({ userId, goalId, date, progressValue });
        const savedProgress = await newProgressEntry.save();
        return res.json(savedProgress);
    } catch (error: any) {
        console.error("Error creating progress entry:", error);
        return res.status(500).json({ error: 'Failed to create progress entry.' });
    }
};


const getProgress = async (req: Request<{ userId: string; goalId: string; }>, res: Response<ProgressType[] | { error: string }>) => {
    try {
        const { userId, goalId } = req.params;
        const progressEntries = await Progress.find({ userId, goalId });
        return res.json(progressEntries);
    } catch (error: any) {
        console.error("Error fetching progress:", error);
        return res.status(500).json({ error: 'Failed to fetch progress.' });
    }
};

const fetchAggregatedProgress = async (userId: string): Promise<AggregatedProgress | null> => {
    try {
        const pipeline = [
            { $match: { userId } },
            {
                $group: {
                    _id: { goalId: "$goalId", date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } } },
                    progressValues: { $push: "$progressValue" },
                    dates: { $push: "$date" }
                }
            },
            {
                $group: {
                    _id: "$_id.goalId",
                    dates: { $push: "$_id.date" },
                    progressValues: { $push: { $avg: "$progressValues" } }
                }
            },
            {
                $project: {
                    _id: 0,
                    goalId: "$_id",
                    dates: 1,
                    progressValues: 1
                }
            }
        ];

        const aggregatedProgress = await Progress.aggregate(pipeline);
        if (aggregatedProgress.length === 0) return null;

        return {
            dates: aggregatedProgress[0].dates.map(dateString => new Date(dateString)),
            weightLoss: aggregatedProgress.map(item => item.progressValues[0]),
            stepsTaken: aggregatedProgress.map(item => item.progressValues[0]) //Placeholder - needs logic for multiple progress types
        };


    } catch (error: any) {
        console.error("Error fetching aggregated progress:", error);
        return null;
    }
};

const getAggregatedProgress = async (req: Request<{ userId: string; }>, res: Response<AggregatedProgress | { error: string }>) => {
    try {
        const userId = req.params.userId;
        const aggregatedProgress = await fetchAggregatedProgress(userId);
        if (!aggregatedProgress) {
            return res.status(404).json({ error: 'No progress data found for this user.' });
        }
        return res.json(aggregatedProgress);
    } catch (error: any) {
        console.error("Error fetching aggregated progress:", error);
        return res.status(500).json({ error: 'Failed to fetch aggregated progress.' });
    }
};


export { createProgressEntry, getProgress, getAggregatedProgress, fetchAggregatedProgress };