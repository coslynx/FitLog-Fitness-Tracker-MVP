import mongoose, { Schema, Document } from 'mongoose';
import { UserType } from './User';

export interface GoalType extends Document {
  name: string;
  target: number;
  unit: 'kg' | 'lbs' | 'steps';
  startDate: Date;
  endDate: Date;
  userId: UserType | string;
  progress: number;
  completed: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const goalSchema: Schema = new Schema(
  {
    name: { type: String, required: true, maxlength: 50 },
    target: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true, enum: ['kg', 'lbs', 'steps'] },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    progress: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Goal = mongoose.model<GoalType & Document>('Goal', goalSchema);