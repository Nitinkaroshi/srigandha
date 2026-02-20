import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import Member from '../models/Member.js';
import Booking from '../models/Booking.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateMemberToken = (id) => {
  return jwt.sign({ id, type: 'member' }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Google OAuth login/register for members
// @route   POST /api/member-auth/google
// @access  Public
export const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: 'Google credential is required' });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Find by googleId first, then by email
    let member = await Member.findOne({ googleId });

    if (!member) {
      member = await Member.findOne({ email: email.toLowerCase() });

      if (member) {
        // Link Google account to existing member
        member.googleId = googleId;
        member.avatar = picture;
        await member.save();
      } else {
        // Create new guest member
        member = await Member.create({
          name,
          email: email.toLowerCase(),
          googleId,
          avatar: picture,
          status: 'guest'
        });
      }
    } else {
      member.avatar = picture;
      await member.save();
    }

    res.json({
      _id: member._id,
      name: member.name,
      email: member.email,
      avatar: member.avatar,
      status: member.status,
      plan: member.plan || null,
      phone: member.phone || null,
      token: generateMemberToken(member._id)
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(401).json({ message: 'Google authentication failed' });
  }
};

// @desc    Get member profile
// @route   GET /api/member-auth/profile
// @access  Private (member)
export const getMemberProfile = async (req, res) => {
  try {
    res.json({
      _id: req.member._id,
      name: req.member.name,
      email: req.member.email,
      phone: req.member.phone,
      avatar: req.member.avatar,
      address: req.member.address,
      status: req.member.status,
      plan: req.member.plan,
      familyMembers: req.member.familyMembers,
      startDate: req.member.startDate,
      expiryDate: req.member.expiryDate
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update member profile
// @route   PUT /api/member-auth/profile
// @access  Private (member)
export const updateMemberProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const member = req.member;

    if (name) member.name = name;
    if (phone) member.phone = phone;
    if (address) member.address = address;

    await member.save();

    res.json({
      _id: member._id,
      name: member.name,
      email: member.email,
      phone: member.phone,
      avatar: member.avatar,
      address: member.address,
      status: member.status,
      plan: member.plan
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get member's booking history
// @route   GET /api/member-auth/bookings
// @access  Private (member)
export const getMemberBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ email: req.member.email })
      .populate('event', 'title date image type')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register for a membership plan
// @route   POST /api/member-auth/register-plan
// @access  Private (member)
export const registerPlan = async (req, res) => {
  try {
    const { plan, phone, address, familyMembers, paymentMethod, paymentReference, notes } = req.body;
    const member = req.member;

    if (!plan) {
      return res.status(400).json({ message: 'Please select a membership plan' });
    }

    if (member.status === 'active') {
      return res.status(400).json({ message: 'You already have an active membership' });
    }

    if (member.status === 'pending') {
      return res.status(400).json({ message: 'You already have a pending membership application' });
    }

    member.plan = plan;
    member.status = 'pending';
    if (phone) member.phone = phone;
    if (address) member.address = address;
    if (familyMembers) member.familyMembers = familyMembers;
    if (paymentMethod) member.paymentMethod = paymentMethod;
    if (paymentReference) member.paymentReference = paymentReference;
    if (notes) member.notes = notes;

    await member.save();

    res.json({
      _id: member._id,
      name: member.name,
      email: member.email,
      status: member.status,
      plan: member.plan,
      message: 'Membership registration submitted. Awaiting admin approval.'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
