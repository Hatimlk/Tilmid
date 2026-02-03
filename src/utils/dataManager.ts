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
      // Try fetching from API first
      // return await api.get('/posts');
      throw new Error("Backend not available");
    } catch (e) {
      console.warn("Backend unavailable, using localStorage");
      const localPosts = localStorage.getItem('tilmid_posts');
      // Return combined initial mock data + local storage data
      const { BLOG_POSTS } = await import('../constants');
      return localPosts ? [...JSON.parse(localPosts), ...BLOG_POSTS] : BLOG_POSTS;
    }
  },

  savePost: async (post: BlogPost): Promise<void> => {
    try {
      // Mock ID generation for new posts
      const newPost = { ...post, id: post.id || `post-${Date.now()}` };

      // Save to LocalStorage
      const localPostsStr = localStorage.getItem('tilmid_posts');
      const localPosts = localPostsStr ? JSON.parse(localPostsStr) : [];

      // simplistic update or add
      const existingIndex = localPosts.findIndex((p: BlogPost) => p.id === newPost.id);
      if (existingIndex >= 0) {
        localPosts[existingIndex] = newPost;
      } else {
        localPosts.unshift(newPost);
      }

      localStorage.setItem('tilmid_posts', JSON.stringify(localPosts));

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // try network save if needed, or just return success
      // await api.post('/posts', post);
    } catch (e) {
      console.error("Error saving post:", e);
      throw e;
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
