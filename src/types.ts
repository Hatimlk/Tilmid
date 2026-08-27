
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
  fileSize: string;
  downloadCount: number;
  iconName: string;
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
  /** Plain-text coach label. No Coach entity yet — see admin `/coaches` module. */
  coachName?: string | null;
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
  city: string;
  bacYear: string;
  regionalGrade: string;
  pack: string;
  status: 'new' | 'contacted' | 'enrolled' | 'archived';
  date: string;
}
