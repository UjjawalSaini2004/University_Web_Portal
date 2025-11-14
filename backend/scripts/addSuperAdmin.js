require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const { ROLES } = require('../utils/constants');

/**
 * Add super admin without clearing existing data
 */
const addSuperAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/university_portal');

    console.log('✅ Connected to MongoDB');

    // Check if super admin already exists
    const existingSuperAdmin = await User.findOne({ role: ROLES.SUPER_ADMIN });
    
    if (existingSuperAdmin) {
      console.log('❌ Super Admin already exists!');
      console.log('Email:', existingSuperAdmin.email);
      process.exit(0);
    }

    // Create super admin
    const superAdminData = {
      email: 'ujjawalsaini2004@gmail.com',
      password: 'UjjawalSaini',
      role: ROLES.SUPER_ADMIN,
      firstName: 'Ujjawal',
      lastName: 'Saini',
      gender: 'male',
      dateOfBirth: new Date('2004-01-01'),
      phoneNumber: '1234567890',
      address: {
        street: 'Admin Address',
        city: 'Jaipur',
        state: 'Rajasthan',
        zipCode: '302022',
        country: 'India',
      },
      isActive: true,
      isVerified: true,
      isEmailVerified: true,
    };

    const superAdmin = await User.create(superAdminData);

    console.log('\n🎉 Super Admin created successfully!');
    console.log('=====================================');
    console.log('Email:', superAdmin.email);
    console.log('Password: UjjawalSaini');
    console.log('Role:', superAdmin.role);
    console.log('=====================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating Super Admin:', error.message);
    process.exit(1);
  }
};

addSuperAdmin();
