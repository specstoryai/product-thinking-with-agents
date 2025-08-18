// Simple logger implementation for production deployment
const isProd = process.env.NODE_ENV === 'production';

export const log = {
  info: (...args: unknown[]) => {
    if (!isProd) console.info('[INFO]', ...args);
  },
  warn: (...args: unknown[]) => {
    if (!isProd) console.warn('[WARN]', ...args);
  },
  error: (...args: unknown[]) => {
    console.error('[ERROR]', ...args);
  },
  debug: (...args: unknown[]) => {
    if (!isProd) console.debug('[DEBUG]', ...args);
  },
};