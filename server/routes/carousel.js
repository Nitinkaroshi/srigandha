import express from 'express';
import Carousel from '../models/Carousel.js';

const router = express.Router();

// Get all active carousel slides (public)
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

export default router;
