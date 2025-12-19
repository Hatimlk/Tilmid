
import React, { useState, useEffect } from 'react';
import { 
  Clock, Calendar, Download, PlayCircle, User, ChevronRight, 
  LogOut, AlertCircle, X, FileText, 
  Play, Activity, Plus, LayoutDashboard, Library, Film, 
  Sparkles, Trophy, Target, MessageCircle, BookText, FileSpreadsheet, FileCode, DownloadCloud, Flame, GraduationCap
} from 'lucide-react';
import { dataManager } from '../utils/dataManager';
import { StudyResource, TimetableTask } from '../types';
import { IMAGES } from '../constants/images';

const DAYS = ['الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'];

const ICON_MAP: Record<string, any> = {
  BookText,
  FileSpreadsheet,
  FileCode,
  Library
};

// Subject Color Mapping for UI consistency
const SUBJECT_COLORS: Record<string, { bg: string, text: string, border: string }> = {
  'رياضيات': { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' },
  'فيزياء': { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100' },
  'علوم': { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
  'فلسفة': { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100' },
  'لغات': { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100' },
  'default': { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-100' }
};

type ActiveTab = 'dashboard' | 'videos' | 'resources' | 'timetable';

export const StudentArea: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  
  // Timetable State
  const [timetable, setTimetable] = useState<TimetableTask[]>([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTask, setNewTask] = useState<Partial<TimetableTask>>({ subject: 'رياضيات', day: 'الاثنين', startTime: '08:00', endTime: '10:00' });

  // Resources State
  const [resources, setResources] = useState<StudyResource[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('tilmid_user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      const freshUser = dataManager.getStudents().find(u => u.username === userData.username);
      if (freshUser && freshUser.status === 'active') {
          setUser(freshUser);
          setResources(dataManager.getResources());
          const storedTable = localStorage.getItem(`timetable_${freshUser.username}`);
          if (storedTable) setTimetable(JSON.parse(storedTable));
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const students = dataManager.getStudents();
    const account = students.find(acc => acc.username === username && acc.password === password);
    if (account) {
      setUser(account);
      localStorage.setItem('tilmid_user', JSON.stringify(account));
      setResources(dataManager.getResources());
      const storedTable = localStorage.getItem(`timetable_${account.username}`);
      if (storedTable) setTimetable(JSON.parse(storedTable));
    } else {
      setError('بيانات الدخول غير صحيحة');
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    const task: TimetableTask = {
        id: Date.now().toString(),
        subject: newTask.subject!,
        day: newTask.day!,
        startTime: newTask.startTime!,
        endTime: newTask.endTime!
    };
    const updated = [...timetable, task];
    setTimetable(updated);
    localStorage.setItem(`timetable_${user.username}`, JSON.stringify(updated));
    setShowTaskModal(false);
  };

  const removeTask = (id: string) => {
    const updated = timetable.filter(t => t.id !== id);
    setTimetable(updated);
    localStorage.setItem(`timetable_${user.username}`, JSON.stringify(updated));
  };

  if (loading) return null;

  if (!user) {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
            <div className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md border border-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16"></div>
                <div className="text-center mb-10 relative z-10">
                    <div className="w-40 h-auto mx-auto mb-8">
                        <img src={IMAGES.LOGOS.OFFICIAL} alt="Tilmid Logo" className="w-full h-auto" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">مرحباً بك مجدداً</h2>
                    <p className="text-slate-500 font-bold mt-2">سجل دخولك لمتابعة رحلة التفوق</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 mr-2 uppercase">اسم المستخدم</label>
                        <input type="text" placeholder="أدخل اسم المستخدم" value={username} onChange={e => setUsername(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all font-bold outline-none" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 mr-2 uppercase">كلمة المرور</label>
                        <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all font-bold outline-none" />
                    </div>
                    {error && <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm font-bold text-center border border-red-100 flex items-center justify-center gap-2 animate-pulse"><AlertCircle size={16}/> {error}</div>}
                    <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-primary shadow-xl shadow-blue-500/10 transition-all hover:-translate-y-1">دخول للمساحة</button>
                </form>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 lg:pb-10 font-sans text-slate-800">
        {/* Modern Glass Header */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-40 px-6 py-4 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-4">
                <div className="h-14 w-auto">
                    <img src={IMAGES.LOGOS.OFFICIAL} alt="Logo" className="h-full w-auto object-contain" />
                </div>
                <div className="border-r-2 border-slate-100 pr-4">
                    <span className="font-black text-slate-900 block leading-tight">مساحة التميز</span>
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">{user.grade}</span>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="hidden sm:flex flex-col text-left">
                    <span className="font-black text-sm text-slate-700">{user.name}</span>
                    <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div> متصل الآن</span>
                </div>
                <button onClick={() => { localStorage.removeItem('tilmid_user'); setUser(null); }} className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><LogOut size={20}/></button>
            </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-12">
            
            {/* Nav Tabs */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar mb-12 bg-white p-2 rounded-3xl border border-slate-100 w-fit mx-auto shadow-xl shadow-slate-200/50">
                {[
                    {id: 'dashboard', label: 'الرئيسية', icon: LayoutDashboard},
                    {id: 'timetable', label: 'الجدول الزمني', icon: Clock},
                    {id: 'resources', label: 'المكتبة', icon: Library},
                    {id: 'videos', label: 'المحاضرات', icon: Film}
                ].map(tab => (
                    <button 
                        key={tab.id} 
                        onClick={() => setActiveTab(tab.id as ActiveTab)} 
                        className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-sm transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20 scale-105' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        <tab.icon size={18} /> {tab.label}
                    </button>
                ))}
            </div>

            {/* Dashboard View */}
            {activeTab === 'dashboard' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="lg:col-span-8 space-y-8">
                        {/* Welcome Banner */}
                        <div className="bg-slate-900 rounded-[3.5rem] p-10 lg:p-14 text-white relative overflow-hidden shadow-2xl shadow-slate-900/30">
                             <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-[100px] -mr-40 -mt-40"></div>
                             <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] -ml-32 -mb-32"></div>
                             
                             <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-blue-200 font-bold text-xs border border-white/10">
                                        <Sparkles size={14} className="text-yellow-400"/> برنامج التميز مفعل
                                    </div>
                                    <div className="h-10 opacity-40 hover:opacity-100 transition-opacity">
                                        <img src={IMAGES.LOGOS.WHITE} alt="White Logo" className="h-full w-auto" />
                                    </div>
                                </div>
                                <h2 className="text-4xl lg:text-6xl font-black mb-6 leading-tight">أهلاً {user.name.split(' ')[0]}! 🔥</h2>
                                <p className="text-blue-100 text-lg lg:text-xl opacity-80 mb-10 max-w-xl leading-relaxed">
                                    أنت الآن في رحلة التفوق. استعمل الأدوات الذكية لتنظيم يومك وضمان أفضل النتائج في مسارك الدراسي.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <button onClick={() => setActiveTab('timetable')} className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-sm hover:scale-105 transition-transform flex items-center gap-2 shadow-xl shadow-white/10"><Clock size={18} className="text-primary"/> ابدأ التخطيط</button>
                                    <div className="flex items-center gap-4 px-6 py-4 bg-white/5 rounded-2xl backdrop-blur-md border border-white/10">
                                         <div className="w-10 h-10 bg-orange-500/20 text-orange-400 rounded-full flex items-center justify-center"><Flame size={20} /></div>
                                         <span className="text-sm font-black text-blue-100">سلسلة الالتزام: 5 أيام</span>
                                    </div>
                                </div>
                             </div>
                        </div>
                        
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 group hover:-translate-y-1 transition-all">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="font-black text-slate-900 flex items-center gap-3"><Activity className="text-primary" size={24}/> نشاط الأسبوع</h3>
                                    <span className="text-xs font-bold text-slate-400">آخر 7 أيام</span>
                                </div>
                                <div className="flex justify-between items-end h-32 gap-3">
                                    {[40,70,55,90,60,85,50].map((h, i) => (
                                        <div key={i} className="flex-1 bg-slate-50 rounded-t-2xl relative group/bar">
                                            <div className="absolute bottom-0 w-full bg-primary rounded-t-2xl transition-all duration-1000 group-hover/bar:bg-royal" style={{height: `${h}%`}}></div>
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity font-bold">%{h}</div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <span>ث</span><span>ث</span><span>أ</span><span>خ</span><span>ج</span><span>س</span><span>ح</span>
                                </div>
                            </div>
                            
                            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-between group hover:-translate-y-1 transition-all">
                                <div className="flex justify-between items-start">
                                    <div className="w-16 h-16 bg-yellow-50 text-yellow-500 rounded-3xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform"><Trophy size={32} /></div>
                                    <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-full uppercase">ممتاز</span>
                                </div>
                                <div className="mt-8">
                                    <h4 className="text-4xl font-black text-slate-900 tracking-tight">92%</h4>
                                    <p className="text-slate-400 text-sm font-bold mt-1">معدل التزامك بالجدول الدراسي</p>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full mt-6 overflow-hidden">
                                    <div className="bg-yellow-400 h-full w-[92%] rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Sidebar Dash */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group">
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-50 rounded-full opacity-50 group-hover:scale-150 transition-transform"></div>
                            <h3 className="font-black text-slate-900 mb-8 relative z-10 flex items-center gap-2">الموعد القادم <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div></h3>
                            <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 relative z-10">
                                <p className="text-[10px] font-black text-orange-500 uppercase mb-3 tracking-widest">غداً • 10:00 صباحاً</p>
                                <h4 className="font-black text-slate-900 text-lg mb-2">جلسة توجيه شخصية</h4>
                                <p className="text-slate-500 text-sm font-bold flex items-center gap-2"><User size={16} className="text-primary"/> مع الأستاذ ياسين</p>
                                <button className="w-full mt-6 py-3 bg-white text-slate-900 border border-slate-200 rounded-xl font-black text-xs hover:bg-slate-900 hover:text-white transition-all shadow-sm">تأكيد الحضور</button>
                            </div>
                        </div>

                        <div className="bg-primary p-10 rounded-[3rem] text-white shadow-2xl shadow-blue-500/30 relative overflow-hidden transform hover:rotate-1 transition-transform">
                            <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mt-16 blur-2xl"></div>
                            <div className="relative z-10">
                                <h3 className="font-black text-2xl mb-6 flex items-center gap-3">نصيحة اليوم <Target size={24}/></h3>
                                <p className="text-blue-50 text-lg font-bold leading-relaxed italic">
                                    "الدراسة بذكاء تعني التركيز على 20% من الدروس التي تعطي 80% من النتائج. استعمل تقنية Pareto لضمان الفعالية!"
                                </p>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex items-center justify-between group cursor-pointer hover:bg-slate-900 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-50 text-primary rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all"><MessageCircle size={22}/></div>
                                <div>
                                    <h4 className="font-black text-slate-900 text-sm group-hover:text-white transition-colors">تحتاج مساعدة؟</h4>
                                    <p className="text-slate-400 text-xs font-bold group-hover:text-slate-50">تحدث مع مستشارك</p>
                                </div>
                            </div>
                            <ChevronRight size={20} className="text-slate-300 group-hover:text-white group-hover:translate-x-1 transition-all"/>
                        </div>
                    </div>
                </div>
            )}

            {/* Timetable View */}
            {activeTab === 'timetable' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                        <div>
                            <h2 className="text-3xl font-black text-slate-900">منظم الوقت الذكي</h2>
                            <p className="text-slate-400 font-bold mt-2">قم ببرمجة حصص المراجعة لضمان التوازن الأسبوعي</p>
                        </div>
                        <button onClick={() => setShowTaskModal(true)} className="bg-primary text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-royal transition-all shadow-xl shadow-blue-500/20 hover:-translate-y-1"><Plus size={24}/> إضافة حصة مراجعة</button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
                        {DAYS.map(day => (
                            <div key={day} className="bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-lg shadow-slate-200/40 min-h-[450px] flex flex-col group/day hover:border-primary/20 transition-colors">
                                <h3 className="font-black text-slate-900 text-center mb-6 pb-4 border-b border-slate-50 group-hover/day:text-primary transition-colors">{day}</h3>
                                <div className="space-y-4 flex-grow">
                                    {timetable.filter(t => t.day === day).sort((a,b) => a.startTime.localeCompare(b.startTime)).map(task => {
                                        const color = SUBJECT_COLORS[task.subject] || SUBJECT_COLORS['default'];
                                        return (
                                            <div key={task.id} className={`p-4 ${color.bg} ${color.border} rounded-3xl border relative group/task animate-in zoom-in-95`}>
                                                <button onClick={() => removeTask(task.id)} className="absolute -top-2 -left-2 bg-white text-red-500 shadow-md rounded-full p-1 opacity-0 group-hover/task:opacity-100 transition-opacity hover:scale-110"><X size={14}/></button>
                                                <p className={`font-black text-sm ${color.text} mb-1`}>{task.subject}</p>
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                                                    <Clock size={12}/>
                                                    <span>{task.startTime} - {task.endTime}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {timetable.filter(t => t.day === day).length === 0 && (
                                        <div className="h-full flex flex-col items-center justify-center text-center py-20">
                                            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-200"><Calendar size={20}/></div>
                                            <p className="text-[10px] text-slate-300 font-bold tracking-widest uppercase">يوم راحة</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Resources View */}
            {activeTab === 'resources' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex items-center gap-5 mb-12 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                        <div className="p-5 bg-emerald-50 text-emerald-600 rounded-[2rem] shadow-inner"><Library size={40}/></div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-900">مستودع الموارد التعليمية</h2>
                            <p className="text-slate-400 font-bold mt-1 text-lg">ملخصات حصرية ونماذج امتحانات منتقاة بعناية</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {resources.map((res, i) => {
                            const ResourceIcon = ICON_MAP[res.iconName] || Library;
                            return (
                                <div key={res.id} className="bg-white p-8 rounded-[3rem] border border-slate-100 hover:shadow-2xl shadow-slate-200/50 transition-all group relative overflow-hidden opacity-0 animate-fade-in-up" style={{animationDelay: `${i * 100}ms`, animationFillMode: 'forwards'}}>
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[3rem] -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                                    <div className="flex justify-between items-start mb-8 relative z-10">
                                        <div className="w-16 h-16 bg-white text-primary rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-slate-200 group-hover:scale-110 transition-transform"><ResourceIcon size={32}/></div>
                                        <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full uppercase tracking-widest border border-emerald-100">{res.subject}</span>
                                    </div>
                                    <h3 className="font-black text-slate-900 text-xl mb-3 group-hover:text-primary transition-colors">{res.title}</h3>
                                    <div className="flex items-center gap-4 text-xs font-bold text-slate-400 mb-8">
                                        <span className="flex items-center gap-1.5"><FileText size={14}/> {res.fileSize}</span>
                                        <span className="flex items-center gap-1.5"><DownloadCloud size={14}/> {res.downloadCount} تحميل</span>
                                    </div>
                                    <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-primary transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-900/10">
                                        تحميل الملف <Download size={20}/>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Videos View */}
            {activeTab === 'videos' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                     <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[4rem] border-4 border-dashed border-slate-100">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8 text-slate-300"><Film size={48}/></div>
                        <h3 className="text-2xl font-black text-slate-900 mb-4">قسم المحاضرات قيد التطوير</h3>
                        <p className="text-slate-400 font-bold max-w-sm text-center">ترقبوا إطلاق محاضرات الفيديو الحصرية قريباً ضمن مساحتكم الخاصة.</p>
                     </div>
                </div>
            )}
        </main>

        {/* Floating Add Button for Mobile */}
        <button onClick={() => setShowTaskModal(true)} className="lg:hidden fixed bottom-8 left-8 w-16 h-16 bg-primary text-white rounded-full shadow-2xl shadow-blue-500/40 flex items-center justify-center z-50 animate-bounce-slow"><Plus size={32}/></button>

        {/* Task Modal */}
        {showTaskModal && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
                <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl w-full max-w-md animate-in zoom-in-95 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16"></div>
                    <div className="flex justify-between items-center mb-10 relative z-10">
                        <div>
                            <h3 className="text-2xl font-black text-slate-900">إضافة حصة مراجعة</h3>
                            <p className="text-slate-400 text-xs font-bold mt-1">نظم وقتك لتحقق التوازن</p>
                        </div>
                        <button onClick={() => setShowTaskModal(false)} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors"><X size={24}/></button>
                    </div>
                    <form onSubmit={handleAddTask} className="space-y-6 relative z-10">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 mr-2 uppercase">المادة الدراسية</label>
                            <select value={newTask.subject} onChange={e => setNewTask({...newTask, subject: e.target.value})} className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-primary/20 rounded-2xl outline-none font-bold appearance-none cursor-pointer">
                                <option>رياضيات</option><option>فيزياء</option><option>علوم</option><option>فلسفة</option><option>لغات</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 mr-2 uppercase">اليوم</label>
                            <select value={newTask.day} onChange={e => setNewTask({...newTask, day: e.target.value})} className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-primary/20 rounded-2xl outline-none font-bold appearance-none cursor-pointer">
                                {DAYS.map(d => <option key={d}>{d}</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 mr-2 uppercase">وقت البدء</label>
                                <input type="time" value={newTask.startTime} onChange={e => setNewTask({...newTask, startTime: e.target.value})} className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold focus:border-primary/20 outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 mr-2 uppercase">وقت الانتهاء</label>
                                <input type="time" value={newTask.endTime} onChange={e => setNewTask({...newTask, endTime: e.target.value})} className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold focus:border-primary/20 outline-none" />
                            </div>
                        </div>
                        <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black shadow-xl shadow-slate-900/10 hover:bg-primary transition-all hover:-translate-y-1">تأكيد الإضافة للجدول</button>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};
