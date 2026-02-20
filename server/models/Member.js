import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  avatar: {
    type: String
  },
  phone: {
    type: String
  },
  address: {
    city: String,
    state: String,
    zip: String
  },
  plan: {
    type: String
  },
  familyMembers: [{
    name: String,
    relation: String
  }],
  status: {
    type: String,
    enum: ['guest', 'pending', 'active', 'expired', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['online', 'cash', 'check', 'zelle', 'other'],
    default: 'online'
  },
  paymentReference: {
    type: String
  },
  startDate: {
    type: Date
  },
  expiryDate: {
    type: Date
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

memberSchema.index({ email: 1 });
memberSchema.index({ googleId: 1 });

export default mongoose.model('Member', memberSchema);
