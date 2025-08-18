import { Repo } from '@automerge/automerge-repo';
import { SQLiteStorageAdapter } from './sqlite-adapter.js';
import { getDB } from '../db/database.js';
import { log } from '../utils/logger.js';

let repo: Repo | null = null;

export function initAutomergeRepo(): Repo {
  if (repo) {
    return repo;
  }

  log.info('Initializing Automerge Repo');

  // Get the SQLite database instance
  const db = getDB();

  // Create storage adapter
  const storage = new SQLiteStorageAdapter(db);

  // Initialize the repo with our storage adapter
  repo = new Repo({
    storage,
    // We'll add network adapters later for WebSocket support
    network: [],
    // Share policy - for now, share all documents
    sharePolicy: async () => true,
  });

  log.info('Automerge Repo initialized successfully');
  
  return repo;
}

export function getRepo(): Repo {
  if (!repo) {
    throw new Error('Automerge Repo not initialized. Call initAutomergeRepo() first.');
  }
  return repo;
}

export function closeRepo(): void {
  if (repo) {
    repo.networkSubsystem.adapters.forEach(adapter => {
      if ('disconnect' in adapter && typeof adapter.disconnect === 'function') {
        adapter.disconnect();
      }
    });
    repo = null;
    log.info('Automerge Repo closed');
  }
}