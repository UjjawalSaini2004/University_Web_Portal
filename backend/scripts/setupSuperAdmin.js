const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { ROLES } = require('../utils/constants');

/**
 * Create the first super admin
 * This script should only be run once during initial setup
 */
const createSuperAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/university_portal', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Check if super admin already exists
    const existingSuperAdmin = await User.findOne({ role: ROLES.SUPER_ADMIN });
    
    if (existingSuperAdmin) {
      console.log('❌ Super Admin already exists!');
      console.log('Email:', existingSuperAdmin.email);
      console.log('Super Admin setup is disabled to prevent unauthorized access.');
      process.exit(1);
    }

    // Create super admin with your credentials
    const superAdminData = {
      email: 'ujjawalsaini2004@gmail.com',
      password: 'UjjawalSaini',
      role: ROLES.SUPER_ADMIN,
      firstName: 'Ujjawal',
      lastName: 'Saini',
      gender: 'male',
      dateOfBirth: new Date('2004-01-01'),
      phoneNumber: '9999999999',
      address: {
        street: 'Admin Address',
        city: 'City',
        state: 'State',
        zipCode: '000000',
        country: 'India',
      },
      isActive: true,
      isVerified: true, // Super admin is always verified
      isEmailVerified: true,
    };

    const superAdmin = await User.create(superAdminData);

    console.log('\n🎉 Super Admin created successfully!');
    console.log('=====================================');
    console.log('Email:', superAdmin.email);
    console.log('Password: UjjawalSaini');
    console.log('Role:', superAdmin.role);
    console.log('=====================================');
    console.log('\n⚠️  SECURITY NOTICE:');
    console.log('1. Change the default password immediately after first login');
    console.log('2. This setup script cannot be run again');
    console.log('3. Only Super Admin can create admin accounts');
    console.log('4. Keep your credentials safe\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating Super Admin:', error.message);
    process.exit(1);
  }
};

createSuperAdmin();
