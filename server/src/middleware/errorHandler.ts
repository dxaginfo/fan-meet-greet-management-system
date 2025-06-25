import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err } as any;
  error.message = err.message;

  // Log the error
  logger.error(
    `${req.method} ${req.path} - ${err.message}`,
    { error: err, stack: err.stack }
  );

  // Check if error is an instance of AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      status: err.status,
    });
  }

  // Handle Sequelize validation errors
  if (error.name === 'SequelizeValidationError') {
    const message = error.errors.map((e: any) => e.message).join(', ');
    return res.status(400).json({
      success: false,
      error: message,
      status: 'fail',
    });
  }

  // Handle Sequelize unique constraint errors
  if (error.name === 'SequelizeUniqueConstraintError') {
    const message = 'Duplicate field value entered';
    return res.status(400).json({
      success: false,
      error: message,
      status: 'fail',
    });
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    const message = 'Invalid token. Please log in again.';
    return res.status(401).json({
      success: false,
      error: message,
      status: 'fail',
    });
  }

  // Handle JWT expiration
  if (error.name === 'TokenExpiredError') {
    const message = 'Token expired. Please log in again.';
    return res.status(401).json({
      success: false,
      error: message,
      status: 'fail',
    });
  }

  // Default error response
  return res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    status: error.status || 'error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};