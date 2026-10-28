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

// Comprehensive CORS configuration supporting local ports (5174, 1109, 5173, 3000) and hosted Vercel/Render origins
const rawOrigins = [
  'http://localhost:5174',
  'http://127.0.0.1:5174',
  'http://localhost:1109',
  'http://127.0.0.1:1109',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'https://lotus-tubes-design.vercel.app',
  'https://lotus-tubes-react-design.vercel.app',
  'https://lotus-tubes.onrender.com',
  config.vercelApi,
  config.renderApi,
  ...(typeof config.clientUrl === 'string' ? config.clientUrl.split(',') : [])
];

const normalizedAllowedOrigins = rawOrigins
  .filter(Boolean)
  .map((o) => o.trim().replace(/\/$/, ''));

const isOriginPermitted = (origin) => {
  if (!origin) return true; // mobile apps, server-to-server, curl, same-origin
  const cleanOrigin = origin.replace(/\/$/, '');

  if (normalizedAllowedOrigins.some((o) => o === '*' || cleanOrigin === o)) {
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
    allowedHeaders: ['Content-Type', 'Authorization', 'cf-turnstile-token']
  })
);

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
