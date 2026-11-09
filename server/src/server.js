import dns from 'dns';
try {
  dns.setDefaultResultOrder('ipv4first');
} catch {
  // Graceful fallback
}

import app from './app.js';
import { config } from './config/env.js';
import { connectDB } from './config/db.js';
import { provisionStaffUser } from './scripts/provisionStaff.js';
import { Product } from './models/Product.js';
import { seedProductCatalog } from './scripts/seedProducts.js';

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    await provisionStaffUser();

    // Check if products need initial seeding
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('📦 Initializing product catalogue in MongoDB...');
      await seedProductCatalog();
    }
  } catch (err) {
    console.error('Initialization error during startup:', err.message);
    if (config.isProduction) {
      process.exit(1);
    }
  }

  let port = config.port;

  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Lotus Tubes API Server listening on port ${port}`);
    console.log(`📡 Health endpoint available at http://localhost:${port}/api/health`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️ Port ${port} is in use. Trying port ${port + 1}...`);
      port += 1;
      server.listen(port, '0.0.0.0');
    } else {
      console.error('Server error:', err);
    }
  });

  // Graceful shutdown handling
  const shutdown = () => {
    console.log('\nShutting down Lotus Tubes Server gracefully...');
    server.close(() => {
      console.log('HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
};

startServer();
