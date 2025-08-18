# Simple Authentication Plan for TnyOffice API

This document describes the implemented simple, single-API-key authentication approach that secures all API endpoints (REST and WebSocket) for the TnyOffice prototype. Since the frontend is already protected by Vercel authentication, we only need to secure the communication between the Next.js app and the Node.js API.

1. The Vercel deployment has password protection enabled
2. This is a prototype, not a production application
3. The simplicity outweighs the security concerns for our current needs

⚠️ **SECURITY WARNING**: This is a VERY BASIC authentication approach suitable only for prototypes. The API key is exposed in the browser's JavaScript bundle, making it visible to anyone who inspects the code. We are only accepting this security risk because:

## Current Implementation Status ✅

This authentication system has been **FULLY IMPLEMENTED** as of the latest commit. All components described in this plan are now active in the codebase.

### What's Been Implemented:
- ✅ Authentication middleware for all REST endpoints
- ✅ WebSocket authentication (both Socket.io and native WebSocket)
- ✅ Frontend API client with automatic authentication
- ✅ Environment configuration files
- ✅ CORS configuration for production
- ✅ Development mode with optional authentication

## Overview

This document describes the implemented simple, single-API-key authentication approach that secures all API endpoints (REST and WebSocket) for the TnyOffice prototype. Since the frontend is already protected by Vercel authentication, we only need to secure the communication between the Next.js app and the Node.js API.

## Requirements

- Single shared API key (no multi-user auth needed)
- Secure both REST endpoints and WebSocket connections
- Frontend deployed on Vercel (already protected)
- API deployed on Fly.io
- Must work across different environments (development/production)
- Simple to implement and maintain

## Authentication Strategy

### 1. Pre-shared API Key Authentication

**Approach**: Use a single, shared API key that the frontend includes in all requests to the backend.

**Major Security Limitation**: 
- The API key is exposed in the browser via `NEXT_PUBLIC_API_KEY`
- Anyone can view the key by inspecting the JavaScript source
- This is NOT secure for public-facing applications
- We rely entirely on Vercel's deployment password protection

**Implementation**:
- Generate a secure API key (32+ character random string)
- Store the API key as an environment variable on both frontend and backend
- Frontend includes the key in all requests (visible in browser!)
- Backend validates the key before processing any request

### 2. Environment Variables

**Backend (Fly.io)**:
```bash
API_KEY=your-secure-32-character-api-key-here
```

**Frontend (Vercel)**:
```bash
NEXT_PUBLIC_API_KEY=your-secure-32-character-api-key-here
```

## Implementation Details (COMPLETED)

### Phase 1: Backend Authentication Middleware ✅

1. **Authentication Middleware** (`/apps/api/src/middleware/auth.ts`):
   - Extract API key from request headers
   - Compare with environment variable
   - Return 401 if missing or invalid
   - Allow request to proceed if valid

2. **Apply Middleware to REST Endpoints**:
   - Add middleware to Express app before routes
   - Apply to all `/api/v1/*` endpoints
   - Exclude health check endpoint if needed

3. **Secure WebSocket Connections**:
   - **Socket.io**: Use `auth` middleware in connection handshake
   - **Native WebSocket**: Validate API key in connection upgrade request

### Phase 2: Frontend Integration ✅

1. **API Client Helper** (`/apps/docs/lib/api/client.ts`):
   - ✅ Centralized API key injection
   - ✅ Automatic key addition to all fetch requests
   - ✅ WebSocket authentication helpers

2. **Updated API Calls**:
   - ✅ `comments.ts` uses authenticated client
   - ✅ `DocumentList`, `DocumentViewer`, `DocumentViewerWithComments` updated
   - ✅ `git-sync.ts` uses authenticated requests

3. **WebSocket Connections**:
   - ✅ Automerge provider includes API key in connection URL
   - ✅ Socket.io authentication configured

### Phase 3: Deployment Configuration ✅

1. **Environment Files Created**:
   - ✅ `/apps/api/.env.example` - API configuration template
   - ✅ `/apps/docs/.env.example` - Frontend configuration template

2. **Deployment Instructions**:
   - ✅ Fly.io secrets configuration documented
   - ✅ Vercel environment variables documented
   - ✅ API key generation command included

### Phase 4: Security Enhancements ✅

1. **CORS Configuration**:
   - ✅ Production restricts to `ALLOWED_ORIGINS` environment variable
   - ✅ Development allows all origins for convenience
   - ✅ Configurable per deployment

2. **Request Logging**:
   - ✅ Failed authentication attempts are logged
   - ✅ Includes request IP for monitoring

## Actual Implementation Code

### Backend Middleware (IMPLEMENTED)

