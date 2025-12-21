import Committee from '../models/Committee.js';
import { handleMongooseError } from '../utils/errorHandler.js';

// @desc    Get all committee members
// @route   GET /api/committee?type=current|past
// @access  Public
export const getAllCommitteeMembers = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = {};

    if (type) {
      filter.type = type;
    }

    const members = await Committee.find(filter).sort({ order: 1 });
    res.json(members);
  } catch (error) {
    const { status, message } = handleMongooseError(error);
    res.status(status).json({ message });
  }
};

// @desc    Get single committee member
// @route   GET /api/committee/:id
// @access  Public
export const getCommitteeMemberById = async (req, res) => {
  try {
    const member = await Committee.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ message: 'Committee member not found' });
    }

    res.json(member);
  } catch (error) {
    const { status, message } = handleMongooseError(error);
    res.status(status).json({ message });
  }
};

// @desc    Create committee member
// @route   POST /api/committee
// @access  Private/Admin
export const createCommitteeMember = async (req, res) => {
  try {
    const { name, position } = req.body;

    if (!name || !position) {
      return res.status(400).json({ message: 'Please provide all required fields: name, position' });
    }

    const member = await Committee.create(req.body);
    res.status(201).json(member);
  } catch (error) {
    const { status, message } = handleMongooseError(error);
    res.status(status).json({ message });
  }
};

// @desc    Update committee member
// @route   PUT /api/committee/:id
// @access  Private/Admin
export const updateCommitteeMember = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: 'Committee member ID is required' });
    }

    const member = await Committee.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!member) {
      return res.status(404).json({ message: 'Committee member not found' });
    }

    res.json(member);
  } catch (error) {
    const { status, message } = handleMongooseError(error);
    res.status(status).json({ message });
  }
};

// @desc    Delete committee member
// @route   DELETE /api/committee/:id
// @access  Private/Admin
export const deleteCommitteeMember = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: 'Committee member ID is required' });
    }

    const member = await Committee.findByIdAndDelete(req.params.id);

    if (!member) {
      return res.status(404).json({ message: 'Committee member not found' });
    }

    res.json({ message: 'Committee member deleted successfully' });
  } catch (error) {
    const { status, message } = handleMongooseError(error);
    res.status(status).json({ message });
  }
};
