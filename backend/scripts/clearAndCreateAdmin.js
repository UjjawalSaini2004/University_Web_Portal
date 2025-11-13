const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const WaitlistUser = require('../models/WaitlistUser');

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/university_portal', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear all users and waitlist users
    await User.deleteMany({});
    await WaitlistUser.deleteMany({});
    console.log('✅ Cleared all existing users');

    // Create new admin - password will be automatically hashed by the pre-save hook
    await User.create({
      email: 'ujjawalsaini2004@gmail.com',
      password: 'UjjawalSaini', // Plain text password - will be hashed by model
      role: 'super_admin', // Create as super_admin directly
      firstName: 'Ujjawal',
      lastName: 'Saini',
      gender: 'male',
      dateOfBirth: new Date('2004-01-01'),
      phoneNumber: '9999999999',
      address: 'Admin Address',
      isActive: true,
      isVerified: true,
    });

    console.log('\n✨ New admin user created successfully!');
    console.log('=================================');
    console.log('Email: ujjawalsaini2004@gmail.com');
    console.log('Password: UjjawalSaini');
    console.log('=================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createAdmin();
