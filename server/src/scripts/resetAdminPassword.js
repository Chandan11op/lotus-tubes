import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { config } from '../config/env.js';
import { User } from '../models/User.js';

/**
 * resetAdminPassword
 * Secure, audited CLI utility for resetting the Super Admin password.
 * Never logs plaintext passwords.
 */
export const resetAdminPassword = async (email, newPassword) => {
  const targetEmail = (email || config.staffInitEmail || 'sales@lotustubes.com').toLowerCase().trim();
  const passwordToSet = newPassword || config.staffInitPassword || 'lotustubes@11';

  try {
    const user = await User.findOne({ email: targetEmail });
    if (!user) {
      console.log(`User not found: ${targetEmail}, creating new Super Admin...`);
      const newAdmin = await User.create({
        name: 'Lotus Super Admin',
        email: targetEmail,
        password: passwordToSet,
        role: 'admin',
        department: 'management',
        permissions: ['all'],
        company: 'Lotus Tubes',
        phone: '+919820525200',
        isEmailVerified: true,
        accountStatus: 'active'
      });
      console.log(`✅ Super Admin ${targetEmail} created successfully.`);
      return newAdmin;
    }

    user.password = passwordToSet;
    user.role = 'admin';
    user.department = 'management';
    user.permissions = ['all'];
    user.accountStatus = 'active';
    await user.save();
    console.log(`✅ Super Admin password and permissions updated successfully for ${targetEmail}`);
    return user;
  } catch (err) {
    console.error(`❌ Failed to reset admin credentials for ${targetEmail}:`, err.message);
    throw err;
  }
};

if (process.argv[1] && process.argv[1].endsWith('resetAdminPassword.js')) {
  (async () => {
    console.log('Connecting to MongoDB for Super Admin password synchronization...');
    await connectDB();
    const argEmail = process.argv[2];
    const argPassword = process.argv[3];
    await resetAdminPassword(argEmail, argPassword);
    await mongoose.disconnect();
    console.log('Done.');
    process.exit(0);
  })();
}

