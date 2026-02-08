/**
 * Fix Email Case Script
 * 
 * This script converts all email addresses in the database to lowercase.
 * This helps fix case-sensitivity issues with login.
 * 
 * Usage: node server/scripts/fix-email-case.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user.model');

const fixEmailCase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected to MongoDB\n');

    // Find all users
    const users = await User.find({});
    console.log(`📋 Found ${users.length} user(s) in database\n`);

    let updatedCount = 0;
    let errorCount = 0;

    for (const user of users) {
      const originalEmail = user.email;
      const lowercasedEmail = originalEmail.toLowerCase().trim();

      // Only update if email needs to be changed
      if (originalEmail !== lowercasedEmail) {
        try {
          // Check if lowercase version already exists (duplicate)
          const existingUser = await User.findOne({ 
            email: lowercasedEmail,
            _id: { $ne: user._id } // Exclude current user
          });

          if (existingUser) {
            console.log(`⚠️  Skipping "${originalEmail}" - lowercase version "${lowercasedEmail}" already exists for another user`);
            errorCount++;
            continue;
          }

          // Update email to lowercase
          user.email = lowercasedEmail;
          await user.save();
          console.log(`✅ Updated: "${originalEmail}" → "${lowercasedEmail}" (${user.role})`);
          updatedCount++;
        } catch (error) {
          console.error(`❌ Error updating "${originalEmail}":`, error.message);
          errorCount++;
        }
      } else {
        console.log(`✓ Already lowercase: "${originalEmail}" (${user.role})`);
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   Total users: ${users.length}`);
    console.log(`   Updated: ${updatedCount}`);
    console.log(`   Already lowercase: ${users.length - updatedCount - errorCount}`);
    console.log(`   Errors: ${errorCount}`);

    if (updatedCount > 0) {
      console.log('\n✅ Email case fixing completed!');
      console.log('   You can now try logging in again.');
    } else {
      console.log('\n✅ All emails are already in lowercase!');
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

fixEmailCase();

