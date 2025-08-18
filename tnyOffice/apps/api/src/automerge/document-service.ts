import { AutomergeUrl, DocHandle } from '@automerge/automerge-repo';
import { getRepo } from './repo.js';
import { getDB } from '../db/database.js';
import type { MarkdownDocument } from './types.js';
import { log } from '../utils/logger.js';

export class DocumentService {
  /**
   * Get or create an Automerge document for a file
   */
  static async getOrCreateDocument(fileId: string): Promise<DocHandle<MarkdownDocument>> {
    const db = getDB();
    const repo = getRepo();
    
    // Check if file has an automerge_id
    const file = db.prepare(`
      SELECT id, filename, content, automerge_id 
      FROM files 
      WHERE id = ?
    `).get(fileId) as { id: string; filename: string; content: string; automerge_id: string | null } | undefined;
    
    if (!file) {
      throw new Error(`File not found: ${fileId}`);
    }
    
    let handle: DocHandle<MarkdownDocument>;
    
    if (file.automerge_id) {
      // File already has an Automerge document
      log.info(`Loading existing Automerge document for file ${fileId}`);
      handle = await repo.find<MarkdownDocument>(file.automerge_id as AutomergeUrl);
    } else {
      // Create new Automerge document
      log.info(`Creating new Automerge document for file ${fileId}`);
      handle = repo.create<MarkdownDocument>();
      
      // Initialize document with current content
      handle.change((doc) => {
        doc.content = file.content || '';
        doc.comments = {};
        doc.metadata = {
          filename: file.filename,
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
      });
      
      // Update file record with automerge_id
      db.prepare(`
        UPDATE files 
        SET automerge_id = ?, updated_at = unixepoch() 
        WHERE id = ?
      `).run(handle.url, fileId);
      
      log.info(`Created Automerge document ${handle.url} for file ${fileId}`);
    }
    
    return handle;
  }
  
  /**
   * Update file content from Automerge document
   */
  static async updateFileFromDocument(fileId: string, handle: DocHandle<MarkdownDocument>): Promise<void> {
    const db = getDB();
    const doc = handle.docSync();
    
    if (!doc) {
      throw new Error('Document not loaded');
    }
    
    // Update file content in database
    db.prepare(`
      UPDATE files 
      SET content = ?, updated_at = unixepoch() 
      WHERE id = ?
    `).run(doc.content || '', fileId);
    
    log.debug(`Updated file ${fileId} from Automerge document`);
  }
  
  /**
   * Get document content
   */
  static async getDocumentContent(handle: DocHandle<MarkdownDocument>): Promise<string> {
    await handle.doc(); // Ensure document is loaded
    const doc = handle.docSync();
    return doc?.content || '';
  }
  
  /**
   * Update document content
   */
  static updateDocumentContent(handle: DocHandle<MarkdownDocument>, content: string): void {
    handle.change((doc) => {
      doc.content = content;
      if (doc.metadata) {
        doc.metadata.updatedAt = Date.now();
      }
    });
  }
}