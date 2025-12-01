
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
  content?: string; // Full HTML content
  status?: 'published' | 'draft';
  views?: number;
  author?: {
    name: string;
    avatar: string;
  };
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
  extraTopics?: string[];
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
  password?: string; // Optional for frontend display, required for logic
  grade: string;
  joinDate: string;
  avatar?: string;
  status: 'active' | 'suspended';
  stats?: {
    studyHours: number;
    commitmentRate: number;
    weeklyProgress: number[]; // Array of 7 numbers (0-100) for chart
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
