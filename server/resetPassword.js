import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import User from './models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const resetPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const email = 'admin@srigandha.org'; // Change this to your admin email
    const newPassword = 'admin@123';

    const user = await User.findOne({ email });

    if (!user) {
      console.log('User not found');
      process.exit(1);
    }

    console.log('Found user:', user.email);
    console.log('Current password hash:', user.password);
    console.log('Current hash length:', user.password.length);

    // Update password - this will trigger the pre('save') hook
    user.password = newPassword;
    await user.save();

    console.log('Password updated successfully');
    console.log('New password hash:', user.password);
    console.log('New hash length:', user.password.length);

    // Test the new password
    const isMatch = await user.matchPassword(newPassword);
    console.log('Password verification:', isMatch ? 'SUCCESS' : 'FAILED');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

resetPassword();
