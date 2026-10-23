import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Customer } from '../models/Customer.js';
import { Enquiry } from '../models/Enquiry.js';
import { Quote } from '../models/Quote.js';
import { Task } from '../models/Task.js';

const ADMIN_EMAIL = 'sales@lotustubes.com';
const ADMIN_PASSWORD = 'lotustubes11';

async function resetDatabase() {
  console.log('Connecting to MongoDB Atlas...');
  await connectDB();

  console.log('Clearing existing users, customers, enquiries, quotes, and tasks...');
  const userResult = await User.deleteMany({});
  const custResult = await Customer.deleteMany({});
  const enqResult = await Enquiry.deleteMany({});
  const quoteResult = await Quote.deleteMany({});
  const taskResult = await Task.deleteMany({});

  console.log(`Deleted ${userResult.deletedCount} users.`);
  console.log(`Deleted ${custResult.deletedCount} customers.`);
  console.log(`Deleted ${enqResult.deletedCount} enquiries.`);
  console.log(`Deleted ${quoteResult.deletedCount} quotes.`);
  console.log(`Deleted ${taskResult.deletedCount} tasks.`);

  console.log(`\nCreating Super Admin: ${ADMIN_EMAIL}...`);
  const admin = await User.create({
    name: 'Lotus Super Admin',
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    role: 'admin',
    department: 'management',
    permissions: ['all'],
    company: 'Lotus Tubes',
    phone: '+919930430789',
    isEmailVerified: true,
    accountStatus: 'active'
  });

  console.log(`✅ Super Admin created successfully!`);
  console.log(`   ID: ${admin._id}`);
  console.log(`   Email: ${admin.email}`);
  console.log(`   Role: ${admin.role}`);
  console.log(`   Department: ${admin.department}`);

  // Test password verification
  const isMatch = await admin.comparePassword(ADMIN_PASSWORD);
  console.log(`   Password verification: ${isMatch ? 'PASSED ✅' : 'FAILED ❌'}`);

  await mongoose.disconnect();
  console.log('Database disconnected cleanly.');
  process.exit(0);
}

resetDatabase().catch((err) => {
  console.error('Fatal error resetting database:', err);
  mongoose.disconnect();
  process.exit(1);
});
