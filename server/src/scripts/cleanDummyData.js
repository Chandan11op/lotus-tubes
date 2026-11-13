import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';

/**
 * cleanDummyData
 * Cleans all dummy audit and automated test records from MongoDB Atlas
 * while preserving legitimate admin, staff, customer, and catalogue records.
 */
export const cleanDummyData = async () => {
  await connectDB();
  const db = mongoose.connection.db;

  console.log('--- Cleaning Dummy Data from MongoDB Atlas ---');

  // 1. Quotes created by test runs (Sun Pharma test payloads)
  const testQuotesFilter = {
    $or: [
      { email: /example\.com$/i },
      { customerName: /Sun Pharma Engineering Dept/i },
      { company: /Sun Pharmaceutical Industries Ltd/i },
      { company: /Dairy Process Solutions LLP/i }
    ]
  };
  const deletedQuotes = await db.collection('quotes').deleteMany(testQuotesFilter);
  console.log(`Deleted ${deletedQuotes.deletedCount} dummy quotes.`);

  // 2. Customers created by test runs
  const testCustomersFilter = {
    $or: [
      { email: /example\.com$/i },
      { name: /Ramesh.*Patel/i },
      { company: /BioPharma India Ltd/i },
      { company: /Dairy Process Solutions/i },
      { company: /Sun Pharmaceutical/i }
    ]
  };
  const deletedCustomers = await db.collection('customers').deleteMany(testCustomersFilter);
  console.log(`Deleted ${deletedCustomers.deletedCount} dummy customers.`);

  // 3. Enquiries created by test runs
  const testEnquiriesFilter = {
    $or: [
      { email: /example\.com$/i },
      { name: /Ramesh.*Patel/i }
    ]
  };
  const deletedEnquiries = await db.collection('enquiries').deleteMany(testEnquiriesFilter);
  console.log(`Deleted ${deletedEnquiries.deletedCount} dummy enquiries.`);

  // 4. Contacts created by automated test scripts
  const testContactsFilter = {
    $or: [
      { email: /^client1_ai_/i },
      { email: /example\.com$/i },
      { name: 'Amit Singhania' }
    ]
  };
  const deletedContacts = await db.collection('contacts').deleteMany(testContactsFilter);
  console.log(`Deleted ${deletedContacts.deletedCount} dummy contacts.`);

  // 5. Agent tasks created by automated test scripts
  const testAgentTasksFilter = {
    $or: [
      { 'proposedPayload.email': /^client1_ai_/i },
      { 'proposedPayload.customerName': 'Amit Singhania' },
      { title: /Amit Singhania/i },
      { title: /BioPharma India Ltd/i }
    ]
  };
  const deletedAgentTasks = await db.collection('agenttasks').deleteMany(testAgentTasksFilter);
  console.log(`Deleted ${deletedAgentTasks.deletedCount} dummy agent tasks.`);

  // 6. Test users (e.g. test.hacker... email pattern)
  const testUsersFilter = {
    email: /^test\.hacker/i
  };
  const deletedUsers = await db.collection('users').deleteMany(testUsersFilter);
  console.log(`Deleted ${deletedUsers.deletedCount} test hacker users.`);

  console.log('✅ Cleanup finished successfully.');
};

if (process.argv[1] && process.argv[1].endsWith('cleanDummyData.js')) {
  (async () => {
    try {
      await cleanDummyData();
      await mongoose.disconnect();
      process.exit(0);
    } catch (err) {
      console.error('Cleanup failed:', err);
      process.exit(1);
    }
  })();
}

