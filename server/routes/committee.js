import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import {
  getAllCommitteeMembers,
  getCommitteeMemberById,
  createCommitteeMember,
  updateCommitteeMember,
  deleteCommitteeMember
} from '../controllers/committeeController.js';

const router = express.Router();

router.get('/', getAllCommitteeMembers);
router.get('/:id', getCommitteeMemberById);
router.post('/', protect, admin, createCommitteeMember);
router.put('/:id', protect, admin, updateCommitteeMember);
router.delete('/:id', protect, admin, deleteCommitteeMember);

export default router;
