// Automatically use production URL when built, otherwise localhost
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://tilmide.ma/api' : 'http://localhost:5000/api');

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
        if (!res.ok) throw new Error(await res.text());
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
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },

    // Add other methods (put, delete) as needed
};
