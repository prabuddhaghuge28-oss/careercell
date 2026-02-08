/**
 * Debug Login Script
 * 
 * This script helps debug login issues by checking:
 * - What users exist in the database
 * - What email is being searched
 * - Case sensitivity issues
 * 
 * Usage: node server/scripts/debug-login.js <email>
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user.model');

const debugLogin = async (searchEmail) => {
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
      console.log('⚠️  No email provided. Showing all users in database:\n');
      
      // Get all users
      const allUsers = await User.find({}).select('email role first_name last_name');
      
      if (allUsers.length === 0) {
        console.log('❌ No users found in database');
      } else {
        console.log(`📋 Found ${allUsers.length} user(s):\n`);
        allUsers.forEach((user, index) => {
          console.log(`${index + 1}. Email: "${user.email}"`);
          console.log(`   Role: ${user.role}`);
          console.log(`   Name: ${user.first_name} ${user.last_name || ''}`);
          console.log(`   Email length: ${user.email.length} characters`);
          console.log(`   Email char codes: ${Array.from(user.email).map(c => c.charCodeAt(0)).join(',')}`);
          console.log('');
        });
      }
    } else {
      console.log(`🔍 Searching for email: "${searchEmail}"\n`);
      console.log(`   Search email length: ${searchEmail.length} characters`);
      console.log(`   Search email trimmed: "${searchEmail.trim()}"`);
      console.log(`   Search email lowercase: "${searchEmail.toLowerCase()}"\n`);

      // Try exact match
      const exactMatch = await User.findOne({ email: searchEmail });
      console.log(`1. Exact match (email: "${searchEmail}"):`);
      console.log(`   Result: ${exactMatch ? '✅ Found' : '❌ Not found'}`);
      if (exactMatch) {
        console.log(`   Email in DB: "${exactMatch.email}"`);
        console.log(`   Role: ${exactMatch.role}`);
      }
      console.log('');

      // Try trimmed match
      const trimmedMatch = await User.findOne({ email: searchEmail.trim() });
      console.log(`2. Trimmed match (email: "${searchEmail.trim()}"):`);
      console.log(`   Result: ${trimmedMatch ? '✅ Found' : '❌ Not found'}`);
      if (trimmedMatch) {
        console.log(`   Email in DB: "${trimmedMatch.email}"`);
        console.log(`   Role: ${trimmedMatch.role}`);
      }
      console.log('');

      // Try case-insensitive match
      const caseInsensitiveMatch = await User.findOne({ 
        email: { $regex: new RegExp(`^${searchEmail.trim()}$`, 'i') } 
      });
      console.log(`3. Case-insensitive match (email: "${searchEmail.trim()}"):`);
      console.log(`   Result: ${caseInsensitiveMatch ? '✅ Found' : '❌ Not found'}`);
      if (caseInsensitiveMatch) {
        console.log(`   Email in DB: "${caseInsensitiveMatch.email}"`);
        console.log(`   Role: ${caseInsensitiveMatch.role}`);
      }
      console.log('');

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
debugLogin(searchEmail);

