'use client';

import { useState, useEffect } from 'react';
import { log } from '@tnyoffice/logger';

interface GitSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSync: (remoteUrl?: string, commitMessage?: string) => Promise<void>;
}

export function GitSyncModal({ isOpen, onClose, onSync }: GitSyncModalProps) {
  const [remoteUrl, setRemoteUrl] = useState('');
  const [commitMessage, setCommitMessage] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load saved remote URL from localStorage
  useEffect(() => {
    if (isOpen) {
      const savedUrl = localStorage.getItem('gitRemoteUrl');
      if (savedUrl) {
        setRemoteUrl(savedUrl);
      }
      // Reset states when opening
      setError(null);
      setSuccess(null);
      setCommitMessage('');
    }
  }, [isOpen]);

  const handleSync = async () => {
    setError(null);
    setSuccess(null);
    setIsSyncing(true);

    try {
      // Save remote URL to localStorage if provided
      if (remoteUrl.trim()) {
        localStorage.setItem('gitRemoteUrl', remoteUrl.trim());
      }

      await onSync(
        remoteUrl.trim() || undefined,
        commitMessage.trim() || undefined
      );

      setSuccess('Documents synced successfully!');
      // Close modal after a short delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      log.error('Git sync error:', err);
      setError(err instanceof Error ? err.message : 'Sync failed');
    } finally {
      setIsSyncing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Sync to Git Repository
        </h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="remoteUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Remote Repository URL (optional)
            </label>
            <input
              id="remoteUrl"
              type="text"
              value={remoteUrl}
              onChange={(e) => setRemoteUrl(e.target.value)}
              placeholder="https://github.com/username/repo.git"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              disabled={isSyncing}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Leave empty to use server default. Include token for private repos.
            </p>
          </div>

          <div>
            <label htmlFor="commitMessage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Commit Message (optional)
            </label>
            <textarea
              id="commitMessage"
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              placeholder="Sync documents from TnyOffice"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              disabled={isSyncing}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
              <p className="text-sm text-green-800 dark:text-green-200">{success}</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isSyncing}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSyncing ? 'Syncing...' : 'Sync'}
          </button>
        </div>
      </div>
    </div>
  );
}