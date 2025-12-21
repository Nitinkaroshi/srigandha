import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import {
  getAllPages,
  getPageBySlug,
  createPage,
  updatePage,
  deletePage
} from '../controllers/pageController.js';

const router = express.Router();

router.get('/', getAllPages);
router.get('/:slug', getPageBySlug);
router.post('/', protect, admin, createPage);
router.put('/:id', protect, admin, updatePage);
router.delete('/:id', protect, admin, deletePage);

export default router;
