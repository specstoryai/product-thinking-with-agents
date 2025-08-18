# Undo/Redo Implementation Plan for TnyOffice Docs

inspired by https://github.com/onsetsoftware/automerge-repo-undo-redo

## Overview

This document outlines the implementation plan for adding undo/redo functionality to the TnyOffice collaborative editor. The plan is inspired by the automerge-repo-undo-redo approach but tailored to our specific needs, with improvements for better integration with our collaborative editing environment.

## Core Concepts

### 1. Change Tracking Architecture

Unlike the reference implementation that wraps DocHandle, we'll integrate undo/redo directly into our collaborative editor component to:
- Track only user-initiated changes (not incoming collaborative changes)
- Maintain per-user undo/redo stacks
- Support document-specific history

### 2. Key Design Decisions

1. **User-Specific History**: Each user has their own undo/redo stack for their changes only
2. **Patch-Based Storage**: Use Automerge's patch system to store and reverse changes
3. **Scope Support**: Allow scoped undo/redo for specific features (e.g., comments, formatting)
4. **Transaction Support**: Batch related changes together (e.g., auto-formatting)
5. **Persistence**: Optionally persist undo history in localStorage

## Technical Architecture

### 1. Core Data Structures

```typescript
interface UndoRedoEntry {
  id: string;                    // Unique identifier
  timestamp: number;             // When the change occurred
  description?: string;          // Optional human-readable description
  scope: string | symbol;        // Change scope (default or custom)
  patches: {
    redo: Patch[];              // Patches to apply the change
    undo: Patch[];              // Patches to reverse the change
  };
  heads: {
    before: Heads;              // Document state before change
    after: Heads;               // Document state after change
  };
  metadata?: {
    userId: string;             // Who made the change
    cursorPosition?: number;    // Cursor position before change
    selectionRange?: [number, number]; // Selection before change
  };
}

interface UndoRedoStack {
  undoStack: UndoRedoEntry[];
  redoStack: UndoRedoEntry[];
  maxStackSize: number;         // Limit memory usage
}

interface UndoRedoState {
  [documentId: string]: {
    [scope: string | symbol]: UndoRedoStack;
  };
}
```

### 2. Implementation Components

#### 2.1 UndoRedoManager Class

```typescript
class UndoRedoManager {
  private state: UndoRedoState = {};
  private activeTransaction: UndoRedoEntry | null = null;
  
  // Track a change
  trackChange(
    handle: DocHandle,
    changeCallback: (doc: any) => void,
    options?: {
      description?: string;
      scope?: string | symbol;
      metadata?: any;
    }
  ): void;
  
  // Undo last change
  undo(documentId: string, scope?: string | symbol): boolean;
  
  // Redo last undone change
  redo(documentId: string, scope?: string | symbol): boolean;
  
  // Transaction support
  startTransaction(description?: string): void;
  endTransaction(): void;
  
  // History management
  getHistory(documentId: string, scope?: string | symbol): UndoRedoEntry[];
  clearHistory(documentId: string, scope?: string | symbol): void;
}
```

#### 2.2 React Hook Integration

```typescript
function useUndoRedo(documentId: string, handle: DocHandle | null) {
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const manager = useRef(new UndoRedoManager());
  
  // Track changes made through the editor
  const trackChange = useCallback((
    changeCallback: (doc: any) => void,
    description?: string
  ) => {
    if (!handle) return;
    manager.current.trackChange(handle, changeCallback, { description });
    updateUndoRedoState();
  }, [handle]);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          undo();
        } else if (e.key === 'z' && e.shiftKey || e.key === 'y') {
          e.preventDefault();
          redo();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [undo, redo]);
  
  return { undo, redo, canUndo, canRedo, trackChange };
}
```

### 3. Integration Points

#### 3.1 CollaborativeEditor Integration

Modify the CollaborativeEditor to track user changes:

```typescript
// In CollaborativeEditor component
const { undo, redo, canUndo, canRedo, trackChange } = useUndoRedo(documentId, handle);

// Track text changes
const handleTextChange = (newContent: string) => {
  trackChange((doc) => {
    doc.content = newContent;
  }, 'Edit text');
};

// Add undo/redo to toolbar
<Toolbar>
  <Button onClick={undo} disabled={!canUndo}>Undo</Button>
  <Button onClick={redo} disabled={!canRedo}>Redo</Button>
</Toolbar>
```

