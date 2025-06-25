import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import MeetGreetBooking from '../models/MeetGreetBooking';
import Event from '../models/Event';
import User from '../models/User';
import { AppError } from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';
import { logger } from '../utils/logger';

// @desc    Get all bookings (filtered by user role)
// @route   GET /api/bookings
// @access  Private
export const getAllBookings = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, status, eventId } = req.query;
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const offset = (pageNum - 1) * limitNum;

  const whereClause: any = {};
  if (status) whereClause.status = status;
  if (eventId) whereClause.eventId = eventId;

  // If user is a fan, only show their bookings
  if (req.user.role === 'fan') {
    whereClause.fanId = req.user.id;
  }
  // If user is an artist, only show bookings for their events
  else if (req.user.role === 'artist') {
    // Get all events created by this artist
    const artistEvents = await Event.findAll({
      where: { artistId: req.user.id },
      attributes: ['id'],
    });
    
    const eventIds = artistEvents.map(event => event.id);
    whereClause.eventId = eventIds;
  }

  const { count, rows: bookings } = await MeetGreetBooking.findAndCountAll({
    where: whereClause,
    limit: limitNum,
    offset,
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: Event,
        as: 'event',
        attributes: ['id', 'title', 'eventDate', 'startTime', 'endTime', 'venueName'],
      },
      {
        model: User,
        as: 'fan',
        attributes: ['id', 'firstName', 'lastName', 'email', 'profileImage'],
      },
    ],
  });

  res.status(200).json({
    success: true,
    count,
    totalPages: Math.ceil(count / limitNum),
    currentPage: pageNum,
    bookings,
  });
});

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const booking = await MeetGreetBooking.findByPk(id, {
    include: [
      {
        model: Event,
        as: 'event',
        attributes: ['id', 'title', 'eventDate', 'startTime', 'endTime', 'venueName', 'address', 'city', 'state', 'zipCode', 'country'],
      },
      {
        model: User,
        as: 'fan',
        attributes: ['id', 'firstName', 'lastName', 'email', 'profileImage'],
      },
    ],
  });

  if (!booking) {
    throw new AppError('Booking not found', 404);
  }

  // Check if user has permission to view this booking
  if (
    req.user.role !== 'admin' &&
    req.user.role !== 'manager' &&
    req.user.id !== booking.fanId &&
    // If user is an artist, check if the booking is for one of their events
    !(req.user.role === 'artist' && booking.event && booking.event.artistId === req.user.id)
  ) {
    throw new AppError('Not authorized to view this booking', 403);
  }

  res.status(200).json({
    success: true,
    booking,
  });
});

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (Fan role only)
export const createBooking = catchAsync(async (req: Request, res: Response) => {
  // Only fans can create bookings
  if (req.user.role !== 'fan') {
    throw new AppError('Only fans can create bookings', 403);
  }

  const { eventId, specialRequests } = req.body;

  // Check if event exists
  const event = await Event.findByPk(eventId);
  if (!event) {
    throw new AppError('Event not found', 404);
  }

  // Check if event is in the future
  if (new Date(event.eventDate) < new Date()) {
    throw new AppError('Cannot book for past events', 400);
  }

  // Check if event is not cancelled
  if (event.status === 'cancelled') {
    throw new AppError('Cannot book for cancelled events', 400);
  }

  // Check if user already has a booking for this event
  const existingBooking = await MeetGreetBooking.findOne({
    where: {
      eventId,
      fanId: req.user.id,
      status: ['pending', 'confirmed'],
    },
  });

  if (existingBooking) {
    throw new AppError('You already have a booking for this event', 400);
  }

  // Check capacity - count existing bookings
  const bookingCount = await MeetGreetBooking.count({
    where: {
      eventId,
      status: ['pending', 'confirmed'],
    },
  });

  if (bookingCount >= event.totalCapacity) {
    throw new AppError('This event is fully booked', 400);
  }

  // Create booking
  const booking = await MeetGreetBooking.create({
    id: uuidv4(),
    eventId,
    fanId: req.user.id,
    bookingDate: new Date(),
    status: 'pending',
    specialRequests,
  });

  logger.info(`Booking created: ${booking.id} for event ${eventId} by fan ${req.user.id}`);

  res.status(201).json({
    success: true,
    booking,
  });
});

