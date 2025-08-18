# Docs UI Plan

## Overview
Dead simple UI for creating, listing, and viewing markdown documents using the TnyOffice API service with CodeMirror 6.0.2 for document viewing/editing.

## Technology Stack
- Next.js 15 (already set up)
- CodeMirror 6.0.2 for markdown editing
- Tailwind CSS for styling
- API client to communicate with `http://localhost:3001`

## UI Structure

### 1. Layout
- Simple sidebar + main content area
- Sidebar: Document list
- Main area: Document viewer/editor

### 2. Pages/Components

#### Home Page (`/`)
- Left sidebar (30% width):
  - "New Document" button at top
  - List of documents below
  - Each item shows: filename, created date, size
  - Click to open document
- Right main area (70% width):
  - Empty state: "Select a document or create a new one"
  - When document selected: CodeMirror editor

#### Document Viewer/Editor Component
- Uses CodeMirror 6.0.2
- Markdown syntax highlighting
- Read-only mode for viewing
- Toolbar with:
  - Document title
  - Last updated timestamp
  - File size

### 3. Features

#### Create Document
- "New Document" button opens a modal
- Modal contains:
  - Filename input (with .md validation)
  - CodeMirror editor for content
  - "Create" and "Cancel" buttons
- On create: POST to API, refresh list, open new doc

#### List Documents
- Fetch from GET `/api/v1/files`
- Show loading state
- Handle empty state
- Simple pagination (Load more button)
- Auto-refresh every 30 seconds

#### View Document
- Click document in list
- Fetch from GET `/api/v1/files/:id`
- Display in CodeMirror (read-only)
- Show loading state
- Handle errors (404, network issues)

## API Integration

### Configuration
```typescript
// Use environment variable with fallback to localhost
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const API_ENDPOINT = `${API_BASE}/api/v1`;
```

### Environment Variables
Create `.env.local` file:
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
```

For production, set:
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Endpoints Used
- `GET /files` - List documents
- `POST /files` - Create document
- `GET /files/:id` - Get document content

### Error Handling
- Network errors: Show toast notification
- 404: Show "Document not found"
- 500: Show "Server error, please try again"

## CodeMirror 6.0.2 Setup

### Installation
```bash
npm install @codemirror/lang-markdown@6.0.2
npm install @codemirror/view@6.0.2
npm install @codemirror/state@6.0.2
npm install @codemirror/basic-setup@6.0.2
```

### Configuration
- Markdown syntax highlighting
- Line numbers
- Word wrap
- Read-only mode for viewing
- Light/dark theme support

## Component Structure
```
components/
├── Layout.tsx           # Main app layout
├── Sidebar.tsx         # Document list sidebar
├── DocumentList.tsx    # List of documents
├── DocumentViewer.tsx  # CodeMirror viewer
├── CreateModal.tsx     # New document modal
└── Editor.tsx          # CodeMirror wrapper
```

## State Management
- Use React hooks (useState, useEffect)
- No external state library needed
- Local state for:
  - Selected document ID
  - Document list
  - Loading states
  - Modal open/close

## Styling
- Tailwind CSS classes
- Responsive design (mobile: stacked, desktop: sidebar)
- Dark mode support
- Clean, minimal design

## Future Enhancements (Not in MVP)
- Edit existing documents
- Delete documents
- Search functionality
- Keyboard shortcuts
- Export as PDF/HTML
- Real-time collaboration