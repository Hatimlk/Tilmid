
import { BlogPost, Student, Appointment, SuccessStory, StudyResource } from '../types';
import { IMAGES } from '../constants/images';
import { BLOG_POSTS } from '../constants';

const KEYS = {
  POSTS: 'tilmid_posts',
  STUDENTS: 'tilmid_students',
  APPOINTMENTS: 'tilmid_appointments',
  STORIES: 'tilmid_stories',
  RESOURCES: 'tilmid_resources'
};

const SEED_RESOURCES: StudyResource[] = [
  { id: 'res-1', title: 'ملخص شامل لدروس الميكانيك', subject: 'الفيزياء', type: 'summary', fileSize: '2.4 MB', downloadCount: 1250, iconName: 'BookText' },
  { id: 'res-2', title: 'نموذج الامتحان الوطني 2023 مع التصحيح', subject: 'الرياضيات', type: 'exam', fileSize: '4.1 MB', downloadCount: 3800, iconName: 'FileSpreadsheet' },
  { id: 'res-3', title: 'جدول القواعد الإنجليزية (Grammar Cheat Sheet)', subject: 'الإنجليزية', type: 'formula', fileSize: '850 KB', downloadCount: 940, iconName: 'FileCode' },
  { id: 'res-4', title: 'منهجية تحليل النص الفلسفي', subject: 'الفلسفة', type: 'summary', fileSize: '1.2 MB', downloadCount: 2100, iconName: 'BookText' }
];

const SEED_STORIES: SuccessStory[] = [
  { id: 1, name: 'أمين البركاني', role: 'طالب هندسة', content: 'بفضل منصة تلميذ، استطعت تنظيم وقتي والحصول على ميزة حسن جداً في البكالوريا.', image: IMAGES.AVATARS.MOHAMED },
  { id: 2, name: 'سارة العلمي', role: 'طالبة طب', content: 'تقنيات الحفظ السريع التي تعلمتها هنا غيرت مساري الدراسي تماماً.', image: IMAGES.AVATARS.SARA },
  { id: 3, name: 'كريم الناصري', role: 'تلميذ 2 باك', content: 'المواكبة النفسية كانت العامل الحاسم في تجاوزي لضغط الامتحانات.', image: IMAGES.AVATARS.KARIM }
];

export const dataManager = {
  init: () => {
    // Seed Blog Posts - Ensure readingTime is present
    if (!localStorage.getItem(KEYS.POSTS)) {
        localStorage.setItem(KEYS.POSTS, JSON.stringify(BLOG_POSTS));
    }
    
    // Seed Resources
    if (!localStorage.getItem(KEYS.RESOURCES)) {
        localStorage.setItem(KEYS.RESOURCES, JSON.stringify(SEED_RESOURCES));
    }

    // Seed Success Stories
    if (!localStorage.getItem(KEYS.STORIES)) {
        localStorage.setItem(KEYS.STORIES, JSON.stringify(SEED_STORIES));
    }

    // Seed Students
    if (!localStorage.getItem(KEYS.STUDENTS)) {
        const initialStudents = [
            { 
              id: 'std-1', 
              name: 'أمين التلميذ', 
              username: 'amin', 
              password: '123', 
              grade: '2 باكالوريا', 
              status: 'active', 
              joinDate: '2023-09-01', 
              avatar: IMAGES.AVATARS.DEFAULT_USER,
              stats: { studyHours: 12, commitmentRate: 85, weeklyProgress: [40, 60, 55, 80, 70, 85, 50] } 
            }
        ];
        localStorage.setItem(KEYS.STUDENTS, JSON.stringify(initialStudents));
    }
  },

  getPosts: (): BlogPost[] => JSON.parse(localStorage.getItem(KEYS.POSTS) || '[]'),
  getStudents: (): Student[] => JSON.parse(localStorage.getItem(KEYS.STUDENTS) || '[]'),
  saveStudent: (student: Student) => {
    const students = dataManager.getStudents();
    const index = students.findIndex(s => s.id === student.id);
    if (index >= 0) students[index] = student;
    else students.push(student);
    localStorage.setItem(KEYS.STUDENTS, JSON.stringify(students));
  },
  getResources: (): StudyResource[] => JSON.parse(localStorage.getItem(KEYS.RESOURCES) || '[]'),
  getAppointments: (): Appointment[] => JSON.parse(localStorage.getItem(KEYS.APPOINTMENTS) || '[]'),
  saveAppointment: (app: Appointment) => {
    const apps = dataManager.getAppointments();
    apps.push(app);
    localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(apps));
  },
  getStories: (): SuccessStory[] => JSON.parse(localStorage.getItem(KEYS.STORIES) || '[]')
};

dataManager.init();
