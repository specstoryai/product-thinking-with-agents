# TnyOffice API Service - Real-time Collaborative Markdown Editor

A TypeScript Node.js API service with real-time collaborative editing capabilities using Automerge CRDTs, Express, WebSocket, and SQLite for persistent storage.

## Overview

This is a production-ready TypeScript Node.js application that provides:
- **Real-time collaborative editing** using Automerge for conflict-free synchronization
- **WebSocket support** for instant updates across all connected clients
- **Dual storage system**: SQLite for metadata + Automerge binary storage
- **REST API** for traditional CRUD operations
- **Automatic conflict resolution** using CRDT technology
- **Commenting system** with real-time sync and position anchoring
- **TypeScript** with strict type checking
- **Express 5.1.0** for the web framework
- **better-sqlite3 12.2.0** for database operations
- **Socket.io** for presence and awareness features

## Getting Started

### Environment Setup

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Configure your environment variables:
```bash
# Edit .env to add your remote repository URL (optional)
GIT_REMOTE_URL=https://github.com/username/repo.git

# For private repos, use a personal access token:
GIT_REMOTE_URL=https://username:token@github.com/username/repo.git
```

### Development

Run the development server with auto-reload:

```bash
npm run dev
```

The API will be available at [http://localhost:3001](http://localhost:3001).

### Production

```bash
npm run start
```

## API Endpoints

### Base URL
- Development: `http://localhost:3001`
- WebSocket: `ws://localhost:3001/automerge-sync`
- Socket.io: `ws://localhost:3001/socket.io/`

### REST Endpoints

#### Files API
- `POST /api/v1/files` - Create a new markdown file
- `GET /api/v1/files` - List all files with pagination
- `GET /api/v1/files/:id` - Get a specific file by ID (with Automerge sync)
- `PUT /api/v1/files/:id` - Update a file (creates/updates Automerge document)
- `GET /api/v1/files/:id/automerge` - Get Automerge document URL for real-time sync

#### Comments API
- `POST /api/v1/files/:id/comments` - Add a comment to a document
- `GET /api/v1/files/:id/comments` - Get all comments for a document
- `DELETE /api/v1/files/:id/comments/:commentId` - Delete a specific comment

#### Git API
- `POST /api/v1/git/sync` - Sync all documents to git repository
  - Optional body parameters:
    - `remoteUrl` (string): Override the default remote repository URL
    - `commitMessage` (string): Custom commit message instead of default timestamp
- `POST /api/v1/git/pull` - Pull changes from git repository and merge into documents
  - Optional body parameters:
    - `remoteUrl` (string): Override the default remote repository URL
    - `branch` (string): Branch to pull from (default: "main")
    - `preview` (boolean): If true, preview changes without applying them (default: false)

### WebSocket Endpoints

- `/automerge-sync` - Automerge document synchronization (native WebSocket)
- `/socket.io/` - Presence, awareness, and custom events

## Database

The SQLite database is automatically created at `database.db` when the server starts. The schema includes:

### Files Table (Document Metadata)
```sql
CREATE TABLE files (
  id TEXT PRIMARY KEY,
  filename TEXT NOT NULL,
  content TEXT,  -- Cached for quick REST access
  automerge_id TEXT UNIQUE,  -- Links to Automerge document
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
)
```

### Automerge Storage Table (Binary CRDT Data)
```sql
CREATE TABLE automerge_storage (
  key TEXT PRIMARY KEY,
  data BLOB NOT NULL,
  created_at INTEGER DEFAULT (unixepoch())
)
```

## Testing

### Using cURL

```bash
# Create a file
curl -X POST http://localhost:3001/api/v1/files \
  -H "Content-Type: application/json" \
  -d '{"filename": "test.md", "content": "# Test Document\n\nThis is a test."}'

# List files
curl http://localhost:3001/api/v1/files?limit=20&offset=0

# Get a file by ID
curl http://localhost:3001/api/v1/files/{id}

# Update a file
curl -X PUT http://localhost:3001/api/v1/files/{id} \
  -H "Content-Type: application/json" \
  -d '{"filename": "updated.md", "content": "# Updated Document\n\nNew content."}'

# Sync documents to git
curl -X POST http://localhost:3001/api/v1/git/sync

# Pull changes from git (preview mode - shows what would change)
curl -X POST http://localhost:3001/api/v1/git/pull \
  -H "Content-Type: application/json" \
  -d '{
    "preview": true
  }'

# Response (preview mode):
{
  "success": true,
  "changes": [
    {
      "fileId": "abc-123",
      "filename": "design-spec.md",
      "status": "modified",
      "additions": 45,
      "deletions": 12,
      "operations": [...]
    }
  ],
  "applied": false
}

# Pull and apply changes from git (default behavior)
curl -X POST http://localhost:3001/api/v1/git/pull \
  -H "Content-Type: application/json" \
  -d '{
    "branch": "main"
  }'

# Response (applied):
{
  "success": true,
  "changes": [...],
  "applied": true,
  "appliedAt": "2025-01-20T10:30:00Z"
}

# Create a comment
curl -X POST http://localhost:3001/api/v1/files/{id}/comments \
  -H "Content-Type: application/json" \
  -d '{
    "author": "TestUser",
    "text": "This needs clarification",
    "anchorStart": 10,
    "anchorEnd": 25
  }'

# Get all comments
curl http://localhost:3001/api/v1/files/{id}/comments

# Delete a comment
curl -X DELETE http://localhost:3001/api/v1/files/{id}/comments/{commentId}
```

## Real-time Collaboration

### How it Works

1. **Document Creation**: Regular markdown files are stored in SQLite
2. **First Edit**: Creates an Automerge document with CRDT structure
3. **Real-time Sync**: Changes propagate instantly via WebSocket
4. **Conflict Resolution**: Automerge automatically merges concurrent edits
5. **Persistence**: Binary CRDT data stored in SQLite for durability

### Architecture

```
Browser ↔ WebSocket ↔ Express Server ↔ Automerge Repo
                     ↔ REST API      ↔ SQLite Storage
```

## Git Integration

The API includes git synchronization capabilities to export all documents to a local git repository:

### Features
- Automatic git repository initialization
- Exports all documents as markdown files
- Tracks additions, modifications, and deletions
- Preserves document IDs in filenames to avoid conflicts
- Fetches latest content from Automerge for edited documents
- **Remote Push Support**: Automatically pushes to GitHub/GitLab when configured

### Git Repository Structure
```
# Production: /data/git-repo/
# Development: apps/api/git-repo/
git-repo/
├── .git/
├── documents/
│   ├── {id}-{filename}  # e.g., "abc123-readme.md"
│   └── ...
└── .gitignore
```

### Remote Repository Setup

To push changes to a remote repository:

1. **Create a GitHub repository** (can be private or public)
2. **Generate a Personal Access Token** with repo permissions
3. **Set the environment variable**:
   ```bash
   GIT_REMOTE_URL=https://YOUR_USERNAME:YOUR_TOKEN@github.com/YOUR_USERNAME/YOUR_REPO.git
   ```

**Note**: The git integration maintains a single remote called "origin". When you provide a new remote URL (either via environment variable or in the sync request), it will replace the existing remote URL rather than adding an additional remote.

### Usage
```bash
# Basic sync (uses environment variables)
curl -X POST http://localhost:3001/api/v1/git/sync

# Sync with custom remote URL (replaces the existing remote)
curl -X POST http://localhost:3001/api/v1/git/sync \
  -H "Content-Type: application/json" \
  -d '{
    "remoteUrl": "https://github.com/username/repo.git"
  }'

# Sync with custom commit message
curl -X POST http://localhost:3001/api/v1/git/sync \
  -H "Content-Type: application/json" \
  -d '{
    "commitMessage": "Weekly backup of all documents"
  }'

# Sync with both custom remote and message
curl -X POST http://localhost:3001/api/v1/git/sync \
  -H "Content-Type: application/json" \
  -d '{
    "remoteUrl": "https://username:token@github.com/username/repo.git",
    "commitMessage": "Manual sync to backup repository"
  }'

# Response
{
  "success": true,
  "commitHash": "a1b2c3d4...",
  "changes": {
    "added": ["123-readme.md"],
    "modified": ["456-spec.md"],
    "deleted": []
  },
  "pushedToRemote": true,
  "remoteUrl": "https://github.com/username/repo.git"
}
```

## Implementation Details

- **Database**: SQLite with better-sqlite3 for synchronous operations
- **Real-time**: Automerge 3.0 + Automerge Repo 2.1 for CRDT synchronization
- **WebSocket**: Native WebSocket for Automerge, Socket.io for presence
- **Git Integration**: simple-git for version control operations
- **IDs**: UUIDs generated with uuid package
- **Validation**: Zod schemas for input validation
- **Logging**: Uses @tnyoffice/logger for consistent logging
- **CORS**: Enabled for cross-origin requests
- **Storage Adapter**: Custom SQLite adapter for Automerge persistence

## Deployment

### Deploying to Fly.io

The API is designed to run on Fly.io with persistent storage and WebSocket support.

#### Prerequisites
1. Install the Fly CLI: https://fly.io/docs/hands-on/install-flyctl/
2. Sign up/login: `fly auth login`

#### Initial Deployment
```bash
# Option 1: Deploy first, then set secrets
fly deploy
fly secrets set GIT_REMOTE_URL="https://github.com/username/repo.git"

# Option 2: Set secrets first, then deploy
fly secrets set GIT_REMOTE_URL="https://github.com/username/repo.git"
fly deploy
```

**Note**: Environment variables in Fly.io are NOT set via .env files. They are managed through `fly secrets` commands and injected into the container at runtime.

#### Features
- **Persistent Volume**: `/data` directory persists across deployments
  - SQLite database: `/data/database.db`
  - Git repository: `/data/git-repo/`
- **WebSocket Support**: Configured for real-time collaboration
- **Auto-scaling**: Configured with min 1 machine for WebSocket persistence
- **Git Integration**: Git is pre-installed and configured
  - Default commit author: "TnyOffice API <api@tnyoffice.com>"
  - Repository persists in volume across deployments

#### Environment Variables
Fly.io uses secrets management for environment variables (NOT .env files):

```bash
# Set GitHub remote (public repo)
fly secrets set GIT_REMOTE_URL="https://github.com/username/repo.git"

# Set GitHub remote (private repo with token)
fly secrets set GIT_REMOTE_URL="https://username:token@github.com/username/repo.git"

# View current secrets (names only, values are hidden)
fly secrets list

# Remove a secret
fly secrets unset GIT_REMOTE_URL
```

**Important**: Setting or changing a secret automatically restarts your app.

#### Setting up GitHub Authentication

For pushing to GitHub repositories from Fly.io:

1. **Create a GitHub Personal Access Token**:
   - Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token"
   - Give it a name (e.g., "TnyOffice Fly.io")
   - Select scopes:
     - `repo` (for private repositories)
     - `public_repo` (for public repositories only)
   - Copy the token immediately (you won't see it again)

2. **Set the token in Fly.io**:
   ```bash
   # For private repos
   fly secrets set GIT_REMOTE_URL="https://YOUR_USERNAME:YOUR_TOKEN@github.com/YOUR_USERNAME/REPO_NAME.git"
   
   # Example
   fly secrets set GIT_REMOTE_URL="https://jakelevirne:ghp_xxxxxxxxxxxx@github.com/jakelevirne/docs-fly.git"
   ```

3. **Security Notes**:
   - The token is encrypted by Fly.io and only available to your app at runtime
   - Never commit tokens to your code or Docker images
   - Use tokens with minimal required permissions
   - Consider setting an expiration date on your token

#### Monitoring
```bash
# View logs
fly logs

# Check app status
fly status

# SSH into the container
fly ssh console
```