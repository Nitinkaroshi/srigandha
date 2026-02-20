import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import Event from '../models/Event.js';
import { handleMongooseError } from '../utils/errorHandler.js';

// @desc    Create a booking (public RSVP)
// @route   POST /api/bookings
// @access  Public
export const createBooking = async (req, res) => {
  try {
    const { eventId, name, email, phone, tickets, notes, memberId } = req.body;

    if (!eventId || !name || !email || !phone) {
      return res.status(400).json({ message: 'Please provide all required fields: eventId, name, email, phone' });
    }

    // Verify event exists and is active
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    if (!event.isActive) {
      return res.status(400).json({ message: 'This event is no longer accepting registrations' });
    }

    // Check for duplicate booking
    const existingBooking = await Booking.findOne({ event: eventId, email });
    if (existingBooking) {
      return res.status(400).json({ message: 'You have already registered for this event' });
    }

    const booking = await Booking.create({
      event: eventId,
      name,
      email,
      phone,
      tickets: tickets || 1,
      notes,
      member: memberId || undefined
    });

    const populated = await booking.populate('event', 'title date');

    res.status(201).json(populated);
  } catch (error) {
    const { status, message } = handleMongooseError(error);
    res.status(status).json({ message });
  }
};

// @desc    Get all bookings (admin)
// @route   GET /api/bookings
// @access  Private/Admin
export const getAllBookings = async (req, res) => {
  try {
    const { eventId, status } = req.query;
    const filter = {};

    if (eventId) filter.event = eventId;
    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
      .populate('event', 'title date type')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    const { status, message } = handleMongooseError(error);
    res.status(status).json({ message });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Private/Admin
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be: pending, confirmed, or cancelled' });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('event', 'title date');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    const { status, message } = handleMongooseError(error);
    res.status(status).json({ message });
  }
};

// @desc    Delete a booking
// @route   DELETE /api/bookings/:id
// @access  Private/Admin
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    const { status, message } = handleMongooseError(error);
    res.status(status).json({ message });
  }
};

// @desc    Get booking stats for an event
// @route   GET /api/bookings/stats/:eventId
// @access  Private/Admin
export const getBookingStats = async (req, res) => {
  try {
    const stats = await Booking.aggregate([
      { $match: { event: new mongoose.Types.ObjectId(req.params.eventId) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalTickets: { $sum: '$tickets' }
        }
      }
    ]);

    res.json(stats);
  } catch (error) {
    const { status, message } = handleMongooseError(error);
    res.status(status).json({ message });
  }
};
