'use client';

import React, { useState, useEffect } from 'react';
import { Settings, X, Check } from 'lucide-react';
import { getStoredUsername, setStoredUsername, clearStoredUsername } from '@/lib/username';

export function UserSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [tempUsername, setTempUsername] = useState('');

  useEffect(() => {
    const stored = getStoredUsername();
    if (stored) {
      setUsername(stored);
      setTempUsername(stored);
    } else {
      setEditMode(true);
    }
  }, [isOpen]);

  const handleSave = () => {
    if (tempUsername.trim()) {
      setStoredUsername(tempUsername.trim());
      setUsername(tempUsername.trim());
      setEditMode(false);
    }
  };

  const handleDelete = () => {
    clearStoredUsername();
    setUsername('');
    setTempUsername('');
    setEditMode(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setEditMode(false);
    setTempUsername(username);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        title="User settings"
      >
        <Settings className="h-5 w-5 text-gray-600" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">User Settings</h3>
              <button
                onClick={handleClose}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              
              {!editMode && username ? (
                <div className="flex items-center justify-between">
                  <p className="text-lg">{username}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditMode(true);
                        setTempUsername(username);
                      }}
                      className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={tempUsername}
                    onChange={(e) => setTempUsername(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  <div className="flex justify-end gap-2">
                    {username && (
                      <button
                        onClick={() => {
                          setEditMode(false);
                          setTempUsername(username);
                        }}
                        className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      onClick={handleSave}
                      disabled={!tempUsername.trim()}
                      className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                      <Check className="h-4 w-4" />
                      Save
                    </button>
                  </div>
                </div>
              )}
              
              {username && !editMode && (
                <p className="mt-4 text-sm text-gray-500">
                  This name will be used for all your comments.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}