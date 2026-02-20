import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  image: {
    type: String
  },
  registrationLink: {
    type: String
  },
  price: {
    type: Number,
    default: 0
  },
  memberPrice: {
    type: Number,
    default: null
  },
  type: {
    type: String,
    enum: ['upcoming', 'past'],
    default: 'upcoming'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Event', eventSchema);