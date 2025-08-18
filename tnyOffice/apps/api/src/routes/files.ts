import express, { Request, Response, Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import * as Automerge from '@automerge/automerge';
import { AutomergeUrl } from '@automerge/automerge-repo';
import { log } from '../utils/logger.js';
import { getDB } from '../db/database.js';
import { DocumentService } from '../automerge/document-service.js';
import { getRepo } from '../automerge/repo.js';
import { createFileSchema, listFilesSchema, updateFileSchema, isValidUUID, createCommentSchema } from '../validation.js';
import { ZodError } from 'zod';
import type { 
  FileMetadata, 
  FileWithContent, 
  ListFilesResponse, 
  CreateFileRequest,
  UpdateFileRequest,
  ErrorResponse 
} from '../types.js';
import type { Comment } from '../automerge/types.js';
import type { CreateCommentInput } from '../validation.js';

const router: Router = express.Router();

// Database row types
interface FileRow {
  id: string;
  filename: string;
  content: string;
  created_at: number;
  updated_at: number;
}

interface FileListRow {
  id: string;
  filename: string;
  created_at: number;
  updated_at: number;
  size: number;
}

// Create a new file
router.post('/', async (req: Request<object, object, CreateFileRequest>, res: Response<FileMetadata | ErrorResponse>) => {
  log.info('POST /api/v1/files - Request received');
  
  try {
    const validatedData = createFileSchema.parse(req.body);
    const db = getDB();
    
    const id = uuidv4();
    const now = Math.floor(Date.now() / 1000);
    
    const stmt = db.prepare(`
      INSERT INTO files (id, filename, content, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    stmt.run(id, validatedData.filename, validatedData.content, now, now);
    
    const fileMetadata: FileMetadata = {
      id,
      filename: validatedData.filename,
      createdAt: new Date(now * 1000).toISOString(),
      updatedAt: new Date(now * 1000).toISOString(),
      size: Buffer.byteLength(validatedData.content, 'utf8')
    };
    
    log.info('POST /api/v1/files - Created:', fileMetadata);
    return res.status(201).json(fileMetadata);
    
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ 
        error: 'Invalid request', 
        details: error.issues 
      });
    }
    
    log.error('Error creating file:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// List all files
router.get('/', async (req: Request, res: Response<ListFilesResponse | ErrorResponse>) => {
  log.info('GET /api/v1/files - Request received');
  
  try {
    const params = listFilesSchema.parse(req.query);
    const db = getDB();
    
    // Get total count
    const countStmt = db.prepare('SELECT COUNT(*) as total FROM files');
    const { total } = countStmt.get() as { total: number };
    
    // Get paginated files
    const stmt = db.prepare(`
      SELECT id, filename, created_at, updated_at, LENGTH(content) as size
      FROM files
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `);
    
    const rows = stmt.all(params.limit, params.offset) as FileListRow[];
    
    const files: FileMetadata[] = rows.map(row => ({
      id: row.id,
      filename: row.filename,
      createdAt: new Date(row.created_at * 1000).toISOString(),
      updatedAt: new Date(row.updated_at * 1000).toISOString(),
      size: row.size
    }));
    
    const result: ListFilesResponse = {
      files,
      total,
      limit: params.limit,
      offset: params.offset
    };
    
    log.info('GET /api/v1/files - Result:', result);
    return res.json(result);
    
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ 
        error: 'Invalid query parameters', 
        details: error.issues 
      });
    }
    
    log.error('Error listing files:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a file by ID
router.get('/:id', async (req: Request<{ id: string }>, res: Response<FileWithContent | ErrorResponse>) => {
  log.info('GET /api/v1/files/[id] - Request received');
  
  try {
    const { id } = req.params;
    
    if (!isValidUUID(id)) {
      return res.status(400).json({ error: 'Invalid file ID format' });
    }
    
    const db = getDB();
    const stmt = db.prepare(`
      SELECT id, filename, content, created_at, updated_at, automerge_id
      FROM files
      WHERE id = ?
    `);
    
    const file = stmt.get(id) as (FileRow & { automerge_id: string | null }) | undefined;
    
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // If file has Automerge document, get content from there
    let content = file.content;
    if (file.automerge_id) {
      try {
        const handle = await DocumentService.getOrCreateDocument(id);
        content = await DocumentService.getDocumentContent(handle);
      } catch (err) {
        log.warn(`Failed to get Automerge content for file ${id}, using database content:`, err);
      }
    }
    
    const result: FileWithContent = {
      id: file.id,
      filename: file.filename,
      content: content,
      createdAt: new Date(file.created_at * 1000).toISOString(),
      updatedAt: new Date(file.updated_at * 1000).toISOString(),
      size: Buffer.byteLength(content, 'utf8')
    };
    
    log.info('GET /api/v1/files/[id] - Found:', result.id);
    return res.json(result);
    
  } catch (error) {
    log.error('Error getting file:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a file by ID
router.put('/:id', async (req: Request<{ id: string }, object, UpdateFileRequest>, res: Response<FileWithContent | ErrorResponse>) => {
  log.info('PUT /api/v1/files/[id] - Request received');
  
  try {
    const { id } = req.params;
    
    if (!isValidUUID(id)) {
      return res.status(400).json({ error: 'Invalid file ID format' });
    }
    
    const validatedData = updateFileSchema.parse(req.body);
    const db = getDB();
    
    // Check if file exists
    const checkStmt = db.prepare('SELECT id FROM files WHERE id = ?');
    const exists = checkStmt.get(id);
    
    if (!exists) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Get or create Automerge document
    const handle = await DocumentService.getOrCreateDocument(id);
    
    // Update content in Automerge if provided
    if (validatedData.content !== undefined) {
      DocumentService.updateDocumentContent(handle, validatedData.content);
      
      // Sync back to database
      await DocumentService.updateFileFromDocument(id, handle);
    }
    
    // Update filename if provided (in database only for now)
    if (validatedData.filename !== undefined) {
      db.prepare(`
        UPDATE files 
        SET filename = ?, updated_at = unixepoch()
        WHERE id = ?
      `).run(validatedData.filename, id);
    }
    
    // Fetch the updated file
    const selectStmt = db.prepare(`
      SELECT id, filename, content, created_at, updated_at
      FROM files
      WHERE id = ?
    `);
    
    const file = selectStmt.get(id) as FileRow;
    
    const result: FileWithContent = {
      id: file.id,
      filename: file.filename,
      content: file.content,
      createdAt: new Date(file.created_at * 1000).toISOString(),
      updatedAt: new Date(file.updated_at * 1000).toISOString(),
      size: Buffer.byteLength(file.content, 'utf8')
    };
    
    log.info('PUT /api/v1/files/[id] - Updated:', result.id);
    return res.json(result);
    
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ 
        error: 'Invalid request', 
        details: error.issues 
      });
    }
    
    log.error('Error updating file:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Automerge document URL for a file
router.get('/:id/automerge', async (req: Request<{ id: string }>, res: Response<{ automergeUrl: string } | ErrorResponse>) => {
  log.info('GET /api/v1/files/[id]/automerge - Request received');
  
  try {
    const { id } = req.params;
    
    if (!isValidUUID(id)) {
      return res.status(400).json({ error: 'Invalid file ID format' });
    }
    
    const db = getDB();
    const file = db.prepare('SELECT id FROM files WHERE id = ?').get(id);
    
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Get or create Automerge document
    const handle = await DocumentService.getOrCreateDocument(id);
    
    log.info(`GET /api/v1/files/[id]/automerge - Returning URL: ${handle.url}`);
    return res.json({ automergeUrl: handle.url });
    
  } catch (error) {
    log.error('Error getting Automerge URL:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a comment on a file
router.post('/:id/comments', async (req: Request<{ id: string }, object, CreateCommentInput>, res: Response<Comment | ErrorResponse>) => {
  log.info('POST /api/v1/files/[id]/comments - Request received');
  
  try {
    const { id } = req.params;
    
    if (!isValidUUID(id)) {
      return res.status(400).json({ error: 'Invalid file ID format' });
    }
    
    const validatedData = createCommentSchema.parse(req.body);
    const db = getDB();
    
    // Check if file exists
    const file = db.prepare('SELECT id FROM files WHERE id = ?').get(id);
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Get Automerge document
    const handle = await DocumentService.getOrCreateDocument(id);
    
    // Create comment
    const comment: Comment = {
      id: uuidv4(),
      author: validatedData.author,
      text: validatedData.text,
      createdAt: Date.now(),
      anchorStart: validatedData.anchorStart,
      anchorEnd: validatedData.anchorEnd
    };
    
    // Add comment to document with cursors
    handle.change((doc) => {
      if (!doc.comments) {
        doc.comments = {};
      }
      
      // Create cursors that will move with text edits
      // 'after' for start means it stays after deleted text, 'before' for end means it stays before
      // When all text between them is deleted, they should converge
      const startCursor = Automerge.getCursor(doc, ['content'], validatedData.anchorStart, 'after');
      const endCursor = Automerge.getCursor(doc, ['content'], validatedData.anchorEnd, 'before');
      
      // Extract the original text for reference
      const originalText = doc.content.substring(validatedData.anchorStart, validatedData.anchorEnd);
      
      // Add cursor information to comment
      const commentWithCursors: Comment = {
        ...comment,
        startCursor,
        endCursor,
        originalText,
        status: 'active'
      };
      
      doc.comments[comment.id] = commentWithCursors;
    });
    
    // Get the comment with cursors from the document
    await handle.doc(); // Ensure document is loaded
    const updatedDoc = handle.docSync();
    const savedComment = updatedDoc?.comments?.[comment.id];
    
    log.info(`POST /api/v1/files/[id]/comments - Created comment ${comment.id} on file ${id}`);
    return res.status(201).json(savedComment || comment);
    
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ 
        error: 'Invalid request', 
        details: error.issues 
      });
    }
    
    log.error('Error creating comment:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all comments for a file
router.get('/:id/comments', async (req: Request<{ id: string }>, res: Response<Comment[] | ErrorResponse>) => {
  log.info('GET /api/v1/files/[id]/comments - Request received');
  
  try {
    const { id } = req.params;
    
    if (!isValidUUID(id)) {
      return res.status(400).json({ error: 'Invalid file ID format' });
    }
    
    const db = getDB();
    const file = db.prepare('SELECT id, automerge_id FROM files WHERE id = ?').get(id) as { id: string; automerge_id: string | null } | undefined;
    
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // If no Automerge document yet, return empty array
    if (!file.automerge_id) {
      return res.json([]);
    }
    
    // Get comments from Automerge document
    const handle = await DocumentService.getOrCreateDocument(id);
    await handle.doc(); // Ensure document is loaded
    const doc = handle.docSync();
    
    if (!doc || !doc.comments) {
      return res.json([]);
    }
    
    // Resolve cursor positions for each comment
    const commentsWithResolvedPositions = Object.values(doc.comments).map(comment => {
      let resolvedStart = comment.anchorStart;
      let resolvedEnd = comment.anchorEnd;
      let status = comment.status || 'active';
      
      // Try to resolve cursor positions if they exist
      if (comment.startCursor && comment.endCursor) {
        try {
          const startPos = Automerge.getCursorPosition(doc, ['content'], comment.startCursor);
          const endPos = Automerge.getCursorPosition(doc, ['content'], comment.endCursor);
          
          if (startPos !== undefined && endPos !== undefined) {
            resolvedStart = startPos;
            resolvedEnd = endPos;
            
            // Debug logging
            log.debug(`Comment ${comment.id}: cursor positions - start: ${startPos}, end: ${endPos}, original: ${comment.anchorStart}-${comment.anchorEnd}`);
            
            // Check if the comment is orphaned (cursors at same position)
            if (startPos === endPos) {
              status = 'orphaned';
              log.info(`Comment ${comment.id} marked as orphaned: positions converged to ${startPos}`);
            }
          }
        } catch (err) {
          // Cursor resolution failed, mark as orphaned
          log.warn(`Failed to resolve cursors for comment ${comment.id}:`, err);
          status = 'orphaned';
        }
      }
      
      return {
        ...comment,
        resolvedStart,
        resolvedEnd,
        status
      };
    });
    
    log.info(`GET /api/v1/files/[id]/comments - Found ${commentsWithResolvedPositions.length} comments for file ${id}`);
    return res.json(commentsWithResolvedPositions);
    
  } catch (error) {
    log.error('Error getting comments:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a comment from a file
router.delete('/:id/comments/:commentId', async (req: Request<{ id: string; commentId: string }>, res: Response<{ success: boolean } | ErrorResponse>) => {
  log.info('DELETE /api/v1/files/[id]/comments/[commentId] - Request received');
  
  try {
    const { id, commentId } = req.params;
    
    if (!isValidUUID(id) || !isValidUUID(commentId)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    
    const db = getDB();
    const file = db.prepare('SELECT id, automerge_id FROM files WHERE id = ?').get(id) as { id: string; automerge_id: string | null } | undefined;
    
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    if (!file.automerge_id) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    // Get Automerge document
    const handle = await DocumentService.getOrCreateDocument(id);
    await handle.doc(); // Ensure document is loaded
    const doc = handle.docSync();
    
    if (!doc || !doc.comments || !doc.comments[commentId]) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    // Delete comment from document
    handle.change((doc) => {
      if (doc.comments && doc.comments[commentId]) {
        delete doc.comments[commentId];
      }
    });
    
    log.info(`DELETE /api/v1/files/[id]/comments/[commentId] - Deleted comment ${commentId} from file ${id}`);
    return res.json({ success: true });
    
  } catch (error) {
    log.error('Error deleting comment:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a file by ID
router.delete('/:id', async (req: Request<{ id: string }>, res: Response<{ success: boolean; message: string } | ErrorResponse>) => {
  log.info('DELETE /api/v1/files/[id] - Request received');
  
  try {
    const { id } = req.params;
    
    if (!isValidUUID(id)) {
      return res.status(400).json({ error: 'Invalid file ID format' });
    }
    
    const db = getDB();
    
    // Check if file exists
    const file = db.prepare('SELECT id, automerge_id FROM files WHERE id = ?').get(id) as { id: string; automerge_id: string | null } | undefined;
    
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // If file has an Automerge document, we need to clean it up
    if (file.automerge_id) {
      try {
        // Get the Automerge repo and delete the document
        const repo = getRepo();
        await repo.delete(file.automerge_id as AutomergeUrl);
        
        log.info(`Deleted Automerge document ${file.automerge_id} for file ${id}`);
      } catch (error) {
        // Log the error but continue with file deletion
        log.error(`Error deleting Automerge document for file ${id}:`, error);
      }
    }
    
    // Delete the file from the database
    const deleteStmt = db.prepare('DELETE FROM files WHERE id = ?');
    const result = deleteStmt.run(id);
    
    if (result.changes === 0) {
      return res.status(500).json({ error: 'Failed to delete file' });
    }
    
    log.info(`DELETE /api/v1/files/[id] - Deleted file ${id}`);
    return res.json({ 
      success: true, 
      message: `File ${id} deleted successfully` 
    });
    
  } catch (error) {
    log.error('Error deleting file:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;