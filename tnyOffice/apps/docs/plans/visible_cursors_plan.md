# Visible Cursors Implementation Plan

## Overview
Implement real-time cursor and selection visibility for all connected users in the collaborative editor, similar to Google Docs. Each user will see their own cursor in one color and other users' cursors in different colors.

## Current State Analysis

### What Already Exists:
1. **Automerge WebSocket Connection**: 
   - Frontend uses `BrowserWebSocketClientAdapter` for document sync
   - Connects to `/automerge-sync` endpoint with authentication
   - Handles real-time document synchronization

2. **Socket.io Infrastructure**:
   - Backend server configured with Socket.io
   - Authentication middleware in place
   - Document room join/leave functionality
   - Presence event handlers ready but unused by frontend

3. **User Identity**:
   - Username system via localStorage
   - UserSettings component for username management
   - Username already used in comments

4. **CodeMirror Editor**:
   - Automerge integration via `automergeSyncPlugin`
   - Comment decorations system as reference
   - Extension architecture for adding features

### What Needs Implementation:
1. Frontend Socket.io client connection
2. Cursor position tracking and broadcasting
3. Remote cursor rendering in CodeMirror
4. User color assignment and persistence
5. Presence state management

## Implementation Plan

### Phase 1: Socket.io Client Setup

#### 1.1 Create Socket.io Context
```typescript
// lib/socket/SocketProvider.tsx
- Create React context for Socket.io client
- Initialize connection with authentication
- Handle connection lifecycle (connect/disconnect/reconnect)
- Export useSocket hook for components
```

#### 1.2 Integrate with CollaborativeEditor
```typescript
// components/CollaborativeEditor.tsx
- Use socket context
- Join document room on mount
- Leave document room on unmount
- Handle connection state
```

### Phase 2: Cursor Position Tracking

#### 2.1 Create Cursor Tracking Extension
```typescript
// lib/codemirror/cursor-tracking-extension.ts
- Track local cursor position changes
- Track selection ranges
- Debounce updates (50ms recommended)
- Emit cursor data via Socket.io
```

#### 2.2 Data Structure
```typescript
interface CursorUpdate {
  userId: string;
  username: string;
  color: string;
  cursor: {
    from: number;
    to: number;
  };
  selection?: {
    from: number;
    to: number;
  };
  timestamp: number;
}
```

### Phase 3: Remote Cursor Rendering

#### 3.1 Create Remote Cursors Extension
```typescript
// lib/codemirror/remote-cursors-extension.ts
- StateField to track remote cursor positions
- Decorations for cursor widgets
- Decorations for selection highlights
- ViewPlugin for smooth updates
- Tooltip showing username on hover
```

#### 3.2 Visual Design
- Cursor: 2px wide colored line with small flag showing username
- Selection: Semi-transparent highlight in user's color
- Colors: Generate consistent colors based on user ID
- Z-index management to prevent overlap issues

### Phase 4: User Color Management

#### 4.1 Color Assignment
```typescript
// lib/utils/user-colors.ts
- Generate deterministic colors from user ID
- Ensure sufficient contrast
- Store color preference in localStorage
- Provide color picker in UserSettings
```

#### 4.2 Color Palette
- Use HSL color space for better distribution
- Ensure colors work in both light/dark themes
- Minimum of 12 distinct colors
- Avoid colors too similar to editor theme

### Phase 5: Presence UI

#### 5.1 Active Users Indicator
```typescript
// components/PresenceIndicator.tsx
- Show avatars/initials of active users
- Display user colors
- Show connection status
- Tooltip with full username
```

#### 5.2 Integration Points
- Add to editor toolbar
- Show count in document list
- Real-time updates as users join/leave

## Technical Considerations

### Performance
1. **Debouncing**: Cursor updates at 50ms intervals
2. **Batching**: Group multiple updates when possible
3. **Cleanup**: Remove decorations for disconnected users
4. **Memory**: Limit stored cursor history

### Edge Cases
1. **Reconnection**: Restore cursor position after disconnect
2. **Conflict**: Handle when multiple users edit same position
3. **Scrolling**: Don't follow other users' cursors
4. **Large Documents**: Efficient rendering for many cursors

### Security
1. **Validation**: Sanitize cursor positions
2. **Rate Limiting**: Prevent cursor update spam
3. **Authentication**: Verify user identity for each update

## API Changes

### Frontend to Backend (Socket.io)
```typescript
// Emit events
socket.emit('cursor-update', cursorData);
socket.emit('join-doc', { documentId });
socket.emit('leave-doc', { documentId });

// Listen for events
socket.on('remote-cursor', (data) => {});
socket.on('user-joined', (data) => {});
socket.on('user-left', (data) => {});
socket.on('presence-sync', (data) => {}); // Full state sync
```

### Backend Modifications
- Minimal changes needed
- Use existing presence handler
- Add cursor data validation
- Broadcast to document rooms

## Implementation Order

1. **Socket.io client setup** (Phase 1)
2. **Basic cursor tracking** (Phase 2.1)
3. **Simple cursor rendering** (Phase 3.1 - just position)
4. **Color system** (Phase 4.1)
5. **Selection highlighting** (Phase 3.2)
6. **Presence UI** (Phase 5)
7. **Polish and edge cases**

## Testing Strategy

1. **Unit Tests**:
   - Color generation consistency
   - Cursor position calculations
   - Debouncing logic

2. **Integration Tests**:
   - Multi-user cursor sync
   - Reconnection handling
   - Performance with many users

3. **Manual Testing**:
   - Visual appearance
   - Smooth cursor movement
   - Cross-browser compatibility

## Success Metrics

1. **Performance**: <100ms latency for cursor updates
2. **Reliability**: No lost cursor updates
3. **Usability**: Clear visual distinction between users
4. **Scalability**: Support 10+ concurrent users

## References

- [CodeMirror 6 Decorations](https://codemirror.net/docs/guide/#decorations)
- [Socket.io Client Docs](https://socket.io/docs/v4/client-api/)
- [Similar Implementation Example](https://github.com/yjs/y-codemirror.next)