'use client';

import React, { useEffect, useRef } from 'react';
import { Comment } from '@/lib/types/comment';
import { Trash2 } from 'lucide-react';
import { deleteComment } from '@/lib/api/comments';

interface CommentsSidebarProps {
  fileId: string;
  comments: Comment[];
  onCommentClick: (comment: Comment) => void;
  onCommentsUpdate: () => void;
  currentUser?: string;
  activeCommentId?: string | null;
}

export function CommentsSidebar({ 
  fileId,
  comments, 
  onCommentClick, 
  onCommentsUpdate,
  currentUser = 'Anonymous',
  activeCommentId
}: CommentsSidebarProps) {
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  
  // Separate active and orphaned comments, then sort by position
  const activeComments = comments
    .filter(c => c.status !== 'orphaned')
    .sort((a, b) => {
      const aStart = a.resolvedStart ?? a.anchorStart;
      const bStart = b.resolvedStart ?? b.anchorStart;
      return aStart - bStart;
    });
  
  const orphanedComments = comments
    .filter(c => c.status === 'orphaned')
    .sort((a, b) => a.createdAt - b.createdAt); // Sort orphaned by creation time

  const handleDelete = async (commentId: string) => {
    try {
      setDeletingId(commentId);
      await deleteComment(fileId, commentId);
      onCommentsUpdate();
    } catch (error) {
      console.error('Failed to delete comment:', error);
      alert('Failed to delete comment');
    } finally {
      setDeletingId(null);
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return date.toLocaleDateString();
  };

  if (comments.length === 0) {
    return (
      <div className="p-4 text-gray-500 text-sm">
        No comments yet. Select text and press Cmd+K to add a comment.
      </div>
    );
  }

  const CommentItem = ({ comment }: { comment: Comment }) => {
    const isOrphaned = comment.status === 'orphaned';
    const isActive = comment.id === activeCommentId;
    const commentRef = useRef<HTMLDivElement>(null);
    
    // Scroll active comment into view
    useEffect(() => {
      if (isActive && commentRef.current) {
        commentRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'nearest' 
        });
      }
    }, [isActive]);
    
    return (
      <div
        ref={commentRef}
        key={comment.id}
        className={`p-4 hover:bg-gray-50 cursor-pointer group transition-colors ${
          isOrphaned ? 'opacity-75' : ''
        } ${
          isActive ? 'bg-blue-50 border-l-4 border-blue-500' : ''
        }`}
        onClick={() => !isOrphaned && onCommentClick(comment)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm">{comment.author}</span>
              <span className="text-gray-500 text-xs">{formatTime(comment.createdAt)}</span>
            </div>
            <p className="text-sm text-gray-700">{comment.text}</p>
            {isOrphaned ? (
              <p className="text-xs text-gray-500 mt-1 italic">
                Original text: &quot;{comment.originalText || 'Unknown'}&quot;
              </p>
            ) : (
              <p className="text-xs text-gray-500 mt-1">
                Characters {comment.resolvedStart ?? comment.anchorStart}-{comment.resolvedEnd ?? comment.anchorEnd}
              </p>
            )}
          </div>
        {comment.author === currentUser && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(comment.id);
            }}
            disabled={deletingId === comment.id}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-opacity"
            title="Delete comment"
          >
            <Trash2 className="h-4 w-4 text-gray-500" />
          </button>
        )}
      </div>
    </div>
    );
  };

  return (
    <div className="divide-y divide-gray-200">
      {/* Active comments */}
      {activeComments.length > 0 && (
        <div>
          {activeComments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}
      
      {/* Orphaned comments */}
      {orphanedComments.length > 0 && (
        <div className="bg-gray-50">
          <div className="px-4 py-2 border-b border-gray-200">
            <h4 className="text-sm font-medium text-gray-600">Orphaned Comments</h4>
            <p className="text-xs text-gray-500">Text was deleted or significantly changed</p>
          </div>
          {orphanedComments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
}