'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { getStoredUsername, setStoredUsername } from '@/lib/username';

interface AddCommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (text: string, username?: string) => void;
  selectedText?: string;
}

export function AddCommentModal({ isOpen, onClose, onSubmit, selectedText }: AddCommentModalProps) {
  const [commentText, setCommentText] = useState('');
  const [username, setUsername] = useState('');
  const [needsUsername, setNeedsUsername] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Check if we have a stored username
      const storedUsername = getStoredUsername();
      if (!storedUsername) {
        setNeedsUsername(true);
        // Focus username field if needed
        setTimeout(() => usernameRef.current?.focus(), 100);
      } else {
        setNeedsUsername(false);
        // Focus textarea if we have username
        setTimeout(() => textareaRef.current?.focus(), 100);
      }
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (needsUsername && !username.trim()) {
      usernameRef.current?.focus();
      return;
    }
    
    if (commentText.trim()) {
      // Store username if needed
      if (needsUsername && username.trim()) {
        setStoredUsername(username.trim());
      }
      
      onSubmit(commentText.trim(), needsUsername ? username.trim() : undefined);
      setCommentText('');
      setUsername('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Add Comment</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          {selectedText && (
            <div className="mb-4 p-3 bg-gray-100 rounded text-sm">
              <p className="text-gray-600 mb-1">Commenting on:</p>
              <p className="font-mono">&quot;{selectedText}&quot;</p>
            </div>
          )}
          
          {needsUsername && (
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Your name (required for first comment)
              </label>
              <input
                ref={usernameRef}
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your name"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
          
          <textarea
            ref={textareaRef}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write your comment..."
            className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
          
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!commentText.trim() || (needsUsername && !username.trim())}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Comment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}