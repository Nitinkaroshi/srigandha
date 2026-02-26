import mongoose from 'mongoose';

const committeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  photo: {
    type: String
  },
  email: String,
  phone: String,
  term: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['current', 'executive', 'previous'],
    default: 'current'
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('Committee', committeeSchema);