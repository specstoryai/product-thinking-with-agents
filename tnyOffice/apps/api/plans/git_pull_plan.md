# Git Pull Implementation Plan: Handling Live Editing Conflicts

## Overview

This document outlines the implementation plan for adding git pull functionality to the TnyOffice collaborative editor. The key challenge is integrating external git changes into documents that may be actively edited by users in real-time, without disrupting their editing experience.

## Current Architecture

### Existing Git Integration (One-way Export)
- Documents are exported to git as `{id}-{filename}.md` files
- Git sync is currently **write-only** (database → git)
- Located at `/api/v1/git/sync` endpoint
- Commits all changes in a single batch
- Optionally pushes to remote repository

### Real-time Collaboration System
- Automerge CRDT handles all real-time collaboration
- Document content stored as a simple string field: `doc.content`
- Changes propagated via WebSocket to all connected clients
- Automatic conflict resolution through CRDT operations
- CodeMirror editor with `automergeSyncPlugin` for seamless integration

## Problem Statement

### Scenario
1. **User A** is actively editing "design-spec.md" in the web app
2. **User B** edits the same document in git and pushes changes
3. **User A** (or admin) triggers "Pull from Git"
4. **Challenge**: How to merge git changes without disrupting User A's experience?

### Why Simple Replacement Won't Work

If we implement git pull using simple content replacement:
```typescript
handle.change((doc) => {
  doc.content = gitContent; // BAD: Replaces entire document
});
```

**User A would experience:**
- Entire document instantly replaced
- Cursor position jumps to beginning
- Text being typed is lost
- Feels like someone did "Select All" + Paste
- **Terrible user experience!**

## Proposed Solution: Diff-Based Merge

### Core Concept
Instead of replacing content wholesale, apply git changes as granular text operations that integrate naturally with Automerge's CRDT system. This makes external changes appear like collaborative edits from another user.

### Technical Approach

1. **Calculate Differences**
   - Use text diff algorithm (e.g., `diff-match-patch` library)
   - Compare current Automerge content with git content
   - Generate list of insertions, deletions, and unchanged regions

2. **Convert to Character-Level Operations**
   - Break down diffs into individual character operations
   - Maintain positional accuracy throughout document
   - Account for Automerge's internal text representation

3. **Apply Operations Sequentially**
   - Use Automerge's text manipulation methods
   - Apply changes in order to maintain consistency
   - Let CRDT handle any conflicts with concurrent edits

### Expected User Experience

**For User A (actively editing):**
- Changes appear gradually, like another user typing
- Cursor position preserved when possible
- Can continue typing without interruption
- Sees visual indicators of incoming changes
- No data loss - all changes merged

**Visual Feedback:**
- Temporary highlights on changed sections
- Toast notification: "Pulled X changes from git"
- Optional diff preview before applying
- Progress indicator during operation

## Implementation Plan

### Phase 1: Backend Infrastructure

#### 1.1 Git Pull Endpoint
```typescript
POST /api/v1/git/pull
```

**Request Body:**
```json
{
  "remoteUrl": "https://github.com/user/repo.git", // optional
  "branch": "main", // optional, default: main
  "preview": false // if true, return diffs without applying
}
```

**Response:**
```json
{
  "success": true,
  "changes": [
    {
      "fileId": "abc-123",
      "filename": "design-spec.md",
      "status": "modified", // added|modified|deleted
      "additions": 45,
      "deletions": 12,
      "conflicts": 0
    }
  ],
  "appliedAt": "2025-01-20T10:30:00Z"
}
```

#### 1.2 Git Diff Service
Create `apps/api/src/services/git-diff.ts`:

```typescript
export class GitDiffService {
  // Calculate diff between git and Automerge content
  static calculateDiff(gitContent: string, automergeContent: string): DiffOperation[]
  
  // Apply diff operations to Automerge document
  static applyDiffToDocument(handle: DocHandle, operations: DiffOperation[]): void
  
  // Preview changes without applying
  static previewChanges(fileId: string): ChangePreview
}
```

#### 1.3 Text Operation Types
```typescript
interface DiffOperation {
  type: 'insert' | 'delete' | 'retain';
  position: number;
  text?: string; // for insert
  length?: number; // for delete/retain
}
```

