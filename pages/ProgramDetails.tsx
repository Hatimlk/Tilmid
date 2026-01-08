
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
      className={`group relative p-6 bg-white rounded-[2rem] border border-gray-100 hover:shadow-lg transition-all duration-700 flex flex-col items-start min-h-[240px]
      ${isActive
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-40 translate-y-8 scale-95 grayscale'}`}
    >
      <div className={`absolute top-0 right-0 w-32 h-full ${lightThemeBg} opacity-20 filter blur-2xl transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-0'}`}></div>

      {/* Icon Circle */}
      <div className="w-full flex justify-start mb-5">
        <div className={`w-14 h-14 rounded-[1rem] flex items-center justify-center transition-all duration-1000 relative z-20 shadow-sm
        ${isActive
            ? `${lightThemeBg} ${themeColor}`
            : 'bg-slate-50 text-slate-300'}`}>
          <Icon size={28} strokeWidth={1.5} />
        </div>
      </div>

      <div className="relative z-10 text-right w-full mt-auto">
        <h3 className="text-lg md:text-xl font-bold mb-3 transition-colors duration-700 text-slate-900 leading-tight">
          {feature.title}
        </h3>
        <p className="leading-relaxed text-sm text-slate-500 font-medium">
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
      <div className={`relative pt-28 pb-24 lg:pt-40 lg:pb-48 overflow-hidden text-white bg-gradient-to-br ${theme.gradient}`}>
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[100px] opacity-20 animate-blob ${theme.blob1}`}></div>
          <div className={`absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[80px] opacity-20 animate-blob animation-delay-2000 ${theme.blob2}`}></div>
          <div className="absolute top-[40%] left-[20%] w-[300px] h-[300px] bg-white rounded-full blur-[80px] opacity-10 animate-pulse"></div>
        </div>

        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat"></div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up">

            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold shadow-sm animate-bounce-slow">
              <Sparkles size={14} className="text-yellow-300" />
              <span>البرنامج الأكثر طلباً هذا الموسم</span>
            </div>

            <div className="w-20 h-20 md:w-28 md:h-28 bg-white/10 backdrop-blur-xl rounded-[2rem] mb-8 shadow-xl border border-white/20 transform hover:rotate-6 transition-all duration-500 mx-auto flex items-center justify-center group/icon relative">
              <div className="absolute inset-0 bg-white/20 blur-xl rounded-[2rem] -z-10 group-hover/icon:blur-2xl transition-all"></div>
              <ProgramIcon size={48} className="text-white group-hover/icon:scale-110 transition-transform drop-shadow-md" strokeWidth={1.5} />
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight leading-[1.1] drop-shadow-lg">
              {data.title}
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-blue-50/90 font-medium leading-relaxed max-w-2xl mx-auto opacity-90">
              {data.subtitle}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-3.5 bg-white text-slate-900 rounded-2xl font-bold text-base hover:bg-slate-50 transition-all shadow-lg hover:-translate-y-1 flex items-center gap-2">
                <span>اكتشف البرنامج</span>
                <ArrowDown size={18} className="animate-bounce" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 -mt-20 lg:-mt-28 relative z-20">

        {/* Polished Stats Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-[0_15px_30px_-10px_rgba(0,0,0,0.05)] p-4 md:p-6 mb-12 border border-white/60 relative z-30 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 items-center">
            {stats.map((stat, idx) => (
              <div key={idx} className={`flex flex-col items-center text-center gap-2 p-3 rounded-2xl group transition-all duration-500 ${idx === 2 ? 'col-span-2 md:col-span-1' : ''}`}>
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl ${idx === 1 ? 'bg-yellow-50 text-yellow-500 border-yellow-100' : theme.lightBg + ' ' + theme.primary + ' ' + theme.border} border flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform bg-white relative z-10`}>
                  <stat.icon size={24} strokeWidth={2} />
                </div>
                <div>
                  <h4 className="text-xl md:text-2xl font-bold text-slate-900 mb-0.5 tracking-tight tabular-nums">{stat.value}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{stat.label}</p>
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
              <div className="w-full mb-12 mt-8">
                <div className="relative p-1 lg:p-2 rounded-[2.5rem] bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-500 shadow-lg shadow-yellow-500/10 overflow-hidden group">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/white-diamond.png')] opacity-20 group-hover:scale-110 transition-transform duration-1000"></div>

                  <div className="relative bg-slate-900 rounded-[2rem] p-6 md:p-10 text-center overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[100px] -ml-32 -mb-32"></div>

                    <div className="relative z-10">
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow-400 text-slate-900 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 shadow-lg animate-bounce-slow">
                        <Gift size={14} /> هدية حصرية مجانية
                      </div>

                      <h2 className="text-2xl md:text-3xl font-black text-white mb-4 tracking-tight leading-tight">
                        دورة <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500 italic">"أسرار التوجيه الجامعي"</span>
                      </h2>

                      <p className="text-base md:text-lg text-slate-300 font-medium mb-8 max-w-xl mx-auto leading-relaxed">
                        احصل مجاناً على أقوى دليل شامل للتخطيط لمسارك بعد الباكالوريا (المدارس العليا، الأقسام التحضيرية، كليات الطب).
                      </p>

                      <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <div className="flex items-center gap-3 text-right">
                          <div className="w-10 h-10 bg-white/5 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10">
                            <CheckCircle size={20} className="text-yellow-400" />
                          </div>
                          <div>
                            <h4 className="text-white font-bold text-sm">تحليل جميع المدارس</h4>
                          </div>
                        </div>
                        <div className="w-px h-8 bg-white/10 hidden sm:block"></div>
                        <div className="flex items-center gap-3 text-right">
                          <div className="w-10 h-10 bg-white/5 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10">
                            <Brain size={20} className="text-yellow-400" />
                          </div>
                          <div>
                            <h4 className="text-white font-bold text-sm">تحديد الشغف المهني</h4>
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
                  {data.relatedBlogIds.map((id) => {
                    const post = BLOG_POSTS.find(p => p.id === id);
                    if (!post) return null;

                    return (
                      <Link to={`/blog/${post.id}`} key={post.id} className="group relative flex flex-col bg-white rounded-[2rem] overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                        {/* Image Container */}
                        <div className="relative h-48 overflow-hidden">
                          <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors z-10"></div>
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute top-4 right-4 z-20">
                            <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-slate-900 shadow-sm border border-white/20">
                              {post.category}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 flex flex-col flex-grow relative z-20">
                          {/* Date & Time */}
                          <div className="flex items-center gap-3 text-xs text-slate-400 font-bold mb-3">
                            <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            <span className="flex items-center gap-1"><Clock size={12} /> {post.readingTime || '5 min'}</span>
                          </div>

                          <h4 className="text-xl font-black text-slate-900 mb-3 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                            {post.title}
                          </h4>

                          <p className="text-slate-500 text-sm font-semibold leading-relaxed mb-6 line-clamp-2">
                            {post.excerpt}
                          </p>

                          {/* Footer */}
                          <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-4">
                            <div className="flex items-center gap-2">
                              <img src={post.author?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'} alt={post.author?.name || 'Admin'} className="w-8 h-8 rounded-full border border-gray-100" />
                              <span className="text-xs font-bold text-slate-700">{post.author?.name || 'Admin'}</span>
                            </div>
                            <div className={`w-8 h-8 rounded-full ${theme.lightBg} flex items-center justify-center ${theme.primary} group-hover:bg-primary group-hover:text-white transition-all`}>
                              <ArrowUpRight size={16} />
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}
          </div>

          {/* 4. Sticky Sidebar Column - Optimized for visibility and containment */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-28 space-y-8">
              {/* Booking Form Card */}
              <div id="registration-card" className="bg-white rounded-[2rem] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] p-5 border border-gray-100 text-center relative overflow-hidden group hover:shadow-lg transition-all duration-500">
                <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${theme.gradient}`}></div>
                <div className="relative z-10">
                  <div className={`w-20 h-20 mx-auto rounded-[1.5rem] ${theme.lightBg} flex items-center justify-center ${theme.primary} mb-6 shadow-md border-2 border-white group-hover:scale-105 transition-transform duration-700`}>
                    <MessageCircle size={36} strokeWidth={2} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">هل تحتاج استشارة؟</h3>
                  <p className="text-slate-500 mb-6 text-base font-medium leading-relaxed">فريقنا المختص جاهز للإجابة على جميع تساؤلاتك وتوجيهك نحو التفوق.</p>

                  <div className="space-y-3">
                    <a href="https://wa.me/message/GN4XKUOMHNHGO1" target="_blank" rel="noreferrer" className="w-full py-4 bg-[#25D366] hover:bg-[#1da851] text-white rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 text-lg group active:scale-95 transition-all">
                      <MessageCircle size={22} fill="white" className="group-hover:rotate-12 transition-transform" />
                      <span>تحدث معنا الآن</span>
                    </a>
                    <Link to="/contact" className={`w-full py-4 bg-white border rounded-2xl font-bold transition-all flex items-center justify-center gap-2 text-lg hover:bg-slate-50 active:scale-95 ${theme.primary} ${theme.border}`}>
                      <span>حجز موعد</span>
                      <Calendar size={20} />
                    </Link>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-50">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex -space-x-2 space-x-reverse">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 overflow-hidden shadow-sm hover:z-10 hover:scale-110 transition-all">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + id!}`} alt="Student" />
                        </div>
                      ))}
                      <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-[8px] font-bold border-2 border-white shadow-sm">+3k</div>
                    </div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">انضم إلى مجتمع المتفوقين في المغرب</p>
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
