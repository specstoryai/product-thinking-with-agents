'use client';

import { useState, useEffect } from 'react';
import { log } from '@tnyoffice/logger';
import type { GitPullResult } from '@/lib/git-sync';

interface GitPullModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPull: (remoteUrl?: string, branch?: string, preview?: boolean) => Promise<GitPullResult>;
}

export function GitPullModal({ isOpen, onClose, onPull }: GitPullModalProps) {
  const [remoteUrl, setRemoteUrl] = useState('');
  const [branch, setBranch] = useState('main');
  const [isPulling, setIsPulling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pullResult, setPullResult] = useState<GitPullResult | null>(null);
  const [showPreview, setShowPreview] = useState(false);

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
      setPullResult(null);
      setShowPreview(false);
      setBranch('main');
    }
  }, [isOpen]);

  const handlePull = async (preview = false) => {
    setError(null);
    setSuccess(null);
    setIsPulling(true);

    try {
      // Save remote URL to localStorage if provided
      if (remoteUrl.trim()) {
        localStorage.setItem('gitRemoteUrl', remoteUrl.trim());
      }

      const result = await onPull(
        remoteUrl.trim() || undefined,
        branch.trim() || 'main',
        preview
      );

      setPullResult(result);

      if (preview) {
        setShowPreview(true);
      } else {
        const changesCount = result.changes.length;
        if (changesCount === 0) {
          setSuccess('Already up to date with remote repository');
        } else {
          setSuccess(`Successfully pulled ${changesCount} ${changesCount === 1 ? 'change' : 'changes'} from git`);
        }
        // Close modal after a short delay if not preview
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (err) {
      log.error('Git pull error:', err);
      setError(err instanceof Error ? err.message : 'Pull failed');
    } finally {
      setIsPulling(false);
    }
  };

  const renderChangeSummary = () => {
    if (!pullResult || !showPreview) return null;

    const { changes } = pullResult;
    const added = changes.filter(c => c.status === 'added').length;
    const modified = changes.filter(c => c.status === 'modified').length;
    const deleted = changes.filter(c => c.status === 'deleted').length;

    return (
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
        <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
          Preview: {changes.length} {changes.length === 1 ? 'change' : 'changes'} will be applied
        </h3>
        
        <div className="space-y-1 text-sm">
          {added > 0 && (
            <div className="text-green-600 dark:text-green-400">
              + {added} new {added === 1 ? 'file' : 'files'}
            </div>
          )}
          {modified > 0 && (
            <div className="text-blue-600 dark:text-blue-400">
              ~ {modified} modified {modified === 1 ? 'file' : 'files'}
            </div>
          )}
          {deleted > 0 && (
            <div className="text-red-600 dark:text-red-400">
              - {deleted} deleted {deleted === 1 ? 'file' : 'files'}
            </div>
          )}
        </div>

        {changes.length > 0 && (
          <div className="mt-3 space-y-1">
            <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Files:</div>
            {changes.slice(0, 5).map((change, idx) => (
              <div key={idx} className="text-xs text-gray-600 dark:text-gray-400">
                {change.status === 'added' && '+ '}
                {change.status === 'modified' && '~ '}
                {change.status === 'deleted' && '- '}
                {change.filename}
                {change.status !== 'deleted' && (
                  <span className="text-gray-500 ml-1">
                    (+{change.additions} -{change.deletions})
                  </span>
                )}
              </div>
            ))}
            {changes.length > 5 && (
              <div className="text-xs text-gray-500 dark:text-gray-500">
                ... and {changes.length - 5} more
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Pull from Git Repository
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
              disabled={isPulling}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Leave empty to use server default
            </p>
          </div>

          <div>
            <label htmlFor="branch" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Branch
            </label>
            <input
              id="branch"
              type="text"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              placeholder="main"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              disabled={isPulling}
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

          {renderChangeSummary()}
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isPulling}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          {!showPreview ? (
            <>
              <button
                onClick={() => handlePull(true)}
                disabled={isPulling}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Preview
              </button>
              <button
                onClick={() => handlePull(false)}
                disabled={isPulling}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPulling ? 'Pulling...' : 'Pull'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowPreview(false)}
                disabled={isPulling}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors disabled:opacity-50"
              >
                Back
              </button>
              <button
                onClick={() => handlePull(false)}
                disabled={isPulling}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPulling ? 'Applying...' : 'Apply Changes'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}