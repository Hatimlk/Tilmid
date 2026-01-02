
import React, { useEffect, useState, useRef } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { TAWJIH_DATA, TILMID_DATA, TALIB_DATA } from '../constants';
import { ProgramData } from '../types';
import {
  CheckCircle,
  MessageCircle,
  Calendar,
  User,
  BookOpen,
  Compass,
  GraduationCap,
  School,
  Target,
  Sparkles,
  Check,
  ArrowUpRight,
  BrainCircuit,
  Cpu,
  Fingerprint,
  RefreshCcw,
  Activity,
  Lightbulb,
  ShieldCheck,
  Clock,
  Play,
  Map,
  ArrowDown
} from 'lucide-react';

const FeatureStep: React.FC<{
  feature: { title: string; description: string };
  index: number;
  themeColor: string;
  lightThemeBg: string;
  borderColor: string;
}> = ({ feature, index, themeColor, lightThemeBg, borderColor }) => {
  const [isActive, setIsActive] = useState(false);
  const stepRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsActive(true);
      },
      { threshold: 0.6 }
    );
    if (stepRef.current) observer.observe(stepRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={stepRef}
      className={`group relative p-6 md:p-8 bg-white rounded-[2rem] border transition-all duration-700 flex flex-col md:flex-row gap-6 items-start z-10
      ${isActive
          ? `opacity-100 translate-y-0 scale-100 shadow-[0_20px_50px_-15px_rgba(0,149,255,0.1)] ${borderColor.replace('border-', 'border-opacity-50 border-')}`
          : 'opacity-40 translate-y-12 scale-95 grayscale'}`}
    >
      <div className={`absolute top-0 right-0 w-48 h-full ${lightThemeBg} opacity-20 filter blur-3xl transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-0'}`}></div>

      {/* Number Circle */}
      <div className={`w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] flex-shrink-0 flex items-center justify-center transition-all duration-1000 shadow-lg relative z-20 font-black
      ${isActive
          ? `${themeColor.replace('text-', 'bg-')} text-white animate-glow-pulse scale-105 rotate-3`
          : 'bg-slate-100 text-slate-400 rotate-0 scale-100'}`}>
        <span className="text-2xl md:text-3xl">{index + 1}</span>
      </div>

      <div className="relative z-10 pt-1 text-right">
        <h3 className={`text-xl md:text-2xl font-black mb-3 transition-colors duration-700 tracking-tight ${isActive ? themeColor : 'text-slate-400'}`}>
          {feature.title}
        </h3>
        <p className={`leading-relaxed text-base md:text-lg font-bold transition-colors duration-700 ${isActive ? 'text-slate-600' : 'text-slate-300'}`}>
          {feature.description}
        </p>
      </div>
    </div>
  );
};

