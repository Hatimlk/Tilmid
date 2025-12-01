
import React, { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { TAWJIH_DATA, TILMID_DATA, TALIB_DATA } from '../constants';
import { dataManager } from '../utils/dataManager';
import { ProgramData } from '../types';
import { 
  CheckCircle, 
  ArrowRight,
  ArrowLeft, 
  MessageCircle, 
  Calendar, 
  User, 
  ChevronLeft, 
  BookOpen, 
  Compass, 
  GraduationCap, 
  School, 
  Target, 
  Sparkles,
  Zap,
  Star as StarIcon,
  Check,
  ArrowUpRight,
  BrainCircuit,
  Cpu,
  Fingerprint,
  RefreshCcw,
  Activity,
  Lightbulb,
  ShieldCheck,
  Clock
} from 'lucide-react';

// --- AI ADVISOR COMPONENT ---
const TawjihAIAdvisor: React.FC = () => {
  const [step, setStep] = useState<'intro' | 'quiz' | 'analyzing' | 'result'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
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
    // Simple logic: Find the most frequent type
    const counts: Record<string, number> = { eng: 0, med: 0, art: 0, bus: 0 };
    finalAnswers.forEach(a => counts[a] = (counts[a] || 0) + 1);
    
    const resultType = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    setStep('result');
  };

  const getResultContent = () => {
    const mostFrequent = answers.sort((a,b) =>
          answers.filter(v => v===a).length - answers.filter(v => v===b).length
    ).pop();

    switch (mostFrequent) {
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
    <section className="my-20 max-w-4xl mx-auto px-4">
      <div className="bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden relative min-h-[600px] flex flex-col border border-slate-800 group">
        {/* Tech Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')] opacity-5"></div>
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-blue-600 rounded-full mix-blend-overlay filter blur-[100px] opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-purple-600 rounded-full mix-blend-overlay filter blur-[100px] opacity-20 animate-pulse"></div>
        </div>

        {step === 'intro' && (
          <div className="relative z-10 flex-grow flex flex-col items-center justify-center text-center p-8 lg:p-16 animate-fade-in-up">
             <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mb-10 shadow-[0_0_40px_rgba(59,130,246,0.4)] animate-float border border-white/10">
                <BrainCircuit size={56} className="text-white" />
             </div>
             <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">المستشار الذكي للتوجيه</h2>
             <p className="text-blue-100 text-xl max-w-2xl mb-12 leading-relaxed opacity-90">
               غير متأكد من المسار المناسب لك؟ دع خوارزمياتنا الذكية تحلل شخصيتك وميولك لتقترح عليك التخصص الأمثل بنسبة دقة عالية.
             </p>
             <button 
               onClick={() => setStep('quiz')}
               className="group relative px-10 py-5 bg-white text-slate-900 rounded-2xl font-bold text-lg overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:-translate-y-1"
             >
               <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-50 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <div className="relative flex items-center gap-3">
                 <Fingerprint size={24} className="text-blue-600" />
                 <span>ابدأ التحليل الآن</span>
               </div>
             </button>
          </div>
        )}

        {step === 'quiz' && (
          <div className="relative z-10 flex-grow flex flex-col p-8 lg:p-16 animate-in fade-in slide-in-from-right duration-500">
             <div className="flex items-center justify-between mb-8">
                <span className="text-blue-400 font-bold text-sm tracking-wider uppercase bg-blue-900/30 px-3 py-1 rounded-full border border-blue-500/20">
                  سؤال {currentQuestion + 1} / {questions.length}
                </span>
                <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out rounded-full"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
             </div>

             <div className="flex-grow flex flex-col justify-center">
               <h3 className="text-2xl md:text-4xl font-bold text-white mb-12 leading-tight text-center md:text-right">
                 {questions[currentQuestion].text}
               </h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 {questions[currentQuestion].options.map((option, idx) => (
                   <button
                     key={idx}
                     onClick={() => handleAnswer(option.type)}
                     className="p-6 bg-slate-800/40 hover:bg-blue-600/20 border border-slate-700 hover:border-blue-500/50 rounded-2xl text-right transition-all group backdrop-blur-sm"
                   >
                     <div className="flex items-center justify-between">
                        <span className="text-gray-200 font-medium text-lg group-hover:text-white transition-colors">
                          {option.label}
                        </span>
                        <div className="w-6 h-6 rounded-full border-2 border-slate-600 group-hover:border-blue-500 group-hover:bg-blue-500 flex items-center justify-center transition-all">
                           <div className="w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100"></div>
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
            <div className="relative w-32 h-32 mb-10">
               <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
               <div className="absolute inset-0 border-4 border-t-blue-500 border-r-purple-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
               <Cpu size={48} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 animate-pulse tracking-tight">{analysisText}</h3>
            <p className="text-slate-400">يرجى الانتظار بينما يقوم النظام بمعالجة مدخلاتك...</p>
          </div>
        )}

        {step === 'result' && (
          <div className="relative z-10 flex-grow flex flex-col p-8 lg:p-16 animate-in zoom-in duration-500">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-green-500/10 text-green-400 rounded-full text-sm font-bold border border-green-500/20 mb-6">
                <Activity size={16} />
                <span>تم اكتمال التحليل</span>
              </div>
              <h2 className="text-4xl font-extrabold text-white mb-4">
                النتيجة المقترحة: <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">{resultData.title}</span>
              </h2>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">{resultData.desc}</p>
            </div>

            <div className="bg-slate-800/40 rounded-3xl p-8 border border-slate-700/50 mb-10 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400 font-bold flex items-center gap-2">
                  <CheckCircle size={20} className="text-blue-500" />
                  نسبة التوافق
                </span>
                <span className="text-3xl font-bold text-blue-400">{resultData.match}%</span>
              </div>
              <div className="w-full bg-slate-700/50 h-4 rounded-full overflow-hidden p-0.5">
                <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: `${resultData.match}%` }}></div>
              </div>
            </div>

            <div className="mb-12">
              <h4 className="text-white font-bold mb-6 flex items-center gap-2 text-xl">
                <Lightbulb size={24} className="text-yellow-400" />
                مهن قد تناسبك:
              </h4>
              <div className="flex flex-wrap justify-center gap-4">
                {resultData.jobs.map((job, idx) => (
                  <span key={idx} className="px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-white rounded-xl text-base font-bold border border-slate-600 transition-colors cursor-default">
                    {job}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-center mt-auto">
               <button 
                 onClick={() => { setStep('intro'); setCurrentQuestion(0); setAnswers([]); }}
                 className="text-slate-400 hover:text-white text-sm font-bold flex items-center justify-center gap-2 mx-auto transition-colors group"
               >
                 <RefreshCcw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
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
  
  // Dynamic Theme Configuration
  switch (id) {
    case 'tawjih':
      data = TAWJIH_DATA;
      ProgramIcon = Compass;
      themeColor = 'text-royal';
      themeBg = 'bg-royal';
      themeGradient = 'from-royal to-blue-700';
      lightThemeBg = 'bg-indigo-50';
      borderColor = 'border-indigo-100';
      break;
    case 'tilmid':
      data = TILMID_DATA;
      ProgramIcon = School;
      themeColor = 'text-primary';
      themeBg = 'bg-primary';
      themeGradient = 'from-primary to-cyan-500';
      lightThemeBg = 'bg-blue-50';
      borderColor = 'border-blue-100';
      break;
    case 'talib':
      data = TALIB_DATA;
      ProgramIcon = GraduationCap;
      themeColor = 'text-purple-600';
      themeBg = 'bg-purple-600';
      themeGradient = 'from-purple-700 to-indigo-500';
      lightThemeBg = 'bg-purple-50';
      borderColor = 'border-purple-100';
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
    if (programId === 'tawjih') return 'مواضيع متعلقة بالتوجيه المدرسي';
    return 'تقنيات ومواضيع ستتقنها معنا';
  };

  const stats = [
    { value: "+3500", label: "تلميذ مستفيد", icon: User },
    { value: "98%", label: "نسبة الرضا", icon: StarIcon },
    { value: "+10", label: "سنوات خبرة", icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 overflow-x-hidden font-sans">
      
      {/* Hero Section */}
      <div className={`relative pt-32 pb-48 lg:pt-44 lg:pb-64 overflow-hidden text-white bg-gradient-to-br ${themeGradient}`}>
        {/* Animated Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-white opacity-10 rounded-full blur-[100px] animate-blob"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-white opacity-5 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.04]"></div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
            <div className="inline-flex items-center justify-center p-4 bg-white/10 backdrop-blur-md rounded-3xl mb-8 shadow-2xl border border-white/20 ring-1 ring-white/10 transform hover:scale-105 transition-transform duration-500">
              <ProgramIcon size={48} className="text-white drop-shadow-md" />
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold mb-8 tracking-tight drop-shadow-sm leading-[1.1]">
              {data.title}
            </h1>
            <p className="text-xl lg:text-3xl text-white/90 font-medium leading-relaxed max-w-3xl mx-auto drop-shadow-sm">
              {data.subtitle}
            </p>
          </div>
        </div>
        
        {/* Curved Bottom Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180">
          <svg className="relative block w-[calc(100%+1.3px)] h-[80px] lg:h-[120px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-gray-50"></path>
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 -mt-32 relative z-20">
        
        {/* Floating Stats Card */}
        <div className="bg-white/90 backdrop-blur-lg rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8 lg:p-12 mb-20 animate-fade-in-up flex flex-wrap justify-around items-center gap-8 border border-white/50 relative overflow-hidden group">
           <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${themeGradient}`}></div>
           {stats.map((stat, idx) => (
             <div key={idx} className="flex items-center gap-6 min-w-[200px] relative z-10 group/stat">
                <div className={`p-5 rounded-2xl ${idx === 1 ? 'bg-yellow-50 text-yellow-500' : lightThemeBg + ' ' + themeColor} group-hover/stat:scale-110 transition-transform duration-300 shadow-sm`}>
                  <stat.icon size={32} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-4xl font-bold text-gray-900 mb-1 tracking-tight">{stat.value}</h4>
                  <p className="text-sm text-gray-500 font-bold tracking-wide uppercase">{stat.label}</p>
                </div>
             </div>
           ))}
        </div>

        {/* AI Advisor for Tawjih Only */}
        {id === 'tawjih' && <TawjihAIAdvisor />}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-16">
            
            {/* Features Section */}
            <section>
              <div className="flex items-center gap-4 mb-10">
                <div className={`p-3.5 rounded-2xl ${lightThemeBg} ${themeColor} shadow-sm`}>
                  <Sparkles size={28} />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">مميزات البرنامج</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {data.features.map((feature, idx) => (
                  <div 
                    key={idx} 
                    className={`group relative p-8 bg-white rounded-[2.5rem] border ${borderColor} shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-2 overflow-hidden opacity-0 animate-fade-in-up`}
                    style={{ animationDelay: `${(idx + 1) * 100}ms`, animationFillMode: 'forwards' }}
                  >
                    {/* Hover Background Effect */}
                    <div className={`absolute top-0 right-0 w-32 h-32 ${lightThemeBg} rounded-bl-[100%] -mr-10 -mt-10 transition-transform group-hover:scale-[1.5] duration-500 opacity-50`}></div>
                    
                    <div className={`w-16 h-16 rounded-2xl mb-6 flex items-center justify-center transition-all ${lightThemeBg} ${themeColor} shadow-sm group-hover:scale-110 duration-300 relative z-10`}>
                      {idx % 2 === 0 ? <Target size={32} /> : <ShieldCheck size={32} />}
                    </div>
                    
                    <h3 className={`text-xl font-bold mb-4 text-gray-900 group-hover:${themeColor} transition-colors relative z-10`}>
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-base relative z-10">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Extra Topics Syllabus */}
            {data.extraTopics && (
              <section className="bg-white rounded-[3rem] p-8 lg:p-14 shadow-lg border border-gray-100 opacity-0 animate-fade-in-up relative overflow-hidden" style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}>
                {/* Decoration */}
                <div className={`absolute -right-20 -top-20 w-80 h-80 ${lightThemeBg} rounded-full opacity-40 blur-3xl`}></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-10">
                     <div className={`p-3.5 rounded-2xl ${lightThemeBg} ${themeColor} shadow-sm`}>
                       <BookOpen size={28} />
                     </div>
                     <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{getExtraTopicsTitle(id || '')}</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {data.extraTopics.map((topic, idx) => (
                      <Link 
                        to={`/blog?search=${encodeURIComponent(topic)}`}
                        key={idx} 
                        className="flex items-center gap-4 p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-md hover:border-gray-200 transition-all group cursor-pointer relative overflow-hidden"
                      >
                        <div className={`w-10 h-10 rounded-full ${lightThemeBg} ${themeColor} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-sm relative z-10`}>
                          <Check size={20} strokeWidth={3} />
                        </div>
                        <span className="text-gray-800 font-bold text-lg group-hover:text-primary transition-colors relative z-10">{topic}</span>
                        <ArrowUpRight className="absolute left-4 text-gray-300 group-hover:text-primary group-hover:-translate-y-1 group-hover:translate-x-1 transition-all duration-300 opacity-0 group-hover:opacity-100" size={20} />
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            )}

          </div>

          {/* Right Column: Sticky Sidebar */}
          <div className="lg:col-span-4 space-y-8">
             <div className="sticky top-32">
                <div className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-10 border border-gray-100 text-center relative overflow-hidden group transition-all hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)]">
                   {/* Top Gradient Line */}
                   <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${themeGradient}`}></div>
                   
                   {/* Background Pattern */}
                   <div className="absolute top-0 right-0 w-40 h-40 bg-gray-50 rounded-full -mr-20 -mt-20 z-0 transition-transform group-hover:scale-125 duration-700"></div>
                   
                   <div className="relative z-10">
                      <div className={`w-24 h-24 mx-auto rounded-3xl ${lightThemeBg} flex items-center justify-center ${themeColor} mb-8 group-hover:scale-110 transition-transform duration-300 shadow-inner border border-white`}>
                         <MessageCircle size={48} />
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">هل تحتاج مساعدة؟</h3>
                      <p className="text-gray-500 mb-10 leading-relaxed text-sm font-medium">
                        نحن هنا للإجابة على استفساراتك وتوجيهك نحو البرنامج الأنسب لك.
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
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 15}`} alt="User" />
                             </div>
                           ))}
                           <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 shadow-sm">+2k</div>
                        </div>
                        <p className="text-xs text-gray-400 font-bold tracking-wide uppercase">انضم إلى مجتمع المتفوقين</p>
                      </div>
                   </div>
                </div>

                {/* Additional Mini Card */}
                <div className={`mt-8 p-8 rounded-[2.5rem] ${themeBg} text-white shadow-xl relative overflow-hidden transform hover:scale-[1.02] transition-transform`}>
                   <div className="absolute -right-6 -bottom-6 text-white opacity-10 rotate-12">
                      <ProgramIcon size={120} />
                   </div>
                   <div className="relative z-10 flex items-start gap-4">
                     <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md">
                       <ShieldCheck size={24} />
                     </div>
                     <div>
                       <h4 className="font-bold text-lg mb-2">ضمان الجودة</h4>
                       <p className="text-white/90 text-sm leading-relaxed font-medium">
                         نضمن لك تجربة تعليمية متميزة ومواكبة مستمرة لتحقيق أهدافك.
                       </p>
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
