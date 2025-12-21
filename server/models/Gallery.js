import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  eventDate: {
    type: Date,
    required: true
  },
  images: [{
    url: {
      type: String,
      required: true
    }
  }],
  youtubeLinks: [{
    url: String,
    title: String
  }],
  isPublished: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Gallery', gallerySchema);