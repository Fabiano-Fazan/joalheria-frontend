import { API_URL } from '../config';

type RequestOptions = RequestInit & {
  query?: Record<string, string | number | boolean | undefined | null>;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: unknown,
  ) {
    super(message);
  }
}

const buildUrl = (path: string, query?: RequestOptions['query']) => {
  const url = new URL(`${API_URL}${path}`);
  Object.entries(query || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { query, headers, ...init } = options;
  const safeHeaders = new Headers(headers);

  if (init.body instanceof FormData) {
    safeHeaders.delete('Content-Type');
    safeHeaders.delete('content-type');
  }

  const response = await fetch(buildUrl(path, query), {
    credentials: 'include',
    headers: safeHeaders,
    ...init,
  });

  if (!response.ok) {
    let details: unknown;
    try {
      details = await response.json();
    } catch {
      details = await response.text().catch(() => undefined);
    }
    throw new ApiError(`API request failed: ${path}`, response.status, details);
  }

  if (response.status === 204) return undefined as T;

  const responseText = await response.text();
  if (!responseText) return undefined as T;

  return JSON.parse(responseText) as T;
}

export function jsonHeaders() {
  return { 'Content-Type': 'application/json' };
}
