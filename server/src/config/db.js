import mongoose from 'mongoose';
import dns from 'dns';
import { config } from './env.js';

// Ensure IPv4 lookup precedence on dual-stack hosts to avoid MongoDB Atlas connection timeouts
try {
  dns.setDefaultResultOrder('ipv4first');
} catch {
  // Graceful fallback for environments where setDefaultResultOrder is unavailable
}

let isConnected = false;

export const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!config.mongoUri) {
    const errorMsg = '⚠️ MONGODB_URI not configured. In production, persistent database storage is mandatory.';
    if (config.isProduction) {
      console.error('FATAL: ' + errorMsg);
      throw new Error(errorMsg);
    }
    console.warn(errorMsg);
    return null;
  }

  try {
    const conn = await mongoose.connect(config.mongoUri, {
      dbName: 'lotus_tubes',
      serverSelectionTimeoutMS: 10000,
      autoIndex: true
    });
    isConnected = true;
    const safeHost = conn.connection.host || 'MongoDB Cluster';
    console.log(`✅ MongoDB Connected successfully to database [${conn.connection.name}] at ${safeHost}`);
    return conn;
  } catch (error) {
    isConnected = false;
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    if (config.isProduction) {
      // In production, do not proceed with severed persistent storage
      throw error;
    }
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

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB runtime error:', err.message);
});

export const getDBStatus = () => {
  const ready = mongoose.connection.readyState === 1;
  return {
    connected: ready,
    readyState: mongoose.connection.readyState,
    dbName: mongoose.connection.name || 'lotus_tubes',
    status: ready ? 'connected' : 'disconnected'
  };
};

/**
 * Middleware or helper to verify DB availability for persistence operations
 */
export const assertDatabaseConnected = () => {
  if (mongoose.connection.readyState !== 1) {
    const err = new Error('Database service is currently unavailable. Operation aborted to prevent data loss.');
    err.status = 503;
    throw err;
  }
};
