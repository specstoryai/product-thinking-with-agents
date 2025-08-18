import { Request, Response, NextFunction } from 'express';
import { log } from '../utils/logger.js';

/**
 * Middleware to authenticate API requests using an API key
 */
export const authenticateRequest = (req: Request, res: Response, next: NextFunction): Response | void => {
  const apiKey = req.headers['x-api-key'] as string;
  const expectedKey = process.env.API_KEY;

  // Skip authentication in development if no API key is set
  if (process.env.NODE_ENV === 'development' && !expectedKey) {
    log.warn('API_KEY not set in development mode - skipping authentication');
    return next();
  }

  // Check if API key is provided
  if (!apiKey) {
    log.warn(`Authentication failed: No API key provided from ${req.ip}`);
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'API key is required' 
    });
  }

  // Validate API key
  if (!expectedKey || apiKey !== expectedKey) {
    log.warn(`Authentication failed: Invalid API key from ${req.ip}`);
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'Invalid API key' 
    });
  }

  // Authentication successful
  next();
};

/**
 * Middleware to authenticate WebSocket connections
 */
export const authenticateWebSocket = (apiKey: string | undefined): boolean => {
  const expectedKey = process.env.API_KEY;

  // Skip authentication in development if no API key is set
  if (process.env.NODE_ENV === 'development' && !expectedKey) {
    log.warn('API_KEY not set in development mode - skipping WebSocket authentication');
    return true;
  }

  if (!apiKey || !expectedKey || apiKey !== expectedKey) {
    log.warn('WebSocket authentication failed: Invalid or missing API key');
    return false;
  }

  return true;
};