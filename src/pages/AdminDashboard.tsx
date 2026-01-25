
import React, { useState, useEffect, useRef } from 'react';
import {
  Shield, LayoutDashboard, FilePlus, LogOut, Trash2, Eye,
  CheckCircle, Users, Calendar,
  Search, PenTool, Settings,
  Clock, XCircle, Check, Ban, Unlock, Edit, Save, X, UserPlus, CalendarPlus, Bell, Menu, Activity, ChevronLeft, TrendingUp, Filter, FileText, Sparkles, Wand2, Loader2, Send, Image, MessageSquare, Star, Upload
} from 'lucide-react';
import { ADMIN_CREDENTIALS, CUSTOM_POSTS_KEY, BLOG_POSTS, GLOBAL_APPOINTMENTS_KEY, STUDENT_ACCOUNTS, GLOBAL_STUDENTS_KEY } from '../constants';
import { BlogPost, Appointment, Student, ContactMessage, SuccessStory } from '../types';
import { IMAGES } from '../constants/images';
import { dataManager } from '../utils/dataManager';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import mammoth from 'mammoth';

// --- SUB COMPONENTS ---

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    suspended: 'bg-red-100 text-red-700 border-red-200',
    published: 'bg-blue-100 text-blue-700 border-blue-200',
    draft: 'bg-gray-100 text-gray-700 border-gray-200',
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    confirmed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200'
  };

  const labels: Record<string, string> = {
    active: 'نشط',
    suspended: 'معلق',
    published: 'منشور',
    draft: 'مسودة',
    pending: 'قيد الانتظار',
    confirmed: 'مؤكد',
    cancelled: 'ملغى'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status] || 'bg-gray-100 border-gray-200'} flex items-center gap-1 w-fit`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'active' || status === 'published' || status === 'confirmed' ? 'bg-current' : 'bg-gray-400'}`}></span>
      {labels[status] || status}
    </span>
  );
};

interface SidebarItemProps {
  id: string;
  label: string;
  icon: React.ElementType;
  activeTab: string;
  onClick: (id: string) => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ id, label, icon: Icon, activeTab, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className={`relative w-full p-4 rounded-2xl flex items-center gap-4 font-bold transition-all duration-300 mb-2 overflow-hidden group ${activeTab === id
      ? 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg shadow-blue-500/25 translate-x-1'
      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
  >
    <Icon size={22} className={`${activeTab === id ? 'text-white' : 'text-slate-500 group-hover:text-white'} transition-colors`} />
    <span className="relative z-10">{label}</span>
    {activeTab === id && (
      <ChevronLeft className="mr-auto text-white/60 animate-pulse" size={18} />
    )}
  </button>
);

const StatCard = ({ label, val, icon: Icon, color, trend }: any) => (
  <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
    <div className={`absolute -top-10 -right-10 w-32 h-32 ${color} opacity-[0.05] rounded-full group-hover:scale-150 transition-transform duration-700`}></div>

    <div className="flex justify-between items-start mb-6 relative z-10">
      <div className={`p-4 rounded-2xl text-white shadow-md ${color} bg-opacity-90 group-hover:rotate-6 transition-transform duration-300`}>
        <Icon size={26} />
      </div>
      {trend && (
        <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
          <TrendingUp size={14} /> {trend}
        </span>
      )}
    </div>

    <div className="relative z-10">
      <h3 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">{val}</h3>
      <p className="text-sm text-gray-500 font-bold">{label}</p>
    </div>
  </div>
);

// --- AI GENERATOR MODAL ---
const GenerativeBlogModal = ({ onClose, onGenerate }: { onClose: () => void, onGenerate: (data: any) => void }) => {
  const [step, setStep] = useState<'input' | 'generating' | 'complete'>('input');
  const [topic, setTopic] = useState('');
  const [progress, setProgress] = useState(0);

  const handleGenerate = () => {
    if (!topic) return;
    setStep('generating');

    // Simulation of AI Generation Process
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 15;
      if (p > 100) {
        clearInterval(interval);
        finishGeneration();
      } else {
        setProgress(Math.min(Math.round(p), 100));
      }
    }, 500);
  };

  const finishGeneration = () => {
    // Mock AI Data based on topic
    const mockData = {
      title: `دليل شامل حول: ${topic}`,
      excerpt: `اكتشف أفضل الاستراتيجيات والتقنيات الحديثة في ${topic} وكيف يمكنك تطبيقها لتحقيق نتائج مذهلة في مسارك الدراسي.`,
      content: `
## مقدمة عن ${topic}
تعتبر ${topic} من أهم المهارات التي يجب على كل طالب امتلاكها. في هذا المقال، سنستعرض خطوات عملية لإتقانها.

## لماذا ${topic} مهمة؟
1. تساعد على تحسين التركيز.
2. توفر الوقت والجهد.
3. تضمن نتائج دراسية أفضل.

## خطوات عملية
* ابدأ بالتخطيط المسبق.
* استخدم أدوات تنظيم الوقت.
* قيم أداءك بانتظام.

## خاتمة
تذكر أن ${topic} تحتاج إلى ممارسة مستمرة. ابدأ اليوم ولا تؤجل!
            `,
      category: 'نصائح',
      image: `https://source.unsplash.com/random/800x600/?education,${encodeURIComponent(topic)}`
    };

