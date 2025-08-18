/**
 * API client helper for authenticated requests
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export interface ApiClientOptions extends RequestInit {
  skipAuth?: boolean;
}

/**
 * Make an authenticated API request
 */
export async function apiClient(
  endpoint: string,
  options: ApiClientOptions = {}
): Promise<Response> {
  const { skipAuth = false, headers = {}, ...fetchOptions } = options;

  // Build full URL
  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;

  // Build headers
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };

  // Add API key if available and not skipped
  if (API_KEY && !skipAuth) {
    requestHeaders['x-api-key'] = API_KEY;
  }

  // Make the request
  const response = await fetch(url, {
    ...fetchOptions,
    headers: requestHeaders,
  });

  // Handle unauthorized responses
  if (response.status === 401) {
    console.error('API request unauthorized. Check NEXT_PUBLIC_API_KEY environment variable.');
  }

  return response;
}

/**
 * Make an authenticated GET request
 */
export async function apiGet<T>(endpoint: string): Promise<T> {
  const response = await apiClient(endpoint, { method: 'GET' });
  
  if (!response.ok) {
    throw new Error(`API GET request failed: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Make an authenticated POST request
 */
export async function apiPost<T>(endpoint: string, data?: unknown): Promise<T> {
  const response = await apiClient(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
  
  if (!response.ok) {
    throw new Error(`API POST request failed: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Make an authenticated PUT request
 */
export async function apiPut<T>(endpoint: string, data?: unknown): Promise<T> {
  const response = await apiClient(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
  
  if (!response.ok) {
    throw new Error(`API PUT request failed: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Make an authenticated DELETE request
 */
export async function apiDelete<T>(endpoint: string): Promise<T> {
  const response = await apiClient(endpoint, { method: 'DELETE' });
  
  if (!response.ok) {
    throw new Error(`API DELETE request failed: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Get WebSocket URL with authentication
 */
export function getAuthenticatedWebSocketUrl(path: string): string {
  const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';
  const baseUrl = path.startsWith('ws') ? path : `${WS_URL}${path}`;
  
  // Add API key as query parameter for WebSocket connections
  if (API_KEY) {
    const url = new URL(baseUrl);
    url.searchParams.set('apiKey', API_KEY);
    return url.toString();
  }
  
  return baseUrl;
}

/**
 * Get Socket.io connection options with authentication
 */
export function getSocketIOOptions() {
  return {
    auth: API_KEY ? { apiKey: API_KEY } : {},
    extraHeaders: API_KEY ? { 'x-api-key': API_KEY } : {},
  };
}