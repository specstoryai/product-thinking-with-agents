import type { StorageAdapterInterface, StorageKey } from '@automerge/automerge-repo';
import type { Database, Statement } from 'better-sqlite3';
import { log } from '../utils/logger.js';

export class SQLiteStorageAdapter implements StorageAdapterInterface {
  private statements: {
    load: Statement;
    save: Statement;
    remove: Statement;
    loadRange: Statement;
    removeRange: Statement;
  };

  constructor(db: Database) {
    
    // Prepare statements for better performance
    this.statements = {
      load: db.prepare('SELECT data FROM automerge_storage WHERE key = ?'),
      save: db.prepare('INSERT OR REPLACE INTO automerge_storage (key, data, created_at) VALUES (?, ?, unixepoch())'),
      remove: db.prepare('DELETE FROM automerge_storage WHERE key = ?'),
      loadRange: db.prepare('SELECT key, data FROM automerge_storage WHERE key LIKE ? ORDER BY key'),
      removeRange: db.prepare('DELETE FROM automerge_storage WHERE key LIKE ?')
    };
    
    log.info('SQLiteStorageAdapter initialized');
  }

  async load(key: StorageKey): Promise<Uint8Array | undefined> {
    const keyStr = this.keyToString(key);
    
    try {
      const row = this.statements.load.get(keyStr) as { data: Buffer } | undefined;
      
      if (row) {
        log.debug(`Loaded data for key: ${keyStr}`);
        return new Uint8Array(row.data);
      }
      
      log.debug(`No data found for key: ${keyStr}`);
      return undefined;
    } catch (error) {
      log.error(`Error loading key ${keyStr}:`, error);
      throw error;
    }
  }

  async save(key: StorageKey, data: Uint8Array): Promise<void> {
    const keyStr = this.keyToString(key);
    
    try {
      this.statements.save.run(keyStr, Buffer.from(data));
      log.debug(`Saved data for key: ${keyStr} (${data.length} bytes)`);
    } catch (error) {
      log.error(`Error saving key ${keyStr}:`, error);
      throw error;
    }
  }

  async remove(key: StorageKey): Promise<void> {
    const keyStr = this.keyToString(key);
    
    try {
      const result = this.statements.remove.run(keyStr);
      log.debug(`Removed key: ${keyStr} (affected: ${result.changes})`);
    } catch (error) {
      log.error(`Error removing key ${keyStr}:`, error);
      throw error;
    }
  }

  async loadRange(keyPrefix: StorageKey): Promise<{ key: StorageKey; data: Uint8Array }[]> {
    const prefix = this.keyToString(keyPrefix);
    
    try {
      const rows = this.statements.loadRange.all(prefix + '%') as Array<{ key: string; data: Buffer }>;
      
      const results = rows.map(row => ({
        key: this.stringToKey(row.key),
        data: new Uint8Array(row.data)
      }));
      
      log.debug(`Loaded ${results.length} items for prefix: ${prefix}`);
      return results;
    } catch (error) {
      log.error(`Error loading range ${prefix}:`, error);
      throw error;
    }
  }

  async removeRange(keyPrefix: StorageKey): Promise<void> {
    const prefix = this.keyToString(keyPrefix);
    
    try {
      const result = this.statements.removeRange.run(prefix + '%');
      log.debug(`Removed ${result.changes} items for prefix: ${prefix}`);
    } catch (error) {
      log.error(`Error removing range ${prefix}:`, error);
      throw error;
    }
  }

  private keyToString(key: StorageKey): string {
    return key.join(':');
  }

  private stringToKey(str: string): StorageKey {
    return str.split(':');
  }
}