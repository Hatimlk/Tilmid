
import React, { useState, useEffect, useRef } from 'react';
import {
  Shield, LayoutDashboard, FilePlus, LogOut, Trash2, Eye,
  CheckCircle, Users, Calendar,
  Search, PenTool, Settings,
  Clock, XCircle, Check, Ban, Unlock, Edit, Save, X, UserPlus, CalendarPlus, Bell, Menu, Activity, ChevronLeft, TrendingUp, Filter, FileText, Sparkles, Wand2, Loader2
} from 'lucide-react';
import { ADMIN_CREDENTIALS, CUSTOM_POSTS_KEY, BLOG_POSTS, GLOBAL_APPOINTMENTS_KEY, STUDENT_ACCOUNTS, GLOBAL_STUDENTS_KEY } from '../constants';
import { BlogPost, Appointment, Student } from '../types';
import { IMAGES } from '../constants/images';
import { dataManager } from '../utils/dataManager';

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

// --- MAIN COMPONENT ---

export const AdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'posts' | 'students' | 'appointments'>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Data States
  const [customPosts, setCustomPosts] = useState<BlogPost[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

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

  // Post Form State
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [newPost, setNewPost] = useState<BlogPost>({
    id: '',
    title: '',
    category: 'نصائح',
    date: '',
    excerpt: '',
    content: '',
    image: '',
    status: 'published'
  });

  // Refs for clicking outside
  const notifRef = useRef<HTMLDivElement>(null);

  // Initial Data Loading
  useEffect(() => {
    const auth = localStorage.getItem('tilmid_admin_auth');
    if (auth === 'true') setIsAuthenticated(true);

    const storedPosts = localStorage.getItem(CUSTOM_POSTS_KEY);
    if (storedPosts) setCustomPosts(JSON.parse(storedPosts));

    const storedAppointments = localStorage.getItem(GLOBAL_APPOINTMENTS_KEY);
    if (storedAppointments) setAppointments(JSON.parse(storedAppointments));

    const storedStudents = localStorage.getItem(GLOBAL_STUDENTS_KEY);
    if (storedStudents) {
      setStudents(JSON.parse(storedStudents));
    } else {
      const initialStudents: Student[] = STUDENT_ACCOUNTS.map((acc, i) => ({
        id: `std-${i}-${Date.now()}`,
        name: acc.name,
        username: acc.username,
        grade: acc.grade,
        joinDate: new Date().toISOString().split('T')[0],
        status: 'active',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${acc.username}`,
        stats: { studyHours: Math.floor(Math.random() * 50), commitmentRate: Math.floor(Math.random() * 100), weeklyProgress: [40, 60, 50, 80, 70, 90, 60] }
      }));
      setStudents(initialStudents);
      localStorage.setItem(GLOBAL_STUDENTS_KEY, JSON.stringify(initialStudents));
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);

  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setIsAuthenticated(true);
      localStorage.setItem('tilmid_admin_auth', 'true');
      setError('');
    } else {
      setError('بيانات الدخول غير صحيحة');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('tilmid_admin_auth');
  };

  const handleTabChange = (tab: any) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    if (tab === 'posts') resetPostForm();
  };

  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    const postToSave: BlogPost = {
      ...newPost,
      id: newPost.id || `custom-${Date.now()}`,
      date: newPost.date || new Date().toLocaleDateString('ar-MA', { year: 'numeric', month: 'long', day: 'numeric' }),
      author: { name: 'الإدارة', avatar: IMAGES.AVATARS.DEFAULT_USER },
      image: newPost.image || 'https://picsum.photos/800/600'
    };

    let updatedPosts;
    if (isEditingPost) {
      updatedPosts = customPosts.map(p => p.id === postToSave.id ? postToSave : p);
    } else {
      updatedPosts = [postToSave, ...customPosts];
    }

    dataManager.savePost(postToSave);

    // Update local state to reflect changes instantly (optional, as we pull from localStorage usually)
    const storedPosts = dataManager.getPosts();
    const customOnly = storedPosts.filter(p => !BLOG_POSTS.find(bp => bp.id === p.id)); // Simple filter for demo

    // Refresh the custom posts list from the manager source
    setCustomPosts(dataManager.getPosts().filter(p => !BLOG_POSTS.find(bp => bp.id === p.id) || p.id.startsWith('custom-')));

    resetPostForm();
    alert(isEditingPost ? 'تم تعديل المقال بنجاح' : 'تم نشر المقال بنجاح');
  };

  const handleDeletePost = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المقال؟')) {
      dataManager.deletePost(id);
      setCustomPosts(current => current.filter(p => p.id !== id));
    }
  };

  const handleEditPost = (post: BlogPost) => {
    setNewPost(post);
    setIsEditingPost(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetPostForm = () => {
    setNewPost({ id: '', title: '', category: 'نصائح', date: '', excerpt: '', content: '', image: '', status: 'published' });
    setIsEditingPost(false);
  };

  const handleOpenStudentModal = (student?: Student) => {
    if (student) {
      setCurrentStudent(student);
    } else {
      setCurrentStudent({ name: '', username: '', grade: '2 باكالوريا', status: 'active' });
    }
    setShowStudentModal(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent.name || !currentStudent.username) {
      alert('المرجو ملء جميع الحقول المطلوبة.');
      return;
    }

    let updatedStudents;
    if (currentStudent.id) {
      updatedStudents = students.map(s => s.id === currentStudent.id ? { ...s, ...currentStudent } as Student : s);
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
      updatedStudents = [...students, newStudentData];
    }

    setStudents(updatedStudents);
    localStorage.setItem(GLOBAL_STUDENTS_KEY, JSON.stringify(updatedStudents));
    setShowStudentModal(false);
  };

  const toggleStudentStatus = (id: string) => {
    if (window.confirm('هل أنت متأكد من تغيير حالة هذا الطالب؟')) {
      const updatedStudents = students.map(s => s.id === id ? { ...s, status: s.status === 'active' ? 'suspended' : 'active' } as Student : s);
      setStudents(updatedStudents);
      localStorage.setItem(GLOBAL_STUDENTS_KEY, JSON.stringify(updatedStudents));
    }
  };

  const deleteStudent = (id: string) => {
    if (window.confirm('حذف الطالب سيمنعه من الدخول نهائياً. هل أنت متأكد؟')) {
      const updatedStudents = students.filter(s => s.id !== id);
      setStudents(updatedStudents);
      localStorage.setItem(GLOBAL_STUDENTS_KEY, JSON.stringify(updatedStudents));
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

  const handleSaveAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBooking.studentName || !newBooking.title) {
      alert('المرجو اختيار الطالب وإدخال عنوان الموعد.');
      return;
    }

    const appointment: Appointment = {
      id: Date.now(),
      studentName: newBooking.studentName!,
      title: newBooking.title!,
      date: newBooking.date!,
      time: newBooking.time!,
      type: newBooking.type as string,
      status: 'confirmed'
    };

    const updatedAppointments = [...appointments, appointment];
    setAppointments(updatedAppointments);
    localStorage.setItem(GLOBAL_APPOINTMENTS_KEY, JSON.stringify(updatedAppointments));
    setShowAppointmentModal(false);
  };

  const updateAppointmentStatus = (id: number, status: 'confirmed' | 'cancelled') => {
    const updated = appointments.map(app => app.id === id ? { ...app, status } : app);
    setAppointments(updated);
    localStorage.setItem(GLOBAL_APPOINTMENTS_KEY, JSON.stringify(updated));
  };

  const deleteAppointment = (id: number) => {
    if (window.confirm('هل تريد حذف هذا الموعد من السجل؟')) {
      const updated = appointments.filter(app => app.id !== id);
      setAppointments(updated);
      localStorage.setItem(GLOBAL_APPOINTMENTS_KEY, JSON.stringify(updated));
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-white/50 backdrop-blur-xl animate-in zoom-in-95">
          <div className="text-center mb-10">
            <div className="w-48 h-auto mx-auto mb-10 transition-transform hover:scale-105 duration-500">
              <img src={IMAGES.LOGOS.OFFICIAL} alt="Tilmid Logo" className="w-full h-auto" />
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">بوابة الإدارة</h1>
            <p className="text-slate-500 mt-2 font-medium">الوصول الآمن للمسؤولين فقط</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-extrabold text-slate-600 mb-2 mr-1">المعرف الإداري</label>
              <div className="relative">
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-primary focus:bg-white outline-none text-lg font-bold transition-all text-left" dir="ltr" placeholder="admin" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-extrabold text-slate-600 mb-2 mr-1">رمز الدخول</label>
              <div className="relative">
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-primary outline-none text-lg font-bold transition-all text-left" dir="ltr" placeholder="•••••••" />
              </div>
            </div>
            {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold text-center border border-red-100 flex items-center justify-center gap-2"><XCircle size={18} /> {error}</div>}
            <button className="w-full py-4 bg-primary text-white font-extrabold rounded-2xl hover:bg-royal transition-all shadow-lg shadow-blue-500/30 text-lg hover:-translate-y-1 active:scale-[0.98]">تسجيل الدخول</button>
          </form>
        </div>
      </div>
    );
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
  };

  return (
    <div className="min-h-screen bg-[#F3F6F9] flex flex-col lg:flex-row font-sans text-slate-800" dir="rtl">
      {showAiModal && <GenerativeBlogModal onClose={() => setShowAiModal(false)} onGenerate={handleAiGeneration} />}
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
          <SidebarItem id="posts" label="إدارة المحتوى" icon={FilePlus} activeTab={activeTab} onClick={handleTabChange} />
          <SidebarItem id="students" label="الطلاب" icon={Users} activeTab={activeTab} onClick={handleTabChange} />
          <SidebarItem id="appointments" label="المواعيد" icon={Calendar} activeTab={activeTab} onClick={handleTabChange} />
        </nav>

        <div className="pt-8 border-t border-slate-800 mt-auto">
          <button onClick={handleLogout} className="w-full p-4 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-2xl flex items-center gap-3 font-bold transition-all group">
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
              {activeTab === 'posts' && 'إدارة المحتوى'}
              {activeTab === 'students' && 'قاعدة بيانات الطلاب'}
              {activeTab === 'appointments' && 'المواعيد'}
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

          {/* --- POSTS TAB --- */}
          {activeTab === 'posts' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="lg:col-span-1 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 h-fit lg:sticky lg:top-32 order-2 lg:order-1">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="font-extrabold text-xl text-slate-900">
                    {isEditingPost ? 'تعديل المقال' : 'إنشاء مقال جديد'}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAiModal(true)}
                      className="text-xs bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-3 py-1.5 rounded-full font-bold hover:shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center gap-1.5 animate-pulse"
                    >
                      <Sparkles size={12} />
                      <span>توليد بالذكاء الاصطناعي</span>
                    </button>
                    {isEditingPost && <button onClick={resetPostForm} className="text-xs bg-slate-100 px-3 py-1 rounded-full font-bold text-slate-500 hover:bg-slate-200">إلغاء</button>}
                  </div>
                </div>
                <form onSubmit={handleSavePost} className="space-y-6">
                  <div>
                    <label className="text-xs font-black text-slate-400 mb-2 block uppercase tracking-wider ml-1">العنوان</label>
                    <input type="text" required value={newPost.title || ''} onChange={e => setNewPost({ ...newPost, title: e.target.value })} className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-primary outline-none bg-slate-50 focus:bg-white transition-all font-bold text-slate-800" placeholder="عنوان جذاب للمقال..." />
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-400 mb-2 block uppercase tracking-wider ml-1">التصنيف</label>
                    <div className="relative">
                      <select value={newPost.category || 'نصائح'} onChange={e => setNewPost({ ...newPost, category: e.target.value })} className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-primary outline-none bg-slate-50 focus:bg-white font-bold text-slate-800 appearance-none cursor-pointer">
                        <option>نصائح</option><option>تقنيات</option><option>توجيه</option><option>الحفظ والمراجعة</option><option>الصحة والدراسة</option>
                      </select>
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"><Filter size={18} /></div>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-400 mb-2 block uppercase tracking-wider ml-1">صورة الغلاف (URL)</label>
                    <input type="text" value={newPost.image || ''} onChange={e => setNewPost({ ...newPost, image: e.target.value })} className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-primary outline-none text-sm font-medium bg-slate-50 focus:bg-white transition-all" placeholder="https://example.com/image.jpg" dir="ltr" />
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-400 mb-2 block uppercase tracking-wider ml-1">مقتطف قصير</label>
                    <textarea required value={newPost.excerpt || ''} onChange={e => setNewPost({ ...newPost, excerpt: e.target.value })} className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-primary outline-none h-32 resize-none text-sm font-medium bg-slate-50 focus:bg-white transition-all leading-relaxed"></textarea>
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-400 mb-2 block uppercase tracking-wider ml-1">محتوى المقال</label>
                    <textarea required value={newPost.content || ''} onChange={e => setNewPost({ ...newPost, content: e.target.value })} className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-primary outline-none h-64 resize-none text-sm font-medium bg-slate-50 focus:bg-white transition-all leading-relaxed"></textarea>
                  </div>
                  <button type="submit" className="w-full py-4 bg-primary text-white font-bold rounded-2xl hover:bg-royal shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
                    {isEditingPost ? <Save size={20} /> : <FilePlus size={20} />}
                    <span>{isEditingPost ? 'حفظ التعديلات' : 'نشر المقال'}</span>
                  </button>
                </form>
              </div>
              <div className="lg:col-span-2 space-y-6 order-1 lg:order-2">
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
            </div>
          )}

          {/* --- STUDENTS TAB --- */}
          {activeTab === 'students' && (
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
          )}

          {/* --- APPOINTMENTS TAB --- */}
          {activeTab === 'appointments' && (
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
          )}
        </div>
      </main >
    </div >
  );
};
