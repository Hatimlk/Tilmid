
import { api } from '../lib/api';
import { BlogPost, Student, Appointment, SuccessStory, StudyResource, ContactMessage } from '../types';

export const dataManager = {
  // --- Initialization ---
  init: async () => {
    console.log("DataManager Initialized with MySQL API");
  },

  // --- Posts ---
  getPosts: async (): Promise<BlogPost[]> => {
    return await api.get('/posts');
  },

  savePost: async (post: BlogPost): Promise<void> => {
    await api.post('/posts', post);
  },

  deletePost: async (id: string): Promise<void> => {
    // Assuming api.delete is implemented or using a different method if strictly following previous pattern
    // But typically a REST API uses DELETE. 
    // The api lib provided earlier only had get/post. I should probably add delete to it or use fetch directly if needed.
    // For now, I'll stick to what I saw in api.ts, but `deletePost` in the previous mock was calling `api.get`.
    // I'll assume we need to fix api.ts as well to support delete, or use a custom fetch here.
    // Let's check api.ts again in next step if it supports DELETE.
    // For now, I will use a direct fetch or assume api.delete exists/will exist.
    // The previous code had: // Add other methods (put, delete) as needed
    // So I should effectively implement api.delete in api.ts as well.
    const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://tilmide.ma/api' : 'http://localhost:5000/api');
    const token = localStorage.getItem('token');
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_URL}/posts/${id}`, { method: 'DELETE', headers });
    if (!res.ok) throw new Error(await res.text());
  },

  // --- Students ---
  getStudents: async (): Promise<Student[]> => {
    return await api.get('/students');
  },

  saveStudent: async (student: Student): Promise<void> => {
    await api.post('/students', student);
  },

  deleteStudent: async (id: string): Promise<void> => {
    // Direct fetch pending api.delete implementation
    const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://tilmide.ma/api' : 'http://localhost:5000/api');
    const token = localStorage.getItem('token');
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    await fetch(`${API_URL}/students/${id}`, { method: 'DELETE', headers });
  },

  // --- Appointments ---
  getAppointments: async (): Promise<Appointment[]> => {
    return await api.get('/appointments');
  },

  saveAppointment: async (app: Appointment): Promise<void> => {
    await api.post('/appointments', app);
  },

  deleteAppointment: async (id: string | number): Promise<void> => {
    const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://tilmide.ma/api' : 'http://localhost:5000/api');
    const token = localStorage.getItem('token');
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    await fetch(`${API_URL}/appointments/${id}`, { method: 'DELETE', headers });
  },

  // --- Stories ---
  getStories: async (): Promise<SuccessStory[]> => {
    return await api.get('/stories');
  },

  saveStory: async (story: SuccessStory): Promise<void> => {
    await api.post('/stories', story);
  },

  deleteStory: async (id: number | string): Promise<void> => {
    const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://tilmide.ma/api' : 'http://localhost:5000/api');
    const token = localStorage.getItem('token');
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    await fetch(`${API_URL}/stories/${id}`, { method: 'DELETE', headers });
  },

  // --- Messages ---
  getMessages: async (): Promise<ContactMessage[]> => {
    return await api.get('/messages');
  },

  saveMessage: async (msg: ContactMessage): Promise<void> => {
    await api.post('/messages', msg);
  },

  // --- Resources ---
  getResources: async (): Promise<StudyResource[]> => {
    return await api.get('/resources');
  },

  // --- Coaching Requests ---
  getCoachingRequests: async (): Promise<any[]> => {
    return await api.get('/coaching-requests');
  },

  saveCoachingRequest: async (request: { name: string; phone: string; grade: string }): Promise<void> => {
    await api.post('/coaching-requests', request);
  },

  // --- Uploads ---
  uploadFile: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    // We can't use the standard api wrapper here because it sets Content-Type to JSON
    // We need to let the browser set the multipart boundary
    const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://tilmide.ma/api' : 'http://localhost:5000/api');
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers,
      body: formData
    });

    if (!res.ok) {
      throw new Error('File upload failed');
    }

    const data = await res.json();
    return data.url;
  }
};
