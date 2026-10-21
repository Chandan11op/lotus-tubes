import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config/env.js';
import apiRoutes from './routes/apiRoutes.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Comprehensive CORS configuration supporting local ports (1109, 5173, 3000) and hosted Vercel/Render origins
const rawOrigins = [
  'http://localhost:1109',
  'http://127.0.0.1:1109',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'https://lotus-tubes-design.vercel.app',
  'https://lotus-tubes-react-design.vercel.app',
  'https://lotus-tubes.onrender.com',
  config.vercelApi,
  config.renderApi,
  ...(typeof config.clientUrl === 'string' ? config.clientUrl.split(',') : [])
];

const normalizedAllowedOrigins = rawOrigins
  .filter(Boolean)
  .map(o => o.trim().replace(/\/$/, ''));

const isOriginPermitted = (origin) => {
  if (!origin) return true; // mobile apps, server-to-server, curl
  const cleanOrigin = origin.replace(/\/$/, '');
  
  if (normalizedAllowedOrigins.some(o => o === '*' || cleanOrigin === o)) {
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
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'cf-turnstile-token']
  })
);

// Body Parsing Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static Files (serving sample quotation PDF and assets)
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../../client/public')));

// Root welcome route
app.get('/', (req, res) => {
  res.json({
    name: 'Lotus Tubes B2B API',
    version: '1.0.0',
    status: 'online',
    documentation: '/api/health'
  });
});

// Mount API Routes
app.use('/api', apiRoutes);

// 404 Not Found Handler
app.use(notFoundHandler);

// Centralized Error Handler
app.use(errorHandler);

export default app;
