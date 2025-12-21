import express from 'express';
import Carousel from '../models/Carousel.js';
import { protect, admin } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/carousel');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'carousel-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];

    if (allowedTypes.includes(file.mimetype)) {
      return cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, GIF, WEBP, and SVG image files are allowed'));
    }
  }
});

// Get all carousel slides (public - only active)
router.get('/', async (req, res) => {
  try {
    const slides = await Carousel.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 });
    res.json(slides);
  } catch (error) {
    console.error('Error fetching carousel slides:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all carousel slides (admin - including inactive)
router.get('/all', protect, admin, async (req, res) => {
  try {
    const slides = await Carousel.find()
      .sort({ order: 1, createdAt: -1 });
    res.json(slides);
  } catch (error) {
    console.error('Error fetching carousel slides:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single carousel slide
router.get('/:id', async (req, res) => {
  try {
    const slide = await Carousel.findById(req.params.id);
    if (!slide) {
      return res.status(404).json({ message: 'Carousel slide not found' });
    }
    res.json(slide);
  } catch (error) {
    console.error('Error fetching carousel slide:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create carousel slide
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
  try {
    const { title, caption, link, order, isActive } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const slide = new Carousel({
      title,
      image: `/uploads/carousel/${req.file.filename}`,
      caption,
      link,
      order: order || 0,
      isActive: isActive === 'true' || isActive === true
    });

    await slide.save();
    res.status(201).json(slide);
  } catch (error) {
    console.error('Error creating carousel slide:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update carousel slide
router.put('/:id', protect, admin, upload.single('image'), async (req, res) => {
  try {
    const { title, caption, link, order, isActive } = req.body;
    const slide = await Carousel.findById(req.params.id);

    if (!slide) {
      return res.status(404).json({ message: 'Carousel slide not found' });
    }

    slide.title = title || slide.title;
    slide.caption = caption !== undefined ? caption : slide.caption;
    slide.link = link !== undefined ? link : slide.link;
    slide.order = order !== undefined ? order : slide.order;
    slide.isActive = isActive !== undefined ? (isActive === 'true' || isActive === true) : slide.isActive;

    // Update image if new file uploaded
    if (req.file) {
      // Delete old image
      if (slide.image) {
        const oldImagePath = path.join(__dirname, '..', slide.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      slide.image = `/uploads/carousel/${req.file.filename}`;
    }

    await slide.save();
    res.json(slide);
  } catch (error) {
    console.error('Error updating carousel slide:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete carousel slide
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const slide = await Carousel.findById(req.params.id);

    if (!slide) {
      return res.status(404).json({ message: 'Carousel slide not found' });
    }

    // Delete image file
    if (slide.image) {
      const imagePath = path.join(__dirname, '..', slide.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Carousel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Carousel slide deleted successfully' });
  } catch (error) {
    console.error('Error deleting carousel slide:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
