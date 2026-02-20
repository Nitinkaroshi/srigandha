import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import {
  registerMember,
  getAllMembers,
  updateMember,
  deleteMember,
  getMemberStats
} from '../controllers/memberController.js';

const router = express.Router();

router.post('/', registerMember);
router.get('/', protect, admin, getAllMembers);
router.get('/stats', protect, admin, getMemberStats);
router.put('/:id', protect, admin, updateMember);
router.delete('/:id', protect, admin, deleteMember);

export default router;
