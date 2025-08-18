# Git Integration Plan - Document Synchronization

## Status: ✅ IMPLEMENTED

## Overview

This plan outlines a simple, prototype-level approach to adding git capabilities to the TnyOffice API, allowing all documents stored in the SQLite database to be synchronized with a git repository.

### Implementation Summary
- ✅ Git sync endpoint created at `/api/v1/git/sync`
- ✅ Automatic repository initialization
- ✅ Environment-based paths (development vs production)
- ✅ Automerge-aware content fetching
- ✅ Add/modify/delete tracking with single commit per sync
- ✅ Remote push support via GIT_REMOTE_URL environment variable

## Goals

1. **Local Git Repository**: Maintain a git repository on the server filesystem
2. **Document Sync**: Keep markdown files in sync with database documents
3. **Change Tracking**: Commit changes when documents are created, updated, or deleted
4. **Future Remote Support**: Design with eventual GitHub push capabilities in mind

## Architecture

### Current State
- Documents stored in SQLite `files` table with:
  - `id` (UUID)
  - `filename`
  - `content` (markdown text)
  - `automerge_id`
  - timestamps

### Proposed Git Structure
```
# Production: /data/git-repo/
# Development: apps/api/git-repo/
git-repo/
├── .git/
├── documents/
│   ├── {id}-{filename}  # e.g., "abc123-readme.md"
│   ├── {id}-{filename}
│   └── ...
└── .gitignore
```

## Implementation Approach

### 1. Git Repository Setup
- Initialize a git repo with environment-based paths:
  - **Production**: `/data/git-repo` (persistent Fly.io volume)
  - **Development**: `apps/api/git-repo` (local project directory)
- Store documents in a `documents/` subdirectory
- Use `{id}-{filename}` naming to handle duplicate filenames

```typescript
const gitRepoPath = process.env.NODE_ENV === 'production' 
  ? '/data/git-repo'
  : path.join(__dirname, '../../git-repo');
```

### 2. New API Endpoint
```
POST /api/v1/git/sync
```

This endpoint will:
1. Query all documents from the SQLite database
2. Compare with existing files in the git repository
3. Perform necessary git operations:
   - Add new files for documents not in git
   - Update modified files based on `updated_at` timestamp
   - Delete files for documents removed from database
4. Create a single commit with all changes
5. Return sync status and commit hash

### 3. File Sync Logic

```typescript
interface GitSyncResult {
  success: boolean;
  commitHash?: string;
  changes: {
    added: string[];
    modified: string[];
    deleted: string[];
  };
  error?: string;
}
```

#### Sync Algorithm:
1. **List all database documents**:
   ```sql
   SELECT id, filename, content, updated_at FROM files
   ```

2. **List all git repository files**:
   ```bash
   ls ${gitRepoPath}/documents/
   ```

3. **Determine changes**:
   - **New**: Document exists in DB but not in git
   - **Modified**: Document in git has older timestamp than DB
   - **Deleted**: File exists in git but not in DB

4. **Apply changes**:
   ```bash
   # For new/modified files
   echo "$content" > ${gitRepoPath}/documents/{id}-{filename}
   git add documents/{id}-{filename}
   
   # For deleted files
   git rm documents/{id}-{filename}
   ```

5. **Commit changes**:
   ```bash
   git commit -m "Sync documents from database - {timestamp}"
   ```

### 4. Implementation Dependencies
- **simple-git**: Node.js library for git operations
- **fs/promises**: For file system operations
- Existing SQLite database connection

### 5. Code Structure
```
apps/api/src/
├── routes/
│   └── git.ts          # New git sync endpoint
├── services/
│   └── git-sync.ts     # Git synchronization logic
└── utils/
    └── git-helpers.ts  # Git operation utilities
```

## Future Enhancements

### Phase 1 (Current Prototype)
- ✅ Local git repository
- ✅ Manual sync endpoint
- ✅ Basic add/update/delete operations
- ✅ Single commit per sync

### Phase 2 (Near Future)
- [ ] Automatic sync on document changes (webhook/event-based)
- [ ] Individual commits per document change
- [ ] Meaningful commit messages with user/change details
- [ ] Git history endpoint to view commits

### Phase 3 (Remote Integration) - PARTIALLY COMPLETE
- [x] GitHub integration with authentication (via personal access token)
- [x] Push to remote repository
- [ ] Pull from remote (conflict resolution strategy needed)
- [ ] Branch management
- [ ] OAuth-based authentication (instead of tokens)

## Technical Considerations

### 1. File Naming Strategy
Using `{id}-{filename}` format ensures:
- No filename collisions
- Easy mapping between database and git
- Stable file paths even if document titles change

### 2. Performance
- Initial sync might be slow with many documents
- Consider batching for large repositories
- Use git's built-in efficiency for incremental updates

### 3. Error Handling
- Validate git repository state before operations
- Handle file system errors gracefully
- Provide detailed error messages in API response
- Rollback strategy if commit fails
- Create parent directories if they don't exist (especially in development)

### 4. Security
- Sanitize filenames to prevent path traversal
- Limit file sizes to prevent abuse
- No sensitive data in commit messages
- Git repository permissions

## Example Usage

### Sync Documents to Git
```bash
curl -X POST http://localhost:3001/api/v1/git/sync
```

### Response
```json
{
  "success": true,
  "commitHash": "a1b2c3d4e5f6",
  "changes": {
    "added": ["123-readme.md", "456-spec.md"],
    "modified": ["789-design.md"],
    "deleted": ["old-doc.md"]
  }
}
```

## Implementation Steps (✅ Completed)

1. **Install Dependencies** ✅
   ```bash
   npm install simple-git
   ```

2. **Create Git Service** ✅
   - Initialize repository if not exists
   - Implement sync logic
   - Handle edge cases

3. **Add API Endpoint** ✅
   - Route handler
   - Input validation
   - Error responses

4. **Test Thoroughly** ✅
   - Empty database scenario
   - Large document sets
   - Special characters in filenames
   - Concurrent sync requests

## Implementation Notes

### Key Design Decisions
1. **Automerge Integration**: The sync service properly fetches content from Automerge documents when available, falling back to SQLite content for unedited documents.

2. **File Naming**: Using `{id}-{filename}` format ensures stable file paths and prevents naming conflicts.

3. **Content Comparison**: The service reads existing file content to detect actual changes, avoiding unnecessary commits.

4. **Environment Paths**: 
   - Development: `apps/api/git-repo/`
   - Production: `/data/git-repo/` (Fly.io persistent volume)

### Files Created
- `src/services/git-sync.ts` - Git synchronization service
- `src/routes/git.ts` - API endpoint handler

### Architecture Integration
The git sync integrates seamlessly with the existing Automerge-based architecture:
- Respects Automerge as the source of truth for edited documents
- Uses the same `DocumentService` pattern as other endpoints
- Maintains consistency with the dual-storage approach

### Remote Push Implementation
- Environment-based configuration via `GIT_REMOTE_URL`
- Automatic remote setup on first sync
- Handles upstream branch configuration
- Non-blocking: push failures don't fail the sync operation
- Supports both public and private repositories (with token auth)

## Conclusion

The git integration has been successfully implemented, providing a simple yet effective way to export all TnyOffice documents to a git repository. The implementation is production-ready for the prototype phase and easily extensible for future features like remote repository push/pull.