#### 3.2 Comment System Integration

Track comment operations separately:

```typescript
// When adding a comment
trackChange((doc) => {
  if (!doc.comments) doc.comments = {};
  doc.comments[commentId] = newComment;
}, 'Add comment', { scope: 'comments' });

// When deleting a comment
trackChange((doc) => {
  delete doc.comments[commentId];
}, 'Delete comment', { scope: 'comments' });
```

#### 3.3 Comment-Text Synchronization During Undo/Redo

**Critical Challenge**: When text changes are undone/redone, comments anchored to that text must adjust properly.

**Current Implementation**: Comments use Automerge cursors (`startCursor` and `endCursor`) that automatically move with text edits. However, undo/redo operations need special handling:

```typescript
interface CommentSyncStrategy {
  // Before undo/redo, capture comment states
  captureCommentState(doc: MarkdownDocument): CommentSnapshot[];
  
  // After undo/redo, reconcile comment positions
  reconcileComments(
    doc: MarkdownDocument, 
    snapshots: CommentSnapshot[],
    undoType: 'undo' | 'redo'
  ): void;
}

interface CommentSnapshot {
  commentId: string;
  originalText: string;
  startPos: number;
  endPos: number;
  cursorPositions: {
    start: number | undefined;
    end: number | undefined;
  };
}
```

**Undo/Redo Behavior with Comments**:

1. **Text Deletion Undo**: 
   - When undoing a text deletion that removed commented text
   - Comments should reappear at their original positions
   - Cursors should expand back to encompass the restored text

2. **Text Insertion Undo**:
   - When undoing text insertion within a comment range
   - Comment should shrink back to original boundaries
   - Maintain comment integrity if text remains

3. **Comment Orphaning**:
   - If undo/redo causes commented text to completely disappear
   - Mark comment as 'orphaned' but preserve it
   - Show visual indicator that comment is orphaned

4. **Cursor Position Validation**:
   ```typescript
   // After undo/redo, validate all comment positions
   function validateCommentPositions(doc: MarkdownDocument) {
     Object.entries(doc.comments || {}).forEach(([id, comment]) => {
       if (comment.startCursor && comment.endCursor) {
         const startPos = Automerge.getCursorPosition(doc, ['content'], comment.startCursor);
         const endPos = Automerge.getCursorPosition(doc, ['content'], comment.endCursor);
         
         // Handle edge cases
         if (startPos === endPos) {
           comment.status = 'orphaned';
         } else if (startPos > endPos) {
           // Swap positions if they got reversed
           [comment.anchorStart, comment.anchorEnd] = [endPos, startPos];
         }
       }
     });
   }
   ```

**Implementation Requirements**:

1. **Wrap Undo/Redo Operations**:
   ```typescript
   function undoWithCommentSync(documentId: string) {
     const handle = getDocumentHandle(documentId);
     const doc = handle.docSync();
     
     // Capture comment state before undo
     const commentSnapshots = captureCommentState(doc);
     
     // Perform undo
     const success = manager.undo(documentId);
     
     if (success) {
       // Reconcile comments after undo
       handle.change((doc) => {
         validateCommentPositions(doc);
         reconcileOrphanedComments(doc, commentSnapshots);
       });
     }
     
     return success;
   }
   ```

2. **Visual Feedback for Comment Changes**:
   - Highlight comments that moved during undo/redo
   - Show indicators for orphaned comments
   - Animate comment position changes

3. **Testing Scenarios**:
   - Undo text deletion that contained comments
   - Redo text insertion that splits comments
   - Multiple undo/redo operations affecting same comment
   - Collaborative edits interleaved with undo/redo

### 4. Advanced Features

#### 4.1 Selective Undo

Allow users to undo specific types of changes:

```typescript
interface UndoOptions {
  scope?: string | symbol;      // Undo only within scope
  filter?: (entry: UndoRedoEntry) => boolean; // Custom filter
  preserveRedoStack?: boolean;  // Don't clear redo on undo
}
```

#### 4.2 Collaborative Awareness

Show other users when someone is undoing:

