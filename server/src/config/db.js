import mongoose from 'mongoose';
import { config } from './env.js';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!config.mongoUri) {
    console.warn('⚠️ MONGODB_URI not configured. Database persistence will be disabled.');
    return null;
  }

  try {
    const conn = await mongoose.connect(config.mongoUri, {
      dbName: 'lotus_tubes',
      serverSelectionTimeoutMS: 8000,
      autoIndex: true
    });
    isConnected = true;
    const safeHost = conn.connection.host || 'MongoDB Cluster';
    console.log(`✅ MongoDB Connected successfully to database [${conn.connection.name}] at ${safeHost}`);
    return conn;
  } catch (error) {
    isConnected = false;
    console.warn(`⚠️ MongoDB Connection Warning: ${error.message}. Database currently offline.`);
    return null;
  }
};

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.warn('⚠️ MongoDB connection lost. Disconnected from database.');
});

mongoose.connection.on('reconnected', () => {
  isConnected = true;
  console.log('🔄 MongoDB reconnected successfully.');
});

export const getDBStatus = () => ({
  connected: isConnected && mongoose.connection.readyState === 1,
  readyState: mongoose.connection.readyState,
  dbName: mongoose.connection.name || 'lotus_tubes',
  status: (isConnected && mongoose.connection.readyState === 1) ? 'connected' : 'disconnected'
});

