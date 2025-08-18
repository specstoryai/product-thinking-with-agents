export interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: number;
  anchorStart: number;
  anchorEnd: number;
  
  // Cursor-based anchoring
  startCursor?: string;
  endCursor?: string;
  
  // Resolved positions (from API)
  resolvedStart?: number;
  resolvedEnd?: number;
  
  // Metadata
  originalText?: string;
  status?: 'active' | 'orphaned';
}

export interface CreateCommentInput {
  author: string;
  text: string;
  anchorStart: number;
  anchorEnd: number;
}