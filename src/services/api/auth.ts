import axios from 'axios';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { User } from '../db/models/index';
import { UserLoginRequest, UserRegistrationRequest, UserResponse } from '../../types/api';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret'; //For development purposes.  Should be retrieved securely in production.

const registerUser = async (req: Request<{}, {}, UserRegistrationRequest>, res: Response<UserResponse | {error: string}>) => {
  try {
    const { username, email, password } = req.body;

    // Input validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required.' });
    }
    //Basic email validation (improve as needed)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Invalid email format.' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    }


    const hashedPassword = await bcrypt.hash(password, 10); //10 salt rounds - adjust as needed

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '1h' });

    return res.json({ user: {username: newUser.username, email: newUser.email}, token });
  } catch (err: any) {
    console.error("Error registering user:", err);
    return res.status(500).json({ error: 'Failed to register user.' });
  }
};


const loginUser = async (req: Request<{}, {}, UserLoginRequest>, res: Response<UserResponse | {error: string}>) => {
  try {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
      return res.status(400).json({ error: 'Username/Email and password are required.' });
    }

    const user = await User.findOne({ $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }] });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

    return res.json({ user: {username: user.username, email: user.email}, token });
  } catch (err: any) {
    console.error("Error logging in user:", err);
    return res.status(500).json({ error: 'Failed to log in user.' });
  }
};


//  Logout -  For this MVP, we're relying on JWT expiration for session management.  No explicit logout endpoint needed in this version.

export { registerUser, loginUser };