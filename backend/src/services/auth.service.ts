import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';
import type { IUser } from '../models/User.js';
import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';

type UserRole = 'client' | 'agent';

export const register = async (name: string, email: string, password: string, role?: UserRole) => {
  const exists = await User.findOne({ email });

  if (exists) {
    throw new AppError('Email already registered', 409, 'EMAIL_ALREADY_REGISTERED');
  }

  const userData = {
    name,
    email,
    password,
    ...(role && { role }),
  };

  const user = await User.create(userData);
  const token = generateToken(user);

  return { user, token };
};

export const login = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) { 
    throw new AppError(
      'Invalid credentials',
      401,
      'INVALID_CREDENTIALS'); 
  }

  const valid = await user.comparePassword(password);

  if (!valid) { 
    throw new AppError(
      'Invalid credentials',
      401,
      'INVALID_CREDENTIALS'); 
  }

  const token = generateToken(user);

  return { user, token };
};

const generateToken = (user: IUser) => {
  return jwt.sign(
    { 
      id: user._id, 
      role: user.role ,
    }, 
    env.JWT_SECRET, 
    { 
      expiresIn: '7d',
    },
  );
};
