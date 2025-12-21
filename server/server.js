import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { sendErrorAlert, sendServerRestartAlert, sendCriticalAlert } from './utils/errorMonitor.js';

import authRoutes from './routes/auth.js';
import pageRoutes from './routes/pages.js';
import eventRoutes from './routes/events.js';
import committeeRoutes from './routes/committee.js';
import galleryRoutes from './routes/gallery.js';
import contactRoutes from './routes/contact.js';
import settingsRoutes from './routes/settings.js';
import uploadRoutes from './routes/upload.js';
import carouselRoutes from './routes/carousel.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

connectDB();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));

app.use('/api/auth', authRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/committee', committeeRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/carousel', carouselRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Srigandha API Server Running' });
});

app.get('/api', (req, res) => {
  res.json({ message: 'API is running', version: '1.0.0' });
});

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Send error alert email in production
  if (process.env.NODE_ENV === 'production') {
    sendErrorAlert(err, {
      endpoint: req.originalUrl,
      method: req.method,
      userId: req.user?.id
    }).catch(console.error);
  }

  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // Send restart notification on server start (only in production)
  if (process.env.NODE_ENV === 'production') {
    sendServerRestartAlert().catch(console.error);
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);

  if (process.env.NODE_ENV === 'production') {
    sendCriticalAlert(
      'Unhandled Promise Rejection',
      'An unhandled promise rejection occurred in the server.',
      { reason: reason.toString() }
    ).catch(console.error);
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);

  if (process.env.NODE_ENV === 'production') {
    sendCriticalAlert(
      'Uncaught Exception',
      'A critical uncaught exception occurred. Server will restart.',
      { error: error.message, stack: error.stack }
    ).catch(console.error);
  }

  // Give time for alert to be sent before exiting
  setTimeout(() => {
    process.exit(1);
  }, 2000);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});