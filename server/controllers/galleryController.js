import Gallery from '../models/Gallery.js';
import { handleMongooseError } from '../utils/errorHandler.js';

// @desc    Get all gallery items
// @route   GET /api/gallery
// @access  Public
export const getAllGalleryItems = async (req, res) => {
  try {
    const items = await Gallery.find({ isPublished: true }).sort({ eventDate: -1 });
    res.json(items);
  } catch (error) {
    const { status, message } = handleMongooseError(error);
    res.status(status).json({ message });
  }
};

// @desc    Get single gallery item
// @route   GET /api/gallery/:id
// @access  Public
export const getGalleryItemById = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    res.json(item);
  } catch (error) {
    const { status, message } = handleMongooseError(error);
    res.status(status).json({ message });
  }
};

// @desc    Create gallery item
// @route   POST /api/gallery
// @access  Private/Admin
export const createGalleryItem = async (req, res) => {
  try {
    const { title, eventDate, images } = req.body;

    if (!title || !eventDate || !images || images.length === 0) {
      return res.status(400).json({ message: 'Please provide all required fields: title, eventDate, and at least one image' });
    }

    const item = await Gallery.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    const { status, message } = handleMongooseError(error);
    res.status(status).json({ message });
  }
};

// @desc    Update gallery item
// @route   PUT /api/gallery/:id
// @access  Private/Admin
export const updateGalleryItem = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: 'Gallery item ID is required' });
    }

    const item = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    res.json(item);
  } catch (error) {
    const { status, message } = handleMongooseError(error);
    res.status(status).json({ message });
  }
};

// @desc    Delete gallery item
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
export const deleteGalleryItem = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: 'Gallery item ID is required' });
    }

    const item = await Gallery.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    res.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    const { status, message } = handleMongooseError(error);
    res.status(status).json({ message });
  }
};
