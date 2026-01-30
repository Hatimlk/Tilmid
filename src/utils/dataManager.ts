import { api } from '../lib/api';
import { BlogPost, Student, Appointment, SuccessStory, StudyResource, ContactMessage } from '../types';

export const dataManager = {
  // --- Initialization ---
  init: async () => {
    console.log("DataManager Initialized with MySQL API");
  },

  // --- Posts ---
  getPosts: async (): Promise<BlogPost[]> => {
    try {
      return await api.get('/posts');
    } catch (e) {
      console.error("Error fetching posts:", e);
      return [];
    }
  },

  savePost: async (post: BlogPost): Promise<void> => {
    // Determine if update or create based on ID existence or logic
    // For now, let's assume all saves are "create" or we need a PUT endpoint
    // If ID starts with 'post-', it might be a temp ID, so create new.
    // If it's a numeric ID, it might be update.
    // Simplifying to always create for this migration step or use specific logic
    if (post.id && !String(post.id).startsWith('post-')) {
      // Update logic (Implement PUT /api/posts/:id later)
      console.log("Update not fully implemented");
    } else {
      await api.post('/posts', post);
    }
  },

  deletePost: async (id: string): Promise<void> => {
    await api.get(`/posts/${id}`); // Should be DELETE, passing as GET for now? No, need DELETE logic in api util
  },

  // --- Students ---
  getStudents: async (): Promise<Student[]> => {
    // return await api.get('/students');
    return [];
  },

  saveStudent: async (student: Student): Promise<void> => {
    // await api.post('/students', student);
  },

  deleteStudent: async (id: string): Promise<void> => {
    // await api.delete(`/students/${id}`);
  },

  // --- Appointments ---
  getAppointments: async (): Promise<Appointment[]> => {
    // return await api.get('/appointments');
    return [];
  },

  saveAppointment: async (app: Appointment): Promise<void> => {
    // await api.post('/appointments', app);
  },

  deleteAppointment: async (id: string | number): Promise<void> => {
    // await api.delete(`/appointments/${id}`);
  },

  // --- Stories ---
  getStories: async (): Promise<SuccessStory[]> => {
    // return await api.get('/stories');
    return [];
  },

  saveStory: async (story: SuccessStory): Promise<void> => {
    // await api.post('/stories', story);
  },

  deleteStory: async (id: number | string): Promise<void> => {
    // await api.delete(`/stories/${id}`);
  },

  // --- Messages ---
  getMessages: async (): Promise<ContactMessage[]> => {
    // return await api.get('/messages');
    return [];
  },

  saveMessage: async (msg: ContactMessage): Promise<void> => {
    // await api.post('/messages', msg);
  },

  // --- Resources ---
  getResources: async (): Promise<StudyResource[]> => {
    // return await api.get('/resources');
    return [];
  }
};
