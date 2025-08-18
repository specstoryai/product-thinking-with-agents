import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { getGitSyncService } from '../services/git-sync.js';
import { log } from '../utils/logger.js';

const router = Router();

// Schema for sync request
const syncRequestSchema = z.object({
  remoteUrl: z.string().url().optional(),
  commitMessage: z.string().optional()
});

// POST /api/v1/git/sync - Sync all documents to git repository
router.post('/sync', async (req: Request, res: Response): Promise<Response> => {
  try {
    // Parse request body
    const parseResult = syncRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Invalid request body',
        details: parseResult.error.issues
      });
    }
    
    const { remoteUrl, commitMessage } = parseResult.data;
    
    log.info('Starting git sync');
    log.info('Sync parameters:', {
      hasRequestRemoteUrl: !!remoteUrl,
      requestRemoteUrl: remoteUrl ? remoteUrl.replace(/:[^@]+@/, ':***@') : undefined,
      hasEnvRemoteUrl: !!process.env.GIT_REMOTE_URL,
      envRemoteUrl: process.env.GIT_REMOTE_URL ? process.env.GIT_REMOTE_URL.replace(/:[^@]+@/, ':***@') : 'not set',
      hasCustomCommitMessage: !!commitMessage
    });
    
    const gitSyncService = getGitSyncService();
    const result = await gitSyncService.syncDocuments({
      remoteUrl: remoteUrl || process.env.GIT_REMOTE_URL,
      commitMessage
    });
    
    log.info('Git sync result:', {
      success: result.success,
      commitHash: result.commitHash,
      pushedToRemote: result.pushedToRemote,
      remoteUrl: result.remoteUrl,
      changes: {
        added: result.changes.added.length,
        modified: result.changes.modified.length,
        deleted: result.changes.deleted.length
      }
    });
    
    if (result.success) {
      return res.json(result);
    } else {
      log.error('Git sync failed:', result.error);
      return res.status(500).json({
        error: result.error || 'Git sync failed',
        ...result
      });
    }
  } catch (error) {
    log.error('Git sync endpoint error:', error);
    return res.status(500).json({
      error: 'Internal server error during git sync',
      message: error instanceof Error ? error.message : String(error)
    });
  }
});

// Schema for pull request
const pullRequestSchema = z.object({
  remoteUrl: z.string().url().optional(),
  branch: z.string().optional(),
  preview: z.boolean().optional()
});

// POST /api/v1/git/pull - Pull changes from git repository
router.post('/pull', async (req: Request, res: Response): Promise<Response> => {
  try {
    // Parse request body
    const parseResult = pullRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Invalid request body',
        details: parseResult.error.issues
      });
    }
    
    const { remoteUrl, branch, preview } = parseResult.data;
    
    log.info('Starting git pull', {
      hasRemoteUrl: !!remoteUrl,
      branch: branch || 'main',
      preview: preview || false
    });
    
    const gitSyncService = getGitSyncService();
    const result = await gitSyncService.pullFromRemote({
      remoteUrl: remoteUrl || process.env.GIT_REMOTE_URL,
      branch,
      preview
    });
    
    log.info('Git pull result:', {
      success: result.success,
      changesCount: result.changes.length,
      preview: preview || false
    });
    
    if (result.success) {
      return res.json(result);
    } else {
      log.error('Git pull failed:', result.error);
      return res.status(500).json({
        error: result.error || 'Git pull failed',
        ...result
      });
    }
  } catch (error) {
    log.error('Git pull endpoint error:', error);
    return res.status(500).json({
      error: 'Internal server error during git pull',
      message: error instanceof Error ? error.message : String(error)
    });
  }
});

export default router;