```typescript
// /apps/api/src/middleware/auth.ts
export const authenticateRequest = (req: Request, res: Response, next: NextFunction): Response | void => {
  const apiKey = req.headers['x-api-key'] as string;
  const expectedKey = process.env.API_KEY;

  // Skip authentication in development if no API key is set
  if (process.env.NODE_ENV === 'development' && !expectedKey) {
    log.warn('API_KEY not set in development mode - skipping authentication');
    return next();
  }

  if (!apiKey) {
    log.warn(`Authentication failed: No API key provided from ${req.ip}`);
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'API key is required' 
    });
  }

  if (!expectedKey || apiKey !== expectedKey) {
    log.warn(`Authentication failed: Invalid API key from ${req.ip}`);
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'Invalid API key' 
    });
  }

  next();
};
```

### Frontend API Client (IMPLEMENTED)

```typescript
// /apps/docs/lib/api/client.ts
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export async function apiClient(
  endpoint: string,
  options: ApiClientOptions = {}
): Promise<Response> {
  const { skipAuth = false, headers = {}, ...fetchOptions } = options;
  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;

  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (API_KEY && !skipAuth) {
    requestHeaders['x-api-key'] = API_KEY;
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers: requestHeaders,
  });

  if (response.status === 401) {
    console.error('API request unauthorized. Check NEXT_PUBLIC_API_KEY environment variable.');
  }

  return response;
}

// Helper methods: apiGet, apiPost, apiPut, apiDelete
// WebSocket helpers: getAuthenticatedWebSocketUrl, getSocketIOOptions
```

### WebSocket Authentication (IMPLEMENTED)

**Socket.io**:
```typescript
// /apps/api/src/websocket/server.ts
io.use((socket, next) => {
  const apiKey = socket.handshake.auth.apiKey || socket.handshake.headers['x-api-key'];
  
  if (authenticateWebSocket(apiKey)) {
    next();
  } else {
    next(new Error('Unauthorized'));
  }
});
```

**Native WebSocket (Automerge)**:
```typescript
// /apps/api/src/websocket/server.ts
httpServer.on('upgrade', (request: IncomingMessage, socket, head) => {
  const url = new URL(request.url || '', `http://${request.headers.host}`);
  
  if (url.pathname !== '/automerge-sync') {
    return;
  }

  const apiKey = url.searchParams.get('apiKey') || request.headers['x-api-key'] as string;
  
  if (!authenticateWebSocket(apiKey)) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
    return;
  }

  wss!.handleUpgrade(request, socket, head, (ws) => {
    wss!.emit('connection', ws, request);
  });
});
```

## Testing Strategy

1. **Development Testing**:
   - Set API_KEY in `.env` files
   - Test all endpoints with and without key
   - Verify WebSocket connections

2. **Production Testing**:
   - Deploy to staging first
   - Test all functionality with production keys
   - Monitor logs for authentication failures

## Rollback Plan

If issues arise:
1. Remove middleware from routes
2. Deploy without authentication checks
3. Frontend will continue to send keys (no-op)
4. Fix issues and redeploy

## Security Considerations

⚠️ **CRITICAL SECURITY LIMITATIONS**:
1. **API Key is PUBLIC**: Anyone who can access the frontend can see the API key
2. **No Real Security**: This only prevents casual automated attacks
3. **Vercel Password is the ONLY Protection**: Without Vercel's deployment password, anyone could use the API

### Why This is Acceptable (For Now):
- Vercel deployment password protects the frontend
- This is a prototype with limited exposure
- The data is not highly sensitive
- Time-to-implement trumps security for this phase

### What This Prevents:
- Random bots hitting the API
- Accidental exposure if API URL leaks
- Casual unauthorized access

### What This DOESN'T Prevent:
- Anyone with frontend access using the API
- API key extraction from browser
- Replay attacks
- Any serious security threat

### Future Improvements Needed:
1. Move to server-side API calls (API key stays on server)
2. Implement proper user authentication
3. Use short-lived JWT tokens
4. Add rate limiting per user
5. Implement proper session management

## Next Steps

After implementing this basic authentication:
1. Monitor usage and security logs
2. Consider adding user-specific tokens if needed
3. Implement refresh token mechanism if long-lived sessions needed
4. Add more sophisticated rate limiting if required

## Alternative Approaches Considered

1. **JWT Tokens**: Overkill for single-key requirement
2. **OAuth**: Too complex for prototype needs
3. **Basic Auth**: Less flexible than API key approach
4. **mTLS**: Too complex for this use case

## Conclusion

This pre-shared API key approach is a **TEMPORARY SOLUTION** that provides minimal security suitable only for a password-protected prototype. 

**Remember**:
- The API key is visible to anyone who can access the frontend
- Vercel's deployment password is the ONLY real security
- This is NOT suitable for production use
- This is a conscious trade-off of security for simplicity

The approach prevents casual unauthorized access and is acceptable ONLY because the frontend itself is password-protected via Vercel's deployment settings.