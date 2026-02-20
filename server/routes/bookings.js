import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import {
  createBooking,
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
  getBookingStats
} from '../controllers/bookingController.js';

const router = express.Router();

router.post('/', createBooking);
router.get('/', protect, admin, getAllBookings);
router.get('/stats/:eventId', protect, admin, getBookingStats);
router.put('/:id', protect, admin, updateBookingStatus);
router.delete('/:id', protect, admin, deleteBooking);

export default router;
