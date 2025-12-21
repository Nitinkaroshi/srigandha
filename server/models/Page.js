import mongoose from 'mongoose';

const pageSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: true
  },
  sections: [{
    type: {
      type: String,
      enum: ['hero', 'text', 'image', 'gallery', 'events', 'news', 'custom'],
      required: true
    },
    order: Number,
    content: {
      type: mongoose.Schema.Types.Mixed
    }
  }],
  metaDescription: String,
  isPublished: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Page', pageSchema);