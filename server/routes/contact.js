import express from 'express';
import { submitContactForm, getAllMessages, toggleReadStatus, deleteMessage } from '../controllers/contactController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', submitContactForm);
router.get('/', protect, admin, getAllMessages);
router.put('/:id/read', protect, admin, toggleReadStatus);
router.delete('/:id', protect, admin, deleteMessage);

export default router;
