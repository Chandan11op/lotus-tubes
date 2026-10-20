import app from './app.js';
import { config } from './config/env.js';
import { connectDB } from './config/db.js';

const startServer = async () => {
  // Connect to MongoDB gracefully
  await connectDB();

  let port = config.port;

  const server = app.listen(port, () => {
    console.log(`🚀 Lotus Tubes API Server listening on http://localhost:${port}`);
    console.log(`📡 Health endpoint available at http://localhost:${port}/api/health`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️ Port ${port} is in use. Trying port ${port + 1}...`);
      port += 1;
      server.listen(port);
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
