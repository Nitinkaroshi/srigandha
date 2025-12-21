import Page from '../models/Page.js';
import { handleMongooseError } from '../utils/errorHandler.js';

// @desc    Get all pages
// @route   GET /api/pages
// @access  Public
export const getAllPages = async (req, res) => {
  try {
    const pages = await Page.find().sort({ createdAt: -1 });
    res.json(pages);
  } catch (error) {
    const { status, message } = handleMongooseError(error);
    res.status(status).json({ message });
  }
};

// @desc    Get page by slug
// @route   GET /api/pages/:slug
// @access  Public
export const getPageBySlug = async (req, res) => {
  try {
    if (!req.params.slug) {
      return res.status(400).json({ message: 'Page slug is required' });
    }

    const page = await Page.findOne({ slug: req.params.slug });

    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }

    res.json(page);
  } catch (error) {
    const { status, message } = handleMongooseError(error);
    res.status(status).json({ message });
  }
};

// @desc    Create page
// @route   POST /api/pages
// @access  Private/Admin
export const createPage = async (req, res) => {
  try {
    const { title, slug, content } = req.body;

    if (!title || !slug || !content) {
      return res.status(400).json({ message: 'Please provide all required fields: title, slug, content' });
    }

    const page = await Page.create(req.body);
    res.status(201).json(page);
  } catch (error) {
    const { status, message } = handleMongooseError(error);
    res.status(status).json({ message });
  }
};

// @desc    Update page
// @route   PUT /api/pages/:id
// @access  Private/Admin
export const updatePage = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: 'Page ID is required' });
    }

    const page = await Page.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }

    res.json(page);
  } catch (error) {
    const { status, message } = handleMongooseError(error);
    res.status(status).json({ message });
  }
};

// @desc    Delete page
// @route   DELETE /api/pages/:id
// @access  Private/Admin
export const deletePage = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: 'Page ID is required' });
    }

    const page = await Page.findByIdAndDelete(req.params.id);

    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }

    res.json({ message: 'Page deleted successfully' });
  } catch (error) {
    const { status, message } = handleMongooseError(error);
    res.status(status).json({ message });
  }
};
