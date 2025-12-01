
import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, Clock, Calendar, Star, Download, PlayCircle, User, ChevronRight, 
  LogOut, Lock, AlertCircle, X, Camera, Check, HelpCircle, Video, FileText, 
  Play, Key, Pause, Volume2, Maximize, Bookmark, BarChart, Activity, TrendingUp, 
  Plus, Share2, Eye, Minimize2, MessageSquare, Send, MoreVertical, LayoutDashboard, 
  Library, Film, Bell, Search, GraduationCap, Flame, Moon, Sun, ArrowRight,
  MessageCircle
} from 'lucide-react';
import { dataManager } from '../utils/dataManager';
import { Appointment } from '../types';

// --- MOCK DATA ---
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

const PREMIUM_VIDEOS = [
  { id: 1, title: "شرح منهجية الفلسفة - المقدمة", duration: "15:30", thumbnail: "https://images.unsplash.com/photo-1555445054-dab5432125bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", subject: "فلسفة", progress: 75 },
  { id: 2, title: "أسرار التعامل مع دالة اللوغاريتم", duration: "22:45", thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", subject: "رياضيات", progress: 30 },
  { id: 3, title: "كيفية تحليل النص الأدبي بامتياز", duration: "18:10", thumbnail: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", subject: "لغة عربية", progress: 0 },
  { id: 4, title: "تصحيح الامتحان الوطني 2023 - فيزياء", duration: "45:00", thumbnail: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", subject: "فيزياء", progress: 0 }
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
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);
  const [focusMode, setFocusMode] = useState(false);
  const [readingArticle, setReadingArticle] = useState<any>(null);
  const [savedPosts, setSavedPosts] = useState<any[]>([]);
  
  // Dynamic Appointments
  const [userAppointments, setUserAppointments] = useState<any[]>([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState({ title: 'جلسة توجيه فردية', date: '', time: '' });

  // Chat
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Time based greeting
  const [greeting, setGreeting] = useState('');

  // Stats Animation
  const animatedHours = useCountUp(user?.stats?.studyHours || 0, 1500, !!user);
  const animatedRate = useCountUp(user?.stats?.commitmentRate || 0, 1500, !!user);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('صباح الخير');
    else if (hour < 18) setGreeting('مساء الخير');
    else setGreeting('ليلة سعيدة');
  }, []);

  // Load User Session & Data
  useEffect(() => {
    const storedUser = localStorage.getItem('tilmid_user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      const freshUser = dataManager.getStudents().find(u => u.username === userData.username);
      if (freshUser && freshUser.status === 'active') {
          setUser(freshUser);
      } else {
          localStorage.removeItem('tilmid_user');
          setUser(null);
      }
    }
    setLoading(false);
  }, []);

  // Load Saved Posts, Chat, Appointments
  useEffect(() => {
    if (user) {
      const bookmarkIds = JSON.parse(localStorage.getItem('tilmid_bookmarks') || '[]');
      const allPosts = dataManager.getPosts();
      setSavedPosts(allPosts.filter(post => bookmarkIds.includes(post.id)));

      const allApps = dataManager.getAppointments();
      const myApps = allApps.filter(a => a.studentName === user.name).map(a => {
          const d = new Date(a.date);
          const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "ماي", "يونيو", "يوليوز", "غشت", "شتنبر", "أكتوبر", "نونبر", "دجنبر"];
          const dayNames = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
          return {
              ...a,
              month: monthNames[d.getMonth()],
              dayName: dayNames[d.getDay()],
              displayDate: d.getDate().toString()
          };
      });
      // Sort by date closest to today
      myApps.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setUserAppointments(myApps);

      const storedChat = localStorage.getItem(`tilmid_chat_${user.username}`);
      if (storedChat) {
          const parsedChat = JSON.parse(storedChat).map((msg: any) => ({ ...msg, timestamp: new Date(msg.timestamp) }));
          setChatMessages(parsedChat);
      } else {
          setChatMessages([{ id: 1, text: `مرحباً ${user.name}! 👋 أنا المشرف التربوي. كيف يمكنني مساعدتك اليوم؟`, sender: 'admin', timestamp: new Date() }]);
      }
    }
  }, [user, activeTab]);

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
    setUsername(''); setPassword(''); setPlayingVideo(null); setFocusMode(false); setReadingArticle(null); setShowBookingModal(false); setChatOpen(false); setActiveTab('dashboard');
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
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { const reader = new FileReader(); reader.onloadend = () => setTempAvatar(reader.result as string); reader.readAsDataURL(file); }
  };
  const saveProfile = () => {
    const updatedUser = { ...user, avatar: tempAvatar, name: tempName, grade: tempGrade };
    dataManager.saveStudent(updatedUser);
    setUser(updatedUser);
    localStorage.setItem('tilmid_user', JSON.stringify(updatedUser));
    setShowProfileModal(false);
  };

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
    
    // Refresh locally roughly
    const d = new Date(newAppointment.date);
    const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "ماي", "يونيو", "يوليوز", "غشت", "شتنبر", "أكتوبر", "نونبر", "دجنبر"];
    const dayNames = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
    
    setUserAppointments([...userAppointments, { 
        ...globalApp, 
        month: monthNames[d.getMonth()], 
        dayName: dayNames[d.getDay()],
        displayDate: d.getDate().toString() 
    }].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));

    setShowBookingModal(false);
    setNewAppointment({ title: 'جلسة توجيه فردية', date: '', time: '' });
    alert('تم إرسال طلب الحجز بنجاح! سيتم تأكيده قريباً من طرف الإدارة.');
  };

  if (loading) return null;

  // --- LOGIN SCREEN (Redesigned) ---
  if (!user) {
     return (
      <div className="min-h-screen bg-white flex font-sans">
        {/* Left Side - Visuals */}
        <div className="hidden lg:flex w-5/12 bg-slate-900 relative overflow-hidden flex-col justify-between p-12 text-white">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[10%] left-[-10%] w-80 h-80 bg-purple-600/20 rounded-full blur-[100px]"></div>
            
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center"><GraduationCap size={24} /></div>
                    <span className="text-2xl font-bold">تلميذ</span>
                </div>
                <h1 className="text-5xl font-extrabold leading-tight mb-6">رحلة التفوق <br/> تبدأ بخطوة.</h1>
                <p className="text-gray-300 text-lg max-w-sm leading-relaxed">منصتك المتكاملة للمواكبة الدراسية، التوجيه، وتقنيات التعلم الحديثة.</p>
            </div>

            <div className="relative z-10 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                <div className="flex gap-1 text-yellow-400 mb-3">
                    {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="text-sm font-medium mb-4">"بفضل منصة تلميذ، قدرت ننظم وقتي ونحصل على نقطة 17 في الوطني. شكراً ليكم!"</p>
                <div className="flex items-center gap-3">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sara" className="w-10 h-10 rounded-full bg-white" alt="Student" />
                    <div>
                        <span className="block font-bold text-sm">سارة م.</span>
                        <span className="text-xs text-gray-400">طالبة طب</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-7/12 flex items-center justify-center p-8 bg-gray-50/50">
            <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-right duration-500">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">تسجيل الدخول</h2>
                    <p className="text-gray-500">مرحباً بعودتك! أدخل بياناتك للمتابعة.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">اسم المستخدم</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                                className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium" 
                                placeholder="أدخل اسم المستخدم"
                                dir="ltr"
                            />
                            <User size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <label className="text-sm font-bold text-gray-700">كلمة المرور</label>
                            <a href="#" className="text-xs font-bold text-primary hover:underline">نسيت كلمة المرور؟</a>
                        </div>
                        <div className="relative">
                            <input 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium" 
                                placeholder="••••••••"
                                dir="ltr"
                            />
                            <Lock size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 rounded-xl bg-red-50 text-red-600 border border-red-100 flex items-center gap-3 text-sm font-bold">
                            <AlertCircle size={18} /> {error}
                        </div>
                    )}

                    <button className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-primary transition-all shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1 flex items-center justify-center gap-2 group">
                        <span>دخول للمنصة</span>
                        <ArrowRight size={20} className="group-hover:-translate-x-1 transition-transform rtl:rotate-180" />
                    </button>
                </form>

                <div className="pt-6 border-t border-gray-200">
                    <p className="text-center text-xs text-gray-400 font-medium mb-4">لأغراض العرض (Demo):</p>
                    <div className="flex justify-center gap-3">
                        <button onClick={() => {setUsername('amin'); setPassword('123')}} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:border-primary hover:text-primary transition-colors">Amin / 123</button>
                        <button onClick={() => {setUsername('sara'); setPassword('123')}} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:border-primary hover:text-primary transition-colors">Sara / 123</button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
  }

  const activeVideoData = PREMIUM_VIDEOS.find(v => v.id === playingVideo);
  
  // --- STUDENT DASHBOARD ---
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 relative font-sans">
        
        {/* 1. Header (Glassmorphic) */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200 px-4 lg:px-8 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20"><GraduationCap size={20} /></div>
                    <div className="hidden md:block">
                        <h1 className="font-bold text-gray-900 leading-tight">فضاء الطالب</h1>
                        <p className="text-xs text-gray-500 font-medium">Tilmid Platform</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 lg:gap-6">
                    <button className="relative p-2.5 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
                        <Bell size={20} />
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    
                    <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
                    
                    <div onClick={openProfileModal} className="flex items-center gap-3 cursor-pointer group">
                        <div className="text-left hidden sm:block">
                            <span className="block font-bold text-sm text-gray-900 group-hover:text-primary transition-colors">{user.name}</span>
                            <span className="text-[10px] font-bold text-primary bg-blue-50 px-2 py-0.5 rounded-full inline-block">{user.grade}</span>
                        </div>
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden bg-gray-100">
                                <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} alt="Profile" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                    </div>

                    <button 
                        onClick={handleLogout} 
                        className="p-2.5 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                        title="تسجيل الخروج"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
            
            {/* 2. Welcome & Stats Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                {/* Greeting Card */}
                <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl flex flex-col justify-center min-h-[220px]">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -mr-16 -mt-16"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2 text-primary">
                            {greeting.includes('صباح') ? <Sun size={20} /> : <Moon size={20} />}
                            <span className="font-bold tracking-wide uppercase text-sm">{greeting}</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">
                            مستعد لتحقيق أهداف اليوم، <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-white">{user.name}؟</span>
                        </h2>
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-sm font-bold">
                                <Flame size={16} className="text-orange-400" fill="currentColor" />
                                <span>حماسة عالية 🔥</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-sm font-bold">
                                <Star size={16} className="text-yellow-400" fill="currentColor" />
                                <span>المستوى 3: مجتهد</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden">
                    <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Activity className="text-primary" size={20} /> نظرة عامة
                    </h3>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-sm font-bold mb-2">
                                <span className="text-gray-500">ساعات الدراسة</span>
                                <span className="text-gray-900">{animatedHours} ساعة</span>
                            </div>
                            <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                                <div className="bg-primary h-full rounded-full" style={{ width: `${Math.min(animatedHours, 100)}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm font-bold mb-2">
                                <span className="text-gray-500">معدل الالتزام</span>
                                <span className="text-gray-900">{animatedRate}%</span>
                            </div>
                            <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                                <div className="bg-green-500 h-full rounded-full" style={{ width: `${animatedRate}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Floating Navigation Dock */}
            <div className="sticky top-24 z-30 mb-10 flex justify-center">
                <div className="bg-white/90 backdrop-blur-xl p-2 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-white/50 flex gap-1 sm:gap-2 overflow-x-auto no-scrollbar max-w-full">
                    {[ 
                      { id: 'dashboard', label: 'الرئيسية', icon: LayoutDashboard }, 
                      { id: 'videos', label: 'المحاضرات', icon: Film }, 
                      { id: 'articles', label: 'المكتبة', icon: Library }, 
                      { id: 'schedule', label: 'برنامجي', icon: Calendar } 
                    ].map((tab) => (
                        <button 
                          key={tab.id} 
                          onClick={() => setActiveTab(tab.id as ActiveTab)} 
                          className={`
                            flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 whitespace-nowrap
                            ${activeTab === tab.id 
                                ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' 
                                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                            }
                          `}
                        >
                          <tab.icon size={18} strokeWidth={2.5} />
                          <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* --- DASHBOARD TAB --- */}
            {activeTab === 'dashboard' && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    
                    {/* Continue Watching (Rail) */}
                    <section>
                        <div className="flex items-center justify-between mb-6 px-2">
                            <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                                <PlayCircle className="text-primary" /> متابعة المشاهدة
                            </h3>
                            <button onClick={() => setActiveTab('videos')} className="text-sm font-bold text-gray-400 hover:text-primary transition-colors">عرض الكل</button>
                        </div>
                        <div className="flex gap-6 overflow-x-auto pb-8 pt-2 px-2 no-scrollbar snap-x">
                            {PREMIUM_VIDEOS.map((video) => (
                                <div key={video.id} onClick={() => setPlayingVideo(video.id)} className="min-w-[280px] sm:min-w-[320px] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 snap-center">
                                    <div className="relative aspect-video">
                                        <img src={video.thumbnail} className="w-full h-full object-cover" alt="" />
                                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white border border-white/50">
                                                <Play size={20} fill="currentColor" />
                                            </div>
                                        </div>
                                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-800/50">
                                            <div className="h-full bg-primary" style={{ width: `${video.progress}%` }}></div>
                                        </div>
                                        <span className="absolute top-3 right-3 bg-black/60 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                                            {video.subject}
                                        </span>
                                    </div>
                                    <div className="p-4">
                                        <h4 className="font-bold text-gray-900 text-sm line-clamp-1 mb-1 group-hover:text-primary transition-colors">{video.title}</h4>
                                        <p className="text-xs text-gray-400 font-medium">متبقي 10 د</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Next Appointment Card */}
                        <div className="bg-gradient-to-br from-orange-500 to-pink-500 rounded-[2.5rem] p-1 text-white shadow-xl">
                            <div className="bg-white rounded-[2.3rem] p-8 h-full flex flex-col relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full blur-3xl opacity-50 -mr-10 -mt-10"></div>
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-6">
                                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                            <Calendar className="text-orange-500" /> موعدك القادم
                                        </h3>
                                        {userAppointments.length > 0 && <span className="bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-full">مؤكد</span>}
                                    </div>
                                    
                                    {userAppointments.length > 0 ? (
                                        <div className="mt-auto">
                                            <div className="flex items-end gap-4 mb-4">
                                                <div className="text-5xl font-black text-gray-900 leading-none">{userAppointments[0].displayDate}</div>
                                                <div className="text-gray-500 font-bold mb-1">{userAppointments[0].month}</div>
                                            </div>
                                            <h4 className="text-xl font-bold text-gray-800 mb-2">{userAppointments[0].title}</h4>
                                            <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                                                <Clock size={16} /> {userAppointments[0].time} • {userAppointments[0].dayName}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex-grow flex flex-col items-center justify-center text-center py-8">
                                            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-3"><Calendar size={24} /></div>
                                            <p className="text-gray-500 text-sm font-bold">لا توجد مواعيد قادمة</p>
                                            <button onClick={() => setActiveTab('schedule')} className="mt-4 text-orange-500 font-bold text-sm hover:underline">حجز موعد جديد</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Recent Articles / Tips */}
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-gray-900 flex items-center gap-2"><BookOpen className="text-blue-500" /> جديد المكتبة</h3>
                                <button onClick={() => setActiveTab('articles')} className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">تصفح</button>
                            </div>
                            <div className="space-y-4">
                                {EXCLUSIVE_ARTICLES.slice(0, 2).map(article => (
                                    <div key={article.id} onClick={() => setReadingArticle(article)} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer group">
                                        <img src={article.image} className="w-16 h-16 rounded-xl object-cover" alt="" />
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-sm line-clamp-1 mb-1 group-hover:text-primary transition-colors">{article.title}</h4>
                                            <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded">{article.category}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- VIDEOS TAB --- */}
            {activeTab === 'videos' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex flex-wrap gap-3 mb-8">
                        {['الكل', 'رياضيات', 'فيزياء', 'فلسفة', 'لغة عربية'].map((filter, i) => (
                            <button key={i} className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${i===0 ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-900'}`}>{filter}</button>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...PREMIUM_VIDEOS, ...PREMIUM_VIDEOS].map((video, i) => (
                            <div key={i} onClick={() => setPlayingVideo(video.id)} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <div className="relative aspect-video">
                                    <img src={video.thumbnail} className="w-full h-full object-cover" alt="" />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                        <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white border border-white/50 group-hover:scale-110 transition-transform">
                                            <Play size={24} fill="currentColor" />
                                        </div>
                                    </div>
                                    <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm">{video.duration}</span>
                                </div>
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] font-bold text-primary bg-blue-50 px-2 py-1 rounded">{video.subject}</span>
                                    </div>
                                    <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors">{video.title}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* --- ARTICLES TAB --- */}
            {activeTab === 'articles' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                        <Bookmark className="text-primary" /> مكتبة المقالات
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {savedPosts.length > 0 && savedPosts.map(post => (
                            <div key={`saved-${post.id}`} onClick={() => {}} className="bg-white rounded-[2rem] p-4 border border-gray-100 shadow-sm relative group cursor-pointer hover:shadow-lg transition-all">
                                <div className="absolute top-4 left-4 z-10 bg-yellow-400 text-white p-1.5 rounded-full shadow-sm" title="محفوظ"><Bookmark size={14} fill="currentColor" /></div>
                                <div className="h-48 rounded-2xl overflow-hidden mb-4"><img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" /></div>
                                <h3 className="font-bold text-gray-900 mb-2">{post.title}</h3>
                                <button onClick={(e) => {e.stopPropagation(); removeBookmark(post.id)}} className="text-xs font-bold text-red-500 hover:bg-red-50 px-2 py-1 rounded transition-colors">إزالة من المحفوظات</button>
                            </div>
                        ))}
                        {EXCLUSIVE_ARTICLES.map((article) => (
                            <div key={article.id} onClick={() => setReadingArticle(article)} className="bg-white rounded-[2rem] p-4 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                                <div className="h-48 rounded-2xl overflow-hidden mb-4 relative">
                                    <img src={article.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold shadow-sm">{article.category}</div>
                                </div>
                                <div className="px-2 pb-2">
                                    <div className="flex items-center gap-2 text-xs text-gray-400 font-bold mb-3"><Clock size={12} /> {article.readTime} قراءة</div>
                                    <h3 className="font-bold text-lg text-gray-900 mb-3 group-hover:text-primary transition-colors leading-tight">{article.title}</h3>
                                    <div className="flex items-center gap-1 text-sm font-bold text-primary">اقرأ المزيد <ChevronRight size={16} className="rtl:rotate-180" /></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* --- SCHEDULE TAB (Timeline) --- */}
            {activeTab === 'schedule' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">جدولك الزمني</h2>
                            <p className="text-gray-500">نظم وقتك لتحقيق أقصى استفادة.</p>
                        </div>
                        <button onClick={() => setShowBookingModal(true)} className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-primary transition-all flex items-center gap-2 transform hover:-translate-y-1"><Plus size={20} /> حجز جديد</button>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-sm border border-gray-100 relative">
                        {/* Timeline Line */}
                        <div className="absolute top-10 bottom-10 right-[3.25rem] w-0.5 bg-gray-100"></div>

                        <div className="space-y-8">
                            {userAppointments.map((app, idx) => (
                                <div key={app.id} className="relative flex items-start gap-6 group">
                                    <div className={`relative z-10 w-12 h-12 rounded-full border-4 border-white shadow-md flex items-center justify-center shrink-0 ${app.status === 'pending' ? 'bg-orange-100 text-orange-500' : 'bg-green-100 text-green-500'}`}>
                                        <Calendar size={20} />
                                    </div>
                                    <div className="flex-grow bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md transition-all">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-sm font-bold text-gray-400">{app.displayDate} {app.month} • {app.dayName}</span>
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded ${app.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>{app.status === 'pending' ? 'قيد الانتظار' : 'مؤكد'}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{app.title}</h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                            <Clock size={16} /> {app.time}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {userAppointments.length === 0 && (
                                <div className="text-center py-20">
                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300"><Calendar size={40} /></div>
                                    <p className="text-gray-400 font-bold">لا توجد مواعيد في جدولك حالياً.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </div>

        {/* --- CHAT FAB --- */}
        <div className="fixed bottom-6 left-6 z-50">
            {!chatOpen && (
                <button onClick={() => setChatOpen(true)} className="w-16 h-16 bg-primary text-white rounded-full shadow-2xl hover:bg-royal transition-all flex items-center justify-center hover:scale-110 animate-bounce-slow">
                    <MessageCircle size={32} />
                </button>
            )}
            {chatOpen && (
                <div className="bg-white rounded-3xl shadow-2xl w-80 sm:w-96 flex flex-col overflow-hidden border border-gray-100 animate-in slide-in-from-bottom-10 fade-in duration-300 mb-4 ml-2">
                    <div className="bg-primary p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"><User size={20} /></div>
                            <div><h4 className="font-bold text-sm">المشرف التربوي</h4><span className="text-[10px] flex items-center gap-1 opacity-90"><span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span> متصل الآن</span></div>
                        </div>
                        <button onClick={() => setChatOpen(false)} className="p-1 hover:bg-white/10 rounded-full"><X size={20} /></button>
                    </div>
                    <div className="h-80 overflow-y-auto p-4 bg-gray-50 space-y-3">
                        {chatMessages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm font-medium ${msg.sender === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-white text-gray-700 shadow-sm border border-gray-100 rounded-bl-none'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>
                    <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex gap-2">
                        <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="اكتب رسالتك..." className="flex-grow bg-gray-50 px-4 py-2 rounded-xl outline-none text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all" />
                        <button type="submit" className="p-2 bg-primary text-white rounded-xl hover:bg-royal transition-colors"><Send size={18} /></button>
                    </form>
                </div>
            )}
        </div>

        {/* --- MODALS (Simplified for brevity but styled) --- */}
        {/* Profile Edit Modal */}
        {showProfileModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95">
                    <div className="text-center mb-6"><h3 className="text-xl font-extrabold text-gray-900">تعديل الملف الشخصي</h3></div>
                    <div className="flex flex-col items-center mb-8 relative">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100 mb-3"><img src={tempAvatar || user.avatar} className="w-full h-full object-cover" alt="" /></div>
                        <button onClick={() => fileInputRef.current?.click()} className="text-primary text-sm font-bold hover:underline">تغيير الصورة</button>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                    </div>
                    <div className="space-y-4 mb-8">
                        <div><label className="text-xs font-bold text-gray-500 mb-1 block uppercase">الاسم</label><input type="text" value={tempName} onChange={e => setTempName(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl font-bold text-gray-900 outline-none focus:ring-2 focus:ring-primary/20" /></div>
                        <div><label className="text-xs font-bold text-gray-500 mb-1 block uppercase">المستوى</label><input type="text" value={tempGrade} onChange={e => setTempGrade(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl font-bold text-gray-900 outline-none focus:ring-2 focus:ring-primary/20" /></div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={saveProfile} className="flex-1 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-primary transition-colors">حفظ</button>
                        <button onClick={() => setShowProfileModal(false)} className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors">إلغاء</button>
                    </div>
                </div>
            </div>
        )}

        {/* Booking Modal */}
        {showBookingModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95">
                    <div className="flex justify-between items-center mb-8"><h3 className="text-xl font-extrabold flex items-center gap-2"><Calendar className="text-orange-500" /> حجز موعد</h3><button onClick={() => setShowBookingModal(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20}/></button></div>
                    <form onSubmit={handleAddAppointment} className="space-y-5">
                        <div><label className="text-xs font-bold text-gray-500 mb-1 block">نوع الموعد</label><select value={newAppointment.title} onChange={(e) => setNewAppointment({...newAppointment, title: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl font-bold outline-none"><option>جلسة توجيه فردية</option><option>حصة دعم رياضيات</option></select></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="text-xs font-bold text-gray-500 mb-1 block">التاريخ</label><input type="date" required value={newAppointment.date} onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl font-medium outline-none" /></div>
                            <div><label className="text-xs font-bold text-gray-500 mb-1 block">الوقت</label><input type="time" required value={newAppointment.time} onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl font-medium outline-none" /></div>
                        </div>
                        <button type="submit" className="w-full py-4 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-all mt-2">تأكيد الحجز</button>
                    </form>
                </div>
            </div>
        )}

        {/* Video Player Modal (Focus Mode) */}
        {playingVideo && (
            <div className="fixed inset-0 bg-black z-50 flex flex-col animate-in fade-in duration-300">
                <div className="p-4 flex justify-between items-center text-white/80 bg-gradient-to-b from-black/80 to-transparent absolute top-0 w-full z-10">
                    <h3 className="font-bold flex items-center gap-3"><span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">LIVE</span> {activeVideoData?.title}</h3>
                    <button onClick={() => setPlayingVideo(null)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-colors"><X size={24} text-white /></button>
                </div>
                <div className="flex-grow flex items-center justify-center bg-black">
                    <div className="w-full max-w-5xl aspect-video bg-gray-900 relative group overflow-hidden shadow-2xl rounded-lg">
                        <img src={activeVideoData?.thumbnail} className="w-full h-full object-cover opacity-60" alt="" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <button className="w-20 h-20 bg-primary/90 hover:bg-primary text-white rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-lg shadow-primary/40"><Play size={32} fill="currentColor" /></button>
                        </div>
                        {/* Fake Controls */}
                        <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-full bg-gray-600/50 h-1.5 rounded-full mb-4 overflow-hidden"><div className="w-1/3 h-full bg-red-600"></div></div>
                            <div className="flex justify-between text-white">
                                <div className="flex gap-4"><Pause size={20} /><Volume2 size={20} /> <span className="text-xs font-mono mt-0.5">05:20 / {activeVideoData?.duration}</span></div>
                                <div className="flex gap-4"><Maximize size={20} /></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Article Reader Modal */}
        {readingArticle && (
            <div className="fixed inset-0 bg-white z-50 overflow-y-auto animate-in slide-in-from-bottom-10 duration-300">
                <div className="max-w-3xl mx-auto px-6 py-12">
                    <button onClick={() => setReadingArticle(null)} className="fixed top-6 left-6 p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"><X size={24} /></button>
                    <span className="text-primary font-bold text-sm tracking-widest uppercase mb-2 block">{readingArticle.category}</span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8 leading-tight">{readingArticle.title}</h1>
                    <div className="flex items-center gap-4 mb-8 text-gray-500 font-medium text-sm">
                        <span className="flex items-center gap-1"><Clock size={16} /> {readingArticle.readTime} قراءة</span>
                        <span>•</span>
                        <span>بواسطة فريق تلميذ</span>
                    </div>
                    <img src={readingArticle.image} className="w-full aspect-video object-cover rounded-3xl shadow-lg mb-10" alt="" />
                    <div className="prose prose-lg prose-slate max-w-none font-medium leading-loose" dangerouslySetInnerHTML={{ __html: readingArticle.content }} />
                </div>
            </div>
        )}

    </div>
  );
};
