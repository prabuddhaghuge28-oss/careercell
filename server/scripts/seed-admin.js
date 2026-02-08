/**
 * Seed Script to Create Initial Admin Users
 * 
 * This script creates the first Management Admin and TPO Admin users.
 * Run this script once to set up initial admin users for the system.
 * 
 * Usage: node server/scripts/seed-admin.js
 */

// Load environment variables
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');

// Admin user credentials (change these before running in production!)
const ADMIN_USERS = {
  management: {
    first_name: 'Management',
    last_name: 'Admin',
    email: 'management@ycc.in',
    password: 'manage@1234', // updated per request
    number: 1234567891,
    role: 'management_admin'
  },
  tpo: {
    first_name: 'TPO',
    last_name: 'Admin',
    email: 'tpo@ycc.in',
    password: 'Tpo@1234', // updated per request
    number: 1234567892,
    role: 'tpo_admin'
  }
};

const seedAdmins = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected to MongoDB');

    // Create admin users
    for (const [userType, userData] of Object.entries(ADMIN_USERS)) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        console.log(`⚠️  User with email ${userData.email} already exists. Skipping...`);
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Create new user
      const newUser = new User({
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        password: hashedPassword,
        number: userData.number,
        role: userData.role,
        isProfileCompleted: false
      });

      await newUser.save();
      console.log(`✅ Created ${userType} admin: ${userData.email}`);
      console.log(`   Password: ${userData.password}`);
    }

    console.log('\n🎉 Admin users created successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Management Admin:');
    console.log(`  Email: ${ADMIN_USERS.management.email}`);
    console.log(`  Password: ${ADMIN_USERS.management.password}`);
    console.log(`  Login URL: http://localhost:5173/management/login`);
    console.log('\nTPO Admin:');
    console.log(`  Email: ${ADMIN_USERS.tpo.email}`);
    console.log(`  Password: ${ADMIN_USERS.tpo.password}`);
    console.log(`  Login URL: http://localhost:5173/tpo/login`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  IMPORTANT: Change these passwords after first login!');
    
  } catch (error) {
    console.error('❌ Error seeding admin users:', error);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
    process.exit(0);
  }
};

// Run the seed script
seedAdmins();

