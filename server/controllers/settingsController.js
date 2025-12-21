import SiteSettings from '../models/SiteSettings.js';
import { handleMongooseError } from '../utils/errorHandler.js';

// @desc    Get site settings
// @route   GET /api/settings
// @access  Public
export const getSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();

    // Create default settings if none exist
    if (!settings) {
      settings = await SiteSettings.create({
        siteName: 'Srigandha Kannada Koota of Florida',
        contactEmail: 'info@srigandhafl.org',
        contactPhone: '',
        address: '',
        socialMedia: {
          facebook: '',
          twitter: '',
          instagram: ''
        }
      });
    }

    res.json(settings);
  } catch (error) {
    const { status, message } = handleMongooseError(error);
    res.status(status).json({ message });
  }
};

// @desc    Update site settings
// @route   PUT /api/settings
// @access  Private/Admin
export const updateSettings = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'Please provide at least one field to update' });
    }

    let settings = await SiteSettings.findOne();

    if (settings) {
      settings = await SiteSettings.findByIdAndUpdate(settings._id, req.body, { new: true });
    } else {
      settings = await SiteSettings.create(req.body);
    }

    res.json(settings);
  } catch (error) {
    const { status, message } = handleMongooseError(error);
    res.status(status).json({ message });
  }
};
