import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { config } from '../config/env.js';
import { User } from '../models/User.js';

export const provisionStaffUser = async () => {
  const staffEmail = (config.staffInitEmail || 'chirag@lotustubes.com').toLowerCase().trim();
  const staffPassword = config.staffInitPassword;

  if (!staffPassword) {
    console.warn('⚠️ STAFF_INIT_PASSWORD is not configured in environment. Skipping staff auto-provisioning.');
    return null;
  }

  try {
    const existingStaff = await User.findOne({ email: staffEmail });
    if (existingStaff) {
      if (existingStaff.role !== 'staff' && existingStaff.role !== 'admin') {
        existingStaff.role = 'staff';
        await existingStaff.save();
        console.log(`🔒 Upgraded account ${staffEmail} to staff role in MongoDB.`);
      } else {
        console.log(`✅ Staff account already provisioned in MongoDB: ${staffEmail}`);
      }
      return existingStaff;
    }

    // Create staff account
    const newStaff = await User.create({
      name: 'Chirag Shah',
      email: staffEmail,
      password: staffPassword,
      role: 'staff',
      company: 'Lotus Tubes',
      phone: '+919930430789',
      isEmailVerified: true,
      accountStatus: 'active'
    });

    console.log(`✅ Successfully provisioned staff account [${staffEmail}] in MongoDB lotus_tubes database.`);
    return newStaff;
  } catch (error) {
    console.error('❌ Failed to provision staff account in MongoDB:', error.message);
    return null;
  }
};

// If run directly from CLI
if (process.argv[1] && process.argv[1].endsWith('provisionStaff.js')) {
  (async () => {
    console.log('Connecting to MongoDB for staff provisioning...');
    await connectDB();
    await provisionStaffUser();
    await mongoose.disconnect();
    console.log('Done.');
    process.exit(0);
  })();
}
