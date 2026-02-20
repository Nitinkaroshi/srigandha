import express from 'express';
import { protectMember } from '../middleware/memberAuth.js';
import {
  googleAuth,
  getMemberProfile,
  updateMemberProfile,
  getMemberBookings,
  registerPlan
} from '../controllers/memberAuthController.js';

const router = express.Router();

router.post('/google', googleAuth);
router.get('/profile', protectMember, getMemberProfile);
router.put('/profile', protectMember, updateMemberProfile);
router.get('/bookings', protectMember, getMemberBookings);
router.post('/register-plan', protectMember, registerPlan);

export default router;
