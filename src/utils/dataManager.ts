
import { api } from '../lib/api';
import {
  Student, Appointment, SuccessStory, StudyResource, ContactMessage, ActivityEntry,
  FeedbackEntry, PlanOverviewRow, CheckInOverviewRow, ProgressOverviewRow,
  CollectiveSession, CollectiveSessionRegistration, Coach, CoachOverviewRow, AdminUser, PlatformSettings, ToolOption,
  StudentNotification, NotificationSummary,
} from '../types';

// The backend stores/returns the students table's avatar_url / coach_name / join_date
// columns as-is; the frontend Student type uses `avatar` / `coachName` / `joinDate`.
// Normalize here so every reader gets consistent field names without repeating this mapping.
const mapStudent = (s: any): Student => (s ? {
  ...s,
  avatar: s.avatar ?? s.avatar_url,
  coachName: s.coachName ?? s.coach_name ?? null,
  coachId: s.coachId ?? s.coach_id ?? null,
  joinDate: s.joinDate ?? s.join_date,
} : s);

const mapCoach = (c: any): Coach => ({
  id: c.id,
  name: c.name,
  email: c.email,
  phone: c.phone,
  specialty: c.specialty,
  status: c.status,
  studentCount: Number(c.student_count) || 0,
  createdAt: c.created_at,
});

const mapCoachOverview = (c: any): CoachOverviewRow => ({
  coachId: c.coach_id,
  name: c.name,
  specialty: c.specialty,
  status: c.status,
  studentCount: Number(c.student_count) || 0,
  sessionsLast30d: Number(c.sessions_last_30d) || 0,
});

// Same idea for appointments: the DB/API return snake_case columns (student_name,
// student_id) but the frontend Appointment type is camelCase.
const mapAppointment = (a: any): Appointment => (a ? {
  ...a,
  studentName: a.studentName ?? a.student_name ?? a.student_full_name,
  studentId: a.studentId ?? a.student_id ?? null,
  category: a.category ?? null,
  notes: a.notes ?? null,
} : a);

const mapFeedback = (f: any): FeedbackEntry => ({
  id: f.id,
  studentId: f.student_id,
  studentName: f.name,
  studentUsername: f.username,
  appointmentId: f.appointment_id,
  message: f.message,
  authorName: f.author_name,
  createdAt: f.created_at,
});

const mapPlanOverview = (p: any): PlanOverviewRow => ({
  studentId: p.student_id,
  name: p.name,
  username: p.username,
  objective: p.objective || '',
  actions: p.actions || [],
  updatedAt: p.updated_at,
});

const mapCheckInOverview = (c: any): CheckInOverviewRow => ({
  id: c.id,
  studentId: c.student_id,
  studentName: c.name,
  studentUsername: c.username,
  adherence: c.adherence,
  daysRespected: c.days_respected,
  obstacle: c.obstacle,
  concentration: c.concentration,
  success: c.success,
  needsAdjustment: !!c.needs_adjustment,
  createdAt: c.created_at,
});

const mapProgressOverview = (p: any): ProgressOverviewRow => ({
  studentId: p.studentId,
  name: p.name,
  username: p.username,
  package: p.package,
  planActionsTotal: p.planActionsTotal,
  planActionsDone: p.planActionsDone,
  goalsTotal: p.goalsTotal,
  goalsAtteints: p.goalsAtteints,
  revisionsLast7d: p.revisionsLast7d,
  habitCount: p.habitCount,
  habitConsistencyPct: p.habitConsistencyPct,
});

const mapCollectiveSession = (s: any): CollectiveSession => ({
  id: s.id,
  title: s.title,
  description: s.description,
  date: s.date,
  time: s.time,
  capacity: s.capacity,
  meetingLink: s.meeting_link,
  status: s.status,
  registeredCount: Number(s.registered_count) || 0,
  myRegistration: !!Number(s.my_registration ?? 0),
});

