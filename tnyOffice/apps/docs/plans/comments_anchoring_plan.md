# Comment Anchoring Plan - Maintaining Position Through Edits

## Problem Statement
Current implementation stores comments with fixed character positions (anchorStart/anchorEnd). When the document is edited:
- Insertions/deletions before a comment invalidate its position
- Deleting commented text orphans the comment
- Comments can end up pointing to wrong text

## Research: Automerge Text Anchoring

### Option 1: Automerge Marks (Preferred)
Automerge 2.0+ supports "marks" - persistent positions that move with text changes:
```typescript
// Instead of storing character positions:
interface Comment {
  anchorStart: number;  // ❌ Fixed position
  anchorEnd: number;    // ❌ Fixed position
}

// Store Automerge marks:
interface Comment {
  anchorStart: Mark;    // ✅ Moves with text
  anchorEnd: Mark;      // ✅ Moves with text
  originalText: string; // Backup for orphaned comments
}
```

### Option 2: Content Fingerprinting (Fallback)
If marks aren't available, store content signatures:
```typescript
interface Comment {
  // Primary anchor: try to find exact text
  textFingerprint: {
    before: string;  // 20 chars before selection
    selected: string; // The commented text
    after: string;   // 20 chars after selection
  };
  // Fallback: approximate position
  relativePosition: number; // 0-1 position in document
}
```

## Implementation Plan

### Phase 1: Research Automerge Marks
1. Test if Automerge supports persistent marks/cursors
2. Check @automerge/automerge-codemirror for mark support
3. Evaluate mark behavior during concurrent edits

### Phase 2: Update Data Model
```typescript
interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: number;
  
  // New anchoring system
  anchor: {
    type: 'mark' | 'position' | 'orphaned';
    markStart?: AutomergeMark;
    markEnd?: AutomergeMark;
    positionStart?: number;  // Fallback
    positionEnd?: number;    // Fallback
    originalText: string;    // For orphaned comments
  };
  
  // Status tracking
  status: 'attached' | 'fuzzy' | 'orphaned';
}
```

### Phase 3: Comment States
1. **Attached**: Comment perfectly anchored to text
2. **Fuzzy**: Text changed but we found approximate location
3. **Orphaned**: Original text deleted, comment unattached

### Phase 4: UI Updates

#### Editor Decorations
```typescript
// Different styles for comment states
const commentStyles = {
  attached: 'bg-yellow-200',    // Solid yellow
  fuzzy: 'bg-yellow-100 border-dashed', // Light yellow, dashed
  orphaned: null // No decoration in editor
};
```

#### Sidebar Organization
```
Comments (5)
├── Active Comments (3)
│   ├── "This needs clarification" - Line 42
│   ├── "Good point here" - Line 156  
│   └── "Consider refactoring" - Line 203 ⚠️ (fuzzy match)
│
└── Orphaned Comments (2)
    ├── "TODO: Add tests" (original: "function calculateTotal")
    └── "Security concern" (original: "api_key = '123'")
```

### Phase 5: Migration Strategy
1. Keep current implementation working
2. Add new anchoring in parallel
3. Migrate existing comments gradually
4. Remove old system once stable

## Technical Considerations

### Automerge Integration
- Investigate `Automerge.mark()` or similar APIs
- Ensure marks sync across clients
- Handle mark conflicts in concurrent edits

### Fuzzy Matching Algorithm
```typescript
function findFuzzyMatch(comment: Comment, docText: string): {
  start: number;
  end: number;
  confidence: number;
} {
  // 1. Try exact text match
  // 2. Try with whitespace normalization
  // 3. Try partial matches (80% similarity)
  // 4. Use relative position as last resort
}
```

### Performance
- Fuzzy matching on every render could be expensive
- Cache match results until document changes
- Limit fuzzy matching to visible comments

## Next Steps
1. Create proof-of-concept with Automerge marks
2. If marks unavailable, implement fuzzy matching
3. Design orphaned comments UI
4. Test with aggressive concurrent editing
5. Add comment recovery features

## Success Criteria
- Comments stay attached through normal editing
- Orphaned comments are clearly marked
- Users can recover/reattach orphaned comments
- Performance remains good with many comments
- System handles concurrent edits gracefully