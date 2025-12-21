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
    default: 'https://srigandhafl.mygumpu.com/public/home'
  },
  contactInfo: {
    email: String,
    phone: String,
    address: String
  }
}, {
  timestamps: true
});

export default mongoose.model('SiteSettings', siteSettingsSchema);