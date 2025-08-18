# TnyOffice Monorepo

A monorepo containing multiple Next.js applications with shared functionality.

## Structure

```
tnyOffice/
├── apps/
│   ├── api/        # TypeScript Node.js API with SQLite storage
│   └── docs/       # Collaborative markdown docs app (like GDocs)
├── packages/
│   ├── logger/     # Shared logging utility
│   ├── shared/     # Shared utilities and types
│   └── ui/         # Shared UI components
└── package.json    # Workspace configuration
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm 10+

### Installation
```bash
npm install
```

### Development
Run all apps in development mode:
```bash
npm run dev
```

### Building
Build all apps:
```bash
npm run build
```

## Apps

### API Service (`apps/api`)
Real-time collaborative markdown editor API with TypeScript, Express, SQLite, and Automerge CRDTs. Features:
- **WebSocket support** for real-time collaboration via Automerge sync
- **SQLite database** with persistent volume for data storage
- **REST API** for CRUD operations on markdown files
- **Automatic conflict resolution** using CRDT technology
- **Deployed on Fly.io** with WebSocket support

**URLs:**
- Local: `http://localhost:3001`
- Production: `https://tny-office-api.fly.dev`
- WebSocket: `wss://tny-office-api.fly.dev/automerge-sync`

### Documents (`apps/docs`)
Next.js collaborative markdown editor (like Google Docs) with real-time sync. Features:
- **Real-time collaboration** using Automerge CRDTs
- **WebSocket connection** to API for instant updates
- **Document list** with create/edit capabilities
- **Markdown preview** with side-by-side editing
- **API authentication** for secure communication

## Authentication

The API and frontend use a simple API key authentication system to secure all endpoints.

### Development Setup

#### 1. API Service (`apps/api`)
```bash
# Copy the example file
cp .env.example .env.local

# For development, you can leave API_KEY empty to disable authentication
# Or set a test key if you want to test authentication:
# API_KEY=dev-api-key-for-testing
```

#### 2. Documents App (`apps/docs`)
```bash
# Copy the example file
cp .env.example .env.local

# The defaults are already set for local development
# If you enabled authentication in the API, add the same key:
# NEXT_PUBLIC_API_KEY=dev-api-key-for-testing
```

**Note**: In development, authentication is optional. If no API_KEY is set, the API will accept all requests.

**Environment Behavior**: 
- Development (`npm run dev`): NODE_ENV is not set, which enables development features (verbose logging, local file paths, relaxed CORS)
- Production (Fly.io): NODE_ENV is automatically set to "production" by the Dockerfile, enabling production features (minimal logging, persistent storage paths, strict CORS)

### CORS Configuration for Development

#### Local Docs → Local API (Default)
No CORS configuration needed. The API allows all origins in development mode by default.

#### Local Docs → Production API (Fly.io)
If you want to connect your local docs app to the production API on Fly.io:

1. **Update your local docs environment** (`apps/docs/.env.local`):
```bash
NEXT_PUBLIC_API_KEY=your-production-api-key
NEXT_PUBLIC_API_URL=https://tny-office-api.fly.dev
NEXT_PUBLIC_WS_URL=wss://tny-office-api.fly.dev
```

2. **Add localhost to allowed origins on Fly.io**:
```bash
cd apps/api
fly secrets set ALLOWED_ORIGINS="https://your-app.vercel.app,http://localhost:3002"
```

**Security Note**: Remember to remove `http://localhost:3002` from `ALLOWED_ORIGINS` when you're done testing to maintain security.

⚠️ **SECURITY WARNING**: This is a VERY BASIC authentication approach suitable only for prototypes. The API key is exposed in the browser's JavaScript bundle, making it visible to anyone who inspects the code. We are only accepting this security risk because:
   1. The Vercel deployment has password protection enabled
   2. This is a prototype, not a production application
   3. The simplicity outweighs the security concerns for our current needs

### Production Setup

#### 1. Generate a Secure API Key
```bash
# Generate a 32-character secure key
openssl rand -hex 32
```

#### 2. API Service Deployment (Fly.io)
```bash
cd apps/api

# Set the API key secret
fly secrets set API_KEY="your-generated-api-key"

# Set allowed frontend origins (your Vercel URL)
fly secrets set ALLOWED_ORIGINS="https://your-app.vercel.app"

# Optional: Set git remote for backups
fly secrets set GIT_REMOTE_URL="https://username:token@github.com/username/repo.git"

# Deploy
fly deploy
```

#### 3. Documents App Deployment (Vercel)
In your Vercel project settings, add these environment variables:
```bash
NEXT_PUBLIC_API_KEY=your-generated-api-key
NEXT_PUBLIC_API_URL=https://tny-office-api.fly.dev
NEXT_PUBLIC_WS_URL=wss://tny-office-api.fly.dev
```

### Environment Variables Reference

#### API Service (`apps/api/.env`)
```bash
# Required in production
API_KEY=your-secure-api-key

# CORS settings (comma-separated origins)
ALLOWED_ORIGINS=https://your-app.vercel.app,https://custom-domain.com

# Optional: Git sync
GIT_REMOTE_URL=https://username:token@github.com/username/repo.git
```

#### Documents App (`apps/docs/.env`)
```bash
# Required in production
NEXT_PUBLIC_API_KEY=your-secure-api-key
NEXT_PUBLIC_API_URL=https://tny-office-api.fly.dev
NEXT_PUBLIC_WS_URL=wss://tny-office-api.fly.dev
```