// 1. Interactive AI Advisor Card with futuristic animations
const TawjihAIAdvisor: React.FC = () => {
  const [step, setStep] = useState<'intro' | 'quiz' | 'analyzing' | 'result'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [resultType, setResultType] = useState<string>('');

  const questions = [
    { id: 1, text: "ما هو النشاط الذي تجد نفسك منغمساً فيه وتنسى الوقت؟", options: [{ label: "حل الألغاز والمشاكل المنطقية", type: "eng" }, { label: "مساعدة الآخرين", type: "med" }, { label: "الكتابة أو الرسم", type: "art" }, { label: "تنظيم المشاريع", type: "bus" }] },
    { id: 2, text: "في العمل الجماعي، ما هو الدور الذي تفضله؟", options: [{ label: "المحلل التقني", type: "eng" }, { label: "الداعم النفسي", type: "med" }, { label: "المبدع والمبتكر", type: "art" }, { label: "القائد الإداري", type: "bus" }] },
    { id: 3, text: "أي من المواد الدراسية التالية كنت تستمتع بها أكثر؟", options: [{ label: "الرياضيات والفيزياء", type: "eng" }, { label: "العلوم الطبيعية", type: "med" }, { label: "اللغات والفنون", type: "art" }, { label: "الاقتصاد", type: "bus" }] }
  ];

  const handleAnswer = (type: string) => {
    const newAnswers = [...answers, type];
    setAnswers(newAnswers);
    if (currentQuestion < questions.length - 1) setCurrentQuestion(prev => prev + 1);
    else {
      setStep('analyzing');
      setTimeout(() => {
        const counts: any = { eng: 0, med: 0, art: 0, bus: 0 };
        newAnswers.forEach(a => { counts[a] = (counts[a] || 0) + 1; });
        setResultType(Object.keys(counts).reduce((a, b) => counts[a] >= counts[b] ? a : b));
        setStep('result');
      }, 2000);
    }
  };

  const getResult = () => {
    const map: any = {
      eng: { t: "الهندسة والتقنية", d: "لديك عقل تحليلي قوي وميول تقنية واضحة." },
      med: { t: "الطب والعلوم الصحية", d: "تتميز بحب مساعدة الآخرين والاهتمام بالجانب الإنساني." },
      art: { t: "الفنون والآداب", d: "تملك خيالاً واسعاً وقدرة على التعبير الإبداعي." },
      bus: { t: "الأعمال والإدارة", d: "تملك سمات قيادية وقدرة على التنظيم الاستراتيجي." }
    };
    return map[resultType] || map.eng;
  };

  return (
    <section className="my-24 max-w-5xl mx-auto px-4" id="ai-advisor">
      {/* Glow Wrapper */}
      <div className="relative group p-1 rounded-[3.8rem] bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 transition-all duration-700 hover:shadow-[0_0_80px_-20px_rgba(0,149,255,0.3)]">
        <div className="bg-slate-900 rounded-[3.5rem] shadow-2xl overflow-hidden relative min-h-[520px] flex flex-col border border-white/5">
          {/* Internal Pulse Gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,149,255,0.08)_0%,transparent_70%)] animate-pulse"></div>

          {step === 'intro' && (
            <div className="relative z-10 flex-grow flex flex-col items-center justify-center text-center p-8 lg:p-20">
              {/* Animated Icon with Scanning Ring */}
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-blue-500/20 rounded-[2.5rem] blur-xl animate-glow-pulse"></div>
                <div className="w-28 h-28 bg-gradient-to-br from-blue-600 to-royal rounded-[2.2rem] flex items-center justify-center relative shadow-2xl animate-float overflow-hidden">
                  <BrainCircuit size={54} className="text-white relative z-10 animate-pulse" />
                  {/* Scanning Line Effect */}
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-white/40 blur-sm animate-[scan_2s_ease-in-out_infinite]"></div>
                </div>
              </div>

              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">المستشار الذكي للتوجيه</h2>
              <p className="text-blue-200 text-xl mb-12 max-w-xl font-bold opacity-80 leading-relaxed">
                دع الذكاء الاصطناعي يحلل ميولك ويقترح عليك المسار الأنسب لشخصيتك وقدراتك.
              </p>

              <button
                onClick={() => setStep('quiz')}
                className="px-14 py-5 bg-white text-slate-900 rounded-2xl font-black text-xl shadow-2xl hover:bg-primary hover:text-white hover:-translate-y-2 transition-all active:scale-95 flex items-center gap-3"
              >
                <span>ابدأ التحليل الآن</span>
                <ArrowUpRight size={24} strokeWidth={3} />
              </button>
            </div>
          )}

          {step === 'quiz' && (
            <div className="relative z-10 flex-grow flex flex-col p-8 lg:p-16">
              <div className="flex justify-between items-center mb-12">
                <span className="text-blue-400 font-black text-sm uppercase tracking-widest">سؤال {currentQuestion + 1} من 3</span>
                <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${((currentQuestion + 1) / 3) * 100}%` }}></div>
                </div>
              </div>
              <h3 className="text-2xl md:text-4xl font-black text-white mb-12 text-right leading-tight">{questions[currentQuestion].text}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {questions[currentQuestion].options.map((o, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(o.type)}
                    className="p-8 bg-slate-800/50 hover:bg-white text-gray-200 hover:text-slate-900 text-right transition-all rounded-3xl font-black text-xl border border-slate-700 shadow-lg group/opt flex items-center justify-between"
                  >
                    <span>{o.label}</span>
                    <div className="w-8 h-8 rounded-full border-2 border-slate-600 group-hover/opt:border-primary flex items-center justify-center transition-colors">
                      <Check size={16} className="opacity-0 group-hover/opt:opacity-100" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'analyzing' && (
            <div className="flex-grow flex flex-col items-center justify-center text-white p-10">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 animate-pulse"></div>
                <Cpu size={80} className="animate-spin mb-8 text-blue-400 relative z-10" />
              </div>
              <h3 className="font-black text-3xl mb-4">جاري تحليل بياناتك...</h3>
              <p className="text-blue-100 opacity-60 font-bold">نقوم بمطابقة إجاباتك مع تخصصات المدارس العليا في المغرب.</p>
            </div>
          )}

          {step === 'result' && (
            <div className="p-10 lg:p-20 text-center text-white animate-in zoom-in duration-500 flex flex-col items-center">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-green-500/10 text-green-400 rounded-full text-sm font-black mb-8 border border-green-500/20">
                <CheckCircle size={18} /> تم التحليل بنجاح
              </div>
              <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">المجال المقترح: <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-purple-400 drop-shadow-sm">{getResult().t}</span></h2>
              <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-2xl mx-auto font-bold opacity-80 leading-relaxed">{getResult().d}</p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-10 py-4 bg-white text-slate-900 rounded-2xl font-black hover:bg-primary hover:text-white transition-all">تحدث مع موجه</button>
                <button onClick={() => { setStep('intro'); setCurrentQuestion(0); setAnswers([]); }} className="px-10 py-4 bg-slate-800 text-white rounded-2xl font-black border border-slate-700 hover:bg-slate-700 transition-all flex items-center gap-2">
                  <RefreshCcw size={18} /> إعادة الاختبار
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes scan {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(112px); }
        }
      `}</style>
    </section>
  );
};

