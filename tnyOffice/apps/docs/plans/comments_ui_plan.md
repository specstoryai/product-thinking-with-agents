# Comments UI Plan - Simple Prototype ✅

## Overview
Add basic commenting UI to the existing CodeMirror-based collaborative editor.

## Implementation Status: COMPLETED ✅

## Components

### 1. Comment Decorations in Editor
- Use CodeMirror decorations to highlight commented text
- Yellow background for text with comments
- Click highlighted text to view comment

### 2. Simple Comment Sidebar
```tsx
// Basic component structure
<CommentsSidebar>
  - List of all comments
  - Click comment to jump to text
  - Delete button for each comment
</CommentsSidebar>
```

### 3. Add Comment Flow
- Select text in editor
- Press "Add Comment" button (or Cmd+K)
- Simple modal with text input
- Submit creates comment

## Implementation Steps

### 1. CodeMirror Extension
Create `comments-extension.ts`:
- StateField to track comment positions
- Decoration.mark() for highlighting
- Listen to Automerge updates for comment changes

### 2. UI Components
- `CommentsSidebar.tsx` - Simple list view
- `AddCommentModal.tsx` - Basic form
- Update `CollaborativeEditor.tsx` to include comment extension

### 3. Integration
- Read comments from Automerge document
- Use existing API endpoints
- Comments sync automatically via Automerge

## Simple UI Mockup
```
[Editor with highlighted text] | [Comments Sidebar]
                              |  • Comment 1
                              |    "This needs work"
                              |    - User1, 2min ago
                              |  
                              |  • Comment 2
                              |    "Good point here"
                              |    - User2, 5min ago
```

## MVP Features Only
- Add comment on selected text
- View all comments in sidebar
- Click comment to jump to text
- Delete own comments
- Real-time sync via Automerge

## Skip for Prototype
- Reply threads
- Resolve/unresolve
- Comment editing
- User avatars
- Permissions

## Testing
1. Open document in two browser tabs
2. Add comment in tab 1
3. See it appear instantly in tab 2
4. Edit document text - comments should stay anchored