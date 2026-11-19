import dotenv from 'dotenv';
import path from 'path';
import crypto from 'crypto';
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
  passwordResetOtpSecret:
    process.env.PASSWORD_RESET_OTP_SECRET ||
    (rawJwtSecret
      ? crypto.createHmac('sha256', rawJwtSecret).update('lotus_tubes_otp_fallback_salt').digest('hex')
      : 'lotus_tubes_otp_hmac_secret_dev_32bytes_min!'),
  staffInitEmail: (process.env.STAFF_INIT_EMAIL || 'sales@lotustubes.com').toLowerCase().trim(),
  staffInitPassword: process.env.STAFF_INIT_PASSWORD || (isProduction ? '' : 'lotustubes@11'),
  turnstileSecretKey: process.env.TURNSTILE_SECRET_KEY || process.env.SECRET_KEY || '',
  backendPublicUrl: process.env.BACKEND_PUBLIC_URL || (isProduction ? 'https://chocolate-goldfinch-515434.hostingersite.com' : 'http://localhost:5000'),
  resend: {
    apiKey: process.env.RESEND_API_KEY || '',
    fromEmail: process.env.RESEND_FROM_EMAIL || 'sales@lotustubes.com',
    supportEmail: process.env.RESEND_SUPPORT_EMAIL || 'support@lotustubes.com',
    notificationEmail: process.env.CONTACT_NOTIFICATION_EMAIL || 'sales@lotustubes.com',
    webhookSecret: process.env.RESEND_WEBHOOK_SECRET || '',
    agents: {
      ananya: process.env.RESEND_AGENT_ANANYA_EMAIL || 'ananyamehta@lotustubes.com',
      riya: process.env.RESEND_AGENT_RIYA_EMAIL || 'riyashah@lotustubes.com',
      neha: process.env.RESEND_AGENT_NEHA_EMAIL || 'nehadesai@lotustubes.com',
      arjun: process.env.RESEND_AGENT_ARJUN_EMAIL || 'arjunyadav@lotustubes.com'
    }
  },
  whatsapp: {
    enabled: process.env.WHATSAPP_ENABLED === 'true',
    metaAppId: process.env.META_APP_ID || '',
    metaAppSecret: process.env.META_APP_SECRET || '',
    businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '',
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
    businessNumber: process.env.WHATSAPP_BUSINESS_NUMBER || '+91 99304 30789',
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
    apiVersion: process.env.WHATSAPP_API_VERSION || 'v21.0',
    webhookVerifyToken: process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || '',
    webhookPath: process.env.WHATSAPP_WEBHOOK_PATH || '/api/webhooks/whatsapp',
    quotationTemplate: process.env.WHATSAPP_QUOTATION_TEMPLATE || 'lotus_quotation_delivery',
    invoiceTemplate: process.env.WHATSAPP_INVOICE_TEMPLATE || 'lotus_invoice_delivery',
    templateLanguage: process.env.WHATSAPP_TEMPLATE_LANGUAGE || 'en',
    botEnabled: process.env.WHATSAPP_BOT_ENABLED !== 'false',
    botMode: process.env.WHATSAPP_BOT_MODE || 'auto',
    humanHandoverEnabled: process.env.WHATSAPP_BOT_HUMAN_HANDOVER !== 'false'
  }
};
