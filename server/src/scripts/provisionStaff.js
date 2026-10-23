import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { config } from '../config/env.js';
import { User } from '../models/User.js';

export const provisionStaffUser = async () => {
  const adminEmail = (config.staffInitEmail || 'sales@lotustubes.com').toLowerCase().trim();
  const adminPassword = config.staffInitPassword || 'lotustubes11';

  if (!adminPassword) {
    console.warn('⚠️ STAFF_INIT_PASSWORD is not configured in environment. Skipping admin auto-provisioning.');
    return null;
  }

  try {
    const existing = await User.findOne({ email: adminEmail });
    if (existing) {
      let needsSave = false;
      if (existing.role !== 'admin') {
        existing.role = 'admin';
        needsSave = true;
      }
      if (existing.department !== 'management') {
        existing.department = 'management';
        needsSave = true;
      }
      if (!existing.permissions || !existing.permissions.includes('all')) {
        existing.permissions = ['all'];
        needsSave = true;
      }
      if (needsSave) {
        await existing.save();
        console.log(`🔒 Provisioned ${adminEmail} with full Super Admin privileges.`);
      } else {
        console.log(`✅ Super Admin already provisioned in MongoDB: ${adminEmail}`);
      }
      return existing;
    }

    // Create Super Admin account
    const newAdmin = await User.create({
      name: 'Chirag Shah',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      department: 'management',
      permissions: ['all'],
      company: 'Lotus Tubes',
      phone: '+919930430789',
      isEmailVerified: true,
      accountStatus: 'active'
    });

    console.log(`✅ Successfully created Super Admin [${adminEmail}] in MongoDB lotus_tubes database.`);
    return newAdmin;
  } catch (error) {
    console.error('❌ Failed to provision Super Admin in MongoDB:', error.message);
    return null;
  }
};

if (process.argv[1] && process.argv[1].endsWith('provisionStaff.js')) {
  (async () => {
    console.log('Connecting to MongoDB for Super Admin provisioning...');
    await connectDB();
    await provisionStaffUser();
    await mongoose.disconnect();
    console.log('Done.');
    process.exit(0);
  })();
}
