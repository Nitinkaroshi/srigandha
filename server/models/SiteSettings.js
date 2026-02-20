import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema({
  logo: String,
  siteName: {
    type: String,
    default: 'Srigandha Kannada Koota of Florida'
  },
  taxId: {
    type: String,
    default: '59-3527606'
  },
  socialLinks: {
    facebook: String,
    youtube: String,
    twitter: String
  },
  membershipPlans: [{
    name: String,
    price: Number,
    duration: String,
    benefits: [String],
    popular: Boolean,
    registrationLink: String
  }],
  membershipPortalUrl: {
    type: String,
    default: ''
  },
  whatsappLink: {
    type: String,
    default: ''
  },
  contactInfo: {
    email: String,
    phone: String,
    address: String
  },
  presidentMessage: {
    name: String,
    title: { type: String, default: 'President' },
    photo: String,
    message: String,
    messageKannada: String
  },
  sponsors: [{
    name: { type: String, required: true },
    logo: String,
    url: String,
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  }]
}, {
  timestamps: true
});

export default mongoose.model('SiteSettings', siteSettingsSchema);
