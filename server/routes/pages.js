import express from 'express';
import { getAllPages, getPageBySlug } from '../controllers/pageController.js';

const router = express.Router();

router.get('/', getAllPages);
router.get('/:slug', getPageBySlug);

export default router;
