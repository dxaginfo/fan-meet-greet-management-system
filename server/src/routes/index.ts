import { Router } from 'express';
import authRoutes from './auth.routes';
import eventRoutes from './event.routes';
import artistRoutes from './artist.routes';
import bookingRoutes from './booking.routes';
import userRoutes from './user.routes';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes
router.use('/auth', authRoutes);

// Protected routes
router.use('/events', eventRoutes);
router.use('/artists', artistRoutes);
router.use('/bookings', authenticate, bookingRoutes);
router.use('/users', authenticate, userRoutes);

export default router;