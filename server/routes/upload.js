import express from 'express';
import { upload } from '../middleware/upload.js';
import { protect, admin } from '../middleware/auth.js';
import { uploadSingle, uploadMultiple, deleteFile } from '../controllers/uploadController.js';

const router = express.Router();

router.post('/single', protect, admin, upload.single('image'), uploadSingle);
router.post('/multiple', protect, admin, upload.array('images', 10), uploadMultiple);
router.delete('/:filename', protect, admin, deleteFile);

export default router;
