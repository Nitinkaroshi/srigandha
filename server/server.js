import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { sendErrorAlert, sendServerRestartAlert, sendCriticalAlert } from './utils/errorMonitor.js';

import pageRoutes from './routes/pages.js';
import eventRoutes from './routes/events.js';
import committeeRoutes from './routes/committee.js';
import galleryRoutes from './routes/gallery.js';
import contactRoutes from './routes/contact.js';
import settingsRoutes from './routes/settings.js';
import carouselRoutes from './routes/carousel.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

connectDB();

// Gzip/Brotli compression for all responses
app.use(compression());

// CORS
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'https://www.srigandhafl.org',
  'https://srigandhafl.org',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(allowed => origin === allowed || origin.endsWith(allowed.replace(/^https?:\/\//, '')))) {
      return callback(null, true);
    }
    callback(null, false);
  },
  credentials: true
}));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { message: 'Too many requests, please try again later.' }
});

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { message: 'Too many messages sent, please try again later.' }
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static uploads directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir, {
  maxAge: '7d',
  etag: true
}));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes with rate limiting
app.use('/api/contact', contactLimiter);
app.use('/api', apiLimiter);

app.use('/api/pages', pageRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/committee', committeeRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/carousel', carouselRoutes);

app.get('/api', (req, res) => {
  res.json({ message: 'API is running', version: '1.0.0' });
});

// Serve React client build in production
const clientBuildPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath, {
    maxAge: '1d',
    etag: true
  }));

  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      res.sendFile(path.join(clientBuildPath, 'index.html'));
    }
  });
} else {
  app.get('/', (req, res) => {
    res.json({ message: 'Srigandha API Server Running' });
  });
}

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (process.env.NODE_ENV === 'production') {
    sendErrorAlert(err, {
      endpoint: req.originalUrl,
      method: req.method,
    }).catch(console.error);
  }

  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

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
