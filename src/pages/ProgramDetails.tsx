
import React, { useEffect, useState, useRef } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { TAWJIH_DATA, TILMID_DATA, TALIB_DATA, BLOG_POSTS } from '../constants';
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
  ArrowDown,
  Star,
  Gift,
  Brain
} from 'lucide-react';
import { BlogCard } from '../components/BlogCard';

const FeatureStep: React.FC<{
  feature: { title: string; description: string };
  index: number;
  themeColor: string;
  lightThemeBg: string;
  borderColor: string;
}> = ({ feature, index, themeColor, lightThemeBg, borderColor }) => {
  const [isActive, setIsActive] = useState(false);
  const stepRef = useRef<HTMLDivElement>(null);

  // Map index to Icons
  const Icons = [Target, BrainCircuit, ShieldCheck, User];
  const Icon = Icons[index] || Star;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsActive(true);
      },
      { threshold: 0.2 }
    );
    if (stepRef.current) observer.observe(stepRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={stepRef}
      className={`group relative p-8 bg-white rounded-[2.5rem] border border-gray-100 hover:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.05)] transition-all duration-700 flex flex-col items-start min-h-[280px] overflow-hidden
      ${isActive
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-12 scale-90'}`}
    >
      <div className={`absolute top-0 right-0 w-48 h-full bg-gradient-to-l from-${themeColor.split('-')[1]}-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700`}>\</div>
      <div className={`absolute -right-10 -top-10 w-32 h-32 ${lightThemeBg} rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>

      {/* Icon Circle */}
      <div className="w-full flex justify-between items-start mb-6 relative z-10">
        <div className={`w-16 h-16 rounded-[1.2rem] flex items-center justify-center transition-all duration-700 shadow-sm border border-transparent group-hover:scale-110
        ${isActive
            ? `${lightThemeBg} ${themeColor} border-${borderColor.split('-')[1]}-100`
            : 'bg-slate-50 text-slate-300'}`}>
          <Icon size={32} strokeWidth={1.5} />
        </div>
        <span className="text-[10px] font-black text-slate-200 group-hover:text-slate-300 transition-colors">0{index + 1}</span>
      </div>

      <div className="relative z-10 text-right w-full mt-auto">
        <h3 className="text-xl md:text-2xl font-black mb-4 transition-colors duration-700 text-slate-900 leading-tight group-hover:text-primary">
          {feature.title}
        </h3>
        <p className="leading-relaxed text-base text-slate-500 font-medium group-hover:text-slate-600 transition-colors">
          {feature.description}
        </p>
      </div>

      {/* Decorative Line */}
      <div className={`absolute bottom-0 right-0 h-1 bg-gradient-to-r ${isActive ? 'from-' + themeColor.split('-')[1] + '-500 to-transparent w-full' : 'w-0'} transition-all duration-1000 delay-300`}></div>
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
    { id: 1, text: "ما هو النشاط الذي تجد نفسك منغمساً فيه وتنسى الوقت؟", options: [{ label: "حل الألغاز والمشاكل المنطقية", type: "eng" }, { label: "مساعدة الآخرين وشرح الأمور", type: "med" }, { label: "الكتابة، الرسم أو التصميم", type: "art" }, { label: "تنظيم المشاريع والخطط", type: "bus" }] },
    { id: 2, text: "في العمل الجماعي، ما هو الدور الذي تفضله عادة؟", options: [{ label: "المحلل التقني", type: "eng" }, { label: "المستمع والداعم", type: "med" }, { label: "صاحب الأفكار الإبداعية", type: "art" }, { label: "القائد والمنظم", type: "bus" }] },
    { id: 3, text: "كيف تفضل التعامل مع المشاكل المعقدة؟", options: [{ label: "تفكيكها إلى أجزاء صغيرة ومنطقية", type: "eng" }, { label: "البحث عن حل يرضي جميع الأطراف", type: "med" }, { label: "التفكير خارج الصندوق وبطرق غير تقليدية", type: "art" }, { label: "اتخاذ قرار سريع وحاسم", type: "bus" }] },
    { id: 4, text: "أي نوع من البيئات تفضل العمل فيه؟", options: [{ label: "مختبر أو مكتب هادئ مع تقنيات", type: "eng" }, { label: "مكان فيه تواصل دائم مع الناس", type: "med" }, { label: "استوديو مفتوح ومرن", type: "art" }, { label: "بيئة عمل ديناميكية ومتغيرة", type: "bus" }] },
    { id: 5, text: "ما هو أكثر شيء يثير فضولك؟", options: [{ label: "كيف تعمل الأشياء والآلات", type: "eng" }, { label: "سلوك الإنسان وعلم النفس", type: "med" }, { label: "الجماليات والتعبير الفني", type: "art" }, { label: "قصص النجاح والثروة", type: "bus" }] },
    { id: 6, text: "كيف تتصرف تحت الضغط؟", options: [{ label: "أركز على الحلول المنطقية", type: "eng" }, { label: "أطلب المساعدة وأتعاون مع الفريق", type: "med" }, { label: "أبحث عن حلول بديلة ومبتكرة", type: "art" }, { label: "أتولى القيادة وأوزع المهام", type: "bus" }] },
    { id: 7, text: "ما هي القيمة الأهم بالنسبة لك مهنياً؟", options: [{ label: "الدقة والابتكار التقني", type: "eng" }, { label: "الأثر المباشر على حياة الناس", type: "med" }, { label: "حرية التعبير والتفرد", type: "art" }, { label: "النمو، القيادة والتأثير", type: "bus" }] }
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

        // Find top two traits for more nuanced result if needed, currently picking top 1
        setResultType(Object.keys(counts).reduce((a, b) => counts[a] >= counts[b] ? a : b));
        setStep('result');
      }, 2000);
    }
  };

  const getResult = () => {
    const map: any = {
      eng: {
        t: "الهندسة والعلوم التطبيقية",
        d: "أنت تتمتع بتفكير تحليلي ومنطقي قوي. تميل لفهم كيف تعمل الأشياء وتستمتع بحل المشكلات المعقدة بالأرقام والبيانات. مجالات مثل الهندسة (المعلوماتية، المدنية، الصناعية) أو الذكاء الاصطناعي تناسبك تماماً."
      },
      med: {
        t: "العلوم الطبية والإنسانية",
        d: "لديك ذكاء عاطفي عالٍ ورغبة حقيقية في مساعدة الآخرين. تجد نفسك في المجالات التي تتطلب تواصلاً إنسانياً وعناية، مثل الطب، الصيدلة، التمريض، أو حتى علم النفس والتعليم."
      },
      art: {
        t: "الفنون، التصميم والإعلام",
        d: "خيّالك هو قوتك الخارقة. لا تحب القيود والروتين، وتبحث دائماً عن طرق جديدة للتعبير عن أفكارك. مجالات مثل الهندسة المعمارية، التصميم الجرافيكي، الصحافة، أو الفنون الرقمية هي ملعبك الطبيعي."
      },
      bus: {
        t: "التسيير، الاقتصاد والمقاولات",
        d: "أنت قائد بالفطرة. لديك رؤية استراتيجية وتهتم بالنتائج والنمو وتستمتع بالمنافسة. تخصصات مثل التجارة والتسيير (ENCG)، إدارة الأعمال، أو الاقتصاد ستسمح لقدراتك القيادية بالازدهار."
      }
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
            <div className="relative z-10 flex-grow flex flex-col items-center justify-center text-center p-8 lg:p-12">
              {/* Animated Icon with Scanning Ring */}
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-blue-500/20 rounded-[2rem] blur-xl animate-glow-pulse"></div>
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-royal rounded-[1.8rem] flex items-center justify-center relative shadow-xl animate-float overflow-hidden">
                  <BrainCircuit size={40} className="text-white relative z-10 animate-pulse" />
                  {/* Scanning Line Effect */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-white/40 blur-sm animate-[scan_2s_ease-in-out_infinite]"></div>
                </div>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">المستشار الذكي للتوجيه</h2>
              <p className="text-blue-200 text-lg mb-8 max-w-lg font-medium opacity-80 leading-relaxed">
                دع الذكاء الاصطناعي يحلل ميولك ويقترح عليك المسار الأنسب لشخصيتك وقدراتك.
              </p>

              <button
                onClick={() => setStep('quiz')}
                className="px-10 py-4 bg-white text-slate-900 rounded-2xl font-bold text-lg shadow-xl hover:bg-primary hover:text-white hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-3"
              >
                <span>ابدأ التحليل الآن</span>
                <ArrowUpRight size={20} strokeWidth={2.5} />
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
            <div className="relative z-10 p-10 lg:p-20 text-center text-white animate-in zoom-in duration-500 flex flex-col items-center">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-green-500/10 text-green-400 rounded-full text-sm font-black mb-8 border border-green-500/20">
                <CheckCircle size={18} /> تم التحليل بنجاح
              </div>
              <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">المجال المقترح: <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-purple-400 drop-shadow-sm">{getResult().t}</span></h2>
              <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-2xl mx-auto font-bold opacity-80 leading-relaxed">{getResult().d}</p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/coaching-offer" className="px-10 py-4 bg-white text-slate-900 rounded-2xl font-black hover:bg-primary hover:text-white transition-all text-center flex items-center justify-center">تحدث مع موجه</Link>
                <button onClick={() => {
                  setStep('intro');
                  setCurrentQuestion(0);
                  setAnswers([]);
                  setResultType('');
                  document.getElementById('ai-advisor')?.scrollIntoView({ behavior: 'smooth' });
                }} className="px-10 py-4 bg-slate-800 text-white rounded-2xl font-black border border-slate-700 hover:bg-slate-700 transition-all flex items-center justify-center gap-2">
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
    gradient: 'from-[#0037ff] via-[#2563eb] to-[#06b6d4]', // Richer blue gradient
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
        gradient: 'from-[#064e3b] via-[#059669] to-[#34d399]', // Richer emerald gradient
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
        gradient: 'from-[#1e3a8a] via-[#2563eb] to-[#06b6d4]', // Richer blue gradient
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
        gradient: 'from-[#2e1065] via-[#7c3aed] to-[#d946ef]', // Richer violet gradient
        lightBg: 'bg-violet-50',
        border: 'border-violet-100',
        accent: 'text-fuchsia-500',
        blob1: 'bg-fuchsia-400',
        blob2: 'bg-violet-400',
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
    <div className="min-h-screen bg-slate-50 pb-20 overflow-x-hidden font-sans selection:bg-primary/30">

      {/* Hero Section */}
      <div className={`relative pt-32 pb-32 lg:pt-48 lg:pb-64 overflow-hidden text-white bg-gradient-to-br ${theme.gradient}`}>
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full blur-[120px] opacity-30 animate-blob ${theme.blob1}`}></div>
          <div className={`absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[100px] opacity-30 animate-blob animation-delay-2000 ${theme.blob2}`}></div>
          <div className="absolute top-[40%] left-[20%] w-[400px] h-[400px] bg-white rounded-full blur-[90px] opacity-10 animate-pulse"></div>

          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05] mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto text-center animate-fade-in-up">

            <div className="inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-bold shadow-lg animate-bounce-slow ring-1 ring-white/10">
              <Sparkles size={16} className="text-yellow-400 fill-current" />
              <span className="tracking-wide">البرنامج الأكثر طلباً هذا الموسم</span>
            </div>

            <div className="w-24 h-24 md:w-32 md:h-32 bg-white/10 backdrop-blur-2xl rounded-[2.5rem] mb-10 shadow-2xl border border-white/20 transform hover:rotate-6 transition-all duration-500 mx-auto flex items-center justify-center group/icon relative">
              <div className="absolute inset-0 bg-white/30 blur-2xl rounded-[2.5rem] -z-10 group-hover/icon:blur-3xl transition-all opacity-50"></div>
              <ProgramIcon size={56} className="text-white group-hover/icon:scale-110 transition-transform drop-shadow-[0_10px_10px_rgba(0,0,0,0.2)]" strokeWidth={1.5} />
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tight leading-[1.1] drop-shadow-xl">
              {data.title}
            </h1>

            <p className="text-xl md:text-3xl text-blue-50/90 font-bold leading-relaxed max-w-3xl mx-auto opacity-90 drop-shadow-md">
              {data.subtitle}
            </p>

            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
              <button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-10 py-4 bg-white text-slate-900 rounded-[2rem] font-black text-lg hover:bg-slate-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center gap-3 group"
              >
                <span>اكتشف البرنامج</span>
                <ArrowDown size={20} className="animate-bounce group-hover:text-primary transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 -mt-24 lg:-mt-32 relative z-20">

        {/* Polished Stats Card - Hovering Glass Effect */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] p-6 md:p-10 mb-20 border border-white/50 relative z-30 max-w-5xl mx-auto overflow-hidden group">
          <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${theme.gradient} opacity-50`}></div>
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-slate-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 items-center relative z-10">
            {stats.map((stat, idx) => (
              <div key={idx} className={`flex flex-col items-center text-center gap-3 p-4 rounded-3xl group/stat hover:bg-white/50 transition-colors duration-300 ${idx === 2 ? 'col-span-2 md:col-span-1' : ''}`}>
                <div className={`w-16 h-16 rounded-[1.5rem] ${idx === 1 ? 'bg-yellow-100 text-yellow-600 border-yellow-200' : theme.lightBg + ' ' + theme.primary + ' ' + theme.border} border-2 flex items-center justify-center shadow-lg group-hover/stat:scale-110 transition-transform bg-white relative z-10`}>
                  <stat.icon size={32} strokeWidth={2} />
                </div>
                <div>
                  <h4 className="text-3xl font-black text-slate-900 mb-1 tracking-tight tabular-nums">{stat.value}</h4>
                  <p className="text-xs text-slate-500 font-black uppercase tracking-widest">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {id === 'tawjih' && <TawjihAIAdvisor />}



        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24" id="features">

          {/* Main Content Column with Journey Path (Step Timeline) */}
          {/* Main Content Column with Grid Features */}
          <div className="lg:col-span-8 space-y-12">
            <div className="relative px-2">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl md:text-4xl font-bold text-slate-900 tracking-tight">مميزات البرنامج</h2>
                <div className={`w-10 h-10 rounded-xl ${theme.lightBg} flex items-center justify-center ${theme.primary}`}>
                  <Sparkles size={20} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
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

            {/* Bonus Course Card - Exclusive for Tawjih - Moved Here */}
            {id === 'tawjih' && (
              <div className="w-full mb-16 mt-12">
                <div className="relative p-1 rounded-[3rem] bg-gradient-to-r from-yellow-200 via-amber-400 to-yellow-600 shadow-2xl shadow-yellow-500/20 overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/white-diamond.png')] opacity-20 mix-blend-overlay group-hover:opacity-30 transition-opacity"></div>

                  {/* Shimmer Effect */}
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-[200%] group-hover:animate-shimmer z-20 pointer-events-none"></div>

                  <div className="relative bg-slate-900 rounded-[2.9rem] p-8 md:p-14 text-center overflow-hidden border-4 border-slate-900">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-yellow-500/10 rounded-full blur-[100px] -mr-40 -mt-40 animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-600/10 rounded-full blur-[100px] -ml-40 -mb-40"></div>

                    <div className="relative z-10">
                      <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 rounded-full text-xs font-black uppercase tracking-widest mb-8 shadow-lg shadow-yellow-500/20 animate-bounce-slow">
                        <Gift size={16} /> هدية حصرية بقيمة 999 درهم
                      </div>

                      <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
                        احصل مجاناً على دورة <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-100 italic">"أسرار التوجيه الجامعي"</span>
                      </h2>

                      <p className="text-lg md:text-xl text-slate-300 font-medium mb-10 max-w-2xl mx-auto leading-relaxed">
                        الدليل الشامل للتخطيط لمسارك بعد الباكالوريا (المدارس العليا، الأقسام التحضيرية، كليات الطب) بين يديك الآن.
                      </p>

                      <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] p-6 border border-white/10 max-w-3xl mx-auto">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                          <div className="flex items-center gap-4 text-right flex-1 p-2">
                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-2xl flex items-center justify-center text-slate-900 shadow-lg shrink-0">
                              <CheckCircle size={24} className="text-slate-900" />
                            </div>
                            <div className="flex flex-col">
                              <h4 className="text-white font-bold text-lg mb-1">تحليل مفصل للمدارس</h4>
                              <span className="text-slate-400 text-sm">شروط الولوج، الآفاق، وعتبات الانتقاء</span>
                            </div>
                          </div>

                          <div className="w-full h-px sm:w-px sm:h-12 bg-white/10"></div>

                          <div className="flex items-center gap-4 text-right flex-1 p-2">
                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-2xl flex items-center justify-center text-slate-900 shadow-lg shrink-0">
                              <Brain size={24} className="text-slate-900" />
                            </div>
                            <div className="flex flex-col">
                              <h4 className="text-white font-bold text-lg mb-1">اكتشاف الشغف المهني</h4>
                              <span className="text-slate-400 text-sm">اختبارات وتطبيقات عملية لتحديد مسارك</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Related Blog Posts Grid */}
            {data.relatedBlogIds && (
              <section id="related-blogs" className="space-y-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-2xl ${theme.lightBg} flex items-center justify-center ${theme.primary}`}>
                    <BookOpen size={24} />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">مقالات قد تهمك</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.relatedBlogIds.map((id, idx) => {
                    const post = BLOG_POSTS.find(p => p.id === id);
                    if (!post) return null;

                    return (
                      <BlogCard key={post.id} post={post} index={idx} />
                    );
                  })}
                </div>
              </section>
            )}
          </div>

          {/* 4. Sticky Sidebar Column - Optimized for visibility and containment */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-32 space-y-8">
              {/* Premium Booking Card */}
              <div id="registration-card" className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 p-6 border border-slate-100 text-center relative overflow-hidden group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 ring-4 ring-slate-50/50">
                <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${theme.gradient}`}></div>

                <div className="relative z-10">
                  <div className={`w-24 h-24 mx-auto rounded-[2rem] ${theme.lightBg} flex items-center justify-center ${theme.primary} mb-6 shadow-inner border-4 border-white group-hover:scale-110 transition-transform duration-700 relative`}>
                    <MessageCircle size={40} strokeWidth={2} />
                    <div className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">هل تحتاج مساعدة؟</h3>
                  <p className="text-slate-500 mb-8 text-base font-bold leading-relaxed px-2">فريقنا المختص جاهز للإجابة على جميع تساؤلاتك وتوجيهك نحو التفوق.</p>

                  <div className="space-y-4">
                    <a href="https://wa.me/message/GN4XKUOMHNHGO1" target="_blank" rel="noreferrer" className="w-full py-4 bg-[#25D366] hover:bg-[#1ebc56] text-white rounded-2xl font-black shadow-[0_10px_20px_-5px_rgba(37,211,102,0.3)] flex items-center justify-center gap-3 text-lg group/btn active:scale-95 transition-all relative overflow-hidden">
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                      <MessageCircle size={24} fill="white" className="group-hover/btn:rotate-12 transition-transform relative z-10" />
                      <span className="relative z-10">تحدث معنا عبر واتساب</span>
                    </a>

                    <Link to="/contact" className={`w-full py-4 bg-white border-2 rounded-2xl font-black transition-all flex items-center justify-center gap-2 text-lg hover:bg-slate-50 active:scale-95 group/cal ${theme.primary} ${theme.border}`}>
                      <span>حجز موعد استشارة</span>
                      <Calendar size={20} className="group-hover/cal:-translate-y-1 transition-transform" />
                    </Link>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-50">
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex -space-x-3 space-x-reverse">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-100 overflow-hidden shadow-sm hover:z-10 hover:scale-110 transition-transform cursor-pointer">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + id! + 'student'}`} alt="Student" className="w-full h-full object-cover" />
                        </div>
                      ))}
                      <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-black border-4 border-white shadow-sm">+3k</div>
                    </div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">انضم إلى مجتمع المتفوقين</p>
                  </div>
                </div>
              </div>

              {/* Premium Guarantee Card */}
              <div className={`p-8 rounded-[3rem] ${theme.bg} text-white shadow-2xl relative overflow-hidden group hover:-translate-y-1 transition-all duration-500`}>
                <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent pointer-events-none"></div>
                <div className="absolute -right-20 -bottom-20 opacity-20 rotate-12 group-hover:scale-110 group-hover:rotate-6 transition-all duration-1000">
                  <ProgramIcon size={240} />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-white/20 rounded-2xl backdrop-blur-md flex items-center justify-center shadow-inner ring-1 ring-white/30 transform group-hover:rotate-12 transition-transform duration-500">
                      <ShieldCheck size={32} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h4 className="font-black text-2xl tracking-tighter leading-none mb-1">ضمان تلميـذ</h4>
                      <div className="h-1 w-12 bg-white/30 rounded-full"></div>
                    </div>
                  </div>

                  <p className="text-white/90 text-lg leading-relaxed font-bold mb-4">
                    نحن نلتزم بتقديم أعلى جودة تعليمية. إذا لم تكن راضياً عن المحتوى في أول 7 أيام، نسترجع لك مبلغ اشتراكك بالكامل.
                  </p>

                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg text-xs font-bold border border-white/20">
                    <Check size={12} strokeWidth={4} />
                    <span>ضمان استرجاع الأموال 100%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
