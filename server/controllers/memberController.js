import Member from '../models/Member.js';
import { handleMongooseError } from '../utils/errorHandler.js';

// @desc    Register a new member (public)
// @route   POST /api/members
// @access  Public
export const registerMember = async (req, res) => {
  try {
    const { name, email, phone, address, plan, familyMembers, paymentMethod, paymentReference, notes } = req.body;

    if (!name || !email || !phone || !plan) {
      return res.status(400).json({ message: 'Please provide all required fields: name, email, phone, plan' });
    }

    // Check for existing active/pending membership
    const existing = await Member.findOne({
      email,
      status: { $in: ['pending', 'active'] }
    });
    if (existing) {
      return res.status(400).json({ message: 'You already have an active or pending membership' });
    }

    const member = await Member.create({
      name,
      email,
      phone,
      address,
      plan,
      familyMembers,
      paymentMethod,
      paymentReference,
      notes
    });

    res.status(201).json(member);
  } catch (error) {
    const { status, message } = handleMongooseError(error);
    res.status(status).json({ message });
  }
};

// @desc    Get all members (admin)
// @route   GET /api/members
// @access  Private/Admin
export const getAllMembers = async (req, res) => {
  try {
    const { status, plan } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (plan) filter.plan = plan;

    const members = await Member.find(filter).sort({ createdAt: -1 });

    res.json(members);
  } catch (error) {
    const { status, message } = handleMongooseError(error);
    res.status(status).json({ message });
  }
};

// @desc    Update a member (admin)
// @route   PUT /api/members/:id
// @access  Private/Admin
export const updateMember = async (req, res) => {
  try {
    const { status, startDate, expiryDate, notes, paymentMethod, paymentReference } = req.body;
    const update = {};

    if (status) {
      if (!['pending', 'active', 'expired', 'cancelled'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
      update.status = status;
    }
    if (startDate) update.startDate = startDate;
    if (expiryDate) update.expiryDate = expiryDate;
    if (notes !== undefined) update.notes = notes;
    if (paymentMethod) update.paymentMethod = paymentMethod;
    if (paymentReference !== undefined) update.paymentReference = paymentReference;

    const member = await Member.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.json(member);
  } catch (error) {
    const { status, message } = handleMongooseError(error);
    res.status(status).json({ message });
  }
};

// @desc    Delete a member (admin)
// @route   DELETE /api/members/:id
// @access  Private/Admin
export const deleteMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    const { status, message } = handleMongooseError(error);
    res.status(status).json({ message });
  }
};

// @desc    Get membership stats (admin)
// @route   GET /api/members/stats
// @access  Private/Admin
export const getMemberStats = async (req, res) => {
  try {
    const stats = await Member.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const planStats = await Member.aggregate([
      {
        $match: { status: { $in: ['active', 'pending'] } }
      },
      {
        $group: {
          _id: '$plan',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({ statusStats: stats, planStats });
  } catch (error) {
    const { status, message } = handleMongooseError(error);
    res.status(status).json({ message });
  }
};