    setStep('complete');
    setTimeout(() => {
      onGenerate(mockData);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden border border-white/20">
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30 shadow-lg">
              <Sparkles size={32} className="text-white animate-pulse" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">الذكاء الاصطناعي</h2>
            <p className="text-indigo-100 font-medium text-sm">أدخل موضوعاً وسيقوم الذكاء الاصطناعي بكتابة المقال بالكامل</p>
          </div>
        </div>

        <div className="p-8">
          {step === 'input' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">عن ماذا تريد أن تكتب؟</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full p-4 rounded-xl border-2 border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none font-bold text-slate-800 transition-all placeholder:text-slate-300"
                  placeholder="مثال: تنظيم الوقت، الاستعداد للبكالوريا..."
                  autoFocus
                />
              </div>
              <button
                onClick={handleGenerate}
                disabled={!topic}
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-indigo-600 transition-all shadow-lg hover:shadow-indigo-500/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <Wand2 size={20} className="group-hover:rotate-12 transition-transform" />
                <span>توليد المقال</span>
              </button>
            </div>
          )}

          {step === 'generating' && (
            <div className="text-center py-8">
              <div className="mb-6 relative w-24 h-24 mx-auto">
                <svg className="animate-spin w-full h-full text-indigo-100" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-black text-indigo-600 text-lg">
                  {progress}%
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">جاري الكتابة...</h3>
              <p className="text-slate-500 text-sm animate-pulse">يتم الآن صياغة الأفكار وتحسين المحتوى</p>
            </div>
          )}

          {step === 'complete' && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in">
                <Check size={40} strokeWidth={3} />
              </div>
              <h3 className="text-xl font-bold text-emerald-600 mb-2">تم الانتهاء!</h3>
              <p className="text-slate-500 text-sm">تم توليد المقال بنجاح</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- REFINEMENT MODAL ---
const RefinementModal = ({ onClose, onComplete, initialContent }: { onClose: () => void, onComplete: (data: any) => void, initialContent: string }) => {
  const [step, setStep] = useState<'analyzing' | 'optimizing' | 'styling' | 'complete'>('analyzing');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 5;
      if (currentProgress >= 100) {
        if (step === 'analyzing') {
          setStep('optimizing');
          currentProgress = 0;
        } else if (step === 'optimizing') {
          setStep('styling');
          currentProgress = 0;
        } else if (step === 'styling') {
          setStep('complete');
          clearInterval(interval);
          finishRefinement();
        }
      }
      setProgress(Math.min(currentProgress, 100));
    }, 200);

    return () => clearInterval(interval);
  }, [step]);

  const finishRefinement = () => {
    // Advanced Processing: Smart Parsing logic
    const rawLines = initialContent.split(/\r?\n/).map(l => l.trim()).filter(l => l);

    if (rawLines.length === 0) {
      onComplete({ title: 'Untitled', content: '', sections: [] });
      onClose();
      return;
    }

    // 1. Title Extraction (Assume first line is title)
    const title = rawLines[0];
    const bodyLines = rawLines.slice(1);

    // 2. Content Pattern Recognition
    const sections: any[] = [];
    let currentSection: { title: string, content: string[], list: any[] } = {
      title: "نظرة عامة",
      content: [],
      list: []
    };

    // Helper to detect if a line is likely a list item
    const isListItem = (line: string) => {
      return /^[-*•\d\.]/.test(line) || (line.length < 60 && !line.endsWith('.'));
    };

    // Helper to detect if a line is likely a header
    const isHeader = (line: string) => {
      return line.length < 50 && !line.endsWith('.') && !isListItem(line);
    };

    for (let i = 0; i < bodyLines.length; i++) {
      const line = bodyLines[i];

      if (isHeader(line) && currentSection.content.length > 0) {
        // Push previous section
        sections.push({
          title: currentSection.title,
          content: currentSection.content.join('\n\n'),
          list: currentSection.list.length > 0 ? currentSection.list : undefined
        });
        // Start new section
        currentSection = { title: line, content: [], list: [] };
      } else if (isListItem(line)) {
        // It's a list item
        currentSection.list.push({ t: line, d: '' }); // Simple list item
      } else {
        // Regular paragraph
        currentSection.content.push(line);
      }
    }

    // Push the final section
    sections.push({
      title: currentSection.title,
      content: currentSection.content.join('\n\n'),
      list: currentSection.list.length > 0 ? currentSection.list : undefined
    });

    // Fallback: If heuristic failed (only 1 section), force split for visual appeal
    if (sections.length === 1 && sections[0].content.length > 500) {
      const fullText = sections[0].content;
      const splitIdx = Math.floor(fullText.length / 2);
      const part1 = fullText.substring(0, splitIdx);
      const part2 = fullText.substring(splitIdx);

      sections[0].content = part1;
      sections.push({
        title: "تتمة الموضوع",
        content: part2,
        list: sections[0].list
      });
    }

    // Enhance List Items (Card formatting)
    sections.forEach(sec => {
      if (sec.list && sec.list.length > 0) {
        sec.list = sec.list.map((item: any) => {
          const parts = item.t.replace(/^[-*•\d\.]+\s*/, '').split(/[:\-]/);
          return {
            t: parts[0].trim(),
            d: parts[1] ? parts[1].trim() : "نقطة مهمة يجب التركيز عليها"
          };
        }).slice(0, 6);
      }
    });

    const refinedData = {
      title: title,
      excerpt: (sections[0]?.content || "").substring(0, 150) + '...',
      content: bodyLines.join('\n\n'),
      sections: sections.length > 0 ? sections : [
        { title: "مقدمة", content: bodyLines.slice(0, 3).join('\n\n') },
        { title: "التفاصيل", content: bodyLines.slice(3).join('\n\n') }
      ],
      category: 'نصائح',
      image: `https://source.unsplash.com/random/800x600/?education`
    };

    setTimeout(() => {
      onComplete(refinedData);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden border border-white/20">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30 shadow-lg">
              <Sparkles size={32} className="text-white animate-pulse" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">تحسين المحتوى</h2>
            <p className="text-cyan-100 font-medium text-sm">جاري معالجة وتنسيق الملف المرفق...</p>
          </div>
        </div>

        <div className="p-8">
          <div className="text-center py-8">
            {step === 'complete' ? (
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in">
                <Check size={40} strokeWidth={3} />
              </div>
            ) : (
              <div className="mb-6 relative w-24 h-24 mx-auto">
                <svg className="animate-spin w-full h-full text-blue-100" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-black text-blue-600 text-lg">
                  {Math.round(progress)}%
                </div>
              </div>
            )}

            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {step === 'analyzing' && 'تحليل المحتوى...'}
              {step === 'optimizing' && 'تحسين الصياغة...'}
              {step === 'styling' && 'تنسيق العرض...'}
              {step === 'complete' && 'تم الانتهاء!'}
            </h3>
            <p className="text-slate-500 text-sm animate-pulse">
              {step !== 'complete' ? 'يرجى الانتظار قليلاً' : 'تم تجهيز المقال بنجاح'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};


// --- MAIN COMPONENT ---

export const AdminDashboard: React.FC = () => {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'overview' | 'create-post' | 'posts-list' | 'students' | 'appointments' | 'messages' | 'stories'>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Data States
  const [customPosts, setCustomPosts] = useState<BlogPost[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [stories, setStories] = useState<SuccessStory[]>([]);

  // Filter States
  const [studentSearch, setStudentSearch] = useState('');

  // UI Toggle States
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [adminName, setAdminName] = useState('Admin User');

  // Modal States
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Partial<Student>>({ name: '', username: '', grade: '2 باكالوريا', status: 'active' });
  const [viewStudent, setViewStudent] = useState<Student | null>(null);

  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [newBooking, setNewBooking] = useState<Partial<Appointment>>({ status: 'confirmed', type: 'live', date: '', time: '' });
  const [showRefinementModal, setShowRefinementModal] = useState(false);
  const [rawFileContent, setRawFileContent] = useState('');

  // Post Form State
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [creationMode, setCreationMode] = useState<'selection' | 'editor'>('selection');
  const [showAiModal, setShowAiModal] = useState(false);
  const [newPost, setNewPost] = useState<BlogPost>({
    id: '',
    title: '',
    category: 'نصائح',
    date: '',
    excerpt: '',
    content: '',
    sections: [],
    image: '',
    status: 'published'
  });

  // Refs for clicking outside
  const notifRef = useRef<HTMLDivElement>(null);

  // Initial Data Loading
  // Initial Data Loading
  useEffect(() => {
    const fetchData = async () => {
      if (!loading && !isAdmin) {
        navigate('/login');
        return;
      }

      try {
        const [posts, apps, msgs, strys, stds] = await Promise.all([
          dataManager.getPosts(),
          dataManager.getAppointments(),
          dataManager.getMessages(),
          dataManager.getStories(),
          dataManager.getStudents()
        ]);

        setCustomPosts(posts);
        setAppointments(apps);
        setMessages(msgs);
        setStories(strys);
        setStudents(stds);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };

    fetchData();

    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);

  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  if (loading) {
    return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={40} /></div>;
  }

  if (!isAdmin) return null;



  const handleTabChange = (tab: any) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    if (tab === 'create-post' && !isEditingPost) {
      resetPostForm();
    }
  };



  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) {
      alert('المرجو ملء عنوان ومحتوى المقال.');
      return;
    }

    try {
      const finalContent = newPost.content || ''; // Ensure content is not null/undefined
      if (isEditingPost) {
        await dataManager.savePost({ ...newPost, content: finalContent, status: 'published' });
      } else {
        const postToSave: BlogPost = {
          ...newPost,
          id: `post-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          content: finalContent,
          status: 'published'
        };
        await dataManager.savePost(postToSave);
      }

      // Refresh posts
      const updatedPosts = await dataManager.getPosts();
      setCustomPosts(updatedPosts);

      setNewPost({ id: '', title: '', category: 'نصائح', date: '', excerpt: '', content: '', sections: [], image: '', status: 'published' });
      setIsEditingPost(false);
      setCreationMode('selection');
      setActiveTab('posts-list');
      setShowNotifications(true);
      setTimeout(() => setShowNotifications(false), 3000);
    } catch (e) {
      console.error("Error saving post", e);
      alert("حدث خطأ أثناء حفظ المقال.");
    }
  };

  const handleDeletePost = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المقال؟')) {
      try {
        await dataManager.deletePost(id);
        setCustomPosts(current => current.filter(p => p.id !== id));
      } catch (e) {
        console.error("Error deleting post", e);
        alert("حدث خطأ أثناء حذف المقال.");
      }
    }
  };

  const handleEditPost = (post: BlogPost) => {
    setNewPost(post);
    setIsEditingPost(true);
    setActiveTab('create-post');
    setCreationMode('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetPostForm = () => {
    setNewPost({ id: '', title: '', category: 'نصائح', date: '', excerpt: '', content: '', sections: [], html: '', image: '', status: 'published' });
    setIsEditingPost(false);
    setCreationMode('selection');
  };

  const handleOpenStudentModal = (student?: Student) => {
    if (student) {
      setCurrentStudent(student);
    } else {
      setCurrentStudent({ name: '', username: '', grade: '2 باكالوريا', status: 'active' });
    }
    setShowStudentModal(true);
  };

  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent.name || !currentStudent.username) {
      alert('المرجو ملء جميع الحقول المطلوبة.');
      return;
    }

    try {
      if (currentStudent.id) {
        await dataManager.saveStudent(currentStudent as Student);
      } else {
        const newStudentData: Student = {
          id: `std-${Date.now()}`,
          name: currentStudent.name!,
          username: currentStudent.username!,
          grade: currentStudent.grade || '2 باكالوريا',
          joinDate: new Date().toISOString().split('T')[0],
          status: 'active',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentStudent.username}`,
          stats: { studyHours: 0, commitmentRate: 0, weeklyProgress: [0, 0, 0, 0, 0, 0, 0] }
        };
        await dataManager.saveStudent(newStudentData);
      }
      const updatedStudents = await dataManager.getStudents();
      setStudents(updatedStudents);
      setShowStudentModal(false);
    } catch (e) {
      console.error("Error saving student", e);
      alert("حدث خطأ أثناء حفظ بيانات الطالب.");
    }
  };

  const toggleStudentStatus = async (id: string) => {
    if (window.confirm('هل أنت متأكد من تغيير حالة هذا الطالب؟')) {
      try {
        const studentToUpdate = students.find(s => s.id === id);
        if (studentToUpdate) {
          const updatedStudent = { ...studentToUpdate, status: studentToUpdate.status === 'active' ? 'suspended' : 'active' } as Student;
          await dataManager.saveStudent(updatedStudent);
          const updatedStudents = await dataManager.getStudents();
          setStudents(updatedStudents);
        }
      } catch (e) {
        console.error("Error toggling student status", e);
        alert("حدث خطأ أثناء تغيير حالة الطالب.");
      }
    }
  };

  const deleteStudent = async (id: string) => {
    if (window.confirm('حذف الطالب سيمنعه من الدخول نهائياً. هل أنت متأكد؟')) {
      try {
        await dataManager.deleteStudent(id);
        const updatedStudents = await dataManager.getStudents();
        setStudents(updatedStudents);
      } catch (e) {
        console.error("Error deleting student", e);
        alert("حدث خطأ أثناء حذف الطالب.");
      }
    }
  };

  const handleOpenAppointmentModal = () => {
    setNewBooking({
      status: 'confirmed',
      type: 'live',
      date: new Date().toISOString().split('T')[0],
      time: '10:00',
      studentName: '',
      title: ''
    });
    setShowAppointmentModal(true);
  };

  const handleSaveAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBooking.studentName || !newBooking.title) {
      alert('المرجو اختيار الطالب وإدخال عنوان الموعد.');
      return;
    }

    try {
      const appointment: Appointment = {
        id: Date.now(),
        studentName: newBooking.studentName!,
        title: newBooking.title!,
        date: newBooking.date!,
        time: newBooking.time!,
        status: 'confirmed',
        type: newBooking.type!
      };

      await dataManager.saveAppointment(appointment);
      const updated = await dataManager.getAppointments();
      setAppointments(updated);
      setShowAppointmentModal(false);
    } catch (e) {
      console.error("Error saving appointment", e);
      alert("حدث خطأ أثناء حفظ الموعد.");
    }
  };

  const deleteAppointment = async (id: number) => {
    if (window.confirm('هل تريد حذف هذا الموعد من السجل؟')) {
      try {
        await dataManager.deleteAppointment(id);
        const updated = await dataManager.getAppointments();
        setAppointments(updated);
      } catch (e) {
        console.error("Error deleting appointment", e);
      }
    }
  };

  const getActivityFeed = () => {
    const apps = appointments.map(a => ({ type: 'appointment', date: a.date, title: a.title, user: a.studentName, id: a.id }));
    const posts = customPosts.map(p => ({ type: 'post', date: p.date, title: p.title, user: 'الإدارة', id: p.id }));
    return [...apps, ...posts].reverse().slice(0, 6);
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.username.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      if (event.target?.result) {
        try {
          const arrayBuffer = event.target.result as ArrayBuffer;
          const result = await mammoth.extractRawText({ arrayBuffer });
          setRawFileContent(result.value);
          setShowRefinementModal(true);
        } catch (error) {
          console.error("Error parsing file:", error);
          alert("حدث خطأ أثناء قراءة الملف. يرجى المحاولة مرة أخرى.");
        }
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleRefinementComplete = (data: any) => {
    setNewPost(prev => ({
      ...prev,
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      sections: data.sections,
      category: data.category
    }));
    setCreationMode('editor');
  }

  const handleAiGeneration = (data: any) => {
    setNewPost(prev => ({
      ...prev,
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      category: data.category
      // Image is intentionally left manual or could be set if Simulate image worked
    }));
    setCreationMode('editor');
  };

  function updateAppointmentStatus(id: number, arg1: string): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="min-h-screen bg-[#F3F6F9] flex flex-col lg:flex-row font-sans text-slate-800" dir="rtl">
      {showAiModal && <GenerativeBlogModal onClose={() => setShowAiModal(false)} onGenerate={handleAiGeneration} />}
      {showRefinementModal && <RefinementModal onClose={() => setShowRefinementModal(false)} onComplete={handleRefinementComplete} initialContent={rawFileContent} />}
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`
            fixed inset-y-0 right-0 z-50 w-72 bg-slate-900 text-white p-6 flex flex-col shrink-0 shadow-2xl
            transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static
            ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
        <div className="flex items-center justify-between mb-12 px-2 pt-2">
          <div className="h-12 lg:h-14 w-auto">
            <img src={IMAGES.LOGOS.WHITE} alt="Logo" className="h-full w-auto" />
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-slate-400 hover:text-white transition-colors"><X size={28} /></button>
        </div>

        <nav className="flex-grow space-y-3">
          <SidebarItem id="overview" label="نظرة عامة" icon={LayoutDashboard} activeTab={activeTab} onClick={handleTabChange} />

          <div className="px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-wider mt-4">المحتوى</div>
          <SidebarItem id="create-post" label="إنشاء مقال" icon={PenTool} activeTab={activeTab} onClick={handleTabChange} />
          <SidebarItem id="posts-list" label="المقالات" icon={FileText} activeTab={activeTab} onClick={handleTabChange} />
          <SidebarItem id="stories" label="قصص النجاح" icon={Star} activeTab={activeTab} onClick={handleTabChange} />

          <div className="px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-wider mt-4">الإدارة</div>
          <SidebarItem id="students" label="الطلاب" icon={Users} activeTab={activeTab} onClick={handleTabChange} />
          <SidebarItem id="appointments" label="المواعيد" icon={Calendar} activeTab={activeTab} onClick={handleTabChange} />
          <SidebarItem id="messages" label="الرسائل" icon={MessageSquare} activeTab={activeTab} onClick={handleTabChange} />
        </nav>

        <div className="pt-8 border-t border-slate-800 mt-auto">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3.5 text-red-500 hover:bg-red-50/10 rounded-xl font-bold transition-all group mt-6">
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" /> خروج
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow h-screen overflow-y-auto relative bg-[#F8FAFC]">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-xl px-6 lg:px-10 py-5 border-b border-gray-100 sticky top-0 z-30 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-xl text-slate-600 transition-colors">
              <Menu size={28} />
            </button>
            <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
              {activeTab === 'overview' && 'نظرة عامة'}
              {activeTab === 'create-post' && 'إنشاء مقال جديد'}
              {activeTab === 'posts-list' && 'مكتبة المقالات'}
              {activeTab === 'students' && 'قاعدة بيانات الطلاب'}
              {activeTab === 'appointments' && 'المواعيد'}
              {activeTab === 'messages' && 'صندوق الوارد'}
              {activeTab === 'stories' && 'قصص النجاح'}
            </h2>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            <div onClick={() => setShowSettings(true)} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-blue-50 rounded-xl cursor-pointer transition-all hidden sm:flex">
              <Settings size={22} />
            </div>
            <div className="h-10 w-px bg-gray-200 hidden md:block"></div>
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setShowSettings(true)}>
              <div className="relative">
                <div className="w-11 h-11 rounded-full bg-gradient-to-r from-primary to-royal flex items-center justify-center text-white font-bold text-sm shadow-md border-2 border-white ring-2 ring-gray-100 group-hover:ring-primary/20 transition-all">
                  AD
                </div>
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="text-right hidden md:block">
                <p className="text-sm font-extrabold text-slate-800 leading-tight group-hover:text-primary transition-colors">{adminName}</p>
                <p className="text-[11px] text-slate-500 font-bold mt-0.5">Super Admin</p>
              </div>
            </div>
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`w-11 h-11 flex items-center justify-center bg-white border rounded-xl transition-all group ${showNotifications ? 'border-primary text-primary shadow-lg shadow-blue-500/20' : 'border-gray-200 text-slate-500 hover:border-primary hover:text-primary'}`}
              >
                <span className="absolute top-3 right-3.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white group-hover:scale-110 transition-transform"></span>
                <Bell size={22} />
              </button>
              {showNotifications && (
                <div className="absolute top-full left-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 animate-in fade-in slide-in-from-top-4 z-50">
                  <div className="flex justify-between items-center px-4 py-3 border-b border-gray-50 mb-1">
                    <span className="font-bold text-sm text-slate-800">الإشعارات</span>
                    <button onClick={() => setShowNotifications(false)} className="text-xs text-primary font-bold hover:underline">مسح الكل</button>
                  </div>
                  <div className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
                    {appointments.filter(a => a.status === 'pending').slice(0, 3).map(app => (
                      <div key={app.id} onClick={() => { setActiveTab('appointments'); setShowNotifications(false); }} className="p-3 hover:bg-blue-50 rounded-xl cursor-pointer flex gap-3 items-start transition-colors">
                        <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center shrink-0"><Calendar size={18} /></div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 mb-0.5">حجز جديد: {app.studentName}</p>
                          <p className="text-[11px] text-slate-500 font-medium">{app.date} - {app.time}</p>
                        </div>
                      </div>
                    ))}
                    {appointments.filter(a => a.status === 'pending').length === 0 && (
                      <div className="py-8 text-center text-slate-400">
                        <Bell size={24} className="mx-auto mb-2 opacity-50" />
                        <p className="text-xs font-bold">لا توجد إشعارات جديدة</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-10 max-w-[1600px] mx-auto">
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="إجمالي الطلاب" val={students.length} icon={Users} color="bg-blue-600" trend="+12%" />
                <StatCard label="المقالات الكلية" val={BLOG_POSTS.length + customPosts.length} icon={FilePlus} color="bg-purple-600" trend="+5%" />
                <StatCard label="مواعيد معلقة" val={appointments.filter(a => a.status === 'pending').length} icon={Clock} color="bg-amber-500" />
                <StatCard label="المواعيد المؤكدة" val={appointments.filter(a => a.status === 'confirmed').length} icon={CheckCircle} color="bg-emerald-500" trend="+8%" />
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="font-extrabold text-xl text-slate-900 flex items-center gap-2">
                      <Activity className="text-primary" /> النشاط الأخير
                    </h3>
                    <button onClick={() => setActiveTab('appointments')} className="text-sm text-primary font-bold hover:underline bg-blue-50 px-4 py-2 rounded-full transition-colors">عرض الكل</button>
                  </div>
                  <div className="space-y-4">
                    {getActivityFeed().map((item: any, i) => (
                      <div key={i} className="flex items-center gap-5 p-4 rounded-2xl hover:bg-slate-50 transition-all group border border-transparent hover:border-gray-100">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all ${item.type === 'post' ? 'bg-blue-50 text-blue-600 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-500/20' : 'bg-amber-50 text-amber-600 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-amber-500/20'}`}>
                          {item.type === 'post' ? <PenTool size={24} /> : <Calendar size={24} />}
                        </div>
                        <div className="flex-grow">
                          <p className="text-base font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">{item.title}</p>
                          <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
                            <span className="bg-white px-2 py-1 rounded-md border border-gray-100 shadow-sm">{item.type === 'post' ? 'نشر مقال' : 'حجز موعد'}</span>
                            <span>•</span>
                            <span className="text-slate-700">{item.user}</span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg whitespace-nowrap">{item.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col h-full">
                  <h3 className="font-extrabold text-xl mb-8 text-slate-900">توزيع الطلاب</h3>
                  <div className="flex-grow flex items-center justify-center">
                    <div className="flex gap-6 items-end h-64 w-full px-4">
                      {['2 باك', '1 باك', 'جذع'].map((level, i) => {
                        const count = students.filter(s => s.grade.includes(level)).length;
                        const height = count > 0 ? (count / students.length) * 100 : 10;
                        const colors = ['bg-blue-500', 'bg-purple-500', 'bg-emerald-500'];
                        return (
                          <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                            <div className="w-full bg-slate-50 rounded-2xl relative overflow-hidden ring-4 ring-white shadow-inner" style={{ height: `${height}%`, minHeight: '60px' }}>
                              <div className={`absolute inset-0 ${colors[i]} opacity-80 group-hover:opacity-100 transition-all duration-500`}></div>
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                              <div className="absolute top-2 left-1/2 -translate-x-1/2 text-white font-bold text-lg drop-shadow-md opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">{count}</div>
                            </div>
                            <span className="text-sm font-bold text-slate-500 group-hover:text-slate-900 transition-colors">{level}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- CREATE POST TAB --- */}
          {activeTab === 'create-post' && (
            <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 pb-20">

              <form onSubmit={handleSavePost} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* Left Column: Main Editor */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Title & Quick Actions */}
                  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col gap-6">
                    <div className="flex justify-between items-start">
                      <h3 className="font-extrabold text-xl text-slate-900 flex items-center gap-2">
                        <PenTool className="text-primary" size={24} />
                        {isEditingPost ? 'تعديل المقال' : 'كتابة مقال جديد'}
                      </h3>
                    </div>

                    <div className="relative group">
                      <input
                        type="text"
                        required
                        value={newPost.title || ''}
                        onChange={e => setNewPost({ ...newPost, title: e.target.value })}
                        className="w-full text-3xl lg:text-4xl font-black text-slate-800 placeholder:text-slate-300 border-none outline-none bg-transparent px-0 py-2 focus:ring-0 leading-tight"
                        placeholder="أدخل عنوان المقال هنا..."
                      />
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-100 group-hover:bg-slate-200 transition-colors"></div>
                    </div>
                  </div>

                  {/* File Upload Section */}
                  <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-4">
                      <Upload size={20} className="text-slate-400" />
                      <label className="text-sm font-black text-slate-700 uppercase tracking-wider">رفع ملف المقال</label>
                    </div>
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 hover:bg-slate-50 transition-colors text-center cursor-pointer group relative">
                      <input type="file" accept=".docx" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                        <FileText size={28} />
                      </div>
                      <p className="text-slate-800 font-bold text-base mb-1">اضغط لرفع ملف (Word, PDF, TXT)</p>
                      <p className="text-slate-400 text-xs font-bold">سيتم استيراد المحتوى تلقائياً</p>
                    </div>
                  </div>






                </div>

                {/* Right Column: Sidebar Settings */}
                <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-32">

                  {/* Publish Actions */}
                  <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                    <h4 className="font-black text-slate-800 mb-4 flex items-center gap-2"><Send size={18} className="text-blue-500" /> النشر</h4>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <span className="text-sm font-bold text-slate-500">الحالة:</span>
                        <select
                          value={newPost.status || 'published'}
                          onChange={e => setNewPost({ ...newPost, status: e.target.value as 'published' | 'draft' })}
                          className="bg-transparent font-bold text-slate-800 outline-none text-sm cursor-pointer"
                        >
                          <option value="published">منشور</option>
                          <option value="draft">مسودة</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl mb-2">
                        <span className="text-sm font-bold text-slate-500">التاريخ:</span>
                        <input
                          type="text"
                          value={newPost.date || new Date().toLocaleDateString('ar-MA')}
                          disabled
                          className="bg-transparent font-bold text-slate-800 outline-none text-sm text-left w-24 opacity-60 cursor-not-allowed"
                        />
                      </div>

                      <button type="submit" className="w-full py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-royal shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
                        {isEditingPost ? <Save size={18} /> : <Send size={18} />}
                        <span>{isEditingPost ? 'حفظ التغييرات' : 'نشر الآن'}</span>
                      </button>

                      {isEditingPost && (
                        <button
                          type="button"
                          onClick={resetPostForm}
                          className="w-full py-3 bg-white border-2 border-slate-100 text-slate-500 font-bold rounded-xl hover:bg-slate-50 transition-all"
                        >
                          إلغاء التعديل
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Category */}
                  <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                    <h4 className="font-black text-slate-800 mb-4 flex items-center gap-2"><Filter size={18} className="text-purple-500" /> التصنيف</h4>
                    <div className="relative">
                      <select value={newPost.category || 'نصائح'} onChange={e => setNewPost({ ...newPost, category: e.target.value })} className="w-full p-4 rounded-xl border-2 border-slate-100 focus:border-purple-500 outline-none bg-slate-50 focus:bg-white font-bold text-slate-800 appearance-none cursor-pointer transition-all">
                        <option>نصائح</option><option>تقنيات</option><option>توجيه</option><option>الحفظ والمراجعة</option><option>الصحة والدراسة</option>
                      </select>
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"><ChevronLeft size={18} className="-rotate-90" /></div>
                    </div>
                  </div>

                  {/* Featured Image */}
                  <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                    <h4 className="font-black text-slate-800 mb-4 flex items-center gap-2"><Image size={18} className="text-emerald-500" /> صورة الغلاف</h4>
                    <div className="space-y-4">
                      <div className="relative group overflow-hidden rounded-2xl bg-slate-100 aspect-video border-2 border-dashed border-slate-300 flex items-center justify-center">
                        {newPost.image ? (
                          <img src={newPost.image} alt="Cover Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Invalid+Image')} />
                        ) : (
                          <div className="text-center text-slate-400 p-4">
                            <Image size={32} className="mx-auto mb-2 opacity-50" />
                            <p className="text-xs font-bold">معاينة الصورة</p>
                          </div>
                        )}
                      </div>
                      <input
                        type="text"
                        value={newPost.image || ''}
                        onChange={e => setNewPost({ ...newPost, image: e.target.value })}
                        className="w-full p-3 text-xs font-medium rounded-xl border border-slate-200 focus:border-emerald-500 outline-none bg-slate-50 focus:bg-white transition-all"
                        placeholder="أدخل رابط الصورة (URL)..."
                        dir="ltr"
                      />
                    </div>
                  </div>

                </div>
              </form>

            </div>
          )}

          {/* --- POSTS LIST TAB --- */}
          {activeTab === 'posts-list' && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-extrabold text-xl text-slate-900 flex items-center gap-2"><FileText size={24} className="text-blue-500" /> مكتبة المقالات</h3>
                  <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold">{customPosts.length} مقال</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-right">
                    <thead className="bg-slate-50 text-slate-400 text-xs font-extrabold uppercase border-b border-gray-100">
                      <tr><th className="p-6">المقال</th><th className="p-6 hidden sm:table-cell">الحالة</th><th className="p-6 hidden md:table-cell">التاريخ</th><th className="p-6 text-center">إجراءات</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {customPosts.map(post => (
                        <tr key={post.id} className="hover:bg-blue-50/30 transition-colors group">
                          <td className="p-6">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 rounded-2xl bg-gray-100 overflow-hidden shadow-sm shrink-0">
                                <img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 text-base line-clamp-1 mb-1.5">{post.title}</p>
                                <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2.5 py-1 rounded-md border border-slate-200">{post.category}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-6 hidden sm:table-cell"><StatusBadge status={post.status || 'published'} /></td>
                          <td className="p-6 text-sm font-bold text-slate-400 hidden md:table-cell">{post.date}</td>
                          <td className="p-6">
                            <div className="flex justify-center gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => handleEditPost(post)} className="p-2.5 text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 hover:scale-110 transition-all" title="تعديل"><PenTool size={18} /></button>
                              <button onClick={() => handleDeletePost(post.id)} className="p-2.5 text-red-600 bg-red-50 rounded-xl hover:bg-red-100 hover:scale-110 transition-all" title="حذف"><Trash2 size={18} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}


          {/* --- STUDENTS TAB --- */}
          {
            activeTab === 'students' && (
              <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 bg-white">
                  <div className="relative w-full max-w-lg group">
                    <Search size={20} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input type="text" placeholder="بحث عن طالب..." value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)} className="w-full pl-4 pr-14 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none text-sm font-bold transition-all shadow-inner" />
                  </div>
                  <button onClick={() => handleOpenStudentModal()} className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-primary shadow-lg transition-all w-full md:w-auto justify-center group"><UserPlus size={18} /> إضافة طالب</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-right min-w-[900px]">
                    <thead className="bg-slate-50 text-slate-400 text-xs font-extrabold uppercase border-b border-slate-100">
                      <tr><th className="p-6">بيانات الطالب</th><th className="p-6">المعرف</th><th className="p-6">المستوى</th><th className="p-6">الحالة</th><th className="p-6 text-center">تحكم</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredStudents.map(student => (
                        <tr key={student.id} className="hover:bg-blue-50/40 transition-colors group">
                          <td className="p-6">
                            <div className="flex items-center gap-4 cursor-pointer" onClick={() => setViewStudent(student)}>
                              <div className="w-12 h-12 rounded-full p-0.5 border-2 border-slate-100 overflow-hidden bg-white"><img src={student.avatar} className="w-full h-full object-cover" alt="" /></div>
                              <div><span className="block font-bold text-slate-900">{student.name}</span><span className="text-xs text-slate-400">{student.joinDate}</span></div>
                            </div>
                          </td>
                          <td className="p-6"><span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg" dir="ltr">{student.username}</span></td>
                          <td className="p-6"><span className="text-sm font-bold text-slate-600">{student.grade}</span></td>
                          <td className="p-6"><StatusBadge status={student.status} /></td>
                          <td className="p-6"><div className="flex items-center justify-center gap-3 opacity-60 group-hover:opacity-100 transition-opacity"><button onClick={() => setViewStudent(student)} className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg"><Eye size={18} /></button><button onClick={() => handleOpenStudentModal(student)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit size={18} /></button><button onClick={() => toggleStudentStatus(student.id)} className={`p-2 rounded-lg transition-colors ${student.status === 'active' ? 'text-amber-500' : 'text-emerald-500'}`}>{student.status === 'active' ? <Ban size={18} /> : <Unlock size={18} />}</button><button onClick={() => deleteStudent(student.id)} className="p-2 text-red-400 hover:text-red-600"><Trash2 size={18} /></button></div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          }

          {/* --- APPOINTMENTS TAB --- */}
          {
            activeTab === 'appointments' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                  <div><h3 className="text-xl font-extrabold text-slate-900">إدارة المواعيد</h3><p className="text-slate-500 text-sm">تتبع وتنظيم جلسات التوجيه</p></div>
                  <button onClick={handleOpenAppointmentModal} className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg transition-all"><CalendarPlus size={20} /> حجز موعد جديد</button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="flex flex-col h-full"><h3 className="font-extrabold text-slate-900 mb-4 px-2">قيد الانتظار</h3>
                    <div className="bg-slate-100/50 p-4 rounded-[2.5rem] border border-slate-200/60 flex-grow">
                      <div className="space-y-4 max-h-[calc(100vh-350px)] overflow-y-auto pr-2 custom-scrollbar">
                        {appointments.filter(a => a.status === 'pending').map(app => (
                          <div key={app.id} className="bg-white p-6 rounded-[2rem] shadow-sm hover:shadow-lg transition-all border border-transparent hover:border-amber-200">
                            <div className="flex justify-between items-start mb-4"><div><h4 className="font-bold text-slate-900 text-sm">{app.title}</h4><p className="text-xs text-slate-500">{app.studentName}</p></div><button onClick={() => deleteAppointment(app.id)} className="text-slate-300 hover:text-red-500"><X size={18} /></button></div>
                            <div className="flex items-center gap-4 text-xs font-bold text-slate-500 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-100"><span>{app.date}</span><span className="w-px h-3 bg-slate-300"></span><span>{app.time}</span></div>
                            <div className="flex gap-3"><button onClick={() => updateAppointmentStatus(app.id, 'confirmed')} className="flex-1 py-3 bg-emerald-500 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2">قبول</button><button onClick={() => updateAppointmentStatus(app.id, 'cancelled')} className="flex-1 py-3 bg-white text-slate-600 border border-slate-200 rounded-xl text-sm font-bold">رفض</button></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col h-full"><h3 className="font-extrabold text-slate-900 mb-4 px-2">المواعيد القادمة</h3>
                    <div className="bg-slate-100/50 p-4 rounded-[2.5rem] border border-slate-200/60 flex-grow">
                      <div className="space-y-3 max-h-[calc(100vh-350px)] overflow-y-auto pr-2 custom-scrollbar">
                        {appointments.filter(a => a.status === 'confirmed').map(app => (
                          <div key={app.id} className="bg-white p-5 rounded-[2rem] shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
                            <div className="flex items-center gap-4"><div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-bold">{app.date.split('-')[2]}</div><div><h4 className="font-bold text-slate-900 text-sm mb-1">{app.title}</h4><p className="text-xs text-slate-500">{app.studentName} • {app.time}</p></div></div>
                            <button onClick={() => deleteAppointment(app.id)} className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100"><Trash2 size={18} /></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          }

          {/* --- MESSAGES TAB --- */}
          {
            activeTab === 'messages' && (
              <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 space-y-6">
                {messages.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-[2.5rem] border border-gray-100">
                    <MessageSquare size={48} className="mx-auto text-slate-200 mb-4" />
                    <h3 className="text-xl font-bold text-slate-800">صندوق الوارد فارغ</h3>
                    <p className="text-slate-400">لم تتلق أي رسائل جديدة بعد.</p>
                  </div>
                ) : (
                  messages.map((msg, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-all">
                      <div className="w-12 h-12 bg-blue-50 text-primary rounded-full flex items-center justify-center shrink-0">
                        <MessageSquare size={20} />
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-bold text-lg text-slate-900">{msg.name}</h4>
                            <span className="text-sm font-medium text-slate-500">{msg.phone}</span>
                          </div>
                          <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">{msg.date}</span>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl text-slate-700 font-medium leading-relaxed">
                          <span className="block text-xs font-black text-primary uppercase mb-1">{msg.type}</span>
                          {msg.message || 'لا توجد رسالة إضافية'}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )
          }

          {/* --- SUCCESS STORIES TAB --- */}
          {
            activeTab === 'stories' && (
              <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 space-y-8">
                {/* Add Story Form */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                  <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                    <Star className="text-yellow-400" fill="currentColor" /> إضافة قصة نجاح جديدة
                  </h3>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    // Basic form handling within the render for simplicity or extract to handler
                    const form = e.target as HTMLFormElement;
                    const formData = new FormData(form);
                    const newStory: SuccessStory = {
                      id: Date.now(),
                      name: formData.get('name') as string,
                      role: formData.get('role') as string,
                      content: formData.get('content') as string,
                      image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.get('name')}`
                    };
                    try {
                      await dataManager.saveStory(newStory);
                      const updated = await dataManager.getStories();
                      setStories(updated);
                      form.reset();
                      alert('تم إضافة القصة بنجاح!');
                    } catch (err) {
                      console.error("Error saving story", err);
                      alert("حدث خطأ أثناء حفظ القصة.");
                    }
                  }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">اسم الطالب</label>
                      <input name="name" required className="w-full p-4 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:border-primary font-bold" placeholder="أحمد..." />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">الصفة / المستوى</label>
                      <input name="role" required className="w-full p-4 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:border-primary font-bold" placeholder="طالب هندسة..." />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-2">قصة النجاح</label>
                      <textarea name="content" required className="w-full p-4 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:border-primary font-bold min-h-[100px]" placeholder="اكتب القصة هنا..."></textarea>
                    </div>
                    <div className="md:col-span-2">
                      <button className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-primary transition-all">نشر القصة</button>
                    </div>
                  </form>
                </div>

                {/* Stories List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {stories.map(story => (
                    <div key={story.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 relative group hover:shadow-lg transition-all">
                      <button onClick={async () => {
                        if (window.confirm('حذف هذه القصة؟')) {
                          try {
                            await dataManager.deleteStory(story.id);
                            const updated = await dataManager.getStories();
                            setStories(updated);
                          } catch (err) {
                            console.error("Error deleting story", err);
                            alert("حدث خطأ أثناء حذف القصة.");
                          }
                        }
                      }} className="absolute top-6 left-6 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
                      <div className="flex items-center gap-4 mb-4">
                        <img src={story.image} alt={story.name} className="w-16 h-16 rounded-full bg-slate-100" />
                        <div>
                          <h4 className="font-bold text-lg text-slate-900">{story.name}</h4>
                          <span className="text-primary text-xs font-bold bg-primary/10 px-2 py-1 rounded-full">{story.role}</span>
                        </div>
                      </div>
                      <p className="text-slate-600 font-medium leading-relaxed">"{story.content}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )
          }
        </div >
      </main >
    </div >
  );
};
