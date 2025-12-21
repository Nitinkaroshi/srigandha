import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import User from './models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const email = 'admin@srigandha.org';
    const username = 'admin';
    const password = 'admin@123';
    const role = 'super-admin';

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists!');
      console.log('Updating password instead...');

      existingUser.password = password;
      await existingUser.save();

      console.log('\nPassword updated successfully!');
      console.log('Email:', existingUser.email);
      console.log('Username:', existingUser.username);
      console.log('Role:', existingUser.role);
      console.log('Password Hash:', existingUser.password);
      console.log('Hash Length:', existingUser.password.length);

      // Test the password
      const isMatch = await existingUser.matchPassword(password);
      console.log('\nPassword verification:', isMatch ? '✓ SUCCESS' : '✗ FAILED');
    } else {
      // Create new user
      const user = await User.create({
        username,
        email,
        password,
        role
      });

      console.log('\nAdmin user created successfully!');
      console.log('Email:', user.email);
      console.log('Username:', user.username);
      console.log('Role:', user.role);
      console.log('Password Hash:', user.password);
      console.log('Hash Length:', user.password.length);

      // Test the password
      const isMatch = await user.matchPassword(password);
      console.log('\nPassword verification:', isMatch ? '✓ SUCCESS' : '✗ FAILED');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
};

createAdmin();
