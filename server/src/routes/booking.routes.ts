import { Router } from 'express';
import { body } from 'express-validator';
import {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
  cancelBooking,
  checkInBooking,
  addBookingNotes,
} from '../controllers/booking.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';

const router = Router();

// All routes require authentication
router.use(authenticate);

// @route   GET /api/bookings
// @desc    Get all bookings (filtered by user role)
// @access  Private
router.get('/', getAllBookings);

// @route   GET /api/bookings/:id
// @desc    Get booking by ID
// @access  Private
router.get('/:id', getBookingById);

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private (Fan role only)
router.post(
  '/',
  authorize('fan'),
  [
    body('eventId').isUUID().withMessage('Event ID must be a valid UUID'),
    body('specialRequests').optional().isString().withMessage('Special requests must be a string'),
  ],
  validateRequest,
  createBooking
);

// @route   PATCH /api/bookings/:id/status
// @desc    Update booking status
// @access  Private (Artist, Manager, Admin)
router.patch(
  '/:id/status',
  authorize('artist', 'manager', 'admin'),
  [
    body('status')
      .isIn(['pending', 'confirmed', 'cancelled', 'completed'])
      .withMessage('Status must be pending, confirmed, cancelled, or completed'),
  ],
  validateRequest,
  updateBookingStatus
);

// @route   PATCH /api/bookings/:id/cancel
// @desc    Cancel a booking (for fans)
// @access  Private (Fan - own bookings only)
router.patch('/:id/cancel', authorize('fan'), cancelBooking);

// @route   PATCH /api/bookings/:id/check-in
// @desc    Check in a fan for a meet & greet
// @access  Private (Artist, Manager, Staff, Admin)
router.patch(
  '/:id/check-in',
  authorize('artist', 'manager', 'staff', 'admin'),
  checkInBooking
);

// @route   PATCH /api/bookings/:id/notes
// @desc    Add notes to a booking
// @access  Private (Artist, Manager, Staff, Admin)
router.patch(
  '/:id/notes',
  authorize('artist', 'manager', 'staff', 'admin'),
  [body('notes').isString().withMessage('Notes must be a string')],
  validateRequest,
  addBookingNotes
);

export default router;