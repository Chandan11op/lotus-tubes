import { getDBStatus } from '../config/db.js';
import { successResponse } from '../utils/responseHandler.js';
import { config } from '../config/env.js';

export const getHealth = (req, res) => {
  const dbStatus = getDBStatus();
  return successResponse(
    res,
    {
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: config.nodeEnv,
      database: dbStatus,
      services: {
        resend: !!config.resend.apiKey && !config.resend.apiKey.includes('placeholder')
      }
    },
    'Lotus Tubes API is operational'
  );
};
