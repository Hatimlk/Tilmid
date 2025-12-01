
import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, LayoutDashboard, FilePlus, LogOut, Trash2, Eye, 
  CheckCircle, Plus, Users, Calendar, 
  Search, PenTool, Bold, Italic, Settings,
  Clock, XCircle, Check, Ban, Unlock, Edit, Save, X, UserPlus, CalendarPlus, Bell, Menu, Activity, Mail
} from 'lucide-react';
import { ADMIN_CREDENTIALS, CUSTOM_POSTS_KEY, BLOG_POSTS, GLOBAL_APPOINTMENTS_KEY, STUDENT_ACCOUNTS, GLOBAL_STUDENTS_KEY } from '../constants';
import { BlogPost, Appointment, Student } from '../types';

// --- SUB COMPONENTS ---

const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
        active: 'bg-green-100 text-green-700',
        suspended: 'bg-red-100 text-red-700',
        published: 'bg-green-100 text-green-700',
        draft: 'bg-gray-100 text-gray-700',
        pending: 'bg-orange-100 text-orange-700',
        confirmed: 'bg-blue-100 text-blue-700',
        cancelled: 'bg-red-100 text-red-700'
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
        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${styles[status] || 'bg-gray-100'}`}>
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
        className={`w-full p-4 rounded-xl flex items-center gap-3 font-bold transition-all mb-2 ${
            activeTab === id 
            ? 'bg-white text-primary shadow-md' 
            : 'text-blue-100 hover:bg-white/10'
        }`}
    >
        <Icon size={20} /> {label}
    </button>
);

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
  const [viewStudent, setViewStudent] = useState<Student | null>(null); // For "View Profile"
  
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [newBooking, setNewBooking] = useState<Partial<Appointment>>({ status: 'confirmed', type: 'live', date: '', time: '' });

  // Post Form State
  const [isEditingPost, setIsEditingPost] = useState(false);
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

    // 1. Load Posts
    const storedPosts = localStorage.getItem(CUSTOM_POSTS_KEY);
    if (storedPosts) setCustomPosts(JSON.parse(storedPosts));

    // 2. Load Appointments
    const storedAppointments = localStorage.getItem(GLOBAL_APPOINTMENTS_KEY);
    if (storedAppointments) setAppointments(JSON.parse(storedAppointments));

    // 3. Load Students (Seed with mock data if empty)
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

    // Click outside handler for notifications
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);

  }, []);

  // --- ACTIONS ---

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

  // --- POST CRUD ---
  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    const postToSave: BlogPost = {
      ...newPost,
      id: newPost.id || `custom-${Date.now()}`,
      date: newPost.date || new Date().toLocaleDateString('ar-MA', { year: 'numeric', month: 'long', day: 'numeric' }),
      author: { name: 'الإدارة', avatar: 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff' },
      image: newPost.image || 'https://picsum.photos/800/600'
    };

    let updatedPosts;
    if (isEditingPost) {
        updatedPosts = customPosts.map(p => p.id === postToSave.id ? postToSave : p);
    } else {
        updatedPosts = [postToSave, ...customPosts];
    }
    
    setCustomPosts(updatedPosts);
    localStorage.setItem(CUSTOM_POSTS_KEY, JSON.stringify(updatedPosts));
    resetPostForm();
    alert(isEditingPost ? 'تم تعديل المقال بنجاح' : 'تم نشر المقال بنجاح');
  };

  const handleDeletePost = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المقال؟')) {
      const updatedPosts = customPosts.filter(p => p.id !== id);
      setCustomPosts(updatedPosts);
      localStorage.setItem(CUSTOM_POSTS_KEY, JSON.stringify(updatedPosts));
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

  // --- STUDENT CRUD ---
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
        stats: { studyHours: 0, commitmentRate: 0, weeklyProgress: [0,0,0,0,0,0,0] }
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

  // --- APPOINTMENT CRUD ---
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

  // --- HELPER FOR ACTIVITY FEED ---
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
            <div className="bg-white p-10 rounded-[2rem] shadow-2xl w-full max-w-md border border-white">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-royal rounded-3xl flex items-center justify-center mx-auto mb-6 text-white shadow-lg shadow-blue-500/30"><Shield size={40} /></div>
                    <h1 className="text-3xl font-extrabold text-gray-900">بوابة الإدارة</h1>
                    <p className="text-gray-500 mt-2">الوصول الآمن للمسؤولين فقط</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div><label className="block text-sm font-bold text-gray-700 mb-2">المعرف الإداري</label><input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full px-5 py-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-primary focus:bg-white outline-none text-lg" dir="ltr" /></div>
                    <div><label className="block text-sm font-bold text-gray-700 mb-2">رمز الدخول</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-5 py-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-primary outline-none text-lg" dir="ltr" /></div>
                    {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold text-center border border-red-100">{error}</div>}
                    <button className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-royal transition-all shadow-lg shadow-blue-500/20 text-lg">تسجيل الدخول</button>
                </form>
                <div className="mt-6 text-center text-xs text-gray-400">
                    <p>demo: admin / admin123</p>
                </div>
            </div>
        </div>
     );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row font-sans" dir="rtl">
        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
            <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
        )}

        {/* Sidebar */}
        <aside className={`
            fixed inset-y-0 right-0 z-50 w-64 lg:w-72 bg-slate-900 text-white p-6 flex flex-col shrink-0
            transform transition-transform duration-300 ease-in-out
            ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
            lg:translate-x-0 lg:static
        `}>
            <div className="flex items-center justify-between mb-10 px-2">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center font-bold text-2xl text-white shadow-lg shadow-blue-500/20">T</div>
                    <div><h2 className="font-bold text-xl">لوحة التحكم</h2><p className="text-xs text-slate-400">v2.0.1 (Beta)</p></div>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-gray-400 hover:text-white"><X size={24} /></button>
            </div>
            <nav className="flex-grow space-y-2">
                <SidebarItem id="overview" label="نظرة عامة" icon={LayoutDashboard} activeTab={activeTab} onClick={handleTabChange} />
                <SidebarItem id="posts" label="إدارة المحتوى" icon={FilePlus} activeTab={activeTab} onClick={handleTabChange} />
                <SidebarItem id="students" label="الطلاب" icon={Users} activeTab={activeTab} onClick={handleTabChange} />
                <SidebarItem id="appointments" label="المواعيد" icon={Calendar} activeTab={activeTab} onClick={handleTabChange} />
            </nav>
            <div className="pt-6 border-t border-slate-800 mt-auto">
                <button onClick={handleLogout} className="w-full p-4 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl flex items-center gap-3 font-bold transition-all"><LogOut size={20} /> خروج</button>
            </div>
        </aside>

        {/* Main Content */}
        <main className="flex-grow h-screen overflow-y-auto relative bg-[#F9FAFB]">
            {/* Header */}
            <header className="bg-white px-4 lg:px-8 py-5 border-b border-gray-200 sticky top-0 z-30 flex justify-between items-center shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-4">
                    <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
                        <Menu size={24} className="text-gray-600" />
                    </button>
                    <h2 className="text-xl lg:text-2xl font-extrabold text-gray-900 tracking-tight">
                        {activeTab === 'overview' && 'نظرة عامة'}
                        {activeTab === 'posts' && 'إدارة المحتوى'}
                        {activeTab === 'students' && 'قاعدة بيانات الطلاب'}
                        {activeTab === 'appointments' && 'المواعيد'}
                    </h2>
                </div>
                
                <div className="flex items-center gap-3 lg:gap-6">
                    {/* Settings Icon */}
                    <div onClick={() => setShowSettings(true)} className="p-2 text-gray-400 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-gray-100 hidden sm:block">
                        <Settings size={20} />
                    </div>

                    <div className="h-8 w-px bg-gray-100 mx-1 hidden md:block"></div>

                    {/* User Profile */}
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowSettings(true)}>
                       <div className="relative">
                          <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-[#0095ff] flex items-center justify-center text-white font-bold text-sm shadow-sm border-2 border-white">
                             AD
                          </div>
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#22c55e] border-2 border-white rounded-full"></div>
                       </div>
                       <div className="text-right hidden md:block">
                          <p className="text-sm font-bold text-gray-900 leading-tight">{adminName}</p>
                          <p className="text-[11px] text-gray-500 font-medium mt-0.5">Super Admin</p>
                       </div>
                    </div>

                    {/* Notification Bell */}
                    <div className="relative" ref={notifRef}>
                        <button 
                            onClick={() => setShowNotifications(!showNotifications)}
                            className={`p-2.5 lg:p-3 bg-white border rounded-2xl text-gray-500 hover:text-primary hover:shadow-md transition-all group ${showNotifications ? 'border-primary text-primary shadow-md' : 'border-gray-100'}`}
                        >
                            <span className="absolute top-2.5 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white group-hover:scale-110 transition-transform"></span>
                            <Bell size={20} />
                        </button>
                        
                        {/* Dropdown */}
                        {showNotifications && (
                            <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 animate-in fade-in slide-in-from-top-2 z-50">
                                <div className="flex justify-between items-center px-4 py-2 border-b border-gray-50 mb-2">
                                    <span className="font-bold text-sm text-gray-900">الإشعارات</span>
                                    <button onClick={() => setShowNotifications(false)} className="text-xs text-primary font-bold">مسح الكل</button>
                                </div>
                                <div className="space-y-1 max-h-64 overflow-y-auto">
                                    {appointments.filter(a => a.status === 'pending').slice(0, 3).map(app => (
                                        <div key={app.id} onClick={() => { setActiveTab('appointments'); setShowNotifications(false); }} className="p-3 hover:bg-gray-50 rounded-xl cursor-pointer flex gap-3 items-start">
                                            <div className="p-2 bg-orange-50 text-orange-500 rounded-full"><Calendar size={16} /></div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-800">حجز جديد: {app.studentName}</p>
                                                <p className="text-xs text-gray-500">{app.date} - {app.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {appointments.filter(a => a.status === 'pending').length === 0 && (
                                        <p className="text-center text-gray-400 text-xs py-4">لا توجد إشعارات جديدة</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <div className="p-4 lg:p-10 max-w-7xl mx-auto">
                
                {/* --- OVERVIEW TAB --- */}
                {activeTab === 'overview' && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: 'إجمالي الطلاب', val: students.length, icon: Users, color: 'bg-blue-600' },
                                { label: 'المقالات الكلية', val: BLOG_POSTS.length + customPosts.length, icon: FilePlus, color: 'bg-purple-600' },
                                { label: 'مواعيد معلقة', val: appointments.filter(a => a.status === 'pending').length, icon: Clock, color: 'bg-orange-500' },
                                { label: 'المواعيد المؤكدة', val: appointments.filter(a => a.status === 'confirmed').length, icon: CheckCircle, color: 'bg-green-500' }
                            ].map((stat, i) => (
                                <div key={i} className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 hover:-translate-y-1 transition-all duration-300 group">
                                    <div className="flex justify-between items-start mb-4"><div className={`p-3.5 rounded-xl text-white shadow-lg ${stat.color} group-hover:scale-110 transition-transform`}><stat.icon size={24} /></div></div>
                                    <h3 className="text-3xl font-black text-gray-900 mb-1">{stat.val}</h3>
                                    <p className="text-sm text-gray-500 font-bold opacity-80">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                        
                        {/* Charts & Activity */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="font-bold text-xl text-gray-900">النشاط الأخير</h3>
                                    <button onClick={() => setActiveTab('appointments')} className="text-sm text-primary font-bold hover:underline">عرض الكل</button>
                                </div>
                                <div className="space-y-5">
                                    {getActivityFeed().map((item: any, i) => (
                                        <div key={i} className="flex items-center gap-5 pb-5 border-b border-gray-50 last:border-0 last:pb-0 group">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${item.type === 'post' ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-100' : 'bg-orange-50 text-orange-600 group-hover:bg-orange-100'}`}>
                                                {item.type === 'post' ? <PenTool size={20} /> : <Calendar size={20} />}
                                            </div>
                                            <div className="flex-grow">
                                                <p className="text-sm font-bold text-gray-900 mb-0.5 group-hover:text-primary transition-colors">{item.title}</p>
                                                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                                   <span>{item.type === 'post' ? 'تم النشر بواسطة' : 'قام بالحجز'}</span>
                                                   <span className="font-bold text-gray-700">{item.user}</span>
                                                </div>
                                            </div>
                                            <span className="text-xs font-bold bg-gray-50 px-3 py-1.5 rounded-lg text-gray-500 border border-gray-100">{item.date}</span>
                                        </div>
                                    ))}
                                    {getActivityFeed().length === 0 && <p className="text-gray-400 text-center py-6">لا يوجد نشاط حديث.</p>}
                                </div>
                            </div>
                            
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
                                <h3 className="font-bold text-xl mb-8 text-gray-900">توزيع الطلاب</h3>
                                <div className="flex-grow flex items-center justify-center">
                                    <div className="flex gap-6 items-end h-56 w-full px-2">
                                        {['2 باك', '1 باك', 'جذع'].map((level, i) => {
                                            const count = students.filter(s => s.grade.includes(level)).length;
                                            const height = count > 0 ? (count / students.length) * 100 : 10;
                                            return (
                                                <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                                                     <div className="w-full bg-gray-100 rounded-t-2xl relative overflow-hidden" style={{ height: `${height}%`, minHeight: '40px' }}>
                                                         <div className="absolute inset-0 bg-primary opacity-80 group-hover:opacity-100 transition-opacity"></div>
                                                         <div className="absolute -top-8 left-1/2 -translate-x-1/2 font-bold text-gray-900 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">{count}</div>
                                                     </div>
                                                     <span className="text-xs font-bold text-gray-500">{level}</span>
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
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in">
                        <div className="lg:col-span-1 bg-white p-6 lg:p-8 rounded-3xl shadow-sm border border-gray-100 h-fit lg:sticky lg:top-28">
                             <h3 className="font-extrabold text-xl mb-8 flex items-center gap-3 text-gray-900">
                                <div className="p-2 bg-blue-50 rounded-lg text-primary"><PenTool size={22} /></div>
                                {isEditingPost ? 'تعديل المقال' : 'إضافة مقال جديد'}
                             </h3>
                             <form onSubmit={handleSavePost} className="space-y-5">
                                <div><label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wider">العنوان</label><input type="text" required value={newPost.title || ''} onChange={e => setNewPost({...newPost, title: e.target.value})} className="w-full p-4 rounded-xl border border-gray-200 focus:border-primary outline-none bg-gray-50 focus:bg-white transition-colors font-bold" placeholder="اكتب عنواناً جذاباً..." /></div>
                                <div><label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wider">التصنيف</label><select value={newPost.category || 'نصائح'} onChange={e => setNewPost({...newPost, category: e.target.value})} className="w-full p-4 rounded-xl border border-gray-200 outline-none bg-white font-medium"><option>نصائح</option><option>تقنيات</option><option>توجيه</option><option>الحفظ والمراجعة</option><option>الصحة والدراسة</option></select></div>
                                <div><label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wider">صورة (URL)</label><input type="text" value={newPost.image || ''} onChange={e => setNewPost({...newPost, image: e.target.value})} className="w-full p-4 rounded-xl border border-gray-200 outline-none text-sm bg-gray-50 focus:bg-white" placeholder="https://..." dir="ltr" /></div>
                                <div><label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wider">مقتطف</label><textarea required value={newPost.excerpt || ''} onChange={e => setNewPost({...newPost, excerpt: e.target.value})} className="w-full p-4 rounded-xl border border-gray-200 outline-none h-24 resize-none text-sm bg-gray-50 focus:bg-white"></textarea></div>
                                <div className="flex items-center gap-4 pt-4"><button type="submit" className="flex-1 py-4 bg-primary text-white font-bold rounded-xl hover:bg-blue-600 shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-1">{isEditingPost ? 'حفظ التعديلات' : 'نشر المقال'}</button>{isEditingPost && (<button type="button" onClick={resetPostForm} className="px-6 py-4 bg-gray-100 text-gray-500 font-bold rounded-xl hover:bg-gray-200 transition-colors">إلغاء</button>)}</div>
                             </form>
                        </div>
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                                <div className="max-h-[700px] overflow-y-auto custom-scrollbar">
                                    <table className="w-full text-right relative">
                                        <thead className="bg-gray-50 text-gray-500 text-xs font-extrabold uppercase sticky top-0 z-10 border-b border-gray-100"><tr><th className="p-6">المقال</th><th className="p-6 hidden sm:table-cell">الحالة</th><th className="p-6 hidden md:table-cell">التاريخ</th><th className="p-6">إجراءات</th></tr></thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {customPosts.map(post => (
                                                <tr key={post.id} className="hover:bg-blue-50/30 transition-colors group"><td className="p-6"><div className="flex items-center gap-4"><img src={post.image} className="w-12 h-12 rounded-xl object-cover shadow-sm" alt="" /><div><p className="font-bold text-gray-900 text-sm line-clamp-1 mb-1">{post.title}</p><span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded">{post.category}</span></div></div></td><td className="p-6 hidden sm:table-cell"><StatusBadge status={post.status || 'published'} /></td><td className="p-6 text-sm font-bold text-gray-400 hidden md:table-cell">{post.date}</td><td className="p-6"><div className="flex gap-2 opacity-100 lg:opacity-50 group-hover:opacity-100 transition-opacity"><button onClick={() => handleEditPost(post)} className="p-2.5 text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"><PenTool size={18} /></button><button onClick={() => handleDeletePost(post.id)} className="p-2.5 text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"><Trash2 size={18} /></button></div></td></tr>
                                            ))}
                                            {customPosts.length === 0 && <tr><td colSpan={4} className="p-12 text-center text-gray-400 font-medium">لا توجد مقالات مضافة يدوياً. ابدأ بالكتابة الآن!</td></tr>}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- STUDENTS TAB --- */}
                {activeTab === 'students' && (
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden animate-in fade-in">
                         <div className="p-6 lg:p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-white">
                            <div className="relative w-full max-w-md">
                                <Search size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input 
                                  type="text" 
                                  placeholder="بحث عن طالب (الاسم، اسم المستخدم)..." 
                                  value={studentSearch}
                                  onChange={(e) => setStudentSearch(e.target.value)}
                                  className="w-full pl-4 pr-12 py-3.5 bg-gray-50 rounded-2xl border border-gray-200 text-sm font-bold outline-none focus:border-primary focus:bg-white transition-all shadow-inner" 
                                />
                                {studentSearch && (
                                    <button 
                                        onClick={() => setStudentSearch('')}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                            <div className="flex flex-wrap justify-center items-center gap-4 w-full md:w-auto">
                                <span className="text-gray-400 text-sm font-bold"> {filteredStudents.length} طالب </span>
                                <button onClick={() => handleOpenStudentModal()} className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-primary shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all w-full md:w-auto justify-center"><UserPlus size={18} /> إضافة طالب</button>
                            </div>
                         </div>
                         <div className="overflow-x-auto">
                             <table className="w-full text-right min-w-[800px]">
                                <thead className="bg-gray-50 text-gray-400 text-xs font-extrabold uppercase tracking-wider">
                                    <tr>
                                        <th className="p-6">الاسم</th>
                                        <th className="p-6">اسم المستخدم</th>
                                        <th className="p-6">المستوى</th>
                                        <th className="p-6">الحالة</th>
                                        <th className="p-6 text-center">الإجراءات</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredStudents.map(student => (
                                        <tr key={student.id} className="hover:bg-gray-50 transition-colors group">
                                            <td className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-gray-100 p-0.5 border border-gray-200 overflow-hidden">
                                                        <img src={student.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.username}`} className="w-full h-full object-cover" alt="" />
                                                    </div>
                                                    <span className="font-bold text-gray-900 text-base">{student.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-6 font-mono text-sm text-gray-500 font-bold" dir="ltr">{student.username}</td>
                                            <td className="p-6"><span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">{student.grade}</span></td>
                                            <td className="p-6"><StatusBadge status={student.status} /></td>
                                            <td className="p-6">
                                                <div className="flex items-center justify-center gap-4">
                                                    <button onClick={() => setViewStudent(student)} className="text-gray-400 hover:text-primary text-xs font-bold underline transition-colors decoration-2 underline-offset-4">عرض الملف</button>
                                                    <div className="flex gap-2 opacity-100 lg:opacity-20 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => handleOpenStudentModal(student)} className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors" title="تعديل"><Edit size={16} /></button>
                                                        <button onClick={() => toggleStudentStatus(student.id)} className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${student.status === 'active' ? 'text-orange-500 bg-orange-50 hover:bg-orange-100' : 'text-green-500 bg-green-50 hover:bg-green-100'}`} title={student.status === 'active' ? 'تجميد' : 'تنشيط'}>{student.status === 'active' ? <Ban size={16} /> : <Unlock size={16} />}</button>
                                                        <button onClick={() => deleteStudent(student.id)} className="p-2 text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors" title="حذف"><Trash2 size={16} /></button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredStudents.length === 0 && (
                                        <tr><td colSpan={5} className="p-12 text-center text-gray-400 font-medium">لم يتم العثور على طلاب مطابقين للبحث.</td></tr>
                                    )}
                                </tbody>
                             </table>
                         </div>
                    </div>
                )}

                {/* --- APPOINTMENTS TAB --- */}
                {activeTab === 'appointments' && (
                    <div className="space-y-8 animate-in fade-in">
                        <div className="flex justify-end">
                             <button onClick={handleOpenAppointmentModal} className="w-full md:w-auto flex items-center justify-center gap-2 bg-orange-500 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-orange-200 hover:bg-orange-600 hover:-translate-y-0.5 transition-all"><CalendarPlus size={20} /> حجز موعد جديد</button>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-white p-6 lg:p-8 rounded-[2.5rem] shadow-sm border border-gray-100 h-fit">
                                <h3 className="font-extrabold text-lg mb-8 flex items-center gap-2 text-orange-500 bg-orange-50 w-fit px-4 py-2 rounded-xl">
                                    <Clock size={20} /> طلبات قيد الانتظار
                                </h3>
                                <div className="space-y-5 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                    {appointments.filter(a => a.status === 'pending').map(app => (
                                        <div key={app.id} className="p-6 rounded-3xl bg-orange-50 border border-orange-100 relative group transition-all hover:bg-white hover:shadow-md hover:border-orange-200">
                                            <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-2">
                                                <div>
                                                    <h4 className="font-bold text-gray-900 text-lg mb-1">{app.title}</h4>
                                                    <p className="text-sm text-gray-600 font-medium flex items-center gap-2"><Users size={14}/> {app.studentName}</p>
                                                </div>
                                                <span className="text-xs font-bold bg-white px-3 py-1.5 rounded-lg text-orange-600 shadow-sm">{app.date}</span>
                                            </div>
                                            <div className="flex items-center gap-3 mt-6">
                                                <button onClick={() => updateAppointmentStatus(app.id, 'confirmed')} className="flex-1 py-3 bg-green-500 text-white rounded-xl text-sm font-bold hover:bg-green-600 flex items-center justify-center gap-2 transition-all shadow-sm"><Check size={16} /> قبول</button>
                                                <button onClick={() => updateAppointmentStatus(app.id, 'cancelled')} className="flex-1 py-3 bg-white text-red-500 border border-red-100 rounded-xl text-sm font-bold hover:bg-red-50 flex items-center justify-center gap-2 transition-all"><XCircle size={16} /> رفض</button>
                                            </div>
                                        </div>
                                    ))}
                                    {appointments.filter(a => a.status === 'pending').length === 0 && <p className="text-center text-gray-400 py-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 font-bold">لا توجد طلبات جديدة.</p>}
                                </div>
                            </div>
                            
                            <div className="bg-white p-6 lg:p-8 rounded-[2.5rem] shadow-sm border border-gray-100 h-fit">
                                <h3 className="font-extrabold text-lg mb-8 flex items-center gap-2 text-green-600 bg-green-50 w-fit px-4 py-2 rounded-xl">
                                    <CheckCircle size={20} /> المواعيد المؤكدة
                                </h3>
                                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                    {appointments.filter(a => a.status !== 'pending').map(app => (
                                        <div key={app.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl bg-white border border-gray-100 group hover:shadow-md transition-all gap-4">
                                            <div><h4 className="font-bold text-gray-900 text-sm mb-1">{app.title}</h4><p className="text-xs text-gray-400 font-medium">{app.studentName} • {app.date}</p></div>
                                            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                                                <StatusBadge status={app.status} />
                                                <button onClick={() => deleteAppointment(app.id)} className="text-red-300 hover:text-red-600 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-all p-2 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                                            </div>
                                        </div>
                                    ))}
                                    {appointments.filter(a => a.status !== 'pending').length === 0 && <p className="text-center text-gray-400 py-8 bg-gray-50 rounded-2xl font-bold">السجل فارغ.</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </main>

        {/* --- MODALS --- */}
        
        {/* Student View Profile Modal (Read Only) */}
        {viewStudent && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
                <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg p-8 animate-in zoom-in-95 duration-300 relative overflow-hidden">
                    <button onClick={() => setViewStudent(null)} className="absolute top-6 left-6 p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors z-10"><X size={24}/></button>
                    
                    <div className="text-center mb-8 relative">
                        <div className="w-28 h-28 rounded-full p-1 border-4 border-white shadow-lg bg-gray-100 mx-auto relative z-10">
                            <img src={viewStudent.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${viewStudent.username}`} alt="Profile" className="w-full h-full object-cover rounded-full" />
                        </div>
                        <div className="absolute top-1/2 left-0 w-full h-32 bg-gradient-to-b from-primary/10 to-transparent -z-0 -translate-y-1/2 rounded-b-full"></div>
                        <h3 className="text-2xl font-extrabold text-gray-900 mt-4">{viewStudent.name}</h3>
                        <p className="text-gray-500 font-mono font-bold text-sm">@{viewStudent.username}</p>
                        <div className="flex justify-center gap-2 mt-3">
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">{viewStudent.grade}</span>
                            <StatusBadge status={viewStudent.status} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-gray-50 p-4 rounded-2xl text-center border border-gray-100">
                            <div className="text-primary mb-2 flex justify-center"><Clock size={24} /></div>
                            <h4 className="text-2xl font-bold text-gray-900">{viewStudent.stats?.studyHours || 0}</h4>
                            <p className="text-xs text-gray-500 font-bold">ساعات الدراسة</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-2xl text-center border border-gray-100">
                            <div className="text-green-500 mb-2 flex justify-center"><Activity size={24} /></div>
                            <h4 className="text-2xl font-bold text-gray-900">{viewStudent.stats?.commitmentRate || 0}%</h4>
                            <p className="text-xs text-gray-500 font-bold">معدل الالتزام</p>
                        </div>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                        <div className="flex justify-between items-end h-24 gap-2 px-2">
                            {(viewStudent.stats?.weeklyProgress || [0,0,0,0,0,0,0]).map((h, i) => (
                                <div key={i} className="flex-1 w-full bg-blue-200 rounded-t-lg relative overflow-hidden">
                                    <div className="absolute bottom-0 w-full bg-primary" style={{ height: `${h}%` }}></div>
                                </div>
                            ))}
                        </div>
                        <p className="text-center text-xs text-blue-400 font-bold mt-3">النشاط الأسبوعي</p>
                    </div>
                </div>
            </div>
        )}

        {/* Settings Modal */}
        {showSettings && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-in zoom-in-95">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900">الإعدادات</h3>
                        <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20}/></button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-bold text-gray-700 mb-1 block">اسم المسؤول</label>
                            <input type="text" value={adminName} onChange={e => setAdminName(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary font-bold" />
                        </div>
                        <div className="pt-4">
                            <button onClick={() => { alert('تم حفظ الإعدادات'); setShowSettings(false); }} className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-600 shadow-lg">حفظ التغييرات</button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Student Modal */}
        {showStudentModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
             <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-8 animate-in zoom-in-95 duration-300 border border-gray-100">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-extrabold flex items-center gap-3 text-gray-900">
                        <div className={`p-3 rounded-xl ${currentStudent.id ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                            {currentStudent.id ? <Edit size={20} /> : <UserPlus size={20} />}
                        </div>
                        {currentStudent.id ? 'تعديل بيانات الطالب' : 'إضافة طالب جديد'}
                    </h3>
                    <button onClick={() => setShowStudentModal(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"><X size={24}/></button>
                </div>
                <form onSubmit={handleSaveStudent} className="space-y-6">
                   <div><label className="text-xs font-bold block mb-2 text-gray-500 uppercase tracking-wider">الاسم الكامل</label><input required type="text" value={currentStudent.name || ''} onChange={e => setCurrentStudent({...currentStudent, name: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary focus:bg-white transition-all font-bold text-gray-900" placeholder="مثال: أحمد التلميذ" /></div>
                   <div><label className="text-xs font-bold block mb-2 text-gray-500 uppercase tracking-wider">اسم المستخدم (للدخول)</label><input required type="text" value={currentStudent.username || ''} onChange={e => setCurrentStudent({...currentStudent, username: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary focus:bg-white transition-all font-mono text-sm" placeholder="ahmed123" dir="ltr" /></div>
                   <div><label className="text-xs font-bold block mb-2 text-gray-500 uppercase tracking-wider">المستوى الدراسي</label><select value={currentStudent.grade || '2 باكالوريا'} onChange={e => setCurrentStudent({...currentStudent, grade: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary bg-white font-bold text-gray-700"><option>2 باكالوريا</option><option>1 باكالوريا</option><option>جذع مشترك</option></select></div>
                   <div className="flex gap-3 pt-4">
                      <button type="submit" className="flex-1 bg-primary text-white py-4 rounded-xl font-bold hover:bg-blue-600 shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5">حفظ البيانات</button>
                      <button type="button" onClick={() => setShowStudentModal(false)} className="px-6 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all">إلغاء</button>
                   </div>
                </form>
             </div>
          </div>
        )}

        {/* Appointment Modal */}
        {showAppointmentModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
             <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-8 animate-in zoom-in-95 duration-300">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-extrabold flex items-center gap-3 text-gray-900">
                        <div className="p-3 bg-orange-50 text-orange-500 rounded-xl"><CalendarPlus size={22} /></div>
                        حجز موعد لطالب
                    </h3>
                    <button onClick={() => setShowAppointmentModal(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600"><X size={24}/></button>
                </div>
                <form onSubmit={handleSaveAppointment} className="space-y-6">
                   <div>
                        <label className="text-xs font-bold block mb-2 text-gray-500 uppercase tracking-wider">الطالب</label>
                        <select required value={newBooking.studentName || ''} onChange={e => setNewBooking({...newBooking, studentName: e.target.value})} className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none focus:border-orange-500 transition-all font-bold text-gray-900">
                           <option value="">اختر الطالب...</option>
                           {students.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                        </select>
                   </div>
                   <div><label className="text-xs font-bold block mb-2 text-gray-500 uppercase tracking-wider">نوع الموعد</label><input required type="text" value={newBooking.title || ''} onChange={e => setNewBooking({...newBooking, title: e.target.value})} placeholder="مثال: حصة دعم رياضيات" className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none focus:border-orange-500 transition-all font-bold" /></div>
                   <div className="grid grid-cols-2 gap-4">
                       <div><label className="text-xs font-bold block mb-2 text-gray-500 uppercase tracking-wider">التاريخ</label><input required type="date" value={newBooking.date || ''} onChange={e => setNewBooking({...newBooking, date: e.target.value})} className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none focus:border-orange-500 transition-all font-medium text-sm" /></div>
                       <div><label className="text-xs font-bold block mb-2 text-gray-500 uppercase tracking-wider">الوقت</label><input required type="time" value={newBooking.time || ''} onChange={e => setNewBooking({...newBooking, time: e.target.value})} className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none focus:border-orange-500 transition-all font-medium text-sm" /></div>
                   </div>
                   <div className="flex gap-3 pt-4">
                      <button type="submit" className="flex-1 bg-orange-500 text-white py-4 rounded-xl font-bold hover:bg-orange-600 shadow-lg shadow-orange-500/20 transition-all hover:-translate-y-0.5">تأكيد الحجز</button>
                      <button type="button" onClick={() => setShowAppointmentModal(false)} className="px-6 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all">إلغاء</button>
                   </div>
                </form>
             </div>
          </div>
        )}

    </div>
  );
};
