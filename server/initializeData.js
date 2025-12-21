import mongoose from 'mongoose';
import dotenv from 'dotenv';
import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import SiteSettings from './models/SiteSettings.js';
import Committee from './models/Committee.js';
import Carousel from './models/Carousel.js';
import Page from './models/Page.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Committee data from original website
const boardOfTrustees = [
  {
    name: 'Padmanabha Bedarahally',
    role: 'Board of Trustees Member',
    type: 'current',
    term: 'Board of Trustees',
    order: 1,
    imageUrl: 'http://srigandhafl.org/sites/default/files/Padmanabha_Bedarahalli.jpg'
  },
  {
    name: 'Nithyanandaswamy Kora',
    role: 'Board of Trustees Member',
    type: 'current',
    term: 'Board of Trustees',
    order: 2,
    imageUrl: 'http://srigandhafl.org/sites/default/files/NIthya_kora.jpg'
  },
  {
    name: 'Vijay Prakash',
    role: 'Board of Trustees Member',
    type: 'current',
    term: 'Board of Trustees',
    order: 3,
    imageUrl: 'http://srigandhafl.org/sites/default/files/Vijay_Prakash_1.jpg'
  },
  {
    name: 'Venu Kulakarni',
    role: 'Board of Trustees Member',
    type: 'current',
    term: 'Board of Trustees',
    order: 4,
    imageUrl: 'https://www.srigandhafl.org/sites/default/files/venu_kulkarni.jpg'
  },
  {
    name: 'Gangadhar Ganga',
    role: 'Board of Trustees Member',
    type: 'current',
    term: 'Board of Trustees',
    order: 5,
    imageUrl: 'https://srigandhafl.org/sites/default/files/Gangadhar_Ganga_Final.jpg'
  }
];

const previousCommittee = [
  // 2022-2023
  { name: 'Gangadhar Ganga', role: 'President', type: 'previous', term: '2022-2023', order: 1 },
  { name: 'Govindagouda Ranganagoudar', role: 'Vice President', type: 'previous', term: '2022-2023', order: 2 },
  { name: 'Harshith Gowda', role: 'Secretary', type: 'previous', term: '2022-2023', order: 3 },
  { name: 'Akshatha Bhat', role: 'Joint Secretary', type: 'previous', term: '2022-2023', order: 4 },
  { name: 'Raghavendra Maiya', role: 'Treasurer', type: 'previous', term: '2022-2023', order: 5 },
  { name: 'Dinesh Manjunath', role: 'Joint Treasurer', type: 'previous', term: '2022-2023', order: 6 },

  // 2020-2021
  { name: 'Venu Kulakarni', role: 'President', type: 'previous', term: '2020-2021', order: 7 },
  { name: 'Gangadhar Ganga', role: 'Vice President', type: 'previous', term: '2020-2021', order: 8 },
  { name: 'Harshith Gowda', role: 'Secretary', type: 'previous', term: '2020-2021', order: 9 },
  { name: 'Srilakshmi Mahesh', role: 'Joint Secretary', type: 'previous', term: '2020-2021', order: 10 },
  { name: 'Govindgouda Rangangoudar', role: 'Treasurer', type: 'previous', term: '2020-2021', order: 11 },
  { name: 'Dinesh Manjunath', role: 'Joint Treasurer', type: 'previous', term: '2020-2021', order: 12 },

  // 2018-2019
  { name: 'Vijaya Prakash', role: 'President', type: 'previous', term: '2018-2019', order: 13 },
  { name: 'Venu Kulkarni', role: 'Vice President', type: 'previous', term: '2018-2019', order: 14 },
  { name: 'Uma Setty', role: 'Secretary', type: 'previous', term: '2018-2019', order: 15 },
  { name: 'Rashmi Raghavendra', role: 'Joint Secretary', type: 'previous', term: '2018-2019', order: 16 },
  { name: 'Govindgouda Rangangoudar', role: 'Treasurer', type: 'previous', term: '2018-2019', order: 17 },
  { name: 'Goverdhan Muralidhar', role: 'Joint Treasurer', type: 'previous', term: '2018-2019', order: 18 },
  { name: 'Raghavendra Maiya', role: 'Website Coordinator', type: 'previous', term: '2018-2019', order: 19 },
  { name: 'Akshatha Bhat', role: 'Cultural Coordinator', type: 'previous', term: '2018-2019', order: 20 },
  { name: 'Srikanth Dharmavaram', role: 'Committee Member', type: 'previous', term: '2018-2019', order: 21 },

  // 2016-2017
  { name: 'Nithyanandaswamy Kora', role: 'President', type: 'previous', term: '2016-2017', order: 22 },
  { name: 'Vijaya Prakash', role: 'Vice President', type: 'previous', term: '2016-2017', order: 23 },
  { name: 'Venu Kulkarni', role: 'Secretary', type: 'previous', term: '2016-2017', order: 24 },
  { name: 'Uma Setty', role: 'Joint Secretary', type: 'previous', term: '2016-2017', order: 25 },
  { name: 'Gangadhar Ganga', role: 'Treasurer', type: 'previous', term: '2016-2017', order: 26 },
  { name: 'Veerendra Viswanath', role: 'Joint Treasurer', type: 'previous', term: '2016-2017', order: 27 },
  { name: 'Sundaresh K. V.', role: 'Comptroller', type: 'previous', term: '2016-2017', order: 28 },

  // 2014-2015
  { name: 'Padmanabha Bedarahally', role: 'President', type: 'previous', term: '2014-2015', order: 29 },
  { name: 'Nithyanandaswamy Kora', role: 'Vice President', type: 'previous', term: '2014-2015', order: 30 },
  { name: 'Venu Kulkarni', role: 'Secretary', type: 'previous', term: '2014-2015', order: 31 },
  { name: 'Uma Setty', role: 'Joint Secretary', type: 'previous', term: '2014-2015', order: 32 },
  { name: 'Sundaresh K. V.', role: 'Treasurer', type: 'previous', term: '2014-2015', order: 33 },
  { name: 'Veerendra Viswanath', role: 'Joint Treasurer', type: 'previous', term: '2014-2015', order: 34 }
];

