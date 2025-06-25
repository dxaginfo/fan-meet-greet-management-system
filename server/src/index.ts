import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';
import { connectDB } from './database/connection';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to the database
connectDB();

// Socket.io connection
io.on('connection', (socket) => {
  logger.info(`Socket connected: ${socket.id}`);
  
  socket.on('disconnect', () => {
    logger.info(`Socket disconnected: ${socket.id}`);
  });
  
  // Event check-in notification
  socket.on('join-event', (eventId: string) => {
    socket.join(`event-${eventId}`);
  });
  
  // Artist notification
  socket.on('join-artist-room', (artistId: string) => {
    socket.join(`artist-${artistId}`);
  });
});

// API Routes
app.use('/api', routes);

// Error handler
app.use(errorHandler);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Start the server
const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  httpServer.close(() => process.exit(1));
});

// For testing purposes
export { app, httpServer };