import mongoose, { Schema, Document } from 'mongoose';
import { GoalType } from './Goal';
import { UserType } from './User';

export interface ProgressType extends Document {
  userId: UserType | string;
  goalId: GoalType | string;
  date: Date;
  progressValue: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const progressSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    goalId: { type: Schema.Types.ObjectId, ref: 'Goal', required: true },
    date: { type: Date, required: true },
    progressValue: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Progress = mongoose.model<ProgressType & Document>(
  'Progress',
  progressSchema
);