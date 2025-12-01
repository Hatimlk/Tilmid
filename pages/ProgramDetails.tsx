
import React, { useEffect, useState } from 'react';
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
  Play
} from 'lucide-react';

// --- AI ADVISOR COMPONENT ---
const TawjihAIAdvisor: React.FC = () => {
  const [step, setStep] = useState<'intro' | 'quiz' | 'analyzing' | 'result'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [resultType, setResultType] = useState<string>('');
  const [analysisText, setAnalysisText] = useState('جاري تحليل البيانات...');

  const questions = [
    {
      id: 1,
      text: "ما هو النشاط الذي تجد نفسك منغمساً فيه وتنسى الوقت؟",
      options: [
        { label: "حل الألغاز والمشاكل المنطقية", type: "eng" },
        { label: "مساعدة الآخرين والاستماع لمشاكلهم", type: "med" },
        { label: "الكتابة، الرسم، أو التصميم", type: "art" },
        { label: "تنظيم الأشياء والتخطيط للمشاريع", type: "bus" }
      ]
    },
    {
      id: 2,
      text: "في العمل الجماعي، ما هو الدور الذي تفضله؟",
      options: [
        { label: "المحلل الذي يجد الحلول التقنية", type: "eng" },
        { label: "الداعم الذي يهتم براحة الفريق", type: "med" },
        { label: "المبدع الذي يطرح أفكاراً خارج الصندوق", type: "art" },
        { label: "القائد الذي يوزع المهام ويدير الوقت", type: "bus" }
      ]
    },
    {
      id: 3,
      text: "أي من المواد الدراسية التالية كنت تستمتع بها أكثر؟",
      options: [
        { label: "الرياضيات والفيزياء", type: "eng" },
        { label: "العلوم الطبيعية والأحياء", type: "med" },
        { label: "اللغات والفنون", type: "art" },
        { label: "الاقتصاد والاجتماعيات", type: "bus" }
      ]
    },
    {
      id: 4,
      text: "ما هي بيئة العمل المثالية بالنسبة لك؟",
      options: [
        { label: "مختبر أو مكتب هادئ مع تقنيات حديثة", type: "eng" },
        { label: "مكان فيه تواصل مباشر مع الناس (مستشفى/مدرسة)", type: "med" },
        { label: "استوديو إبداعي مرن وغير مقيد", type: "art" },
        { label: "شركة كبرى واجتماعات مهنية", type: "bus" }
      ]
    },
    {
      id: 5,
      text: "ما هو هدفك المهني الأسمى؟",
      options: [
        { label: "ابتكار تقنيات تسهل حياة الناس", type: "eng" },
        { label: "علاج الناس أو تحسين جودة حياتهم", type: "med" },
        { label: "التعبير عن الذات وترك أثر ثقافي", type: "art" },
        { label: "بناء ثروة وإدارة مشاريع ناجحة", type: "bus" }
      ]
    }
  ];

  const handleAnswer = (type: string) => {
    const newAnswers = [...answers, type];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      startAnalysis(newAnswers);
    }
  };

  const startAnalysis = (finalAnswers: string[]) => {
    setStep('analyzing');
    const texts = [
      "جاري معالجة الإجابات...",
      "مقارنة سماتك الشخصية...",
      "تحليل ميولك الأكاديمية...",
      "مطابقة النتائج مع سوق الشغل...",
      "إعداد التقرير النهائي..."
    ];

    let i = 0;
    const interval = setInterval(() => {
      setAnalysisText(texts[i]);
      i++;
      if (i >= texts.length) {
        clearInterval(interval);
        calculateResult(finalAnswers);
      }
    }, 800);
  };

  const calculateResult = (finalAnswers: string[]) => {
    const counts: Record<string, number> = { eng: 0, med: 0, art: 0, bus: 0 };
    finalAnswers.forEach(a => counts[a] = (counts[a] || 0) + 1);
    
    const winningType = Object.keys(counts).reduce((a, b) => counts[a] >= counts[b] ? a : b);
    
    setResultType(winningType);
    setStep('result');
  };

  const getResultContent = () => {
    switch (resultType) {
      case 'eng':
        return {
          title: "المجال الهندسي والتقني",
          desc: "لديك عقل تحليلي قوي وميول لحل المشكلات المعقدة. تناسبك المهن التي تتطلب دقة ومنطقاً.",
          jobs: ["مهندس برمجيات", "مهندس مدني", "خبير ذكاء اصطناعي", "محلل بيانات"],
          match: 92
        };
      case 'med':
        return {
          title: "المجال الطبي والاجتماعي",
          desc: "تتميز بالتعاطف وحب مساعدة الآخرين. تناسبك المهن التي فيها تأثير مباشر على حياة الناس.",
          jobs: ["طبيب", "صيدلي", "أخصائي نفسي", "ممرض"],
          match: 88
        };
      case 'art':
        return {
          title: "المجال الإبداعي والفني",
          desc: "لديك خيال واسع ورغبة في التعبير. تناسبك البيئات غير التقليدية التي تقدر الابتكار.",
          jobs: ["مصمم جرافيك", "كاتب محتوى", "مهندس معماري", "مخرج فني"],
          match: 90
        };
      case 'bus':
      default:
        return {
          title: "مجال الإدارة والأعمال",
          desc: "تملك شخصية قيادية وقدرة على التنظيم والتخطيط. تناسبك عالم الشركات والمشاريع.",
          jobs: ["مدير مشاريع", "خبير تسويق", "محاسب", "رائد أعمال"],
          match: 85
        };
    }
  };

  const resultData = getResultContent();

  return (
    <section className="my-20 max-w-5xl mx-auto px-4" id="ai-advisor">
      <div className="bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden relative min-h-[600px] flex flex-col border border-slate-800 group">
        {/* Tech Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')] opacity-5"></div>
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-600 rounded-full mix-blend-overlay filter blur-[120px] opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-600 rounded-full mix-blend-overlay filter blur-[120px] opacity-20 animate-pulse"></div>
        </div>

        {step === 'intro' && (
          <div className="relative z-10 flex-grow flex flex-col items-center justify-center text-center p-8 lg:p-20 animate-fade-in-up">
             <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-[2rem] flex items-center justify-center mb-10 shadow-[0_0_50px_rgba(59,130,246,0.3)] animate-float border border-white/10 relative">
                <div className="absolute inset-0 bg-white/20 blur-xl rounded-full"></div>
                <BrainCircuit size={64} className="text-white relative z-10" />
             </div>
             <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">المستشار الذكي للتوجيه</h2>
             <p className="text-blue-100 text-xl max-w-2xl mb-12 leading-relaxed opacity-90 font-medium">
               غير متأكد من المسار المناسب لك؟ دع خوارزمياتنا الذكية تحلل شخصيتك وميولك لتقترح عليك التخصص الأمثل بنسبة دقة عالية.
             </p>
             <button 
               onClick={() => setStep('quiz')}
               className="group relative px-12 py-5 bg-white text-slate-900 rounded-2xl font-bold text-lg overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] hover:-translate-y-1"
             >
               <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-50 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <div className="relative flex items-center gap-3">
                 <Fingerprint size={24} className="text-blue-600" />
                 <span>ابدأ التحليل المجاني</span>
               </div>
             </button>
          </div>
        )}

        {step === 'quiz' && (
          <div className="relative z-10 flex-grow flex flex-col p-8 lg:p-16 animate-in fade-in slide-in-from-right duration-500">
             <div className="flex items-center justify-between mb-12">
                <span className="text-blue-400 font-bold text-sm tracking-wider uppercase bg-blue-900/30 px-4 py-2 rounded-xl border border-blue-500/20 shadow-inner">
                  سؤال {currentQuestion + 1} / {questions.length}
                </span>
                <div className="w-48 h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
             </div>

             <div className="flex-grow flex flex-col justify-center">
               <h3 className="text-3xl md:text-4xl font-bold text-white mb-16 leading-tight text-center md:text-right">
                 {questions[currentQuestion].text}
               </h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {questions[currentQuestion].options.map((option, idx) => (
                   <button
                     key={idx}
                     onClick={() => handleAnswer(option.type)}
                     className="p-8 bg-slate-800/60 hover:bg-gradient-to-r hover:from-blue-600/30 hover:to-purple-600/30 border border-slate-700 hover:border-blue-500/50 rounded-3xl text-right transition-all group backdrop-blur-sm relative overflow-hidden"
                   >
                     <div className="flex items-center justify-between relative z-10">
                        <span className="text-gray-200 font-bold text-xl group-hover:text-white transition-colors">
                          {option.label}
                        </span>
                        <div className="w-8 h-8 rounded-full border-2 border-slate-600 group-hover:border-blue-400 group-hover:bg-blue-500 flex items-center justify-center transition-all shadow-md">
                           <Check size={16} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                     </div>
                   </button>
                 ))}
               </div>
             </div>
          </div>
        )}

        {step === 'analyzing' && (
          <div className="relative z-10 flex-grow flex flex-col items-center justify-center text-center p-8">
            <div className="relative w-40 h-40 mb-12">
               <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
               <div className="absolute inset-0 border-4 border-t-blue-500 border-r-purple-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
               <div className="absolute inset-4 border-4 border-t-transparent border-r-transparent border-b-cyan-400 border-l-pink-500 rounded-full animate-spin-slow"></div>
               <Cpu size={56} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-pulse tracking-tight">{analysisText}</h3>
            <p className="text-slate-400 text-lg">يرجى الانتظار، الذكاء الاصطناعي يعمل الآن...</p>
          </div>
        )}

        {step === 'result' && (
          <div className="relative z-10 flex-grow flex flex-col p-8 lg:p-16 animate-in zoom-in duration-500">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-green-500/10 text-green-400 rounded-full text-sm font-bold border border-green-500/20 mb-8 shadow-[0_0_20px_rgba(74,222,128,0.1)]">
                <Activity size={18} />
                <span>تم اكتمال التحليل بنجاح</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6">
                المسار المقترح: <br className="md:hidden"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">{resultData.title}</span>
              </h2>
              <p className="text-slate-300 text-xl max-w-3xl mx-auto leading-relaxed font-medium">{resultData.desc}</p>
            </div>

            <div className="bg-slate-800/40 rounded-[2rem] p-10 border border-slate-700/50 mb-12 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full filter blur-xl"></div>
              
              <div className="flex items-center justify-between mb-6 relative z-10">
                <span className="text-gray-300 font-bold flex items-center gap-3 text-lg">
                  <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400"><CheckCircle size={24} /></div>
                  نسبة التوافق مع شخصيتك
                </span>
                <span className="text-4xl font-black text-blue-400">{resultData.match}%</span>
              </div>
              <div className="w-full bg-slate-700/50 h-6 rounded-full overflow-hidden p-1 shadow-inner">
                <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)] relative" style={{ width: `${resultData.match}%` }}>
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>

            <div className="mb-14">
              <h4 className="text-white font-bold mb-8 flex items-center gap-3 text-2xl justify-center md:justify-start">
                <div className="p-2 bg-yellow-500/10 rounded-xl text-yellow-400"><Lightbulb size={28} /></div>
                مهن المستقبل المناسبة لك:
              </h4>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                {resultData.jobs.map((job, idx) => (
                  <span key={idx} className="px-8 py-4 bg-slate-700/50 hover:bg-blue-600/20 hover:border-blue-500/50 text-white rounded-2xl text-lg font-bold border border-slate-600 transition-all cursor-default shadow-sm hover:shadow-lg">
                    {job}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-center mt-auto">
               <button 
                 onClick={() => { setStep('intro'); setCurrentQuestion(0); setAnswers([]); setResultType(''); }}
                 className="text-slate-400 hover:text-white text-base font-bold flex items-center justify-center gap-2 mx-auto transition-colors group px-6 py-3 rounded-xl hover:bg-slate-800"
               >
                 <RefreshCcw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                 إعادة الاختبار
               </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export const ProgramDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  let data: ProgramData | null = null;
  let ProgramIcon = School;
  let themeColor = 'text-primary';
  let themeBg = 'bg-primary';
  let themeGradient = 'from-blue-600 to-blue-400';
  let lightThemeBg = 'bg-blue-50';
  let borderColor = 'border-blue-100';
  let accentColor = 'text-blue-500';
  
  // Dynamic Theme Configuration
  switch (id) {
    case 'tawjih':
      data = TAWJIH_DATA;
      ProgramIcon = Compass;
      themeColor = 'text-royal';
      themeBg = 'bg-royal';
      themeGradient = 'from-royal to-blue-800';
      lightThemeBg = 'bg-indigo-50';
      borderColor = 'border-indigo-100';
      accentColor = 'text-indigo-600';
      break;
    case 'tilmid':
      data = TILMID_DATA;
      ProgramIcon = School;
      themeColor = 'text-primary';
      themeBg = 'bg-primary';
      themeGradient = 'from-primary to-cyan-500';
      lightThemeBg = 'bg-blue-50';
      borderColor = 'border-blue-100';
      accentColor = 'text-cyan-600';
      break;
    case 'talib':
      data = TALIB_DATA;
      ProgramIcon = GraduationCap;
      themeColor = 'text-purple-600';
      themeBg = 'bg-purple-600';
      themeGradient = 'from-purple-700 to-pink-500';
      lightThemeBg = 'bg-purple-50';
      borderColor = 'border-purple-100';
      accentColor = 'text-purple-500';
      break;
  }

  useEffect(() => {
    if (data) {
      document.title = `${data.title} - تلميذ | Tilmid`;
      window.scrollTo(0, 0);
    }
  }, [data]);

  if (!data) {
    return <Navigate to="/" />;
  }

  const getExtraTopicsTitle = (programId: string) => {
    if (programId === 'tawjih') return 'محاور التوجيه الأساسية';
    if (programId === 'talib') return 'مهارات الطالب الجامعي';
    return 'تقنيات التفوق الدراسي';
  };

  const stats = [
    { value: "+3500", label: "تلميذ مستفيد", icon: User },
    { value: "98%", label: "نسبة الرضا", icon: CheckCircle },
    { value: "+10", label: "سنوات خبرة", icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 overflow-x-hidden font-sans">
      
      {/* Hero Section */}
      <div className={`relative pt-40 pb-48 lg:pt-52 lg:pb-72 overflow-hidden text-white bg-gradient-to-br ${themeGradient}`}>
        {/* Animated Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-white opacity-[0.08] rounded-full blur-[100px] animate-blob"></div>
          <div className="absolute bottom-[10%] right-[-10%] w-[600px] h-[600px] bg-white opacity-[0.05] rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.06]"></div>
          
          {/* Floating Icons based on theme */}
          <div className="absolute top-1/4 right-[15%] opacity-20 animate-float">
             <Target size={64} />
          </div>
          <div className="absolute bottom-1/3 left-[10%] opacity-20 animate-float animation-delay-1000">
             <Sparkles size={48} />
          </div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto text-center animate-fade-in-up">
            <div className="inline-flex items-center justify-center p-5 bg-white/10 backdrop-blur-md rounded-[2rem] mb-10 shadow-2xl border border-white/20 ring-1 ring-white/10 transform hover:scale-105 transition-transform duration-500">
              <ProgramIcon size={64} className="text-white drop-shadow-md" strokeWidth={1.5} />
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-8 tracking-tight drop-shadow-sm leading-[1.1]">
              {data.title}
            </h1>
            <p className="text-xl lg:text-3xl text-blue-50 font-medium leading-relaxed max-w-4xl mx-auto drop-shadow-sm">
              {data.subtitle}
            </p>
            
            <div className="mt-12 flex justify-center gap-4">
                <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-white text-gray-900 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all shadow-lg flex items-center gap-2">
                    <Play size={20} className="fill-current" />
                    اكتشف البرنامج
                </button>
            </div>
          </div>
        </div>
        
        {/* Modern Curve Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-[80px] lg:h-[150px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" className="fill-gray-50 opacity-20"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" className="fill-gray-50 opacity-50"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="fill-gray-50"></path>
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 -mt-24 lg:-mt-32 relative z-20">
        
        {/* Floating Stats Card - Refined */}
        <div className="bg-white rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] p-8 lg:p-14 mb-20 animate-fade-in-up flex flex-wrap justify-around items-center gap-10 border border-white/60 relative overflow-hidden group">
           <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${themeGradient}`}></div>
           {/* Decorative bg */}
           <div className="absolute right-0 bottom-0 w-64 h-64 bg-gray-50 rounded-full opacity-50 -mr-16 -mb-16 pointer-events-none"></div>

           {stats.map((stat, idx) => (
             <div key={idx} className="flex flex-col items-center text-center gap-4 min-w-[150px] relative z-10 group/stat">
                <div className={`w-20 h-20 rounded-3xl ${idx === 1 ? 'bg-yellow-50 text-yellow-500' : lightThemeBg + ' ' + themeColor} flex items-center justify-center group-hover/stat:scale-110 transition-transform duration-300 shadow-sm border border-white`}>
                  <stat.icon size={36} strokeWidth={2} />
                </div>
                <div>
                  <h4 className="text-4xl font-extrabold text-gray-900 mb-1 tracking-tight">{stat.value}</h4>
                  <p className="text-sm text-gray-500 font-bold tracking-wide uppercase">{stat.label}</p>
                </div>
             </div>
           ))}
        </div>

        {/* AI Advisor for Tawjih Only */}
        {id === 'tawjih' && <TawjihAIAdvisor />}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16" id="features">
          
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-16">
            
            {/* Features Section */}
            <section>
              <div className="flex items-center gap-4 mb-10">
                <div className={`p-4 rounded-2xl ${lightThemeBg} ${themeColor} shadow-sm`}>
                  <Sparkles size={28} />
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">مميزات البرنامج</h2>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {data.features.map((feature, idx) => (
                  <div 
                    key={idx} 
                    className={`group relative p-8 bg-white rounded-[2.5rem] border ${borderColor} shadow-sm hover:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col sm:flex-row gap-6 items-start`}
                    style={{ animationDelay: `${(idx + 1) * 100}ms` }}
                  >
                    {/* Hover Background Effect */}
                    <div className={`absolute top-0 right-0 w-24 h-full ${lightThemeBg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                    
                    <div className={`w-16 h-16 rounded-2xl flex-shrink-0 flex items-center justify-center transition-all ${lightThemeBg} ${themeColor} shadow-sm group-hover:scale-110 duration-300 relative z-10`}>
                      <span className="text-2xl font-black font-sans">{idx + 1}</span>
                    </div>
                    
                    <div className="relative z-10 pt-2">
                        <h3 className={`text-xl font-bold mb-3 text-gray-900 group-hover:${themeColor} transition-colors`}>
                        {feature.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed text-base font-medium">
                        {feature.description}
                        </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Extra Topics Syllabus */}
            {data.extraTopics && (
              <section className="bg-white rounded-[3rem] p-10 lg:p-14 shadow-xl shadow-gray-100 border border-gray-100 relative overflow-hidden">
                {/* Decoration */}
                <div className={`absolute -left-20 -top-20 w-80 h-80 ${lightThemeBg} rounded-full opacity-50 blur-3xl`}></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-10">
                     <div className={`p-4 rounded-2xl ${lightThemeBg} ${themeColor} shadow-sm`}>
                       <BookOpen size={28} />
                     </div>
                     <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900">{getExtraTopicsTitle(id || '')}</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {data.extraTopics.map((topic, idx) => (
                      <Link 
                        to={`/blog?search=${encodeURIComponent(topic)}`}
                        key={idx} 
                        className="flex items-center gap-4 p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-lg hover:border-gray-200 transition-all group cursor-pointer relative overflow-hidden"
                      >
                        <div className={`w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-sm border border-gray-100 relative z-10 ${accentColor}`}>
                          <Check size={24} strokeWidth={3} />
                        </div>
                        <span className="text-gray-800 font-bold text-lg group-hover:text-primary transition-colors relative z-10">{topic}</span>
                        <ArrowUpRight className="absolute left-6 text-gray-300 group-hover:text-primary group-hover:-translate-y-1 group-hover:translate-x-1 transition-all duration-300 opacity-0 group-hover:opacity-100" size={24} />
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            )}

          </div>

          {/* Right Column: Sticky Sidebar */}
          <div className="lg:col-span-4 space-y-8">
             <div className="sticky top-28">
                {/* Main Action Card */}
                <div className="bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-8 md:p-10 border border-gray-100 text-center relative overflow-hidden group transition-all">
                   {/* Top Gradient Line */}
                   <div className={`absolute top-0 left-0 w-full h-3 bg-gradient-to-r ${themeGradient}`}></div>
                   
                   {/* Background Pattern */}
                   <div className="absolute top-0 right-0 w-40 h-40 bg-gray-50 rounded-full -mr-20 -mt-20 z-0 transition-transform group-hover:scale-125 duration-700"></div>
                   
                   <div className="relative z-10">
                      <div className={`w-28 h-28 mx-auto rounded-full ${lightThemeBg} flex items-center justify-center ${themeColor} mb-8 group-hover:scale-110 transition-transform duration-300 shadow-md border-4 border-white`}>
                         <MessageCircle size={48} />
                      </div>
                      
                      <h3 className="text-2xl font-black text-gray-900 mb-3">هل تحتاج مساعدة؟</h3>
                      <p className="text-gray-500 mb-10 leading-relaxed text-sm font-medium">
                        فريقنا جاهز للإجابة على جميع استفساراتك وتوجيهك نحو البرنامج الأنسب لك.
                      </p>

                      <div className="space-y-4">
                          <a 
                            href="https://wa.me/message/GN4XKUOMHNHGO1" 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-4 bg-[#25D366] hover:bg-[#20b858] text-white rounded-2xl font-bold transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-3 transform hover:-translate-y-1 hover:shadow-green-500/40"
                          >
                              <MessageCircle size={24} fill="white" className="text-white" />
                              <span>تواصل عبر واتساب</span>
                          </a>
                          
                          <Link 
                            to="/contact" 
                            className={`w-full py-4 bg-white border-2 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 hover:bg-gray-50 ${
                              id === 'tawjih' ? 'border-royal text-royal' : 
                              id === 'talib' ? 'border-purple-600 text-purple-600' : 
                              'border-primary text-primary'
                            }`}
                          >
                              <span>حجز استشارة</span>
                              <Calendar size={20} />
                          </Link>
                      </div>
                   </div>
                   
                   <div className="mt-10 pt-8 border-t border-gray-100 relative z-10">
                      <div className="flex flex-col items-center gap-3">
                        <div className="flex -space-x-4 space-x-reverse">
                           {[1,2,3,4].map((_, i) => (
                             <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden shadow-sm hover:scale-110 transition-transform z-0 hover:z-10">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 15 + (id?.length || 0)}`} alt="User" />
                             </div>
                           ))}
                           <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 shadow-sm">+2k</div>
                        </div>
                        <p className="text-xs text-gray-400 font-bold tracking-wide uppercase">انضم إلى مجتمع المتفوقين</p>
                      </div>
                   </div>
                </div>

                {/* Additional Mini Card: Social Proof / Quality Guarantee */}
                <div className={`mt-8 p-8 rounded-[2.5rem] ${themeBg} text-white shadow-xl relative overflow-hidden transform hover:scale-[1.02] transition-transform`}>
                   <div className="absolute -right-10 -bottom-10 text-white opacity-10 rotate-12">
                      <ProgramIcon size={160} />
                   </div>
                   <div className="relative z-10 flex flex-col gap-4">
                     <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md shadow-inner">
                            <ShieldCheck size={28} />
                        </div>
                        <h4 className="font-bold text-xl">ضمان الجودة</h4>
                     </div>
                     <p className="text-white/90 text-sm leading-relaxed font-medium">
                       نحن نلتزم بتقديم محتوى تعليمي عالي الجودة ومواكبة مستمرة حتى تحقيق أهدافك الدراسية.
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
