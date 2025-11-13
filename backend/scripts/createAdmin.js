require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/db');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const createAdmin = async () => {
  try {
    await connectDB();

    console.log('\n🔐 Create New Admin Account\n');

    rl.question('Enter email: ', async (email) => {
      rl.question('Enter password: ', async (password) => {
        rl.question('Enter first name: ', async (firstName) => {
          rl.question('Enter last name: ', async (lastName) => {
            
            try {
              // Check if user already exists
              const existingUser = await User.findOne({ email });
              
              if (existingUser) {
                console.log('\n⚠️  User already exists. Updating to admin role...');
                existingUser.role = 'admin';
                existingUser.isActive = true;
                existingUser.isEmailVerified = true;
                if (password) {
                  existingUser.password = password; // Will be hashed by pre-save hook
                }
                await existingUser.save();
                console.log('✅ User updated to admin role successfully!');
              } else {
                // Create new admin user
                const newAdmin = await User.create({
                  email,
                  password,
                  role: 'admin',
                  firstName,
                  lastName,
                  phoneNumber: '+91-0000000000',
                  dateOfBirth: new Date('1990-01-01'),
                  gender: 'male',
                  isActive: true,
                  isEmailVerified: true,
                });
                
                console.log('\n✅ Admin created successfully!');
                console.log('📧 Email:', newAdmin.email);
                console.log('👤 Name:', newAdmin.fullName);
                console.log('🔑 Role:', newAdmin.role);
              }
              
              console.log('\n🎉 You can now login at http://localhost:5173');
              console.log('📧 Email:', email);
              console.log('🔐 Password: [the password you entered]\n');
              
              process.exit(0);
            } catch (error) {
              console.error('❌ Error creating admin:', error.message);
              process.exit(1);
            }
          });
        });
      });
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createAdmin();
