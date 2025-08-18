'use client';

import { useState } from 'react';
import { Editor } from './Editor';
import { log } from '@tnyoffice/logger';
import { apiPost } from '../lib/api/client';

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}


export function CreateModal({ isOpen, onClose, onCreated }: CreateModalProps) {
  const [filename, setFilename] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!filename.trim()) {
      setError('Filename is required');
      return;
    }

    if (!filename.endsWith('.md')) {
      setError('Filename must end with .md');
      return;
    }

    if (!content.trim()) {
      setError('Content is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const body = {
        filename: filename.trim(),
        content,
      };
      
      log.debug('Creating document with body:', body);

      await apiPost('/api/v1/files', body);

      log.debug('Document created successfully');

      // Reset form
      setFilename('');
      setContent('');
      onCreated();
      onClose();
    } catch (err) {
      log.error('Create error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create document');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Create New Document
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="p-6 space-y-4 flex-shrink-0">
            {/* Filename input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Filename
              </label>
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="document.md"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                autoFocus
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Must end with .md extension
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Editor */}
          <div className="flex-1 px-6 pb-2 min-h-0 overflow-hidden">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Content
            </label>
            <div className="h-[calc(100%-2rem)] border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
              <Editor
                value={content}
                onChange={setContent}
                placeholder="# Start typing your markdown here..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}