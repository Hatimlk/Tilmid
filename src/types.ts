
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

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  category: string;
  image: string;
  excerpt: string;
  content?: string;
  html?: string;
  status?: 'published' | 'draft';
  views?: number;
  readingTime?: string;
  author?: {
    name: string;
    avatar: string;
  };
  sections?: {
    title: string;
    content: string;
    list?: { t: string; d: string; }[];
  }[];
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

export interface Student {
  id: string;
  name: string;
  username: string;
  password?: string;
  grade: string;
  joinDate: string;
  avatar?: string;
  status: 'active' | 'suspended';
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
  status: 'pending' | 'confirmed' | 'cancelled';
  type: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  type: string;
  message: string;
  date: string;
  status: 'new' | 'read';
}
