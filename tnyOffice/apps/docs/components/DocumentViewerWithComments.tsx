'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { CollaborativeEditor } from './ClientOnlyCollaborativeEditor';
import { CommentsSidebar } from './CommentsSidebar';
import { AddCommentModal } from './AddCommentModal';
import { getComments, createComment } from '@/lib/api/comments';
import type { AutomergeUrlResponse } from '@/lib/automerge/types';
import type { Comment } from '@/lib/types/comment';
import { MessageSquarePlus } from 'lucide-react';
import { EditorView } from '@codemirror/view';
import { getStoredUsername } from '@/lib/username';
import { UserSettings } from './UserSettings';
import { apiGet, apiPut } from '../lib/api/client';

interface DocumentViewerWithCommentsProps {
  documentId: string | null;
}

interface FileWithContent {
  id: string;
  filename: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  size: number;
}


export function DocumentViewerWithComments({ documentId }: DocumentViewerWithCommentsProps) {
  const [document, setDocument] = useState<FileWithContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [automergeUrl, setAutomergeUrl] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const editorRef = useRef<EditorView | null>(null);
  
  // Comments state
  const [comments, setComments] = useState<Comment[]>([]);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedTextForComment, setSelectedTextForComment] = useState<{
    from: number;
    to: number;
    text: string;
  } | null>(null);
  const [showCommentsSidebar, setShowCommentsSidebar] = useState(true);
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);

  // Fetch document
  useEffect(() => {
    if (!documentId) {
      setDocument(null);
      setComments([]);
      return;
    }

    const fetchDocument = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let data: FileWithContent;
        try {
          data = await apiGet<FileWithContent>(`/api/v1/files/${documentId}`);
          setDocument(data);
        } catch (err) {
          if (err instanceof Error && err.message.includes('404')) {
            throw new Error('Document not found');
          }
          throw new Error('Failed to fetch document');
        }
        
        // Create Automerge document if it doesn't exist yet
        try {
          // First try to get existing Automerge URL
          try {
            const automergeData = await apiGet<AutomergeUrlResponse>(`/api/v1/files/${documentId}/automerge`);
            setAutomergeUrl(automergeData.automergeUrl);
          } catch (_err) {
            // If no Automerge document exists, create one by updating the document
            await apiPut(`/api/v1/files/${documentId}`, {
              content: data.content,
            });
            
            // Now fetch the Automerge URL
            const automergeData = await apiGet<AutomergeUrlResponse>(`/api/v1/files/${documentId}/automerge`);
            setAutomergeUrl(automergeData.automergeUrl);
          }
        } catch (err) {
          console.error('Failed to get/create Automerge document:', err);
          setError('Failed to enable collaborative editing');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load document');
        setDocument(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [documentId]);

  // Fetch comments
  const fetchComments = useCallback(async () => {
    if (!documentId) return;
    
    try {
      const fetchedComments = await getComments(documentId);
      setComments(fetchedComments);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    }
  }, [documentId]);

  useEffect(() => {
    fetchComments();
    
    // Poll for new comments every 5 seconds
    const interval = setInterval(fetchComments, 5000);
    return () => clearInterval(interval);
  }, [fetchComments]);

  const handleAddComment = useCallback((selection: { from: number; to: number; text: string }) => {
    setSelectedTextForComment(selection);
    setShowCommentModal(true);
  }, []);

  const handleSubmitComment = async (text: string, username?: string) => {
    if (!documentId || !selectedTextForComment) return;
    
    // Use provided username or get from storage
    const author = username || getStoredUsername() || 'Anonymous';
    
    try {
      await createComment(documentId, {
        author,
        text,
        anchorStart: selectedTextForComment.from,
        anchorEnd: selectedTextForComment.to,
      });
      
      setShowCommentModal(false);
      setSelectedTextForComment(null);
      fetchComments();
    } catch (err) {
      console.error('Failed to create comment:', err);
      alert('Failed to create comment');
    }
  };

  const handleCommentClick = useCallback((comment: Comment) => {
    // Set as active comment
    setActiveCommentId(comment.id);
    
    // Don't scroll for orphaned comments
    if (comment.status === 'orphaned' || !editorRef.current) {
      return;
    }
    
    const view = editorRef.current;
    const pos = comment.resolvedStart ?? comment.anchorStart;
    
    // Scroll the position into view
    view.dispatch({
      effects: EditorView.scrollIntoView(pos, {
        y: 'center', // Center vertically
        x: 'start',  // Align to start horizontally
      })
    });
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (!documentId) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="mt-2">Select a document or create a new one</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500 dark:text-gray-400">Loading document...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 mb-2">{error}</div>
          {error === 'Document not found' && (
            <p className="text-sm text-gray-500">The document may have been deleted or moved.</p>
          )}
        </div>
      </div>
    );
  }

  if (!document) return null;

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col">
        {/* Document header */}
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {document.filename}
              </h1>
              <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Last updated: {formatDate(document.updatedAt)} • {formatSize(document.size)}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowCommentsSidebar(!showCommentsSidebar)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50"
                title="Toggle comments sidebar"
              >
                <MessageSquarePlus className="h-4 w-4" />
                Comments ({comments.length})
              </button>
              <div className="flex items-center gap-3">
                <UserSettings />
                <span className="flex items-center gap-2 text-sm text-gray-500">
                  <span className={`inline-block w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  {isConnected ? 'Connected' : 'Connecting...'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-y-auto">
          {automergeUrl ? (
            <CollaborativeEditor
              documentUrl={automergeUrl}
              readOnly={false}
              onConnectionChange={setIsConnected}
              placeholder="Start typing..."
              onAddComment={handleAddComment}
              comments={comments}
              activeCommentId={activeCommentId}
              showComments={showCommentsSidebar}
              editorRef={editorRef}
              onCommentClick={(position: number) => {
                // Find comment at this position
                const comment = comments.find(c => {
                  const start = c.resolvedStart ?? c.anchorStart;
                  const end = c.resolvedEnd ?? c.anchorEnd;
                  return position >= start && position <= end && c.status !== 'orphaned';
                });
                if (comment) {
                  setActiveCommentId(comment.id);
                }
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500 dark:text-gray-400">Setting up collaborative editing...</div>
            </div>
          )}
        </div>
      </div>

      {/* Comments Sidebar */}
      {showCommentsSidebar && (
        <div className="w-80 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-y-auto">
          <div className="border-b border-gray-200 dark:border-gray-700 p-4">
            <h2 className="font-semibold">Comments</h2>
          </div>
          <CommentsSidebar
            fileId={documentId}
            comments={comments}
            onCommentClick={handleCommentClick}
            onCommentsUpdate={fetchComments}
            currentUser={getStoredUsername() || undefined}
            activeCommentId={activeCommentId}
          />
        </div>
      )}

      {/* Add Comment Modal */}
      <AddCommentModal
        isOpen={showCommentModal}
        onClose={() => {
          setShowCommentModal(false);
          setSelectedTextForComment(null);
        }}
        onSubmit={handleSubmitComment}
        selectedText={selectedTextForComment?.text}
      />
    </div>
  );
}