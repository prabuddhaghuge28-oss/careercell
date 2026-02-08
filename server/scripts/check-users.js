/**
 * Check Existing Users Script
 * 
 * This script checks if admin users exist in the database.
 * 
 * Usage: node server/scripts/check-users.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user.model');

const checkUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected to MongoDB\n');

    // Check for management admin
    const management = await User.findOne({ role: 'management_admin' });
    if (management) {
      console.log('\n✅ Management Admin found:');
      console.log(`   Email: ${management.email}`);
      console.log(`   Name: ${management.first_name} ${management.last_name || ''}`);
    } else {
      console.log('\n❌ No Management Admin found in database');
    }

    // Check for TPO admin
    const tpo = await User.findOne({ role: 'tpo_admin' });
    if (tpo) {
      console.log('\n✅ TPO Admin found:');
      console.log(`   Email: ${tpo.email}`);
      console.log(`   Name: ${tpo.first_name} ${tpo.last_name || ''}`);
    } else {
      console.log('\n❌ No TPO Admin found in database');
    }

    // Count all users by role
    const userCounts = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    console.log('\n📊 User Statistics:');
    userCounts.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} users`);
    });

    if (!management && !tpo) {
      console.log('\n⚠️  No admin users found!');
      console.log('👉 Run the seed script to create admin users:');
      console.log('   npm run seed:admin');
      console.log('   OR');
      console.log('   node server/scripts/seed-admin.js');
    }

  } catch (error) {
    console.error('❌ Error checking users:', error.message);
    if (error.message.includes('ENOTFOUND') || error.message.includes('connection')) {
      console.error('\n💡 Tip: Make sure MongoDB is running and MONGO_URI is correct in .env file');
    }
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
    process.exit(0);
  }
};

checkUsers();