```typescript
// Broadcast undo/redo operations
socket.emit('user-action', {
  type: 'undo',
  userId: currentUser.id,
  documentId,
  description: entry.description
});
```

#### 4.3 Conflict Resolution

Handle cases where undo might conflict with other users' changes:

```typescript
// Before applying undo patches
const currentHeads = handle.heads();
if (!equalHeads(entry.heads.after, currentHeads)) {
  // Document has changed since this operation
  // Attempt smart merge or show warning
  return handleUndoConflict(entry, currentHeads);
}
```

### 5. User Experience Considerations

#### 5.1 Visual Feedback

- Flash or highlight the changed content briefly after undo/redo
- Show toast notifications for undo/redo operations
- Display undo history in a sidebar panel

#### 5.2 Cursor Restoration

```typescript
// Store cursor position with each change
const cursorBefore = editor.getCursorPosition();
trackChange(changeCallback, description, {
  metadata: { cursorPosition: cursorBefore }
});

// Restore cursor after undo
const cursorPos = entry.metadata?.cursorPosition;
if (cursorPos !== undefined) {
  editor.setCursorPosition(cursorPos);
}
```

#### 5.3 Undo Descriptions

Generate user-friendly descriptions:

```typescript
function generateDescription(change: ChangeType): string {
  switch (change.type) {
    case 'text-edit':
      return `Edit text at line ${change.line}`;
    case 'comment-add':
      return `Add comment "${change.preview}"`;
    case 'format':
      return `Apply ${change.format} formatting`;
    default:
      return 'Edit document';
  }
}
```

## Implementation Phases

### Phase 1: Core Undo/Redo (Week 1)

1. Implement UndoRedoManager class
2. Add patch tracking to document changes
3. Implement basic undo/redo operations
4. Add keyboard shortcuts

### Phase 2: React Integration (Week 1-2)

1. Create useUndoRedo hook
2. Integrate with CollaborativeEditor
3. Add UI controls (buttons, menu items)
4. Implement visual feedback

### Phase 3: Advanced Features (Week 2-3)

1. Add transaction support
2. Implement scoped undo/redo
3. Add comment system integration
4. Implement cursor restoration

### Phase 4: Collaborative Features (Week 3-4)

1. Add collaborative awareness
2. Implement conflict detection
3. Add undo history panel
4. Performance optimization

## Testing Strategy

### 1. Unit Tests

```typescript
describe('UndoRedoManager', () => {
  test('tracks changes and creates patches');
  test('undoes changes in correct order');
  test('handles transaction grouping');
  test('respects scope boundaries');
  test('handles maximum stack size');
});
```

### 2. Integration Tests

- Test with real Automerge documents
- Verify patch application correctness
- Test collaborative scenarios
- Verify cursor position restoration

### 3. E2E Tests

- User workflows with undo/redo
- Keyboard shortcut functionality
- Collaborative editing with undo
- Performance with large documents

## Performance Considerations

1. **Memory Management**
   - Limit undo stack size (default: 100 entries)
   - Compress patches for storage
   - Clear old entries periodically

2. **Patch Optimization**
   - Batch small changes together
   - Compress sequential text edits
   - Skip no-op changes

3. **Storage**
   - Optional localStorage persistence
   - Configurable retention period
   - Compression for storage

## Security Considerations

1. **Access Control**
   - Users can only undo their own changes
   - Respect document permissions
   - Audit trail for undo operations

2. **Data Integrity**
   - Validate patches before applying
   - Verify document heads match
   - Handle corrupt history gracefully

## Future Enhancements

1. **Visual History Timeline**
   - Graphical representation of changes
   - Jump to any point in history
   - Compare versions side-by-side

2. **Collaborative Undo**
   - Undo other users' changes (with permission)
   - Group undo for collaborative edits
   - Conflict resolution UI

3. **Smart Undo**
   - AI-powered change grouping
   - Semantic undo (undo concept, not just text)
   - Pattern recognition for repeated actions

## Conclusion

This implementation plan provides a robust undo/redo system that:
- Integrates seamlessly with Automerge's CRDT system
- Respects collaborative editing workflows
- Provides excellent user experience
- Scales to support advanced features

The phased approach allows for iterative development and testing, ensuring each component is solid before building on it.