const mapCollectiveSessionRegistration = (r: any): CollectiveSessionRegistration => ({
  id: r.id,
  sessionId: r.session_id,
  studentId: r.student_id,
  studentName: r.name,
  studentUsername: r.username,
  attended: r.attended === null ? null : !!Number(r.attended),
  registeredAt: r.registered_at,
});

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

  // --- Notifications (admin "Notifications" — in-app student notifications) ---
  sendNotification: async (payload: { title: string; message: string; target: { studentId?: number | string } | { package: 'essentiel' | 'boost' | 'premium' } | { all: true } }): Promise<{ message: string; recipients: number }> => {
    return await api.post('/notifications', payload);
  },
  getNotifications: async (): Promise<StudentNotification[]> => {
    return await api.get('/notifications');
  },
  markNotificationRead: async (id: number | string): Promise<void> => {
    await api.post(`/notifications/${id}/read`, {});
  },
  getAdminNotifications: async (): Promise<NotificationSummary[]> => {
    return await api.get('/admin/notifications');
  },

  // --- Tool options (admin "Outils" — subjects/techniques dropdowns) ---
  getToolOptions: async (): Promise<ToolOption[]> => {
    return await api.get('/tool-options');
  },
  saveToolOption: async (option: { id?: number; category: 'subject' | 'technique'; label: string; position?: number }): Promise<{ id: number; message: string }> => {
    return await api.post('/tool-options', option);
  },
  deleteToolOption: async (id: number | string): Promise<void> => {
    await api.delete(`/tool-options/${id}`);
  },

  // --- Platform settings (admin "Paramètres") ---
  getSettings: async (): Promise<PlatformSettings> => {
    return await api.get('/settings');
  },
  saveSettings: async (settings: {
    contactPhone: string; contactEmail: string; whatsappNumber: string;
    instagramUrl: string; tiktokUrl: string; facebookUrl: string; youtubeUrl: string;
  }): Promise<{ message: string }> => {
    return await api.post('/settings', settings);
  },

  // --- Users (admin "Utilisateurs & rôles") ---
  getUsers: async (): Promise<AdminUser[]> => {
    return await api.get('/users');
  },
  saveUser: async (user: { id?: number; username: string; email: string; password?: string; role: 'user' | 'admin' }): Promise<{ id: number; message: string }> => {
    return await api.post('/users', user);
  },
  deleteUser: async (id: number | string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  // --- Coaches ---
  getCoaches: async (): Promise<Coach[]> => {
    const coaches = await api.get('/coaches');
    return coaches.map(mapCoach);
  },
  saveCoach: async (coach: { id?: number; name: string; email?: string | null; phone?: string | null; specialty?: string | null; status?: 'active' | 'inactive' }): Promise<{ id: number; message: string }> => {
    return await api.post('/coaches', coach);
  },
  deleteCoach: async (id: number | string): Promise<void> => {
    await api.delete(`/coaches/${id}`);
  },
  getCoachesOverview: async (): Promise<CoachOverviewRow[]> => {
    const rows = await api.get('/admin/coaches-overview');
    return rows.map(mapCoachOverview);
  },

  // --- Appointments ---
  getAppointments: async (): Promise<Appointment[]> => {
    const appointments = await api.get('/appointments');
    return appointments.map(mapAppointment);
  },

  saveAppointment: async (app: Partial<Appointment>): Promise<void> => {
    await api.post('/appointments', app);
  },

  updateAppointmentStatus: async (id: number, status: Appointment['status']): Promise<void> => {
    await api.post('/appointments', { id, status });
  },

  deleteAppointment: async (id: string | number): Promise<void> => {
    await api.delete(`/appointments/${id}`);
  },

  // --- Coaching sessions (appointments tagged category='coaching') ---
  getCoachingSessions: async (studentId?: string | number): Promise<Appointment[]> => {
    const sessions = await api.get(`/coaching-sessions${studentId ? `?studentId=${studentId}` : ''}`);
    return sessions.map(mapAppointment);
  },

  // --- Feedback ---
  getFeedback: async (studentId?: string | number): Promise<FeedbackEntry[]> => {
    const entries = await api.get(`/feedback${studentId ? `?studentId=${studentId}` : ''}`);
    return entries.map(mapFeedback);
  },
  getAdminFeedback: async (): Promise<FeedbackEntry[]> => {
    const entries = await api.get('/admin/feedback');
    return entries.map(mapFeedback);
  },
  saveFeedback: async (feedback: { studentId: number | string; message: string; appointmentId?: number | null }): Promise<{ id: number; message: string }> => {
    return await api.post('/feedback', feedback);
  },

  // --- Admin cross-student overviews (Plans, Check-ins, Progression) ---
  getAdminPlans: async (): Promise<PlanOverviewRow[]> => {
    const rows = await api.get('/admin/plans');
    return rows.map(mapPlanOverview);
  },
  getAdminCheckins: async (): Promise<CheckInOverviewRow[]> => {
    const rows = await api.get('/admin/checkins');
    return rows.map(mapCheckInOverview);
  },
  getAdminProgressOverview: async (): Promise<ProgressOverviewRow[]> => {
    const rows = await api.get('/admin/progress-overview');
    return rows.map(mapProgressOverview);
  },

  // --- Collective sessions (Sessions collectives) ---
  getCollectiveSessions: async (): Promise<CollectiveSession[]> => {
    const rows = await api.get('/collective-sessions');
    return rows.map(mapCollectiveSession);
  },
  saveCollectiveSession: async (session: {
    id?: number; title: string; description?: string | null; date: string; time: string;
    capacity?: number | null; meetingLink?: string | null; status?: CollectiveSession['status'];
  }): Promise<{ id: number; message: string }> => {
    return await api.post('/collective-sessions', session);
  },
  deleteCollectiveSession: async (id: number | string): Promise<void> => {
    await api.delete(`/collective-sessions/${id}`);
  },
  getCollectiveSessionRegistrations: async (id: number | string): Promise<CollectiveSessionRegistration[]> => {
    const rows = await api.get(`/collective-sessions/${id}/registrations`);
    return rows.map(mapCollectiveSessionRegistration);
  },
  registerForCollectiveSession: async (id: number | string): Promise<void> => {
    await api.post(`/collective-sessions/${id}/register`, {});
  },
  unregisterFromCollectiveSession: async (id: number | string): Promise<void> => {
    await api.delete(`/collective-sessions/${id}/register`);
  },
  setCollectiveSessionAttendance: async (id: number | string, studentId: number | string, attended: boolean): Promise<void> => {
    await api.post(`/collective-sessions/${id}/attendance`, { studentId, attended });
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

  // --- Activity log ---
  getActivity: async (): Promise<ActivityEntry[]> => {
    return await api.get('/activity');
  },

  // --- Coaching Requests ---
  getCoachingRequests: async (): Promise<any[]> => {
    return await api.get('/coaching-requests');
  },

  saveCoachingRequest: async (request: { name: string; phone: string; grade: string }): Promise<void> => {
    await api.post('/coaching-requests', request);
  },

  // --- Orientation Requests ---
  getOrientationRequests: async (): Promise<any[]> => {
    return await api.get('/orientation-requests');
  },

  saveOrientationRequest: async (request: {
    name: string;
    phone: string;
    filiere: string;
    city: string;
    bacYear: string;
    regionalGrade: string;
    pack: string;
  }): Promise<void> => {
    await api.post('/orientation-requests', request);
  },

  // --- Student modules (Mon Plan, Mes outils, Check-ins, Planning) ---
  // Every getter accepts an optional studentId: omitted for a student reading
  // their own data (scoped by their token), passed by the admin to read a
  // given student's data (read-only there — admin never calls the setters).
  getPlan: async (studentId?: string): Promise<any> => {
    return await api.get(`/plan${studentId ? `?studentId=${studentId}` : ''}`);
  },
  savePlan: async (plan: { objective: string; startDate: string; obstacles: string; actions: any[]; habits: string[] }): Promise<any> => {
    return await api.post('/plan', plan);
  },

  getGoals: async (studentId?: string): Promise<any[]> => {
    return await api.get(`/goals${studentId ? `?studentId=${studentId}` : ''}`);
  },
  saveGoal: async (goal: any): Promise<{ id: number; message: string }> => {
    return await api.post('/goals', goal);
  },
  deleteGoal: async (id: string | number): Promise<void> => {
    await api.delete(`/goals/${id}`);
  },

  getRevisions: async (studentId?: string): Promise<any[]> => {
    return await api.get(`/revisions${studentId ? `?studentId=${studentId}` : ''}`);
  },
  saveRevision: async (session: any): Promise<{ id: number; message: string }> => {
    return await api.post('/revisions', session);
  },
  deleteRevision: async (id: string | number): Promise<void> => {
    await api.delete(`/revisions/${id}`);
  },

  getHabits: async (studentId?: string): Promise<any[]> => {
    return await api.get(`/habits${studentId ? `?studentId=${studentId}` : ''}`);
  },
  saveHabit: async (habit: any): Promise<{ id: number; message: string }> => {
    return await api.post('/habits', habit);
  },
  deleteHabit: async (id: string | number): Promise<void> => {
    await api.delete(`/habits/${id}`);
  },

  getCheckIns: async (studentId?: string): Promise<any[]> => {
    return await api.get(`/checkins${studentId ? `?studentId=${studentId}` : ''}`);
  },
  saveCheckIn: async (checkIn: any): Promise<{ id: number; message: string }> => {
    return await api.post('/checkins', checkIn);
  },

  getTimetable: async (studentId?: string): Promise<any[]> => {
    return await api.get(`/timetable${studentId ? `?studentId=${studentId}` : ''}`);
  },
  saveTimetableTask: async (task: any): Promise<{ id: number; message: string }> => {
    return await api.post('/timetable', task);
  },
  deleteTimetableTask: async (id: string | number): Promise<void> => {
    await api.delete(`/timetable/${id}`);
  },

  // --- Uploads ---
  // kind: 'document' (PDF/DOC/DOCX, e.g. Bibliothèque resources — default) or
  // 'video' (MP4/WEBM/MOV, course module videos). Admin only on the server.
  uploadFile: async (file: File, kind: 'document' | 'video' = 'document'): Promise<{ url: string; size: number }> => {
    const formData = new FormData();
    formData.append('file', file);

    // We can't use the standard api wrapper here because it sets Content-Type to JSON
    // We need to let the browser set the multipart boundary
    const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://tilmide.ma/api' : 'http://localhost:5000/api');
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_URL}/upload?kind=${kind}`, {
      method: 'POST',
      headers,
      body: formData
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(text || 'File upload failed');
    }

    return await res.json();
  },

  // --- Course modules ("Mes contenus") ---
  getCourseModules: async (): Promise<any[]> => {
    return await api.get('/course-modules');
  },
  saveCourseModuleVideo: async (id: number | string, body: { videoUrl: string | null; videoSource: 'link' | 'upload' | null }): Promise<void> => {
    await api.post(`/course-modules/${id}`, body);
  },
  createCourseModule: async (body: { title: string; description?: string }): Promise<any> => {
    return await api.post('/course-modules', body);
  },
  updateCourseModuleDetails: async (id: number | string, body: { title: string; description?: string }): Promise<void> => {
    await api.post(`/course-modules/${id}/details`, body);
  },
  deleteCourseModule: async (id: number | string): Promise<void> => {
    await api.delete(`/course-modules/${id}`);
  },

  // --- Library resources (documents) ---
  saveResource: async (resource: { title: string; type: string; url: string; subject: string; fileSize?: string | null; iconName?: string | null }): Promise<{ id: number; message: string }> => {
    return await api.post('/resources', resource);
  },
  deleteResource: async (id: string | number): Promise<void> => {
    await api.delete(`/resources/${id}`);
  },
};
