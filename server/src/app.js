import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import apiRoutes from './routes/apiRoutes.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

const app = express();

// CORS configuration supporting local dev and configured origin
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  config.clientUrl
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.some(o => origin.startsWith(o) || o === '*')) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev mode for smooth pair programming
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Body Parsing Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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