// @desc    Update booking status
// @route   PATCH /api/bookings/:id/status
// @access  Private (Artist, Manager, Admin)
export const updateBookingStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
    throw new AppError('Invalid status value', 400);
  }

  const booking = await MeetGreetBooking.findByPk(id, {
    include: [
      {
        model: Event,
        as: 'event',
      },
    ],
  });

  if (!booking) {
    throw new AppError('Booking not found', 404);
  }

  // Check if user has permission to update this booking
  if (
    req.user.role !== 'admin' &&
    req.user.role !== 'manager' &&
    // If user is an artist, check if the booking is for one of their events
    !(req.user.role === 'artist' && booking.event && booking.event.artistId === req.user.id)
  ) {
    throw new AppError('Not authorized to update this booking', 403);
  }

  // Update status
  await booking.update({ status });

  logger.info(`Booking status changed: ${booking.id} to ${status} by ${req.user.id}`);

  res.status(200).json({
    success: true,
    booking,
  });
});

// @desc    Cancel a booking (for fans)
// @route   PATCH /api/bookings/:id/cancel
// @access  Private (Fan - own bookings only)
export const cancelBooking = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const booking = await MeetGreetBooking.findByPk(id);

  if (!booking) {
    throw new AppError('Booking not found', 404);
  }

  // Check if user is the booking owner
  if (req.user.id !== booking.fanId) {
    throw new AppError('Not authorized to cancel this booking', 403);
  }

  // Check if booking is already cancelled or completed
  if (booking.status === 'cancelled') {
    throw new AppError('Booking is already cancelled', 400);
  }

  if (booking.status === 'completed') {
    throw new AppError('Cannot cancel a completed booking', 400);
  }

  // Get the event to check date
  const event = await Event.findByPk(booking.eventId);
  if (!event) {
    throw new AppError('Event not found', 404);
  }

  // Check if event is in the past (optional - you may want to allow cancellation anyway)
  if (new Date(event.eventDate) < new Date()) {
    throw new AppError('Cannot cancel bookings for past events', 400);
  }

  // Update status to cancelled
  await booking.update({ status: 'cancelled' });

  logger.info(`Booking cancelled: ${booking.id} by fan ${req.user.id}`);

  res.status(200).json({
    success: true,
    message: 'Booking has been cancelled',
    booking,
  });
});

// @desc    Check in a fan for a meet & greet
// @route   PATCH /api/bookings/:id/check-in
// @access  Private (Artist, Manager, Staff, Admin)
export const checkInBooking = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const booking = await MeetGreetBooking.findByPk(id, {
    include: [
      {
        model: Event,
        as: 'event',
      },
    ],
  });

  if (!booking) {
    throw new AppError('Booking not found', 404);
  }

  // Check if user has permission
  if (
    req.user.role !== 'admin' &&
    req.user.role !== 'manager' &&
    req.user.role !== 'staff' &&
    // If user is an artist, check if the booking is for one of their events
    !(req.user.role === 'artist' && booking.event && booking.event.artistId === req.user.id)
  ) {
    throw new AppError('Not authorized to check in this booking', 403);
  }

  // Check if booking is confirmed
  if (booking.status !== 'confirmed') {
    throw new AppError('Only confirmed bookings can be checked in', 400);
  }

  // Update with check-in time
  await booking.update({
    status: 'completed',
    checkInTime: new Date(),
  });

  logger.info(`Booking checked in: ${booking.id} by ${req.user.id}`);

  res.status(200).json({
    success: true,
    message: 'Fan checked in successfully',
    booking,
  });
});

// @desc    Add notes to a booking
// @route   PATCH /api/bookings/:id/notes
// @access  Private (Artist, Manager, Staff, Admin)
export const addBookingNotes = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { notes } = req.body;

  const booking = await MeetGreetBooking.findByPk(id, {
    include: [
      {
        model: Event,
        as: 'event',
      },
    ],
  });

  if (!booking) {
    throw new AppError('Booking not found', 404);
  }

  // Check if user has permission
  if (
    req.user.role !== 'admin' &&
    req.user.role !== 'manager' &&
    req.user.role !== 'staff' &&
    // If user is an artist, check if the booking is for one of their events
    !(req.user.role === 'artist' && booking.event && booking.event.artistId === req.user.id)
  ) {
    throw new AppError('Not authorized to add notes to this booking', 403);
  }

  // Update notes
  await booking.update({ notes });

  logger.info(`Booking notes updated: ${booking.id} by ${req.user.id}`);

  res.status(200).json({
    success: true,
    message: 'Notes added successfully',
    booking,
  });
});