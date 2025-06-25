import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/User';
import { AppError } from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';
import { logger } from '../utils/logger';

// Helper function to generate JWT token
const generateToken = (userId: string) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'your-secret-jwt-key',
    { expiresIn: '7d' }
  );
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = catchAsync(async (req: Request, res: Response) => {
  const { email, password, firstName, lastName, role } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new AppError('User with this email already exists', 400);
  }

  // Create user
  const user = await User.create({
    id: uuidv4(),
    email,
    password,
    firstName,
    lastName,
    role,
  });

  // Generate verification token (would normally send email)
  // const verificationToken = crypto.randomBytes(32).toString('hex');
  // Store token in database
  
  // Send verification email here (using nodemailer or similar)

  // Generate JWT token
  const token = generateToken(user.id);

  // Return user info and token
  res.status(201).json({
    success: true,
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isVerified: user.isVerified,
    },
  });
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Invalid credentials', 401);
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate token
  const token = generateToken(user.id);

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isVerified: user.isVerified,
      profileImage: user.profileImage,
    },
  });
});

// @desc    Request password reset
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;

  // Find user by email
  const user = await User.findOne({ where: { email } });
  if (!user) {
    // We don't want to reveal if a user exists or not
    return res.status(200).json({
      success: true,
      message: 'If a user with that email exists, a password reset link was sent.',
    });
  }

  // Generate password reset token
  // const resetToken = crypto.randomBytes(32).toString('hex');
  // Set token expiry (1 hour)
  // const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
  
  // Save to database
  // Here we would store the reset token and expiry in database
  
  // Send password reset email
  // Here we would send an email with the reset link

  logger.info(`Password reset requested for: ${email}`);

  res.status(200).json({
    success: true,
    message: 'If a user with that email exists, a password reset link was sent.',
  });
});

// @desc    Reset password with token
// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { token } = req.params;
  const { password } = req.body;

  // Here we would find the user with the reset token and check if it's valid
  // Check if token exists and has not expired

  // For demo purposes, assume token is valid
  // In a real app, this would query the database for the token
  
  // Update password and clear reset token
  // const user = await User.findOne({ where: { /* token query */ } });
  // if (!user) {
  //   throw new AppError('Invalid or expired token', 400);
  // }
  
  // user.password = password;
  // user.resetToken = null;
  // user.resetTokenExpiry = null;
  // await user.save();

  logger.info(`Password reset for token: ${token.substring(0, 8)}...`);

  res.status(200).json({
    success: true,
    message: 'Password has been reset successfully. You can now log in with your new password.',
  });
});

// @desc    Verify user email
// @route   GET /api/auth/verify-email/:token
// @access  Public
export const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const { token } = req.params;

  // Here we would find the user with this verification token
  // For demo purposes, assume token is valid
  // In a real app, this would query the database for the token
  
  // Mark user as verified and clear verification token
  // const user = await User.findOne({ where: { /* verification token query */ } });
  // if (!user) {
  //   throw new AppError('Invalid or expired token', 400);
  // }
  
  // user.isVerified = true;
  // user.verificationToken = null;
  // await user.save();

  logger.info(`Email verified for token: ${token.substring(0, 8)}...`);

  res.status(200).json({
    success: true,
    message: 'Email verified successfully. You can now log in.',
  });
});