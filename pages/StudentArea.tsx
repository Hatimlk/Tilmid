
import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, Clock, Calendar, Star, Download, PlayCircle, User, ChevronRight, 
  LogOut, Lock, AlertCircle, X, Check, Video, FileText, 
  Play, Key, Activity, TrendingUp, Plus, Eye, MessageSquare, Send,
  LayoutDashboard, Library, Film, Bell, GraduationCap, Flame, Moon, Sun, 
  ArrowRight, MessageCircle, BookText, FileSpreadsheet, FileCode, DownloadCloud, Sparkles
} from 'lucide-react';
import { dataManager } from '../utils/dataManager';
import { Appointment, StudyResource, TimetableTask } from '../types';

const DAYS = ['الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'];

const ICON_MAP: Record<string, any> = {
  BookText,
  FileSpreadsheet,
  FileCode,
  Library
};

type ActiveTab = 'dashboard' | 'videos' | 'resources' | 'timetable' | 'schedule';

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
          // Load local timetable for this user
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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-xl w-full max-w-md border border-gray-100">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-primary text-white rounded-3xl flex items-center justify-center mx-auto mb-4"><GraduationCap size={40}/></div>
                    <h2 className="text-3xl font-black text-slate-900">مرحباً بك</h2>
                    <p className="text-slate-500">سجل الدخول للوصول لأدواتك الدراسية</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-6">
                    <input type="text" placeholder="اسم المستخدم" value={username} onChange={e => setUsername(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-200 outline-none focus:border-primary transition-all font-bold" />
                    <input type="password" placeholder="كلمة المرور" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-200 outline-none focus:border-primary transition-all font-bold" />
                    {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}
                    <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-primary shadow-lg transition-all">دخول</button>
                </form>
                <p className="text-center mt-6 text-xs text-gray-400 font-bold">حساب تجريبي: amin / 123</p>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
        <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-40 px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center"><GraduationCap size={20}/></div>
                <span className="font-black text-slate-900">مساحة التميز</span>
            </div>
            <div className="flex items-center gap-4">
                <span className="font-bold text-sm text-slate-600 hidden sm:block">{user.name}</span>
                <button onClick={() => { localStorage.removeItem('tilmid_user'); setUser(null); }} className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors"><LogOut size={20}/></button>
            </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-10">
            {/* Nav Tabs */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar mb-10 bg-white p-2 rounded-[2rem] border border-gray-100 w-fit mx-auto shadow-sm">
                {[
                    {id: 'dashboard', label: 'الرئيسية', icon: LayoutDashboard},
                    {id: 'timetable', label: 'منظم الوقت', icon: Clock},
                    {id: 'resources', label: 'المكتبة الرقمية', icon: Library},
                    {id: 'videos', label: 'المحاضرات', icon: Film}
                ].map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id as ActiveTab)} className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-gray-50'}`}>
                        <tab.icon size={18} /> {tab.label}
                    </button>
                ))}
            </div>

            {/* Timetable View */}
            {activeTab === 'timetable' && (
                <div className="animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900">مولد الجدول الزمني</h2>
                            <p className="text-slate-400 text-sm font-bold">نظم حصص المراجعة الأسبوعية بذكاء</p>
                        </div>
                        <button onClick={() => setShowTaskModal(true)} className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-royal transition-all shadow-lg"><Plus size={20}/> إضافة حصة</button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                        {DAYS.map(day => (
                            <div key={day} className="bg-white p-4 rounded-3xl border border-gray-100 min-h-[400px]">
                                <h3 className="font-black text-primary text-center mb-4 pb-2 border-b border-gray-50">{day}</h3>
                                <div className="space-y-3">
                                    {timetable.filter(t => t.day === day).sort((a,b) => a.startTime.localeCompare(b.startTime)).map(task => (
                                        <div key={task.id} className="p-3 bg-blue-50 rounded-2xl border border-blue-100 group relative">
                                            <button onClick={() => removeTask(task.id)} className="absolute -top-1 -left-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"><X size={12}/></button>
                                            <p className="font-black text-xs text-blue-700">{task.subject}</p>
                                            <p className="text-[10px] text-blue-400 font-bold mt-1">{task.startTime} - {task.endTime}</p>
                                        </div>
                                    ))}
                                    {timetable.filter(t => t.day === day).length === 0 && <p className="text-center py-10 text-gray-200 text-xs font-bold">لا توجد حصص</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Resources View */}
            {activeTab === 'resources' && (
                <div className="animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><Library size={28}/></div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900">مستودع الموارد</h2>
                            <p className="text-slate-400 text-sm font-bold">ملخصات حصرية ونماذج امتحانات منتقاة</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {resources.map(res => {
                            const ResourceIcon = ICON_MAP[res.iconName] || Library;
                            return (
                                <div key={res.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 hover:shadow-xl transition-all group">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-14 h-14 bg-gray-50 text-primary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"><ResourceIcon size={28}/></div>
                                        <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full uppercase tracking-widest">{res.subject}</span>
                                    </div>
                                    <h3 className="font-black text-slate-900 mb-2">{res.title}</h3>
                                    <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-50">
                                        <span className="text-xs text-gray-400 font-bold">{res.fileSize} • {res.downloadCount} تحميل</span>
                                        <button className="p-3 bg-slate-900 text-white rounded-2xl hover:bg-primary transition-all"><Download size={20}/></button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Dashboard View */}
            {activeTab === 'dashboard' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
                             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                             <div className="relative z-10">
                                <h2 className="text-4xl font-black mb-4">أهلاً {user.name.split(' ')[0]}! 🔥</h2>
                                <p className="text-blue-100 text-lg opacity-80 mb-8 max-w-md">أنت الآن في رحلة التفوق. استعمل الأدوات الذكية لتنظيم يومك وضمان النجاح.</p>
                                <div className="flex gap-4">
                                    <button onClick={() => setActiveTab('timetable')} className="px-6 py-3 bg-white text-slate-900 rounded-2xl font-black text-sm hover:scale-105 transition-transform flex items-center gap-2"><Sparkles size={16} className="text-primary"/> ابدأ التخطيط</button>
                                    <div className="flex items-center gap-2 text-sm font-bold text-blue-200"> <Flame size={18} className="text-orange-400"/> مستوى التركيز: عالٍ </div>
                                </div>
                             </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                                <h3 className="font-black text-slate-900 mb-6 flex items-center gap-2"><Activity className="text-primary"/> إحصائيات الأسبوع</h3>
                                <div className="flex justify-between items-end h-32 gap-2">
                                    {[40,70,50,90,60,80,45].map((h, i) => (
                                        <div key={i} className="flex-1 bg-gray-50 rounded-t-xl relative group">
                                            <div className="absolute bottom-0 w-full bg-primary rounded-t-xl transition-all duration-1000" style={{height: `${h}%`}}></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-center text-center">
                                <div className="w-20 h-20 bg-yellow-50 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4"><Star size={40} fill="currentColor"/></div>
                                <h4 className="text-2xl font-black text-slate-900">92%</h4>
                                <p className="text-gray-400 text-sm font-bold">معدل التزامك بالجدول</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-6">
                        <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
                            <h3 className="font-black text-slate-900 mb-6">الموعد القادم</h3>
                            <div className="p-5 bg-orange-50 rounded-3xl border border-orange-100">
                                <p className="text-xs font-black text-orange-400 uppercase mb-2">غداً • 10:00 صباحاً</p>
                                <h4 className="font-black text-slate-900">جلسة توجيه شخصية</h4>
                                <p className="text-slate-500 text-sm mt-1">مع الأستاذ ياسين</p>
                            </div>
                        </div>
                        <div className="bg-primary p-8 rounded-[3rem] text-white shadow-xl shadow-blue-500/20">
                            <h3 className="font-black text-xl mb-4">نصيحة اليوم 💡</h3>
                            <p className="text-blue-50 font-medium leading-relaxed italic">"الدراسة بذكاء تعني التركيز على 20% من الدروس التي تعطي 80% من النتائج. استعمل تقنية Pareto!"</p>
                        </div>
                    </div>
                </div>
            )}
        </main>

        {/* Task Modal */}
        {showTaskModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-in fade-in">
                <div className="bg-white p-8 rounded-[3rem] shadow-2xl w-full max-w-md animate-in zoom-in-95">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-black text-slate-900">إضافة حصة دراسية</h3>
                        <button onClick={() => setShowTaskModal(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20}/></button>
                    </div>
                    <form onSubmit={handleAddTask} className="space-y-5">
                        <div>
                            <label className="text-xs font-black text-slate-400 block mb-2 mr-1">المادة</label>
                            <select value={newTask.subject} onChange={e => setNewTask({...newTask, subject: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold">
                                <option>رياضيات</option><option>فيزياء</option><option>علوم</option><option>فلسفة</option><option>لغات</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-black text-slate-400 block mb-2 mr-1">اليوم</label>
                            <select value={newTask.day} onChange={e => setNewTask({...newTask, day: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold">
                                {DAYS.map(d => <option key={d}>{d}</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="text-xs font-black text-slate-400 block mb-2 mr-1">البداية</label><input type="time" value={newTask.startTime} onChange={e => setNewTask({...newTask, startTime: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold" /></div>
                            <div><label className="text-xs font-black text-slate-400 block mb-2 mr-1">النهاية</label><input type="time" value={newTask.endTime} onChange={e => setNewTask({...newTask, endTime: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold" /></div>
                        </div>
                        <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black shadow-lg hover:bg-primary transition-all">تأكيد الإضافة</button>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};
