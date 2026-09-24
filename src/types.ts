
import { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  isButton?: boolean;
  subItems?: NavItem[];
}

export interface ServiceFeature {
  title: string;
  description: string;
  icon: LucideIcon;
  highlight?: boolean;
}


export interface StudyResource {
  id: string;
  title: string;
  subject: string;
  type: 'summary' | 'exam' | 'formula';
  url: string;
  fileSize: string;
  downloadCount: number;
  iconName: string;
}

export interface CourseModule {
  id: number;
  slug: string;
  title: string;
  description: string;
  position: number;
  videoUrl: string | null;
  videoSource: 'link' | 'upload' | null;
}

export interface TimetableTask {
  id: string;
  subject: string;
  startTime: string;
  endTime: string;
  day: string;
}

export interface VideoReel {
  id: string;
  reelId: string;
  thumbnail: string;
  title: string;
  duration: string;
  views: string;
  url: string;
}

export interface ProgramData {
  id: string;
  title: string;
  subtitle: string;
  features: {
    title: string;
    description: string;
    color?: string;
  }[];
  extraTopics?: {
    title: string;
    query: string;
  }[];
  relatedBlogIds?: string[];
}

export interface SuccessStory {
  id: number;
  name: string;
  role: string;
  content: string;
  image: string;
}

export type MouwakabaPackage = 'essentiel' | 'boost' | 'premium';

export type StudentStatus = 'active' | 'pending_activation' | 'suspended' | 'completed' | 'archived';

export interface Student {
  id: string;
  name: string;
  username: string;
  password?: string;
  email?: string;
  grade: string;
  joinDate: string;
  avatar?: string;
  status: StudentStatus;
  /** Active Mouwakaba coaching pack. Absent/null = no coaching pack purchased. */
  package?: MouwakabaPackage | null;
  /** Denormalized coach label, kept in sync with coachId. */
  coachName?: string | null;
  /** Real link to the coaches table (admin `/coaches` module). Null = unassigned. */
  coachId?: number | null;
  stats?: {
    studyHours: number;
    commitmentRate: number;
    weeklyProgress: number[];
  };
}

export interface Appointment {
  id: number;
  studentName: string;
  title: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  type: string;
  /** Links the appointment to a real student record — needed for coaching sessions. */
  studentId?: number | null;
  /** 'coaching' for an individual coaching session; absent/null for a generic rendez-vous. */
  category?: 'coaching' | null;
  /** Admin's post-session notes (coaching sessions only). */
  notes?: string | null;
}

export interface FeedbackEntry {
  id: number;
  studentId: number;
  studentName?: string;
  studentUsername?: string;
  appointmentId?: number | null;
  checkinId?: number | null;
  message: string;
  authorName?: string | null;
  createdAt: string;
}

export interface PlanOverviewRow {
  studentId: number;
  name: string;
  username: string;
  objective: string;
  actions: { id: string; text: string; done: boolean }[];
  habits: string[];
  obstacles: string;
  startDate: string | null;
  updatedAt: string | null;
}

export interface CheckInOverviewRow {
  id: number;
  studentId: number;
  studentName: string;
  studentUsername: string;
  adherence: number | null;
  daysRespected: number | null;
  obstacle: string | null;
  concentration: number | null;
  success: string | null;
  needsAdjustment: boolean;
  createdAt: string;
}

export interface ProgressOverviewRow {
  studentId: number;
  name: string;
  username: string;
  package: MouwakabaPackage | null;
  planActionsTotal: number;
  planActionsDone: number;
  goalsTotal: number;
  goalsAtteints: number;
  revisionsLast7d: number;
  habitCount: number;
  habitConsistencyPct: number | null;
}

export interface StudentNotification {
  id: number;
  student_id: number;
  title: string;
  message: string;
  created_at: string;
  read_at: string | null;
}

export interface NotificationSummary {
  title: string;
  message: string;
  created_at: string;
  recipient_count: number;
  read_count: number;
}

export interface ToolOption {
  id: number;
  category: 'subject' | 'technique';
  label: string;
  position: number;
}

export interface PlatformSettings {
  contact_phone: string;
  contact_email: string;
  whatsapp_number: string;
  instagram_url: string;
  tiktok_url: string;
  facebook_url: string;
  youtube_url: string;
}

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: 'user' | 'admin';
  created_at: string;
}

export interface Coach {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  specialty: string | null;
  status: 'active' | 'inactive';
  studentCount: number;
  createdAt: string;
}

export interface CoachOverviewRow {
  coachId: number;
  name: string;
  specialty: string | null;
  status: 'active' | 'inactive';
  studentCount: number;
  sessionsLast30d: number;
}

export interface CollectiveSession {
  id: number;
  title: string;
  description: string | null;
  date: string;
  time: string;
  capacity: number | null;
  meetingLink: string | null;
  status: 'scheduled' | 'completed' | 'cancelled';
  registeredCount: number;
  myRegistration?: boolean;
}

export interface CollectiveSessionRegistration {
  id: number;
  sessionId: number;
  studentId: number;
  studentName: string;
  studentUsername: string;
  attended: boolean | null;
  registeredAt: string;
}

export interface ActivityEntry {
  id: number;
  actor_name: string;
  action: string;
  entity_type: string;
  entity_label: string;
  meta: Record<string, any> | null;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email?: string;
  phone: string;
  type: string;
  message: string;
  created_at: string;
  status: 'new' | 'read' | 'archived';
}

export interface CoachingRequest {
  id: string;
  name: string;
  phone: string;
  grade: string;
  status: 'new' | 'contacted' | 'enrolled' | 'archived';
  date: string;
}

export interface OrientationRequest {
  id: string;
  name: string;
  phone: string;
  filiere: string;
  schoolType: string;
  city: string;
  bacYear: string;
  regionalGrade: string;
  pack: string;
  status: 'new' | 'contacted' | 'enrolled' | 'archived';
  date: string;
}
