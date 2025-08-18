import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { WebSocketServer } from 'ws';
import { WebSocketServerAdapter } from '@automerge/automerge-repo-network-websocket';
import { getRepo } from '../automerge/repo.js';
import { log } from '../utils/logger.js';
import { authenticateWebSocket } from '../middleware/auth.js';
import { IncomingMessage } from 'http';
import { URL } from 'url';

let io: SocketIOServer | null = null;
let wss: WebSocketServer | null = null;
let wsAdapter: WebSocketServerAdapter | null = null;

export function initWebSocketServer(httpServer: HTTPServer): SocketIOServer {
  if (io) {
    return io;
  }

  log.info('Initializing WebSocket server');

  // Create Socket.io server for custom events (presence, etc.)
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: (origin, callback) => {
        // Allow requests with no origin
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
      methods: ['GET', 'POST'],
      credentials: true,
      allowedHeaders: ['x-api-key']
    },
    path: '/socket.io/'
  });

  // Socket.io authentication middleware
  io.use((socket, next) => {
    const apiKey = socket.handshake.auth.apiKey || socket.handshake.headers['x-api-key'];
    
    if (authenticateWebSocket(apiKey)) {
      next();
    } else {
      next(new Error('Unauthorized'));
    }
  });

  // Create WebSocket server for Automerge sync
  wss = new WebSocketServer({ 
    noServer: true  // We'll handle the upgrade manually
  });

  // Handle WebSocket upgrade with authentication
  httpServer.on('upgrade', (request: IncomingMessage, socket, head) => {
    const url = new URL(request.url || '', `http://${request.headers.host}`);
    
    // Only handle /automerge-sync path
    if (url.pathname !== '/automerge-sync') {
      return;
    }

    // Extract API key from query params or headers
    const apiKey = url.searchParams.get('apiKey') || request.headers['x-api-key'] as string;
    
    if (!authenticateWebSocket(apiKey)) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }

    // Authentication successful, upgrade the connection
    wss!.handleUpgrade(request, socket, head, (ws) => {
      wss!.emit('connection', ws, request);
    });
  });

  // Create Automerge WebSocket adapter
  const repo = getRepo();
  wsAdapter = new WebSocketServerAdapter(wss as any);
  repo.networkSubsystem.addNetworkAdapter(wsAdapter);

  // Handle connections
  io.on('connection', (socket) => {
    log.info(`WebSocket client connected: ${socket.id}`);

    // Handle custom events (presence, etc.)
    socket.on('presence', (data) => {
      log.debug('Presence update:', data);
      // Broadcast presence to other clients in the same document room
      if (data.docId) {
        socket.to(`doc:${data.docId}`).emit('presence', data);
      }
    });

    // Join document room for presence
    socket.on('join-doc', (docId: string) => {
      socket.join(`doc:${docId}`);
      log.info(`Client ${socket.id} joined document: ${docId}`);
    });

    // Leave document room
    socket.on('leave-doc', (docId: string) => {
      socket.leave(`doc:${docId}`);
      log.info(`Client ${socket.id} left document: ${docId}`);
    });

    socket.on('disconnect', () => {
      log.info(`WebSocket client disconnected: ${socket.id}`);
    });
  });

  log.info('WebSocket server initialized');
  return io;
}

export function getWebSocketServer(): SocketIOServer {
  if (!io) {
    throw new Error('WebSocket server not initialized');
  }
  return io;
}

export function closeWebSocketServer(): void {
  if (wsAdapter) {
    // Remove adapter from repo
    const repo = getRepo();
    repo.networkSubsystem.removeNetworkAdapter(wsAdapter);
    wsAdapter = null;
  }
  
  if (wss) {
    wss.close();
    wss = null;
  }
  
  if (io) {
    io.close();
    io = null;
    log.info('WebSocket servers closed');
  }
}