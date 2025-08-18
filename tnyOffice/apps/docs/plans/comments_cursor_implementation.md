# Comment Cursor Implementation - Using Automerge 3.0

## Overview
Automerge 3.0 provides cursor support that allows positions to move with text edits. We'll use this to make comments survive document changes.

## Implementation Steps

### 1. Update Comment Interface (API)
```typescript
// In apps/api/src/automerge/types.ts
export interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: number;
  
  // Cursor-based anchoring (NEW)
  startCursor?: string;  // Automerge cursor
  endCursor?: string;    // Automerge cursor
  
  // Fallback data
  anchorStart: number;   // Keep for backwards compatibility
  anchorEnd: number;     // Keep for backwards compatibility
  originalText: string;  // Store original selected text
  
  // Status
  status?: 'active' | 'orphaned';
}
```

### 2. Update Document Service (API)
```typescript
// In document creation/update
import * as Automerge from '@automerge/automerge';

// When creating a comment:
handle.change((doc) => {
  // Create cursors at comment boundaries
  const startCursor = Automerge.getCursor(doc, ['content'], anchorStart, 'after');
  const endCursor = Automerge.getCursor(doc, ['content'], anchorEnd, 'before');
  
  const comment: Comment = {
    id: uuidv4(),
    author,
    text,
    createdAt: Date.now(),
    startCursor,
    endCursor,
    anchorStart,  // Keep as fallback
    anchorEnd,    // Keep as fallback
    originalText: doc.content.substring(anchorStart, anchorEnd),
    status: 'active'
  };
  
  if (!doc.comments) doc.comments = {};
  doc.comments[comment.id] = comment;
});
```

### 3. Add Cursor Resolution (API)
```typescript
// New endpoint or enhance GET comments to include resolved positions
router.get('/:id/comments', async (req, res) => {
  // ... existing code ...
  
  const doc = handle.docSync();
  const comments = Object.values(doc.comments || {});
  
  // Resolve cursor positions
  const resolvedComments = comments.map(comment => {
    let currentStart = comment.anchorStart;
    let currentEnd = comment.anchorEnd;
    let status = comment.status || 'active';
    
    if (comment.startCursor && comment.endCursor) {
      try {
        currentStart = Automerge.getCursorPosition(doc, ['content'], comment.startCursor);
        currentEnd = Automerge.getCursorPosition(doc, ['content'], comment.endCursor);
        
        // Check if text was deleted (cursors at same position)
        if (currentStart === currentEnd) {
          status = 'orphaned';
        }
      } catch (err) {
        // Cursor invalid, mark as orphaned
        status = 'orphaned';
      }
    }
    
    return {
      ...comment,
      resolvedStart: currentStart,
      resolvedEnd: currentEnd,
      status
    };
  });
  
  res.json(resolvedComments);
});
```

### 4. Update UI Components

#### Update Comment Type (UI)
```typescript
// In apps/docs/lib/types/comment.ts
export interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: number;
  
  // Original positions (for creation)
  anchorStart: number;
  anchorEnd: number;
  
  // Resolved positions (from API)
  resolvedStart?: number;
  resolvedEnd?: number;
  
  // Metadata
  originalText?: string;
  status?: 'active' | 'orphaned';
}
```

#### Update Comment Decorations
```typescript
// In comments-extension.ts
for (const comment of sortedComments) {
  // Use resolved positions if available
  const start = comment.resolvedStart ?? comment.anchorStart;
  const end = comment.resolvedEnd ?? comment.anchorEnd;
  
  // Only decorate active comments
  if (comment.status === 'active' && start < end) {
    builder.add(start, end, commentMark);
  }
}
```

#### Update Sidebar for Orphaned Comments
```typescript
// In CommentsSidebar.tsx
export function CommentsSidebar({ comments, ... }) {
  const activeComments = comments.filter(c => c.status !== 'orphaned');
  const orphanedComments = comments.filter(c => c.status === 'orphaned');
  
  return (
    <div>
      {/* Active comments section */}
      <div>
        <h3>Comments ({activeComments.length})</h3>
        {activeComments.map(comment => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
      
      {/* Orphaned comments section */}
      {orphanedComments.length > 0 && (
        <div className="mt-6 opacity-75">
          <h3>Orphaned Comments ({orphanedComments.length})</h3>
          <p className="text-xs text-gray-500 mb-2">
            Original text was deleted
          </p>
          {orphanedComments.map(comment => (
            <div key={comment.id} className="p-3 bg-gray-50 rounded mb-2">
              <div className="text-sm font-medium">{comment.author}</div>
              <div className="text-sm">{comment.text}</div>
              <div className="text-xs text-gray-500 mt-1">
                Original: "{comment.originalText}"
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### 5. Migration Strategy
1. Deploy cursor support without breaking existing comments
2. New comments get cursors automatically
3. Existing comments use fallback positions
4. Optionally: Background job to add cursors to old comments

### 6. Testing Scenarios
- Add comment, then insert text before it
- Add comment, then delete part of commented text
- Add comment, then delete all commented text
- Multiple comments on same line with edits
- Concurrent editing with comments

## Benefits
- Comments survive document edits
- Clear indication of orphaned comments
- Graceful degradation for old comments
- No complex fuzzy matching needed
- Leverages Automerge's built-in CRDT capabilities

## Next Steps
1. Update API comment creation to use cursors
2. Update GET endpoint to resolve cursor positions
3. Update UI to handle active vs orphaned comments
4. Test with aggressive concurrent editing