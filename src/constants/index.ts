
import {
  TrendingUp,
  Target,
  MessageCircle,
  Brain
} from 'lucide-react';
import { ServiceFeature, VideoReel, ProgramData } from '../types';
import { IMAGES } from './images';

export const NAV_ITEMS = [
  { label: "nav.home", href: "/" },
  { label: "nav.tawjih", href: "/tawjih" },
  { label: "nav.coaching", href: "/coaching-offer" },
  { label: "nav.higherSchools", href: "/higher-schools" },
  { label: "nav.studentArea", href: "/student-area", isButton: true }
];

export const MAIN_SERVICES: ServiceFeature[] = [
  {
    title: "تطوير مهارة التلميذ الدراسية",
    description: "عن طريق تقنيات متقدمة ومتطورة في المراجعة من أجل الحصول على نتائج جيدة أثناء المراجعة أو الدراسة.",
    icon: TrendingUp
  },
  {
    title: "تحسين الأداء التعليمي",
    description: "مساعدة التلميذ في تطوير مهاراته من خلال تنظيم الوقت وإعداد برامج مراجعة متقدمة أساسها تقنيات تجعله يستمتع بدراسته.",
    icon: Brain
  },
  {
    title: "تحديد أهداف التلميذ",
    description: "عن طريق استشارات توجيهية مع الأستاذ والمستشار الدراسي بخبرة طويلة في الميدان ومواكبة التلاميذ.",
    icon: Target
  },
  {
    title: "تطوير مهارات الاتصال",
    description: "عن طريق تداريب وتجارب تمكن التلميذ من التفاعل بفعالية مع المحيط والتعبير عن أفكاره وتطوير شخصيته.",
    icon: MessageCircle
  }
];

export const INSTAGRAM_REELS: VideoReel[] = [
  {
    id: '1',
    reelId: 'C7J4pnzC-VR',
    thumbnail: 'https://images.unsplash.com/photo-1544717305-2782549b5136?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    title: 'reels.reel1',
    duration: '0:47',
    views: '125.5K',
    url: 'https://www.instagram.com/reel/C7J4pnzC-VR/'
  },
  {
    id: '2',
    reelId: 'C4ob4c3iLkv',
    thumbnail: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    title: 'reels.reel2',
    duration: '0:27',
    views: '98.2K',
    url: 'https://www.instagram.com/reel/C4ob4c3iLkv/'
  },
  {
    id: '3',
    reelId: 'C6wzMqkrN_x',
    thumbnail: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    title: 'reels.reel3',
    duration: '1:02',
    views: '150.1K',
    url: 'https://www.instagram.com/reel/C6wzMqkrN_x/'
  }
];

// --- ADMIN CREDENTIALS REMOVED FOR SECURITY ---
// Authentication should only be handled via API


// Data from PDF 1 (Tawjih)
export const TAWJIH_DATA: ProgramData = {
  id: 'tawjih',
  title: 'programs.tawjih.title',
  subtitle: 'programs.tawjih.subtitle',
  features: [
    {
      title: 'programs.tawjih.features.0.title',
      description: 'programs.tawjih.features.0.description'
    },
    {
      title: 'programs.tawjih.features.1.title',
      description: 'programs.tawjih.features.1.description'
    },
    {
      title: 'programs.tawjih.features.2.title',
      description: 'programs.tawjih.features.2.description'
    },
    {
      title: 'programs.tawjih.features.3.title',
      description: 'programs.tawjih.features.3.description'
    }
  ],
  extraTopics: [
    { title: 'programs.tawjih.extraTopics.0.title', query: 'programs.tawjih.extraTopics.0.query' },
    { title: 'programs.tawjih.extraTopics.1.title', query: 'programs.tawjih.extraTopics.1.query' },
    { title: 'programs.tawjih.extraTopics.2.title', query: 'programs.tawjih.extraTopics.2.query' }
  ],
  relatedBlogIds: ['9', '10', '11']
};

// Data from PDF 2 (Tilmid)
export const TILMID_DATA: ProgramData = {
  id: 'tilmid',
  title: 'programs.tilmid.title',
  subtitle: 'programs.tilmid.subtitle',
  features: [
    {
      title: 'programs.tilmid.features.0.title',
      description: 'programs.tilmid.features.0.description'
    },
    {
      title: 'programs.tilmid.features.1.title',
      description: 'programs.tilmid.features.1.description'
    },
    {
      title: 'programs.tilmid.features.2.title',
      description: 'programs.tilmid.features.2.description'
    },
    {
      title: 'programs.tilmid.features.3.title',
      description: 'programs.tilmid.features.3.description'
    }
  ],
  extraTopics: [
    { title: 'programs.tilmid.extraTopics.0.title', query: 'programs.tilmid.extraTopics.0.query' },
    { title: 'programs.tilmid.extraTopics.1.title', query: 'programs.tilmid.extraTopics.1.query' },
    { title: 'programs.tilmid.extraTopics.2.title', query: 'programs.tilmid.extraTopics.2.query' }
  ],
  relatedBlogIds: ['6', '8', '1']
};

// Data from PDF 3 (Talib)
export const TALIB_DATA: ProgramData = {
  id: 'talib',
  title: 'programs.talib.title',
  subtitle: 'programs.talib.subtitle',
  features: [
    {
      title: 'programs.talib.features.0.title',
      description: 'programs.talib.features.0.description'
    },
    {
      title: 'programs.talib.features.1.title',
      description: 'programs.talib.features.1.description'
    },
    {
      title: 'programs.talib.features.2.title',
      description: 'programs.talib.features.2.description'
    },
    {
      title: 'programs.talib.features.3.title',
      description: 'programs.talib.features.3.description'
    }
  ],
  extraTopics: [
    { title: 'programs.talib.extraTopics.0.title', query: 'programs.talib.extraTopics.0.query' },
    { title: 'programs.talib.extraTopics.1.title', query: 'programs.talib.extraTopics.1.query' },
    { title: 'programs.talib.extraTopics.2.title', query: 'programs.talib.extraTopics.2.query' }
  ],
  relatedBlogIds: ['4', '5', '7']
};

// --- SHARED KEYS ---
export const CUSTOM_POSTS_KEY = 'tilmid_posts';
export const GLOBAL_STUDENTS_KEY = 'tilmid_students';
export const GLOBAL_APPOINTMENTS_KEY = 'tilmid_appointments';