// Default carousel placeholder images (these will create placeholder slides)
const carouselSlides = [
  {
    title: 'Welcome to Srigandha Kannada Koota',
    caption: 'Preserving Kannada culture and heritage in Florida',
    order: 0,
    isActive: true,
    // Note: No image - admin should upload actual images via dashboard
  }
];

// Home page content
const homePageContent = {
  slug: 'home',
  title: 'Home',
  sections: [
    {
      type: 'hero',
      content: {
        title: 'Welcome to Srigandha Kannada Koota',
        subtitle: 'Preserving Kannada Culture & Heritage in Florida',
        buttonText: 'Learn More',
        buttonLink: '/about'
      }
    }
  ],
  isPublished: true
};

// Site settings data
const siteSettingsData = {
  siteName: 'Srigandha Kannada Koota of Florida',
  taxId: '59-3527606',
  socialLinks: {
    facebook: 'https://www.facebook.com/groups/318531618064/',
    youtube: 'https://www.youtube.com/@srigandhakannadakootaflorida7600',
    twitter: ''
  },
  membershipPlans: [
    {
      name: 'Single',
      price: 20,
      duration: '1 Year Membership',
      benefits: ['Discounted Event Tickets', 'Network With Members', 'Community Support'],
      popular: false,
      registrationLink: 'https://widgets.mygumpu.com/memberships/signup/?sid=9'
    },
    {
      name: 'Family',
      price: 35,
      duration: '1 Year Membership',
      benefits: ['Discounted Event Tickets', 'Network With Members', 'Family Benefits'],
      popular: true,
      registrationLink: 'https://widgets.mygumpu.com/memberships/signup/?sid=9'
    },
    {
      name: 'Lifetime',
      price: 350,
      duration: 'Lifetime Membership',
      benefits: ['All Benefits Forever', 'Priority Access', 'Exclusive Perks'],
      popular: false,
      registrationLink: 'https://widgets.mygumpu.com/memberships/signup/?sid=9'
    }
  ],
  membershipPortalUrl: 'https://srigandhafl.mygumpu.com/public/home',
  contactInfo: {
    email: 'srigandha@yahoo.com',
    phone: '(813) 508-0146',
    address: 'Srigandha Kannada Koota,\n11605 Quiet Forest DR,\nTampa, FL 33635'
  }
};

