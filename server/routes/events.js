import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import { optionalMember } from '../middleware/memberAuth.js';
import {
  getAllEvents,
  getAllEventsAdmin,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} from '../controllers/eventController.js';

const router = express.Router();

router.get('/', optionalMember, getAllEvents);
router.get('/all', protect, admin, getAllEventsAdmin);
router.get('/:id', getEventById);
router.post('/', protect, admin, createEvent);
router.put('/:id', protect, admin, updateEvent);
router.delete('/:id', protect, admin, deleteEvent);

export default router;