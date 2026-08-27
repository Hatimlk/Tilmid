// Automatically use production URL when built, otherwise localhost
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://tilmide.ma/api' : 'http://localhost:5000/api');

export interface ApiError extends Error {
  status?: number;
}

// Attaches the HTTP status to the thrown Error (in addition to the existing
// .message text) so callers can distinguish e.g. invalid credentials (400)
// from rate-limiting (429) without parsing response bodies. Purely additive —
// .message keeps its previous shape, so existing catch blocks are unaffected.
const throwApiError = async (res: Response): Promise<never> => {
  const text = await res.text();
  const err: ApiError = new Error(text);
  err.status = res.status;
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