// Download image function
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filepath = path.join(uploadsDir, filename);
    const protocol = url.startsWith('https') ? https : http;

    protocol.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`✅ Downloaded: ${filename}`);
          resolve(`/uploads/${filename}`);
        });
      } else {
        console.error(`❌ Failed to download ${url}: ${response.statusCode}`);
        resolve(null);
      }
    }).on('error', (err) => {
      console.error(`❌ Error downloading ${url}:`, err.message);
      resolve(null);
    });
  });
}

async function initializeDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/srigandha');
    console.log('✅ Connected to MongoDB');

    // Initialize Site Settings
    console.log('\n📋 Initializing Site Settings...');
    let settings = await SiteSettings.findOne();

    if (!settings) {
      settings = await SiteSettings.create(siteSettingsData);
      console.log('✅ Site settings created successfully');
    } else {
      // Update existing settings
      Object.assign(settings, siteSettingsData);
      await settings.save();
      console.log('✅ Site settings updated successfully');
    }

    // Initialize Committee Members
    console.log('\n👥 Initializing Committee Members...');

    // Clear existing committee data
    await Committee.deleteMany({});
    console.log('🗑️  Cleared existing committee data');

    // Download and add Board of Trustees
    console.log('\n📥 Downloading Board of Trustees images...');
    for (const member of boardOfTrustees) {
      if (member.imageUrl) {
        const filename = `committee_${member.name.replace(/\s+/g, '_').toLowerCase()}.jpg`;
        const localPath = await downloadImage(member.imageUrl, filename);

        if (localPath) {
          await Committee.create({
            ...member,
            photo: localPath
          });
          console.log(`✅ Added: ${member.name}`);
        } else {
          await Committee.create(member);
          console.log(`⚠️  Added ${member.name} without photo`);
        }
      } else {
        await Committee.create(member);
        console.log(`✅ Added: ${member.name}`);
      }
    }

    // Add Previous Committee members (without images for now)
    console.log('\n📝 Adding Previous Committee members...');
    for (const member of previousCommittee) {
      await Committee.create(member);
    }
    console.log(`✅ Added ${previousCommittee.length} previous committee members`);

    // Initialize Pages
    console.log('\n📄 Initializing Pages...');
    await Page.deleteMany({ slug: { $in: ['home', 'about'] } });

    // Create Home Page
    await Page.create(homePageContent);
    console.log('✅ Home page created');

    // Create About Page (empty placeholder - will use fallback content in frontend)
    await Page.create({
      slug: 'about',
      title: 'About Us',
      sections: [],
      isPublished: false
    });
    console.log('✅ About page placeholder created (uses fallback content)');

    // Initialize Carousel (placeholder - admin will upload images)
    console.log('\n🎠 Initializing Carousel...');
    await Carousel.deleteMany({});
    console.log('⚠️  Note: Carousel slides need images. Please upload via admin dashboard.');
    console.log('   Go to: Admin Dashboard → Carousel → Add New Slide');

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('✅ DATABASE INITIALIZATION COMPLETE!');
    console.log('='.repeat(50));

    const committeeCount = await Committee.countDocuments();
    const pageCount = await Page.countDocuments();
    const carouselCount = await Carousel.countDocuments();

    console.log(`\n📊 Summary:`);
    console.log(`   - Site Settings: Initialized`);
    console.log(`   - Pages: ${pageCount} (Home page created)`);
    console.log(`   - Carousel: ${carouselCount} slides (Upload images via admin)`);
    console.log(`   - Committee Members: ${committeeCount}`);
    console.log(`     • Board of Trustees: ${boardOfTrustees.length}`);
    console.log(`     • Previous Committee: ${previousCommittee.length}`);
    console.log(`\n🎉 All data has been populated successfully!`);
    console.log(`\n⚠️  IMPORTANT: Upload carousel images via admin dashboard!`);
    console.log(`\nNext steps:`);
    console.log(`  1. Start the server: npm start`);
    console.log(`  2. Login to admin dashboard`);
    console.log(`  3. Go to Carousel → Add New Slide`);
    console.log(`  4. Upload carousel images with titles and captions`);
    console.log(`  5. Verify homepage displays correctly`);
    console.log('\n');

  } catch (error) {
    console.error('❌ Error initializing database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the initialization
initializeDatabase();
