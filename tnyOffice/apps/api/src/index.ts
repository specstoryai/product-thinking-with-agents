import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { log } from './utils/logger.js';
import { initDB } from './db/database.js';
import { initAutomergeRepo } from './automerge/repo.js';
import { initWebSocketServer } from './websocket/server.js';
import filesRouter from './routes/files.js';
import gitRouter from './routes/git.js';
import { authenticateRequest } from './middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local first, then .env
dotenv.config({ path: path.join(__dirname, '../.env.local') });
dotenv.config({ path: path.join(__dirname, '../.env') });

// Debug environment variables
if (process.env.GIT_REMOTE_URL) {
  log.info('Environment loaded - GIT_REMOTE_URL is set');
} else {
  log.warn('Environment loaded - GIT_REMOTE_URL is NOT set');
}

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // In production, only allow specific origins
    if (process.env.NODE_ENV === 'production') {
      const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    } else {
      // In development, allow all origins
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-api-key'],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint (no auth required)
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Apply authentication middleware to all API routes
app.use('/api/v1', authenticateRequest);

// Routes
app.use('/api/v1/files', filesRouter);
app.use('/api/v1/git', gitRouter);

// Initialize database and start server
async function start(): Promise<void> {
  try {
    await initDB();
    initAutomergeRepo();
    
    // Create HTTP server
    const httpServer = createServer(app);
    
    // Initialize WebSocket server
    initWebSocketServer(httpServer);
    
    // Start the server
    httpServer.listen(PORT, () => {
      log.info(`API server running on http://localhost:${PORT}`);
      log.info(`WebSocket server ready on ws://localhost:${PORT}`);
    });
  } catch (error) {
    log.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();