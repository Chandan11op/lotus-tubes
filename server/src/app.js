import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config/env.js';
import apiRoutes from './routes/apiRoutes.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';
import { generalApiLimiter } from './middleware/rateLimiters.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security Headers with Helmet
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows flexible API & asset delivery across domains
    crossOriginEmbedderPolicy: false
  })
);

// Comprehensive CORS configuration supporting production domains, Hostinger, and local dev
const rawOrigins = [
  'https://lotustubes.com',
  'https://www.lotustubes.com',
  'https://chocolate-goldfinch-515434.hostingersite.com',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
  'http://localhost:1109',
  'http://127.0.0.1:1109',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5000',
  'http://127.0.0.1:5000',
  'https://lotus-tubes-design.vercel.app',
  'https://lotus-tubes-react-design.vercel.app',
  'https://lotus-tubes.onrender.com',
  config.vercelApi,
  config.renderApi,
  ...(typeof config.clientUrl === 'string' ? config.clientUrl.split(',') : [])
];

const normalizedAllowedOrigins = rawOrigins
  .filter(Boolean)
  .map((o) => o.trim().replace(/\/+$/, ''));

const isOriginPermitted = (origin) => {
  if (!origin) return true; // mobile apps, server-to-server, curl, same-origin
  const cleanOrigin = origin.trim().replace(/\/+$/, '');

  if (normalizedAllowedOrigins.some((o) => o !== '*' && cleanOrigin === o)) {
    return true;
  }
  // Production domain pattern match (lotustubes.com and www.lotustubes.com)
  if (/^https:\/\/(www\.)?lotustubes\.com$/.test(cleanOrigin)) {
    return true;
  }
  // Hostinger backend preview domain
  if (/^https:\/\/chocolate-goldfinch-515434\.hostingersite\.com$/.test(cleanOrigin)) {
    return true;
  }
  // Allow all Vercel deployments and preview URLs for this project
  if (/^https:\/\/lotus-tubes(-[a-zA-Z0-9_-]+)?\.vercel\.app$/.test(cleanOrigin)) {
    return true;
  }
  // Allow Render domains
  if (/^https:\/\/lotus-tubes(-[a-zA-Z0-9_-]+)?\.onrender\.com$/.test(cleanOrigin)) {
    return true;
  }
  return false;
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isOriginPermitted(origin)) {
        return callback(null, true);
      }
      if (config.nodeEnv === 'development') {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'cf-turnstile-token', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 86400
  })
);

// Explicit preflight handler across all routes
app.options('*', cors());

// Request body size limits (1MB is plenty for B2B RFQs and prevents payload-bombing)
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Static Files (serving sample quotation PDF and static assets)
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../../client/public')));

// Root welcome & API health indicator
app.get('/', (req, res) => {
  res.json({
    name: 'Lotus Tubes B2B API',
    version: '2.0.0',
    status: 'online',
    documentation: '/api/health'
  });
});

// Apply general API rate limiting to all /api routes
app.use('/api', generalApiLimiter);

// Mount API Routes
app.use('/api', apiRoutes);

// 404 Not Found Handler
app.use(notFoundHandler);

// Centralized Error Handler
app.use(errorHandler);

export default app;
