import { Router } from 'express';
import { body } from 'express-validator';
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  changeEventStatus,
} from '../controllers/event.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';

const router = Router();

// @route   GET /api/events
// @desc    Get all events
// @access  Public
router.get('/', getAllEvents);

// @route   GET /api/events/:id
// @desc    Get event by ID
// @access  Public
router.get('/:id', getEventById);

// @route   POST /api/events
// @desc    Create a new event
// @access  Private (Artist, Manager, Admin)
router.post(
  '/',
  authenticate,
  authorize('artist', 'manager', 'admin'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('eventDate')
      .isISO8601()
      .withMessage('Event date must be a valid date'),
    body('startTime')
      .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('Start time must be in format HH:MM'),
    body('endTime')
      .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('End time must be in format HH:MM'),
    body('venueName').trim().notEmpty().withMessage('Venue name is required'),
    body('address').trim().notEmpty().withMessage('Address is required'),
    body('city').trim().notEmpty().withMessage('City is required'),
    body('state').trim().notEmpty().withMessage('State is required'),
    body('zipCode').trim().notEmpty().withMessage('Zip code is required'),
    body('country').trim().notEmpty().withMessage('Country is required'),
    body('totalCapacity')
      .isInt({ min: 1 })
      .withMessage('Total capacity must be a positive number'),
    body('artistId').isUUID().withMessage('Artist ID must be a valid UUID'),
  ],
  validateRequest,
  createEvent
);

// @route   PUT /api/events/:id
// @desc    Update event
// @access  Private (Owner, Manager, Admin)
router.put(
  '/:id',
  authenticate,
  [
    body('title').trim().optional().notEmpty().withMessage('Title cannot be empty'),
    body('description')
      .trim()
      .optional()
      .notEmpty()
      .withMessage('Description cannot be empty'),
    body('eventDate')
      .optional()
      .isISO8601()
      .withMessage('Event date must be a valid date'),
    body('startTime')
      .optional()
      .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('Start time must be in format HH:MM'),
    body('endTime')
      .optional()
      .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('End time must be in format HH:MM'),
    body('venueName')
      .trim()
      .optional()
      .notEmpty()
      .withMessage('Venue name cannot be empty'),
    body('address')
      .trim()
      .optional()
      .notEmpty()
      .withMessage('Address cannot be empty'),
    body('city').trim().optional().notEmpty().withMessage('City cannot be empty'),
    body('state')
      .trim()
      .optional()
      .notEmpty()
      .withMessage('State cannot be empty'),
    body('zipCode')
      .trim()
      .optional()
      .notEmpty()
      .withMessage('Zip code cannot be empty'),
    body('country')
      .trim()
      .optional()
      .notEmpty()
      .withMessage('Country cannot be empty'),
    body('totalCapacity')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Total capacity must be a positive number'),
    body('artistId')
      .optional()
      .isUUID()
      .withMessage('Artist ID must be a valid UUID'),
  ],
  validateRequest,
  updateEvent
);

// @route   DELETE /api/events/:id
// @desc    Delete event
// @access  Private (Owner, Admin)
router.delete('/:id', authenticate, deleteEvent);

// @route   PATCH /api/events/:id/status
// @desc    Change event status
// @access  Private (Owner, Manager, Admin)
router.patch(
  '/:id/status',
  authenticate,
  [
    body('status')
      .isIn(['scheduled', 'in-progress', 'completed', 'cancelled'])
      .withMessage(
        'Status must be one of: scheduled, in-progress, completed, cancelled'
      ),
  ],
  validateRequest,
  changeEventStatus
);

export default router;