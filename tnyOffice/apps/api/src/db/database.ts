import Database from 'better-sqlite3';
import { log } from '../utils/logger.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db: Database.Database | null = null;

export async function initDB(): Promise<Database.Database> {
  // Use /data directory for persistent volume in production, local path for development
  const dbPath = process.env.NODE_ENV === 'production' 
    ? '/data/database.db'
    : path.join(__dirname, '../../database.db');
  db = new Database(dbPath);
  
  log.info('Initializing SQLite database at:', dbPath);

  // Create files table
  db.exec(`
    CREATE TABLE IF NOT EXISTS files (
      id TEXT PRIMARY KEY,
      filename TEXT NOT NULL,
      content TEXT,
      automerge_id TEXT UNIQUE,
      created_at INTEGER DEFAULT (unixepoch()),
      updated_at INTEGER DEFAULT (unixepoch())
    )
  `);

  // Create Automerge storage table
  db.exec(`
    CREATE TABLE IF NOT EXISTS automerge_storage (
      key TEXT PRIMARY KEY,
      data BLOB NOT NULL,
      created_at INTEGER DEFAULT (unixepoch())
    )
  `);

  // Create indexes
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_files_created_at ON files(created_at);
    CREATE INDEX IF NOT EXISTS idx_files_filename ON files(filename);
    CREATE INDEX IF NOT EXISTS idx_files_automerge_id ON files(automerge_id);
    CREATE INDEX IF NOT EXISTS idx_automerge_key_prefix ON automerge_storage(key);
  `);

  log.info('Database initialized successfully');
  return db;
}

export function getDB(): Database.Database {
  if (!db) {
    throw new Error('Database not initialized. Call initDB() first.');
  }
  return db;
}