
import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Clock, Calendar, Star, Download, PlayCircle, User, ChevronRight, LogOut, Lock, AlertCircle, X, Camera, Check, HelpCircle, Video, FileText, Play, Key, Pause, Volume2, Maximize, Bookmark, BarChart, Activity, TrendingUp, Plus, Share2, Eye, Minimize2, MessageSquare, Send, MoreVertical, LayoutDashboard, Library, Film } from 'lucide-react';
import { dataManager } from '../utils/dataManager';
import { Appointment } from '../types';

const PREDEFINED_AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Cal',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Milo',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sasha',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe',
];

const TOUR_STEPS = [
  { target: 'welcome-banner', title: 'لوحة القيادة 🚀', content: 'هنا تظهر إحصائياتك. اضغط على البطاقات لرؤية تفاصيل تقدمك.', position: 'bottom' },
  { target: 'navigation-tabs', title: 'التنقل السريع ⚡', content: 'استخدم هذه القائمة للتنقل بين المحاضرات، المقالات، وجدول المواعيد بسهولة.', position: 'bottom' },
  { target: 'tour-profile', title: 'ملفك الشخصي 👤', content: 'هنا تظهر معلوماتك. يمكنك تعديل صورتك وبياناتك بالضغط على زر التعديل.', position: 'left' }
];

