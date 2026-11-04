import { getDBStatus } from '../config/db.js';
import { config } from '../config/env.js';

export const getHealth = (req, res) => {
  const dbStatus = getDBStatus();
  return res.status(200).json({
    status: 'success',
    success: true,
    message: 'Lotus Tubes API is running',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    database: {
      status: dbStatus.status || (dbStatus.connected ? 'connected' : 'disconnected'),
      connected: !!dbStatus.connected
    },
    // Backwards compatibility for existing tests and client consumers
    data: {
      status: 'healthy',
      database: dbStatus,
      services: {
        resend: !!config.resend.apiKey && !config.resend.apiKey.includes('placeholder')
      }
    }
  });
};
