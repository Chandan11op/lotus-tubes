import { getDBStatus } from '../config/db.js';
import { config } from '../config/env.js';

export const getHealth = (req, res) => {
  const dbStatus = getDBStatus();
  const isHealthy = dbStatus.connected;
  const statusCode = isHealthy ? 200 : 503;

  return res.status(statusCode).json({
    status: isHealthy ? 'success' : 'unhealthy',
    success: isHealthy,
    message: isHealthy ? 'Lotus Tubes API is running' : 'Lotus Tubes API service degraded: Database disconnected',
    version: '2.0.0',
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    database: {
      status: dbStatus.status || (dbStatus.connected ? 'connected' : 'disconnected'),
      connected: !!dbStatus.connected
    },
    // Backwards compatibility for existing tests and client consumers
    data: {
      status: isHealthy ? 'healthy' : 'degraded',
      database: dbStatus,
      services: {
        resend: !!config.resend.apiKey && !config.resend.apiKey.includes('placeholder')
      }
    }
  });
};
