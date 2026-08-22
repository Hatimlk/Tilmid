
import { api } from '../lib/api';
import { Student, Appointment, SuccessStory, StudyResource, ContactMessage } from '../types';

// The backend stores/returns the students table's avatar_url column as-is;
// the frontend Student type uses `avatar`. Normalize here so <img src={student.avatar}>
// doesn't silently render a broken image everywhere a student record is read.
const mapStudent = (s: any): Student => (s ? { ...s, avatar: s.avatar ?? s.avatar_url } : s);

export const dataManager = {
  // --- Initialization ---
  init: async () => {
    console.log("DataManager Initialized with MySQL API");
  },



  // --- Students ---
  getStudents: async (): Promise<Student[]> => {
    const students = await api.get('/students');
    return students.map(mapStudent);
  },

  loginStudent: async (username: string, password: string): Promise<{ token: string; user: Student }> => {
    const res = await api.post('/students/login', { username, password });
    return { ...res, user: mapStudent(res.user) };
  },

  saveStudent: async (student: Student): Promise<void> => {
    await api.post('/students', student);
  },

  deleteStudent: async (id: string): Promise<void> => {
    await api.delete(`/students/${id}`);
  },

  // --- Appointments ---
  getAppointments: async (): Promise<Appointment[]> => {
    return await api.get('/appointments');
  },

  saveAppointment: async (app: Appointment): Promise<void> => {
    await api.post('/appointments', app);
  },

  updateAppointmentStatus: async (id: number, status: Appointment['status']): Promise<void> => {
    await api.post('/appointments', { id, status });
  },

  deleteAppointment: async (id: string | number): Promise<void> => {
    await api.delete(`/appointments/${id}`);
  },

  // --- Stories ---
  getStories: async (): Promise<SuccessStory[]> => {
    return await api.get('/stories');
  },

  saveStory: async (story: SuccessStory): Promise<void> => {
    await api.post('/stories', story);
  },

  deleteStory: async (id: number | string): Promise<void> => {
    await api.delete(`/stories/${id}`);
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
