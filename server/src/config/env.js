import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:1109',
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/lotus_tubes',
  jwtSecret: process.env.JWT_SECRET || 'lotus_tubes_jwt_secret_dev_2026_hygienic_valves',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  staffInitEmail: (process.env.STAFF_INIT_EMAIL || 'chirag@lotustubes.com').toLowerCase().trim(),
  staffInitPassword: process.env.STAFF_INIT_PASSWORD || 'LotusTubesStaff2026!',
  turnstileSecretKey: process.env.TURNSTILE_SECRET_KEY || process.env.SECRET_KEY || '',
  resend: {
    apiKey: process.env.RESEND_API_KEY || '',
    fromEmail: process.env.RESEND_FROM_EMAIL || 'sales@lotustubes.com',
    notificationEmail: process.env.CONTACT_NOTIFICATION_EMAIL || 'sales@lotustubes.com',
  }
};

