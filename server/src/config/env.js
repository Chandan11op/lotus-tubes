import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load from server directory .env, falling back to current working directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';

// In production, ensure secure JWT secret is supplied
const rawJwtSecret = process.env.JWT_SECRET;
if (isProduction) {
  if (!rawJwtSecret || rawJwtSecret.length < 32 || rawJwtSecret.includes('dev') || rawJwtSecret.includes('secret')) {
    throw new Error('SECURITY FATAL: In production, JWT_SECRET must be set and contain at least 32 high-entropy characters.');
  }
}

export const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv,
  isProduction,
  clientUrl: process.env.CLIENT_URL || 'https://lotustubes.com,https://www.lotustubes.com,http://localhost:5173,http://localhost:5174',
  renderApi: process.env.RENDER_API || 'https://lotus-tubes.onrender.com',
  vercelApi: process.env.VERCEL_API || 'https://lotus-tubes-react-design.vercel.app',
  mongoUri: process.env.MONGODB_URI || (isProduction ? '' : 'mongodb://localhost:27017/lotus_tubes'),
  jwtSecret: rawJwtSecret || 'lotus_tubes_jwt_secret_dev_2026_hygienic_valves',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  staffInitEmail: (process.env.STAFF_INIT_EMAIL || 'sales@lotustubes.com').toLowerCase().trim(),
  staffInitPassword: process.env.STAFF_INIT_PASSWORD || (isProduction ? '' : 'lotustubes@11'),
  turnstileSecretKey: process.env.TURNSTILE_SECRET_KEY || process.env.SECRET_KEY || '',
  resend: {
    apiKey: process.env.RESEND_API_KEY || '',
    fromEmail: process.env.RESEND_FROM_EMAIL || 'sales@lotustubes.com',
    notificationEmail: process.env.CONTACT_NOTIFICATION_EMAIL || 'sales@lotustubes.com'
  },
  whatsapp: {
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
    businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || ''
  }
};
