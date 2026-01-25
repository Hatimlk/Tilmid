import { db } from '../lib/firebase';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { BlogPost, Student, Appointment, SuccessStory, StudyResource, ContactMessage } from '../types';
import { BLOG_POSTS } from '../constants';

const COLLECTIONS = {
  POSTS: 'posts',
  STUDENTS: 'students',
  APPOINTMENTS: 'appointments',
  STORIES: 'stories',
  RESOURCES: 'resources',
  MESSAGES: 'messages'
};

export const dataManager = {
  // --- Initialization (Migration Helper) ---
  init: async () => {
    // In a real app, we might check if DB is empty and seed it.
    // For now, we can leave this empty or implement a one-time seed function invoked manually.
    console.log("DataManager Initialized with Firestore");
  },

  // --- Posts ---
  getPosts: async (): Promise<BlogPost[]> => {
    const q = query(collection(db, COLLECTIONS.POSTS), orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as BlogPost));
  },

  savePost: async (post: BlogPost): Promise<void> => {
    if (post.id) {
      // Update existing
      const docRef = doc(db, COLLECTIONS.POSTS, post.id);
      // Remove id from data to avoid redundancy if stored inside
      const { id, ...data } = post;
      await setDoc(docRef, data, { merge: true });
    } else {
      // Add new
      const { id, ...data } = post; // Ignore empty ID
      await addDoc(collection(db, COLLECTIONS.POSTS), {
        ...data,
        createdAt: new Date().toISOString()
      });
    }
  },

  deletePost: async (id: string): Promise<void> => {
    await deleteDoc(doc(db, COLLECTIONS.POSTS, id));
  },

  // --- Students ---
  getStudents: async (): Promise<Student[]> => {
    const snapshot = await getDocs(collection(db, COLLECTIONS.STUDENTS));
    return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Student));
  },

  saveStudent: async (student: Student): Promise<void> => {
    if (student.id) {
      const docRef = doc(db, COLLECTIONS.STUDENTS, student.id);
      const { id, ...data } = student;
      await setDoc(docRef, data, { merge: true });
    } else {
      await addDoc(collection(db, COLLECTIONS.STUDENTS), student);
    }
  },

  deleteStudent: async (id: string): Promise<void> => {
    await deleteDoc(doc(db, COLLECTIONS.STUDENTS, id));
  },

  // --- Appointments ---
  getAppointments: async (): Promise<Appointment[]> => {
    const snapshot = await getDocs(collection(db, COLLECTIONS.APPOINTMENTS));
    return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Appointment)); // Type assertion might need adjustment if IDs are numbers vs strings
  },

  saveAppointment: async (app: Appointment): Promise<void> => {
    // Ensure ID is string for Firestore or let Firestore gen it
    // For this migration, we'll let Firestore generate valid IDs or use existing ones
    await addDoc(collection(db, COLLECTIONS.APPOINTMENTS), app);
  },

  deleteAppointment: async (id: string | number): Promise<void> => {
    // Ideally use doc ID
    // For migration, we might need to query by numeric ID if that's what we have
    // But let's assume valid doc ID is passed for deletion
    await deleteDoc(doc(db, COLLECTIONS.APPOINTMENTS, String(id)));
  },

  // --- Stories ---
  getStories: async (): Promise<SuccessStory[]> => {
    const snapshot = await getDocs(collection(db, COLLECTIONS.STORIES));
    return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as unknown as SuccessStory));
  },

  saveStory: async (story: SuccessStory): Promise<void> => {
    await addDoc(collection(db, COLLECTIONS.STORIES), story);
  },

  deleteStory: async (id: number | string): Promise<void> => {
    // This is tricky if ID is number. We need to find the doc first.
    // Ideally we migrate to string IDs.
    // For now, let's assume we pass the Firestore Doc ID.
    // If not, we'd need a query. Let's start by assuming we fix the UI to pass strings.
    await deleteDoc(doc(db, COLLECTIONS.STORIES, String(id)));
  },

  // --- Messages ---
  getMessages: async (): Promise<ContactMessage[]> => {
    const snapshot = await getDocs(collection(db, COLLECTIONS.MESSAGES));
    return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as ContactMessage));
  },

  saveMessage: async (msg: ContactMessage): Promise<void> => {
    await addDoc(collection(db, COLLECTIONS.MESSAGES), msg);
  },

  // --- Resources ---
  getResources: async (): Promise<StudyResource[]> => {
    // For V1 we might just keep using the constant SEED if we don't want to migrate them yet
    // Or fetch them. Let's fetch.
    const snapshot = await getDocs(collection(db, COLLECTIONS.RESOURCES));
    if (snapshot.empty) return []; // Or return seed if empty?
    return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as StudyResource));
  }
};