// Premium Content Mock
const PREMIUM_VIDEOS = [
  { id: 1, title: "شرح منهجية الفلسفة - المقدمة", duration: "15:30", thumbnail: "https://images.unsplash.com/photo-1555445054-dab5432125bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", subject: "فلسفة" },
  { id: 2, title: "أسرار التعامل مع دالة اللوغاريتم", duration: "22:45", thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", subject: "رياضيات" },
  { id: 3, title: "كيفية تحليل النص الأدبي بامتياز", duration: "18:10", thumbnail: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", subject: "لغة عربية" }
];

const EXCLUSIVE_ARTICLES = [
  { id: 1, title: "خطة المراجعة المكثفة للـ 30 يوم الأخيرة", category: "استراتيجيات", readTime: "5 د", image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", content: `<h3 class="text-xl font-bold mb-4">كيف تستغل الشهر الأخير بفعالية؟</h3><p>الثلاثون يوماً الأخيرة قبل الامتحان هي الفترة الحاسمة...</p>` },
  { id: 2, title: "أخطاء قاتلة يرتكبها التلاميذ يوم الامتحان الوطني", category: "توجيه", readTime: "7 د", image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", content: `<h3 class="text-xl font-bold mb-4">تجنب هذه الأخطاء</h3><p>يوم الامتحان، العامل النفسي يلعب دوراً...</p>` },
  { id: 3, title: "كيف ترفع معدلك الدراسي بدون زيادة ساعات الدراسة؟", category: "إنتاجية", readTime: "6 د", image: "https://images.unsplash.com/photo-1506784365847-bbad939e9335?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", content: `<h3 class="text-xl font-bold mb-4">ادرس بذكاء</h3><p>المعادلة بسيطة: جودة الدراسة > كمية الدراسة...</p>` }
];

const useCountUp = (end: number, duration: number = 2000, start: boolean = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [end, duration, start]);
  return count;
};

interface ChatMessage { id: number; text: string; sender: 'user' | 'admin'; timestamp: Date; }
type ActiveTab = 'dashboard' | 'videos' | 'articles' | 'schedule';

export const StudentArea: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [tempAvatar, setTempAvatar] = useState('');
  const [tempName, setTempName] = useState('');
  const [tempGrade, setTempGrade] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);
  const [focusMode, setFocusMode] = useState(false);
  const [readingArticle, setReadingArticle] = useState<any>(null);
  const [savedPosts, setSavedPosts] = useState<any[]>([]);
  
  // Dynamic Appointments specific to this user
  const [userAppointments, setUserAppointments] = useState<any[]>([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState({ title: 'جلسة توجيه فردية', date: '', time: '' });

  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Using stats from user object or defaults
  const animatedHours = useCountUp(user?.stats?.studyHours || 0, 1500, !!user);
  const animatedRate = useCountUp(user?.stats?.commitmentRate || 0, 1500, !!user);

  // Load User Session & Data
  useEffect(() => {
    const storedUser = localStorage.getItem('tilmid_user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      // Re-fetch user to get updates (like status change or stats update)
      const freshUser = dataManager.getStudents().find(u => u.username === userData.username);
      if (freshUser && freshUser.status === 'active') {
          setUser(freshUser);
      } else {
          // Logout if suspended or deleted
          localStorage.removeItem('tilmid_user');
          setUser(null);
      }
    }
    setLoading(false);
  }, []);

  // Load Saved Posts, Chat, Appointments
  useEffect(() => {
    if (user) {
      // Bookmarks
      const bookmarkIds = JSON.parse(localStorage.getItem('tilmid_bookmarks') || '[]');
      const allPosts = dataManager.getPosts();
      setSavedPosts(allPosts.filter(post => bookmarkIds.includes(post.id)));

      // Appointments (Sync with Global)
      const allApps = dataManager.getAppointments();
      // Filter appointments for this user (by name match or ideally ID)
      const myApps = allApps.filter(a => a.studentName === user.name).map(a => {
          const d = new Date(a.date);
          const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "ماي", "يونيو", "يوليوز", "غشت", "شتنبر", "أكتوبر", "نونبر", "دجنبر"];
          return {
              ...a,
              month: monthNames[d.getMonth()],
              displayDate: d.getDate().toString()
          };
      });
      setUserAppointments(myApps);

      // Tour
      if (!localStorage.getItem('tilmid_tour_completed')) setTimeout(() => setShowTour(true), 500);

      // Chat
      const storedChat = localStorage.getItem(`tilmid_chat_${user.username}`);
      if (storedChat) {
          const parsedChat = JSON.parse(storedChat).map((msg: any) => ({ ...msg, timestamp: new Date(msg.timestamp) }));
          setChatMessages(parsedChat);
      } else {
          setChatMessages([{ id: 1, text: `مرحباً ${user.name}! 👋 أنا المشرف التربوي. كيف يمكنني مساعدتك اليوم؟`, sender: 'admin', timestamp: new Date() }]);
      }
    }
  }, [user, activeTab]); // Re-run when tab changes to refresh appointments

  // Auto-scroll chat
  useEffect(() => { if (chatOpen) chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMessages, chatOpen]);

  const removeBookmark = (postId: string) => {
     const bookmarks = JSON.parse(localStorage.getItem('tilmid_bookmarks') || '[]');
     const newBookmarks = bookmarks.filter((id: string) => id !== postId);
     localStorage.setItem('tilmid_bookmarks', JSON.stringify(newBookmarks));
     setSavedPosts(savedPosts.filter(p => p.id !== postId));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // Authenticate against dynamic DB
    const students = dataManager.getStudents();
    const account = students.find(acc => acc.username.toLowerCase() === username.toLowerCase() && acc.password === password);

    if (account) {
      if (account.status === 'suspended') {
          setError('تم تعليق حسابك. المرجو التواصل مع الإدارة.');
          return;
      }
      setUser(account);
      localStorage.setItem('tilmid_user', JSON.stringify(account));
    } else {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('tilmid_user');
    setUser(null);
    setUsername(''); setPassword(''); setShowTour(false); setPlayingVideo(null); setFocusMode(false); setReadingArticle(null); setShowStatsModal(false); setShowBookingModal(false); setChatOpen(false); setActiveTab('dashboard');
  };

  const handleSendMessage = (e: React.FormEvent) => {
      e.preventDefault();
      if (!chatInput.trim()) return;
      const newUserMsg: ChatMessage = { id: Date.now(), text: chatInput, sender: 'user', timestamp: new Date() };
      const updatedMessages = [...chatMessages, newUserMsg];
      setChatMessages(updatedMessages);
      setChatInput('');
      if (user) localStorage.setItem(`tilmid_chat_${user.username}`, JSON.stringify(updatedMessages));

      setTimeout(() => {
          const adminMsg: ChatMessage = { id: Date.now() + 1, text: "شكراً على رسالتك. سأقوم بمراجعة طلبك والرد عليك قريباً.", sender: 'admin', timestamp: new Date() };
          const withAdmin = [...updatedMessages, adminMsg];
          setChatMessages(withAdmin);
          if (user) localStorage.setItem(`tilmid_chat_${user.username}`, JSON.stringify(withAdmin));
      }, 1500);
  };

  const openProfileModal = () => { setTempAvatar(user.avatar || ''); setTempName(user.name || ''); setTempGrade(user.grade || ''); setShowProfileModal(true); };
  const handleAvatarSelect = (url: string) => setTempAvatar(url);
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { const reader = new FileReader(); reader.onloadend = () => setTempAvatar(reader.result as string); reader.readAsDataURL(file); }
  };
  const saveProfile = () => {
    const updatedUser = { ...user, avatar: tempAvatar, name: tempName, grade: tempGrade };
    // Save to local state AND global DB
    dataManager.saveStudent(updatedUser);
    setUser(updatedUser);
    localStorage.setItem('tilmid_user', JSON.stringify(updatedUser));
    setShowProfileModal(false);
  };

  // Tour Logic
  const nextStep = () => tourStep < TOUR_STEPS.length - 1 ? setTourStep(prev => prev + 1) : finishTour();
  const prevStep = () => tourStep > 0 && setTourStep(prev => prev - 1);
  const finishTour = () => {
    setShowTour(false); localStorage.setItem('tilmid_tour_completed', 'true');
    document.querySelectorAll('.tour-highlight').forEach(el => el.classList.remove('tour-highlight', 'relative', 'z-50', 'bg-white', 'shadow-2xl', 'ring-4', 'ring-primary/50', 'rounded-2xl'));
  };
  useEffect(() => {
    if (!showTour) return;
    const step = TOUR_STEPS[tourStep];
    document.querySelectorAll('.tour-highlight').forEach(el => el.classList.remove('tour-highlight', 'relative', 'z-50', 'bg-white', 'shadow-2xl', 'ring-4', 'ring-primary/50', 'rounded-2xl'));
    const element = document.getElementById(step.target);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('tour-highlight', 'relative', 'z-50', 'bg-white', 'shadow-2xl', 'ring-4', 'ring-primary/50');
        if (!element.className.includes('rounded') && step.target !== 'welcome-banner') element.classList.add('rounded-2xl');
        if (step.target === 'welcome-banner') element.classList.add('rounded-3xl');
    }
  }, [tourStep, showTour]);

  // Booking Logic
  const handleAddAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if(!newAppointment.date || !newAppointment.time) return;
    
    const globalApp: Appointment = {
        id: Date.now(),
        studentName: user.name,
        title: newAppointment.title,
        date: newAppointment.date,
        time: newAppointment.time,
        status: 'pending',
        type: 'live'
    };
    
    dataManager.saveAppointment(globalApp);
    
    // Refresh local view
    const d = new Date(newAppointment.date);
    const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "ماي", "يونيو", "يوليوز", "غشت", "شتنبر", "أكتوبر", "نونبر", "دجنبر"];
    setUserAppointments([...userAppointments, { ...globalApp, month: monthNames[d.getMonth()], displayDate: d.getDate().toString() }]);

    setShowBookingModal(false);
    setNewAppointment({ title: 'جلسة توجيه فردية', date: '', time: '' });
    alert('تم إرسال طلب الحجز بنجاح! سيتم تأكيده قريباً من طرف الإدارة.');
  };

  if (loading) return null;

  // --- LOGIN RENDER ---
  if (!user) {
     return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-20">
        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-primary"><Lock size={32} /></div>
            <h1 className="text-2xl font-bold text-gray-900">تسجيل الدخول</h1>
            <p className="text-gray-500 mt-2">مرحباً بك في مساحة الطالب. المرجو إدخال بياناتك للمتابعة.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">اسم المستخدم</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="أدخل اسم المستخدم" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">كلمة المرور</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="••••••••" dir="ltr" />
            </div>
            {error && <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 text-right animate-in fade-in slide-in-from-top-2 duration-300"><AlertCircle className="text-red-500 shrink-0" size={20} /><span className="text-red-600 font-bold text-sm">{error}</span></div>}
            <button type="submit" className="w-full bg-gradient-to-r from-primary to-royal text-white font-bold py-4 rounded-xl hover:shadow-xl hover:-translate-y-0.5 transition-all shadow-lg shadow-blue-500/30 transform active:scale-[0.98]">دخول</button>
          </form>
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100 text-right">
            <p className="font-bold text-primary text-sm mb-2 flex items-center gap-2"><Key size={16} /> حسابات تجريبية:</p>
            <div className="space-y-2 text-xs text-gray-600" dir="ltr">
              <div className="flex justify-between bg-white p-2 rounded-lg border border-blue-100"><span>User: <span className="font-mono font-bold text-primary">amin</span></span><span>Pass: 123</span></div>
              <div className="flex justify-between bg-white p-2 rounded-lg border border-blue-100"><span>User: <span className="font-mono font-bold text-primary">sara</span></span><span>Pass: 123</span></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const activeVideoData = PREMIUM_VIDEOS.find(v => v.id === playingVideo);
  
  // --- DASHBOARD RENDER ---
  return (
    <div className="min-h-screen bg-gray-50 py-12 relative">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Welcome Banner */}
        <div id="welcome-banner" className="bg-gradient-to-r from-primary to-royal rounded-3xl p-8 lg:p-10 text-white shadow-2xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative" id="tour-profile">
                <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full border-4 border-white/30 bg-white overflow-hidden shadow-lg relative">
                  <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <button onClick={openProfileModal} className="absolute bottom-0 right-0 bg-white text-primary p-1.5 rounded-full shadow-md hover:bg-gray-100 transition-colors"><Camera size={14} /></button>
              </div>
              <div><h1 className="text-2xl lg:text-4xl font-bold mb-2">مرحباً، {user.name} 👋</h1><p className="text-blue-100 text-lg">{user.grade} • مسار التميز</p></div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
               <div className="flex gap-4 text-center">
                 <div onClick={() => setShowStatsModal(true)} className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 hover:bg-white/20 transition-all cursor-pointer hover:scale-105 active:scale-95 min-w-[100px]"><h3 className="text-2xl lg:text-3xl font-bold">{animatedHours}</h3><p className="text-xs text-blue-100 font-bold mt-1">ساعة دراسة</p></div>
                 <div onClick={() => setShowStatsModal(true)} className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 hover:bg-white/20 transition-all cursor-pointer hover:scale-105 active:scale-95 min-w-[100px]"><h3 className="text-2xl lg:text-3xl font-bold">{animatedRate}%</h3><p className="text-xs text-blue-100 font-bold mt-1">معدل الالتزام</p></div>
               </div>
            </div>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="sticky top-20 z-40 bg-white/95 backdrop-blur-sm py-3 mb-8 border-b border-gray-100 shadow-sm transition-all duration-300">
            <div className="flex items-center justify-between gap-4 px-2">
                 <div id="navigation-tabs" className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar flex-grow">
                    {[ { id: 'dashboard', label: 'لوحة القيادة', icon: LayoutDashboard }, { id: 'videos', label: 'المحاضرات', icon: Film }, { id: 'articles', label: 'المكتبة', icon: Library }, { id: 'schedule', label: 'المواعيد', icon: Calendar } ].map((tab) => (
                        <button 
                          key={tab.id} 
                          onClick={() => setActiveTab(tab.id as ActiveTab)} 
                          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold transition-all duration-300 whitespace-nowrap transform ${
                            activeTab === tab.id 
                            ? 'bg-primary text-white shadow-lg shadow-blue-500/30 scale-105' 
                            : 'bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-primary border border-transparent hover:border-blue-100'
                          }`}
                        >
                          <tab.icon size={18} />
                          {tab.label}
                        </button>
                    ))}
                </div>
                <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-500 rounded-full font-bold hover:bg-red-500 hover:text-white transition-all shrink-0 shadow-sm hover:shadow-md border border-red-100 group">
                  <LogOut size={18} className="group-hover:rotate-180 transition-transform duration-300" />
                  <span className="hidden lg:inline">تسجيل الخروج</span>
                </button>
            </div>
        </div>

        {/* --- CONTENT VIEWS --- */}
        {/* 1. DASHBOARD */}
        {activeTab === 'dashboard' && (
            <div key="dashboard" className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white rounded-3xl shadow-sm hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100 h-fit">
                        <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Calendar className="text-orange-500" /> المواعيد القادمة</h2><button onClick={() => setShowBookingModal(true)} className="text-xs bg-orange-50 text-orange-600 font-bold px-3 py-1.5 rounded-lg hover:bg-orange-100 transition-colors">+ حجز</button></div>
                        <div className="space-y-4">
                            {userAppointments.slice(0, 3).map((app) => (
                                <div key={app.id} className="flex items-center bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md transition-all cursor-pointer hover:border-orange-100 group hover:scale-[1.02] duration-300">
                                    <div className="ml-4 text-center bg-orange-100 text-orange-600 p-2 rounded-xl min-w-[3.5rem]"><span className="block text-lg font-bold leading-none">{app.displayDate}</span><span className="text-[10px] font-bold">{app.month}</span></div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-sm mb-1">{app.title}</h3>
                                        <div className="flex items-center gap-3 text-xs text-gray-500"><span className="flex items-center gap-1"><Clock size={12} /> {app.time}</span><span className={`px-2 py-0.5 rounded-md ${app.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>{app.status === 'pending' ? 'قيد الانتظار' : 'مؤكد'}</span></div>
                                    </div>
                                </div>
                            ))}
                            {userAppointments.length === 0 && <p className="text-center text-gray-400 py-4">لا توجد مواعيد قادمة</p>}
                        </div>
                        <button onClick={() => setActiveTab('schedule')} className="w-full mt-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-primary transition-all shadow-lg shadow-gray-200 flex items-center justify-center gap-2 active:scale-[0.98]"><Plus size={20} /> حجز موعد جديد</button>
                    </div>
                </div>
                <div className="lg:col-span-2 space-y-8">
                    <div>
                        <div className="flex items-center justify-between mb-6"><h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Video className="text-primary" /> متابعة التعلم</h2><button onClick={() => setActiveTab('videos')} className="text-primary text-sm font-bold hover:underline flex items-center gap-1">عرض الكل <ChevronRight size={16} className="rtl:rotate-180" /></button></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {PREMIUM_VIDEOS.slice(0, 2).map((video) => (
                                <div key={video.id} onClick={() => setPlayingVideo(video.id)} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1 hover:scale-[1.01]">
                                    <div className="relative aspect-video">
                                        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center"><div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/50 group-hover:scale-110 transition-transform"><Play size={20} fill="currentColor" /></div></div>
                                    </div>
                                    <div className="p-4"><h3 className="font-bold text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">{video.title}</h3></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* 2. VIDEOS */}
        {activeTab === 'videos' && (
            <div key="videos" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Video className="text-primary" /> جميع المحاضرات</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {[...PREMIUM_VIDEOS, ...PREMIUM_VIDEOS].map((video, i) => (
                        <div key={i} onClick={() => setPlayingVideo(video.id)} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-2 hover:scale-[1.02]">
                            <div className="relative aspect-video">
                                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center"><div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/50 group-hover:scale-110 transition-transform"><Play size={24} fill="currentColor" /></div></div>
                                <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-md backdrop-blur-sm">{video.duration}</span>
                            </div>
                            <div className="p-5"><h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors">{video.title}</h3></div>
                        </div>
                     ))}
                </div>
            </div>
        )}

        {/* 3. ARTICLES */}
        {activeTab === 'articles' && (
             <div key="articles" className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 {savedPosts.length > 0 && (
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><Bookmark size={18} className="text-yellow-500" /> مقالاتي المحفوظة</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {savedPosts.map(post => (
                                <div key={post.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4 hover:shadow-md transition-all duration-300 cursor-pointer hover:scale-[1.02]">
                                    <img src={post.image} className="w-20 h-20 rounded-lg object-cover" alt="" />
                                    <div className="flex-grow"><h4 className="font-bold text-sm line-clamp-2 mb-2">{post.title}</h4><button onClick={() => removeBookmark(post.id)} className="text-xs text-red-500 hover:underline font-bold">إزالة</button></div>
                                </div>
                            ))}
                        </div>
                    </div>
                 )}
                 <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Lock size={20} className="text-purple-500" /> محتوى حصري للمشتركين</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {EXCLUSIVE_ARTICLES.map((article) => (
                            <div key={article.id} onClick={() => setReadingArticle(article)} className="flex flex-col md:flex-row gap-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1 hover:scale-[1.01]">
                                <div className="w-full md:w-48 h-48 rounded-xl overflow-hidden shrink-0"><img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /></div>
                                <div className="flex-grow flex flex-col"><div className="flex items-center gap-2 mb-3"><span className="text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">{article.category}</span><span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={12} /> {article.readTime} قراءة</span></div><h3 className="font-bold text-xl text-gray-900 group-hover:text-purple-600 transition-colors mb-3">{article.title}</h3><button className="mt-auto w-fit flex items-center gap-2 text-sm font-bold text-gray-500 group-hover:text-primary transition-colors">اقرأ المقال <ChevronRight size={16} className="rtl:rotate-180" /></button></div>
                            </div>
                        ))}
                    </div>
                 </div>
             </div>
        )}

        {/* 4. SCHEDULE */}
        {activeTab === 'schedule' && (
            <div key="schedule" className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
                 <div className="flex justify-between items-center mb-8"><h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Calendar className="text-orange-500" /> جدول المواعيد</h2><button onClick={() => setShowBookingModal(true)} className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-orange-200 hover:bg-orange-600 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-2"><Plus size={20} /> حجز موعد جديد</button></div>
                 <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                     <div className="divide-y divide-gray-100">
                        {userAppointments.map((app) => (
                            <div key={app.id} className="p-6 hover:bg-gray-50 transition-all duration-300 flex items-center gap-6 group cursor-pointer hover:pl-8">
                                <div className="text-center bg-orange-50 text-orange-600 p-3 rounded-2xl min-w-[4.5rem] group-hover:bg-orange-100 transition-colors"><span className="block text-2xl font-bold leading-none mb-1">{app.displayDate}</span><span className="text-xs font-bold uppercase">{app.month}</span></div>
                                <div className="flex-grow"><h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">{app.title}</h3><div className="flex items-center gap-4 text-sm text-gray-500"><span className="flex items-center gap-1"><Clock size={14} /> {app.time}</span><span className={`px-2 py-0.5 rounded-md text-xs font-bold ${app.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>{app.status === 'pending' ? 'قيد الانتظار' : 'مؤكد'}</span></div></div>
                            </div>
                        ))}
                        {userAppointments.length === 0 && <div className="text-center py-12"><div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400"><Calendar size={32} /></div><h3 className="text-lg font-bold text-gray-900">لا توجد مواعيد</h3><p className="text-gray-500">قم بحجز موعد جديد للبدء.</p></div>}
                     </div>
                 </div>
            </div>
        )}

      </div>

      {/* Modals logic mostly same but simplified for brevity */}
      {/* Profile Edit Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold text-gray-900">تعديل الملف الشخصي</h3><button onClick={() => setShowProfileModal(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20}/></button></div>
            <div className="flex flex-col items-center mb-8"><div className="w-28 h-28 rounded-full border-4 border-primary/20 mb-4 overflow-hidden relative group"><img src={tempAvatar || user.avatar} alt="Avatar" className="w-full h-full object-cover" /><div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => fileInputRef.current?.click()}><Camera size={24} className="text-white" /></div></div><input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} /><p className="text-xs text-gray-500">اضغط لتغيير الصورة</p></div>
            <div className="space-y-4 mb-8">
               <div><label className="text-sm font-bold text-gray-700 mb-1 block">الاسم الكامل</label><input type="text" value={tempName} onChange={e => setTempName(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary" /></div>
               <div><label className="text-sm font-bold text-gray-700 mb-1 block">المستوى الدراسي</label><input type="text" value={tempGrade} onChange={e => setTempGrade(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary" /></div>
            </div>
            <button onClick={saveProfile} className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-600 shadow-lg shadow-blue-500/20">حفظ التغييرات</button>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center shrink-0 bg-gray-50"><h3 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Calendar size={22} className="text-orange-500" /> حجز موعد جديد</h3><button onClick={() => setShowBookingModal(false)} className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"><X size={24} /></button></div>
                <form onSubmit={handleAddAppointment} className="p-6 space-y-6">
                <div><label className="block text-sm font-bold text-gray-700 mb-2">نوع الموعد</label><select value={newAppointment.title} onChange={(e) => setNewAppointment({...newAppointment, title: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-white"><option value="جلسة توجيه فردية">جلسة توجيه فردية</option><option value="ورشة عمل: إدارة التوتر">ورشة عمل: إدارة التوتر</option><option value="حصة دعم: رياضيات">حصة دعم: رياضيات</option></select></div>
                <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-bold text-gray-700 mb-2">التاريخ</label><input type="date" required value={newAppointment.date} onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-white"/></div><div><label className="block text-sm font-bold text-gray-700 mb-2">التوقيت</label><input type="time" required value={newAppointment.time} onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-white"/></div></div>
                <div className="pt-2"><button type="submit" className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-primary transition-all shadow-lg shadow-gray-200 flex items-center justify-center gap-2 hover:-translate-y-0.5"><Check size={20} /> تأكيد الحجز</button></div>
                </form>
            </div>
            </div>
      )}

      {/* Reading Modal */}
      {readingArticle && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative animate-in slide-in-from-bottom-10 duration-300">
                <div className="sticky top-0 bg-white/90 backdrop-blur p-4 border-b border-gray-100 flex justify-between items-center z-10">
                    <div className="flex items-center gap-3"><span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-lg text-xs font-bold">{readingArticle.category}</span></div>
                    <button onClick={() => setReadingArticle(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
                </div>
                <div className="p-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">{readingArticle.title}</h2>
                    <img src={readingArticle.image} alt="" className="w-full h-64 object-cover rounded-2xl mb-8 shadow-sm" />
                    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: readingArticle.content }} />
                </div>
            </div>
        </div>
      )}

      {/* Focus Mode */}
      {playingVideo && focusMode && (
        <div className="fixed inset-0 bg-black/95 z-[60] flex flex-col animate-in fade-in duration-500">
           <div className="flex justify-between items-center p-6 text-white"><h3 className="font-bold text-lg opacity-80 flex items-center gap-2"><Video size={20} /> وضع التركيز</h3><button onClick={() => { setFocusMode(false); }} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-all"><Minimize2 size={18} /> <span className="text-sm font-bold">تصغير</span></button></div>
           <div className="flex-grow flex items-center justify-center p-4"><div className="w-full max-w-6xl aspect-video bg-black rounded-2xl overflow-hidden relative shadow-2xl border border-gray-800"><img src={activeVideoData?.thumbnail} className="w-full h-full object-cover opacity-80" alt="" /><div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-8"><div className="flex justify-between items-center"><div className="flex items-center gap-6"><button className="text-white hover:text-primary transition-colors"><Pause size={32} fill="currentColor" /></button><span className="text-white font-mono text-sm">05:12 / {activeVideoData?.duration}</span></div><h2 className="text-white font-bold text-xl">{activeVideoData?.title}</h2></div></div></div></div>
        </div>
      )}

      {/* Stats Modal */}
      {showStatsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
                <div className="bg-primary p-6 text-white flex justify-between items-start">
                    <div><h3 className="text-2xl font-bold mb-1">إحصائياتك التفصيلية</h3></div>
                    <button onClick={() => setShowStatsModal(false)} className="text-white/80 hover:text-white"><X size={24} /></button>
                </div>
                <div className="p-8">
                    <div className="flex items-end justify-between h-40 mb-6 px-2 gap-2">
                        {(user.stats?.weeklyProgress || [30, 50, 45, 80, 60, 90, 40]).map((h: number, i: number) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                                <div className="w-full bg-blue-50 rounded-t-lg relative h-full overflow-hidden">
                                    <div 
                                        className="absolute bottom-0 w-full bg-primary rounded-t-lg transition-all duration-1000 ease-out group-hover:bg-royal" 
                                        style={{ height: `${h}%` }}
                                    ></div>
                                </div>
                                <span className="text-xs text-gray-400 font-bold">
                                    {['سبت', 'أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة'][i]}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="text-center text-gray-500 text-sm font-medium bg-gray-50 p-3 rounded-xl">
                        نشاطك الدراسي خلال الأسبوع الماضي
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Tour Overlay */}
      {showTour && <div className="fixed inset-0 bg-black/70 z-40"><div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-white p-6 rounded-3xl shadow-2xl w-[90%] max-w-md z-50 animate-bounce-slow"><div className="flex justify-between items-start mb-4"><h3 className="font-bold text-xl text-primary flex items-center gap-2">{TOUR_STEPS[tourStep].title}</h3><button onClick={finishTour} className="text-gray-400 hover:text-gray-600"><X size={20} /></button></div><p className="text-gray-600 mb-6">{TOUR_STEPS[tourStep].content}</p><div className="flex justify-between items-center"><div className="flex gap-1">{TOUR_STEPS.map((_, i) => (<div key={i} className={`w-2 h-2 rounded-full ${i === tourStep ? 'bg-primary' : 'bg-gray-200'}`}></div>))}</div><div className="flex gap-3">{tourStep > 0 && <button onClick={prevStep} className="text-gray-500 font-bold text-sm">السابق</button>}<button onClick={nextStep} className="bg-primary text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-blue-200">{tourStep === TOUR_STEPS.length - 1 ? 'إنهاء' : 'التالي'}</button></div></div></div></div>}

    </div>
  );
};