export const ProgramDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  let data: ProgramData | null = null;
  let ProgramIcon = School;

  // Default Theme (Tilmid)
  let theme = {
    primary: 'text-primary',
    bg: 'bg-primary',
    gradient: 'from-blue-600 via-primary to-cyan-500',
    lightBg: 'bg-blue-50',
    border: 'border-blue-100',
    accent: 'text-cyan-600',
    blob1: 'bg-white',
    blob2: 'bg-cyan-200',
    button: 'bg-primary hover:bg-blue-600',
    iconBg: 'bg-white/10'
  };

  switch (id) {
    case 'tawjih':
      data = TAWJIH_DATA;
      ProgramIcon = Compass;
      theme = {
        primary: 'text-emerald-600',
        bg: 'bg-emerald-600',
        gradient: 'from-emerald-800 via-teal-600 to-emerald-500',
        lightBg: 'bg-emerald-50',
        border: 'border-emerald-100',
        accent: 'text-teal-500',
        blob1: 'bg-teal-200',
        blob2: 'bg-emerald-300',
        button: 'bg-emerald-600 hover:bg-emerald-700',
        iconBg: 'bg-emerald-900/10'
      };
      break;
    case 'tilmid':
      data = TILMID_DATA;
      ProgramIcon = School;
      theme = {
        primary: 'text-blue-600',
        bg: 'bg-blue-600',
        gradient: 'from-blue-700 via-blue-600 to-cyan-500',
        lightBg: 'bg-blue-50',
        border: 'border-blue-100',
        accent: 'text-cyan-500',
        blob1: 'bg-blue-300',
        blob2: 'bg-cyan-200',
        button: 'bg-blue-600 hover:bg-blue-700',
        iconBg: 'bg-blue-900/10'
      };
      break;
    case 'talib':
      data = TALIB_DATA;
      ProgramIcon = GraduationCap;
      theme = {
        primary: 'text-violet-600',
        bg: 'bg-violet-600',
        gradient: 'from-violet-800 via-purple-600 to-fuchsia-500',
        lightBg: 'bg-violet-50',
        border: 'border-violet-100',
        accent: 'text-fuchsia-500',
        blob1: 'bg-fuchsia-300',
        blob2: 'bg-violet-300',
        button: 'bg-violet-600 hover:bg-violet-700',
        iconBg: 'bg-violet-900/10'
      };
      break;
  }

  useEffect(() => {
    if (data) {
      document.title = `${data.title} - تلميذ | Tilmid`;
      window.scrollTo(0, 0);
    }
  }, [data]);

  if (!data) return <Navigate to="/" />;

  const stats = [
    { value: "+3500", label: "تلميذ مستفيد", icon: User },
    { value: "98%", label: "نسبة الرضا", icon: CheckCircle },
    { value: "+10", label: "سنوات خبرة", icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 overflow-x-hidden font-sans">

      {/* Hero Section */}
      <div className={`relative pt-32 pb-32 lg:pt-48 lg:pb-64 overflow-hidden text-white bg-gradient-to-br ${theme.gradient}`}>
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full blur-[120px] opacity-20 animate-blob ${theme.blob1}`}></div>
          <div className={`absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[100px] opacity-20 animate-blob animation-delay-2000 ${theme.blob2}`}></div>
          <div className="absolute top-[40%] left-[20%] w-[400px] h-[400px] bg-white rounded-full blur-[100px] opacity-10 animate-pulse"></div>
        </div>

        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat"></div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto text-center animate-fade-in-up">

            <div className="inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-bold shadow-lg animate-bounce-slow">
              <Sparkles size={16} className="text-yellow-300" />
              <span>البرنامج الأكثر طلباً هذا الموسم</span>
            </div>

            <div className="w-28 h-28 md:w-36 md:h-36 bg-white/10 backdrop-blur-xl rounded-[2.5rem] mb-10 shadow-2xl border border-white/20 transform hover:rotate-6 transition-all duration-500 mx-auto flex items-center justify-center group/icon relative">
              <div className="absolute inset-0 bg-white/20 blur-xl rounded-[2.5rem] -z-10 group-hover/icon:blur-2xl transition-all"></div>
              <ProgramIcon size={72} className="text-white group-hover/icon:scale-110 transition-transform drop-shadow-md" strokeWidth={1.5} />
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tight leading-[1] drop-shadow-lg">
              {data.title}
            </h1>

            <p className="text-xl sm:text-2xl md:text-3xl text-blue-50/90 font-bold leading-relaxed max-w-3xl mx-auto">
              {data.subtitle}
            </p>

            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="px-10 py-4 bg-white text-slate-900 rounded-2xl font-black text-lg hover:bg-slate-50 transition-all shadow-xl hover:-translate-y-1 flex items-center gap-2">
                <span>اكتشف البرنامج</span>
                <ArrowDown size={20} className="animate-bounce" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 -mt-20 lg:-mt-28 relative z-20">

        {/* Polished Stats Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] p-5 md:p-8 mb-16 border border-white/60 relative z-30">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-10 items-center">
            {stats.map((stat, idx) => (
              <div key={idx} className={`flex flex-col items-center text-center gap-3 p-3 md:p-5 rounded-[2rem] group transition-all duration-500 ${idx === 2 ? 'col-span-2 md:col-span-1' : ''}`}>
                <div className={`w-14 h-14 md:w-20 md:h-20 rounded-2xl ${idx === 1 ? 'bg-yellow-50 text-yellow-500 border-yellow-100' : theme.lightBg + ' ' + theme.primary + ' ' + theme.border} border-2 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform bg-white relative z-10`}>
                  <stat.icon size={32} strokeWidth={2} className="md:w-10 md:h-10" />
                </div>
                <div>
                  <h4 className="text-2xl md:text-4xl font-black text-slate-900 mb-1 tracking-tighter tabular-nums">{stat.value}</h4>
                  <p className="text-[10px] md:text-xs text-slate-400 font-black uppercase tracking-widest leading-none">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {id === 'tawjih' && <TawjihAIAdvisor />}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24" id="features">

          {/* Main Content Column with Journey Path (Step Timeline) */}
          <div className="lg:col-span-8 space-y-16">
            <div className="relative px-2">
              <div className="space-y-4 mb-16 text-center md:text-right">
                <div className={`inline-flex items-center gap-2 px-6 py-2.5 ${theme.lightBg} ${theme.primary} rounded-full text-xs font-black uppercase tracking-widest shadow-sm border ${theme.border}`}>
                  <Sparkles size={16} fill="currentColor" />
                  <span>خارطة طريق النجاح الدراسي</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">ماذا ستحقق في هذا البرنامج؟</h2>
              </div>

              {/* 2. Vertical Timeline Connector Logic (Dashed line) */}
              <div className="absolute top-[320px] bottom-[100px] right-[75px] md:right-[100px] w-1 border-r-2 border-dashed border-slate-200 hidden md:block z-0 opacity-80"></div>

              <div className="grid grid-cols-1 gap-12 relative z-10">
                {data.features.map((feature, idx) => (
                  <FeatureStep
                    key={idx}
                    feature={feature}
                    index={idx}
                    themeColor={theme.primary}
                    lightThemeBg={theme.lightBg}
                    borderColor={theme.border}
                  />
                ))}
              </div>
            </div>

            {/* 3. Exclusive Topics Refactored with Glassmorphism Grid */}
            {data.extraTopics && (
              <section id="extra-topics" className="bg-slate-900 rounded-[3rem] p-8 md:p-16 shadow-2xl relative overflow-hidden group">
                <div className={`absolute top-0 right-0 w-96 h-96 ${theme.bg} opacity-[0.15] rounded-full blur-[120px] group-hover:scale-125 transition-transform duration-1000`}></div>

                <div className="relative z-10">
                  <div className="flex items-center gap-6 mb-16">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-[2.2rem] flex items-center justify-center text-white border border-white/20 shadow-2xl">
                      <BookOpen size={40} />
                    </div>
                    <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight">محاور إضافية حصرية</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.extraTopics.map((topic, idx) => (
                      <Link
                        to={`/blog?search=${encodeURIComponent(topic)}`}
                        key={idx}
                        className="flex items-center gap-6 p-10 rounded-[2.5rem] bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white hover:border-white transition-all duration-500 group/topic overflow-hidden relative shadow-lg"
                      >
                        {/* Interactive Highlight Background */}
                        <div className={`absolute inset-0 ${theme.bg} opacity-0 group-hover/topic:opacity-10 transition-opacity`}></div>

                        <div className={`w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10 ${theme.accent} group-hover/topic:bg-white group-hover/topic:text-slate-900 group-hover/topic:border-white transition-all duration-500`}>
                          <Check size={28} strokeWidth={4} className="scale-75 group-hover/topic:scale-100 transition-transform" />
                        </div>

                        <span className="text-white font-black text-xl group-hover/topic:text-slate-900 transition-colors leading-tight">
                          {topic}
                        </span>

                        <ArrowUpRight size={24} className={`absolute left-8 text-white/20 ${theme.primary} transition-all opacity-0 group-hover/topic:opacity-100 -translate-y-4 group-hover/topic:translate-y-0`} />
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* 4. Sticky Sidebar Column - Optimized for visibility and containment */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-28 space-y-8">
              {/* Booking Form Card */}
              <div id="registration-card" className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] p-6 border border-gray-100 text-center relative overflow-hidden group hover:shadow-xl transition-all duration-500">
                <div className={`absolute top-0 left-0 w-full h-3 bg-gradient-to-r ${theme.gradient}`}></div>
                <div className="relative z-10">
                  <div className={`w-24 h-24 mx-auto rounded-[2rem] ${theme.lightBg} flex items-center justify-center ${theme.primary} mb-8 shadow-lg border-4 border-white group-hover:scale-105 transition-transform duration-700`}>
                    <MessageCircle size={48} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">هل تحتاج استشارة؟</h3>
                  <p className="text-slate-500 mb-8 text-lg font-bold leading-relaxed">فريقنا المختص جاهز للإجابة على جميع تساؤلاتك وتوجيهك نحو التفوق.</p>

                  <div className="space-y-4">
                    <a href="https://wa.me/message/GN4XKUOMHNHGO1" target="_blank" rel="noreferrer" className="w-full py-5 bg-[#25D366] hover:bg-[#1da851] text-white rounded-[1.8rem] font-black shadow-xl flex items-center justify-center gap-3 text-xl group active:scale-95 transition-all">
                      <MessageCircle size={26} fill="white" className="group-hover:rotate-12 transition-transform" />
                      <span>تحدث معنا الآن</span>
                    </a>
                    <Link to="/contact" className={`w-full py-5 bg-white border-2 rounded-[1.8rem] font-black transition-all flex items-center justify-center gap-3 text-xl hover:bg-slate-50 active:scale-95 ${theme.primary} ${theme.border}`}>
                      <span>حجز موعد</span>
                      <Calendar size={22} />
                    </Link>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-gray-50">
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex -space-x-2 space-x-reverse">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 overflow-hidden shadow-sm hover:z-10 hover:scale-110 transition-all">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + id!}`} alt="Student" />
                        </div>
                      ))}
                      <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-[9px] font-black border-2 border-white shadow-sm">+3k</div>
                    </div>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">انضم إلى مجتمع المتفوقين في المغرب</p>
                  </div>
                </div>
              </div>

              {/* Guarantee Card */}
              <div className={`p-6 rounded-[2rem] ${theme.bg} text-white shadow-xl relative overflow-hidden group hover:rotate-1 transition-all duration-500`}>
                <div className="absolute -right-16 -bottom-16 opacity-10 rotate-12 group-hover:scale-110 group-hover:rotate-0 transition-all duration-1000">
                  <ProgramIcon size={200} />
                </div>
                <div className="relative z-10 flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-[1.2rem] backdrop-blur-md shadow-inner ring-1 ring-white/30">
                      <ShieldCheck size={36} />
                    </div>
                    <h4 className="font-black text-2xl tracking-tight leading-none">ضمان تلميـذ</h4>
                  </div>
                  <p className="text-white/95 text-lg leading-relaxed font-bold">
                    نحن نلتزم بتقديم أعلى جودة تعليمية ومواكبة دقيقة لكل تلميذ حتى تحقيق هدفه الدراسي.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
