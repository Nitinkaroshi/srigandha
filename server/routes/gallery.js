import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import {
  getAllGalleryItems,
  getAllGalleryItemsAdmin,
  getGalleryItemById,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem
} from '../controllers/galleryController.js';

const router = express.Router();

router.get('/', getAllGalleryItems);
router.get('/all', protect, admin, getAllGalleryItemsAdmin);
router.get('/:id', getGalleryItemById);
router.post('/', protect, admin, createGalleryItem);
router.put('/:id', protect, admin, updateGalleryItem);
router.delete('/:id', protect, admin, deleteGalleryItem);

export default router;
