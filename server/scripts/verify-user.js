/**
 * Verify User Script
 * 
 * This script verifies if a specific user exists in the database
 * and shows detailed information about the user.
 * 
 * Usage: node server/scripts/verify-user.js <email>
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user.model');

const verifyUser = async (searchEmail) => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected to MongoDB\n');

    if (!searchEmail) {
      console.log('⚠️  Please provide an email address');
      console.log('Usage: node server/scripts/verify-user.js <email>');
      process.exit(1);
    }

    const normalizedEmail = searchEmail.trim().toLowerCase();
    console.log(`🔍 Verifying user with email: "${normalizedEmail}"\n`);

    // Try multiple search methods (same as login controller)
    let user = null;
    
    // Method 1: Case-insensitive regex
    try {
      const escapedEmail = normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      user = await User.findOne({ 
        email: { $regex: new RegExp(`^${escapedEmail}$`, 'i') } 
      });
      if (user) console.log('✅ Found using method 1 (case-insensitive regex)');
    } catch (err) {
      console.log('❌ Method 1 error:', err.message);
    }

    // Method 2: Exact lowercase
    if (!user) {
      try {
        user = await User.findOne({ email: normalizedEmail });
        if (user) console.log('✅ Found using method 2 (exact lowercase)');
      } catch (err) {
        console.log('❌ Method 2 error:', err.message);
      }
    }

    // Method 3: Trimmed original
    if (!user) {
      try {
        user = await User.findOne({ email: searchEmail.trim() });
        if (user) console.log('✅ Found using method 3 (trimmed original)');
      } catch (err) {
        console.log('❌ Method 3 error:', err.message);
      }
    }

    if (user) {
      console.log('\n✅ USER FOUND:\n');
      console.log(`   Email: "${user.email}"`);
      console.log(`   Email length: ${user.email.length} characters`);
      console.log(`   Email char codes: [${Array.from(user.email).map(c => c.charCodeAt(0)).join(',')}]`);
      console.log(`   Role: ${user.role}`);
      console.log(`   First Name: ${user.first_name || 'N/A'}`);
      console.log(`   Last Name: ${user.last_name || 'N/A'}`);
      console.log(`   User ID: ${user._id}`);
      console.log(`   Has Password: ${!!user.password}`);
      console.log(`   Password Hash Length: ${user.password ? user.password.length : 0}`);
      console.log(`   Created At: ${user.createdAt}`);
      console.log(`   Profile Completed: ${user.isProfileCompleted}`);
    } else {
      console.log('\n❌ USER NOT FOUND\n');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
    process.exit(0);
  }
};

// Get email from command line argument
const searchEmail = process.argv[2];
verifyUser(searchEmail);

