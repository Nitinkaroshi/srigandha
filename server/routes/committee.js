import express from 'express';
import { getAllCommitteeMembers, getCommitteeMemberById } from '../controllers/committeeController.js';

const router = express.Router();

router.get('/', getAllCommitteeMembers);
router.get('/:id', getCommitteeMemberById);

export default router;
