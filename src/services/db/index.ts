import mongoose from 'mongoose';
import { User, Goal, Progress } from './models';

const connectToDatabase = async (): Promise<typeof mongoose> => {
  const dbUri = process.env.DATABASE_URL;
  if (!dbUri) {
    throw new Error('DATABASE_URL environment variable not set.');
  }

  try {
    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
    return mongoose;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw new Error('Failed to connect to MongoDB.');
  }
};


export const db = {
  User,
  Goal,
  Progress,
  connect: connectToDatabase,
};