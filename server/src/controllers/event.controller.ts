import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Event from '../models/Event';
import { AppError } from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';
import { logger } from '../utils/logger';

// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getAllEvents = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, status, artistId } = req.query;
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const offset = (pageNum - 1) * limitNum;

  const whereClause: any = {};
  if (status) whereClause.status = status;
  if (artistId) whereClause.artistId = artistId;

  const { count, rows: events } = await Event.findAndCountAll({
    where: whereClause,
    limit: limitNum,
    offset,
    order: [['eventDate', 'ASC']],
  });

  res.status(200).json({
    success: true,
    count,
    totalPages: Math.ceil(count / limitNum),
    currentPage: pageNum,
    events,
  });
});

// @desc    Get event by ID
// @route   GET /api/events/:id
// @access  Public
export const getEventById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const event = await Event.findByPk(id);

  if (!event) {
    throw new AppError('Event not found', 404);
  }

  res.status(200).json({
    success: true,
    event,
  });
});

// @desc    Create a new event
// @route   POST /api/events
// @access  Private (Artist, Manager, Admin)
export const createEvent = catchAsync(async (req: Request, res: Response) => {
  const {
    title,
    description,
    eventDate,
    startTime,
    endTime,
    venueName,
    address,
    city,
    state,
    zipCode,
    country,
    totalCapacity,
    imageUrl,
    artistId,
  } = req.body;

  // Create event
  const event = await Event.create({
    id: uuidv4(),
    title,
    description,
    eventDate,
    startTime,
    endTime,
    venueName,
    address,
    city,
    state,
    zipCode,
    country,
    totalCapacity,
    status: 'scheduled',
    imageUrl,
    artistId,
    createdBy: req.user.id,
  });

  logger.info(`Event created: ${event.id}`);

  res.status(201).json({
    success: true,
    event,
  });
});

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Owner, Manager, Admin)
export const updateEvent = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const event = await Event.findByPk(id);

  if (!event) {
    throw new AppError('Event not found', 404);
  }

  // Check if user is authorized to update the event
  if (
    req.user.role !== 'admin' &&
    req.user.id !== event.createdBy &&
    req.user.role !== 'manager'
  ) {
    throw new AppError('Not authorized to update this event', 403);
  }

  // Update event
  await event.update(req.body);

  logger.info(`Event updated: ${event.id}`);

  res.status(200).json({
    success: true,
    event,
  });
});

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Owner, Admin)
export const deleteEvent = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const event = await Event.findByPk(id);

  if (!event) {
    throw new AppError('Event not found', 404);
  }

  // Check if user is authorized to delete the event
  if (req.user.role !== 'admin' && req.user.id !== event.createdBy) {
    throw new AppError('Not authorized to delete this event', 403);
  }

  await event.destroy();

  logger.info(`Event deleted: ${id}`);

  res.status(200).json({
    success: true,
    message: 'Event deleted successfully',
  });
});

// @desc    Change event status
// @route   PATCH /api/events/:id/status
// @access  Private (Owner, Manager, Admin)
export const changeEventStatus = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['scheduled', 'in-progress', 'completed', 'cancelled'].includes(status)) {
      throw new AppError('Invalid status value', 400);
    }

    const event = await Event.findByPk(id);

    if (!event) {
      throw new AppError('Event not found', 404);
    }

    // Check if user is authorized to update the event
    if (
      req.user.role !== 'admin' &&
      req.user.id !== event.createdBy &&
      req.user.role !== 'manager'
    ) {
      throw new AppError('Not authorized to update this event', 403);
    }

    // Update status
    await event.update({ status });

    logger.info(`Event status changed: ${event.id} to ${status}`);

    res.status(200).json({
      success: true,
      event,
    });
  }
);