### Phase 2: Diff Application Logic

#### 2.1 Diff Algorithm Integration
- Add `diff-match-patch` dependency
- Configure for line-level or character-level diffs
- Optimize for minimal operations

#### 2.2 Automerge Text Operations
Implement careful position tracking:
```typescript
// Apply operations in reverse order to maintain positions
operations.sort((a, b) => b.position - a.position);

handle.change((doc) => {
  for (const op of operations) {
    switch (op.type) {
      case 'insert':
        // Insert text at position
        doc.content = doc.content.slice(0, op.position) + 
                     op.text + 
                     doc.content.slice(op.position);
        break;
      case 'delete':
        // Delete characters
        doc.content = doc.content.slice(0, op.position) + 
                     doc.content.slice(op.position + op.length);
        break;
    }
  }
});
```

#### 2.3 Conflict Detection
- Identify overlapping changes
- Mark potential conflict zones
- Let Automerge CRDT resolve naturally

### Phase 3: Frontend Integration

#### 3.1 UI Components
- "Pull from Git" button in document list
- Confirmation dialog with change preview
- Progress indicator during pull
- Success/error notifications

#### 3.2 Visual Indicators
- Highlight changed text temporarily
- Show diff markers in gutter
- Animation for smooth transitions

#### 3.3 User Controls
- Option to preview before applying
- Ability to reject specific changes
- Undo support for entire pull operation

### Phase 4: Edge Cases and Error Handling

#### 4.1 Document State Mismatches
- **New in git**: Create document in database
- **Deleted in git**: Mark as deleted, don't remove if active
- **Renamed in git**: Update metadata, preserve ID

#### 4.2 Large Documents
- Chunk operations for performance
- Show progress for long operations
- Implement operation batching

#### 4.3 Binary and Non-Markdown Files
- Detect file type from extension
- Skip or handle specially
- Warn user about skipped files

#### 4.4 Network and Authentication
- Handle git authentication failures
- Retry logic for network errors
- Timeout for long operations

### Phase 5: Testing Strategy

#### 5.1 Unit Tests
- Diff calculation accuracy
- Operation application correctness
- Position tracking with cursors
- Comment anchor preservation

#### 5.2 Integration Tests
- Full pull workflow
- Concurrent editing scenarios
- Large document handling
- Error recovery

#### 5.3 User Acceptance Tests
- Real-world editing scenarios
- Performance benchmarks
- UI responsiveness
- Data integrity verification

## Alternative Approaches Considered

### 1. Document Locking
- **Approach**: Lock documents during pull
- **Rejected**: Blocks collaboration, poor UX

### 2. Version Branching
- **Approach**: Create new version, let user merge
- **Rejected**: Splits document history, complex UI

### 3. Modal Merge Dialog
- **Approach**: Show merge UI like git
- **Rejected**: Interrupts workflow, not real-time

### 4. Queue System
- **Approach**: Queue changes, apply later
- **Rejected**: Delays, sync complexity

## Success Metrics

1. **Performance**
   - Pull operation < 5 seconds for typical documents
   - No UI freezing during operation
   - Smooth animation of changes

2. **Reliability**
   - Zero data loss
   - Correct merge in all test scenarios
   - Graceful error handling

3. **User Experience**
   - Users can continue editing during pull
   - Clear visual feedback
   - Intuitive conflict resolution

## Future Enhancements

1. **Selective Pull**
   - Choose specific files to pull
   - Filter by date or author

2. **Merge Strategies**
   - Different algorithms for different file types
   - User-configurable merge preferences

3. **Automation**
   - Scheduled pulls
   - Webhook integration for auto-pull

4. **Audit Trail**
   - Track who pulled when
   - Detailed change attribution

## Implementation Timeline

- **Week 1**: Backend infrastructure (Phase 1)
- **Week 2**: Diff logic and Automerge integration (Phase 2)
- **Week 3**: Frontend UI and visual feedback (Phase 3)
- **Week 4**: Edge cases and testing (Phase 4-5)

## Conclusion

This implementation ensures git changes integrate smoothly into the live collaborative editing experience without disrupting active users. By treating git changes as collaborative edits and leveraging Automerge's CRDT capabilities, we maintain the real-time, conflict-free editing experience users expect while adding powerful git integration features.