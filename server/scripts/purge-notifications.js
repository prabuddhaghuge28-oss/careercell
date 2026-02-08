const mongoose = require('mongoose');
const connectDB = require('../config/MongoDB');
require('dotenv').config();

const Notice = require('../models/notice.model');

async function main() {
  await connectDB();

  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections({ name: 'notifications' }).toArray();

    if (collections.length === 0) {
      console.log("No 'notifications' collection found. Nothing to purge.");
    } else {
      const coll = mongoose.connection.collection('notifications');
      const delRes = await coll.deleteMany({});
      console.log(`Deleted ${delRes.deletedCount} document(s) from 'notifications' collection.`);
    }

    // Optional: purge system-generated notices if requested
    if (process.argv.includes('--purge-system-notices')) {
      const res = await Notice.deleteMany({ sender_role: 'system' });
      console.log(`Deleted ${res.deletedCount} system-generated document(s) from 'notices' collection.`);
    }

    if (process.argv.includes('--drop-collection')) {
      const collections2 = await db.listCollections({ name: 'notifications' }).toArray();
      if (collections2.length > 0) {
        await db.dropCollection('notifications');
        console.log("Dropped 'notifications' collection.");
      }
    }
  } catch (err) {
    console.error('Error while purging notifications: ', err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

main();
