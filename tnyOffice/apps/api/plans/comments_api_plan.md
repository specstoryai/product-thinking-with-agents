# Comments API Plan - Simple Prototype ✅

## Overview
Add basic commenting functionality to the existing Automerge-based collaborative editor API.

## Implementation Status: COMPLETED ✅

### Data Model
Comments are stored directly in the Automerge document alongside the text content:

```typescript
// In src/automerge/types.ts
interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: number;
  anchorStart: number;  // character offset in document
  anchorEnd: number;
}

interface MarkdownDocument {
  content: string;
  comments?: { [id: string]: Comment };
  metadata?: {
    filename?: string;
    createdAt?: number;
    updatedAt?: number;
  };
}
```

### Implemented Endpoints

#### POST /api/v1/files/:id/comments
Create a new comment on a document
- Request body: `{ author, text, anchorStart, anchorEnd }`
- Returns: Created comment with generated ID
- Status: 201 Created

#### GET /api/v1/files/:id/comments
Get all comments for a document
- Returns: Array of comments
- Status: 200 OK

#### DELETE /api/v1/files/:id/comments/:commentId
Delete a specific comment
- Returns: `{ success: true }`
- Status: 200 OK

### Key Features
- ✅ Comments automatically sync via Automerge WebSocket
- ✅ No additional WebSocket code needed
- ✅ Comments persist with the document
- ✅ Real-time updates across all connected clients
- ✅ Validation with Zod schemas
- ✅ Proper error handling

### Testing Examples
```bash
# Create a comment
curl -X POST http://localhost:3001/api/v1/files/4e2f1e8d-8de0-4a58-91dc-d049ceb70f0b/comments \
  -H "Content-Type: application/json" \
  -d '{
    "author": "TestUser",
    "text": "This needs clarification",
    "anchorStart": 10,
    "anchorEnd": 25
  }'

# Get all comments
curl http://localhost:3001/api/v1/files/4e2f1e8d-8de0-4a58-91dc-d049ceb70f0b/comments

# Delete a comment (replace {COMMENT_ID} with actual ID)
curl -X DELETE http://localhost:3001/api/v1/files/4e2f1e8d-8de0-4a58-91dc-d049ceb70f0b/comments/{COMMENT_ID}
```

## Next Steps
- Implement UI components in the docs app
- Add CodeMirror decorations for comment highlighting
- Create comment sidebar component