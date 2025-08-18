import { log } from '@tnyoffice/logger';
import { apiPost } from './api/client';

export interface GitSyncResult {
  success: boolean;
  commitHash?: string;
  changes: {
    added: string[];
    modified: string[];
    deleted: string[];
  };
  pushedToRemote?: boolean;
  remoteUrl?: string;
  error?: string;
}

export interface GitPullResult {
  success: boolean;
  changes: Array<{
    fileId: string;
    filename: string;
    status: 'added' | 'modified' | 'deleted';
    additions: number;
    deletions: number;
  }>;
  applied?: boolean;
  appliedAt?: string;
  error?: string;
}

export async function syncToGit(remoteUrl?: string, commitMessage?: string): Promise<GitSyncResult> {
  try {
    const body: Record<string, string> = {};
    if (remoteUrl) body.remoteUrl = remoteUrl;
    if (commitMessage) body.commitMessage = commitMessage;

    log.info('Syncing to git with:', { remoteUrl: remoteUrl?.replace(/:[^@]+@/, ':***@'), commitMessage });

    return await apiPost('/api/v1/git/sync', Object.keys(body).length > 0 ? body : undefined);
  } catch (error) {
    log.error('Git sync error:', error);
    throw error;
  }
}

export async function pullFromGit(remoteUrl?: string, branch?: string, preview?: boolean): Promise<GitPullResult> {
  try {
    const body: Record<string, string | boolean> = {};
    if (remoteUrl) body.remoteUrl = remoteUrl;
    if (branch) body.branch = branch;
    if (preview !== undefined) body.preview = preview;

    log.info('Pulling from git with:', { 
      remoteUrl: remoteUrl?.replace(/:[^@]+@/, ':***@'), 
      branch: branch || 'main',
      preview: preview || false 
    });

    return await apiPost('/api/v1/git/pull', Object.keys(body).length > 0 ? body : undefined);
  } catch (error) {
    log.error('Git pull error:', error);
    throw error;
  }
}