## Adding New Apps

1. Navigate to the apps directory
2. Create a new Next.js app:
   ```bash
   cd apps
   npx create-next-app@latest my-app
   # or with shadcn/ui
   npx shadcn@latest init
   ```

## Packages

### Logger (`packages/logger`)
A simple, environment-aware logging utility that provides consistent logging across all apps.

**Log Levels:**
- `log.info()` - General information messages (hidden in production)
- `log.debug()` - Detailed debugging information (hidden in production)
- `log.warn()` - Warning messages (hidden in production)
- `log.error()` - Error messages (always visible, even in production)

**Environment-based Behavior:**
The logger automatically adjusts its output based on the `NODE_ENV` environment variable:
- **Development** (`NODE_ENV !== 'production'`): All log levels are visible
- **Production** (`NODE_ENV === 'production'`): Only `error` logs are visible

Usage:
```typescript
import { log } from '@tnyoffice/logger';

log.info('Fetching user data', userId);      // Visible in dev, hidden in prod
log.debug('Request payload:', data);         // Visible in dev, hidden in prod
log.warn('API rate limit approaching');      // Visible in dev, hidden in prod
log.error('Failed to fetch', error);         // Always visible
```

To run in production mode locally:
```bash
NODE_ENV=production npm run start
```

## Workspace Management

This monorepo uses npm workspaces and Turbo for efficient builds and development.

### Running Commands
- **Development**: `npm run dev` - Runs all apps concurrently
- **Building**: `npm run build` - Builds all apps
- **Linting**: `npm run lint` - Runs ESLint across all workspaces
- **Type Checking**: `npm run typecheck` - Runs TypeScript type checking
- **Full Check**: `npm run check-all` - Runs both lint and typecheck

### Specific Workspace Commands
Run commands for a specific app:
```bash
npm run dev -w api      # Run only the API app
npm run lint -w docs    # Lint only the docs app
```

## Code Quality

### Linting and Type Checking

This monorepo uses a comprehensive linting and type checking setup to catch errors before deployment:

#### ESLint Configuration
- **ESLint v9** with the new flat config format
- **TypeScript ESLint** for TypeScript-specific rules
- **Strict rules** to ensure code quality:
  - No unused variables (prefix with `_` to ignore)
  - No `any` types allowed
  - No `console.log` (use the logger package instead)
  - Enforces `const` over `let` when possible
  - Consistent code style across all packages

#### TypeScript Configuration
- **Strict mode** enabled for maximum type safety
- **No implicit `any`** - all types must be explicit
- **Unused locals and parameters** are treated as errors
- **Consistent casing** in file names required
- Each app/package has its own `tsconfig.json` extending from root

#### Running Checks
```bash
# Run all linting across the monorepo
npm run lint

# Run TypeScript type checking
npm run typecheck

# Run both lint and typecheck
npm run check-all

# Run everything including build (mimics Vercel deployment)
npm run check-build
```

#### Package-Specific Configuration
- **Next.js apps** use Next.js's built-in ESLint config with additional strict rules
- **Logger package** has custom ESLint config to allow console usage
- All packages use the latest versions:
  - ESLint v9.31.0
  - TypeScript v5.8.3
  - @typescript-eslint v8.37.0

#### Why This Matters
Vercel runs both linting and type checking during deployment. Our setup ensures:
1. **No deployment failures** due to type errors
2. **Consistent code quality** across the monorepo
3. **Early error detection** during development
4. **Production-ready code** with no debug logs

## Deployment

### API Deployment to Fly.io

The API service is deployed on Fly.io with WebSocket support and persistent SQLite storage.

#### Prerequisites
- [Fly CLI](https://fly.io/docs/hands-on/install-flyctl/) installed
- Authenticated with `fly auth login`

#### Initial Deployment
```bash
cd apps/api

# Create new app (one-time setup)
fly launch --no-deploy
# Choose app name, region, NO to Postgres/Redis

# Create persistent volume for SQLite
fly volumes create data --size 1 --region bos

# Set required secrets before first deploy
fly secrets set API_KEY="$(openssl rand -hex 32)"
fly secrets set ALLOWED_ORIGINS="https://your-docs-app.vercel.app"

# Deploy
fly deploy
```

#### Updating Deployment
```bash
cd apps/api
fly deploy
```

#### Monitoring
```bash
# View logs
fly logs

# Check status
fly status

# SSH into container
fly ssh console
```

#### Configuration
The `fly.toml` is configured for:
- WebSocket support on `/automerge-sync`
- Persistent volume mounted at `/data`
- Auto-scaling with minimum 1 instance for WebSocket connections
- HTTPS with automatic certificates

### Frontend Deployment

The docs app can be deployed to Vercel:

1. Push to GitHub
2. Import project in Vercel
3. Set environment variables:
   ```
   NEXT_PUBLIC_API_KEY=your-api-key-from-fly-secrets
   NEXT_PUBLIC_API_URL=https://tny-office-api.fly.dev
   NEXT_PUBLIC_WS_URL=wss://tny-office-api.fly.dev/automerge-sync
   ```
4. Deploy

**Important**: The `NEXT_PUBLIC_API_KEY` must match the `API_KEY` set in your Fly.io deployment.

## Contributing

1. Create feature branches from `main`
2. Run `npm run check-all` before committing to ensure:
   - All TypeScript types are correct
   - ESLint rules pass
   - Code follows project conventions
3. Use the logger package instead of `console.log`
4. Ensure all apps build successfully before creating PRs