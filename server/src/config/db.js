import mongoose from 'mongoose';
import { config } from './env.js';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    return;
  }

  if (!config.mongoUri) {
    console.warn('⚠️ MONGODB_URI not configured. Database persistence will be disabled.');
    return;
  }

  try {
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 4000,
    });
    isConnected = !!conn.connections[0].readyState;
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    isConnected = false;
    console.warn(`⚠️ MongoDB Connection Warning: ${error.message}. Running in offline/graceful mode.`);
  }
};

export const getDBStatus = () => ({
  connected: isConnected,
  readyState: mongoose.connection.readyState,
  status: isConnected ? 'connected' : 'disconnected'
});
