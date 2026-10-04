// Automatically use production URL when built, otherwise localhost
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://tilmide.ma/api' : 'http://localhost:5000/api');

// Uploaded files (course videos, library PDFs) come back from the API as
// root-relative paths (e.g. /api/uploads/documents/xxx.pdf). In production
// the frontend and API share the same origin so that resolves on its own,
// but in local dev the frontend runs on a different port than the API —
// resolve explicitly against the API's origin so links/players work in both.
export const resolveFileUrl = (path: string | null | undefined): string => {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  return `${new URL(API_URL).origin}${path}`;
};

export interface ApiError extends Error {
  status?: number;
  retryAfterSeconds?: number;
}

// Whole minutes to wait, for a message like "réessayez dans 15 minutes".
export const rateLimitMinutes = (seconds?: number): number => Math.max(1, Math.ceil((seconds ?? 60) / 60));

// Attaches the HTTP status to the thrown Error (in addition to the existing
// .message text) so callers can distinguish e.g. invalid credentials (400)
// from rate-limiting (429) without parsing response bodies. Purely additive —
// .message keeps its previous shape, so existing catch blocks are unaffected.
const throwApiError = async (res: Response): Promise<never> => {
  const text = await res.text();
  let body: { retryAfterSeconds?: number } | null = null;
  try { body = JSON.parse(text); } catch { /* not JSON */ }
  const err: ApiError = new Error(text);
  err.status = res.status;
  err.retryAfterSeconds = body?.retryAfterSeconds ?? (Number(res.headers.get('Retry-After')) || undefined);
  throw err;
};

export const api = {
    get: async (endpoint: string) => {
        const token = localStorage.getItem('token');
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`${API_URL}${endpoint}`, {
            method: 'GET',
            headers,
        });
        if (!res.ok) return throwApiError(res);
        return res.json();
    },

    post: async (endpoint: string, body: any) => {
        const token = localStorage.getItem('token');
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
        });
        if (!res.ok) return throwApiError(res);
        return res.json();
    },

    delete: async (endpoint: string) => {
        const token = localStorage.getItem('token');
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`${API_URL}${endpoint}`, {
            method: 'DELETE',
            headers,
        });
        if (!res.ok) return throwApiError(res);
        return res.json();
    },
};
