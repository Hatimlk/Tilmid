
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
      className={`group relative p-8 md:p-12 bg-white rounded-[3rem] border transition-all duration-700 flex flex-col md:flex-row gap-8 items-start z-10
      ${isActive 
        ? `opacity-100 translate-y-0 scale-100 shadow-[0_30px_70px_-20px_rgba(0,149,255,0.15)] ${borderColor.replace('border-', 'border-opacity-50 border-')}` 
        : 'opacity-40 translate-y-12 scale-95 grayscale'}`}
    >
      <div className={`absolute top-0 right-0 w-48 h-full ${lightThemeBg} opacity-20 filter blur-3xl transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-0'}`}></div>
      
      {/* Number Circle */}
      <div className={`w-20 h-20 md:w-24 md:h-24 rounded-[2.5rem] flex-shrink-0 flex items-center justify-center transition-all duration-1000 shadow-xl relative z-20 font-black
      ${isActive 
        ? `${themeColor.replace('text-', 'bg-')} text-white animate-glow-pulse scale-110 rotate-3` 
        : 'bg-slate-100 text-slate-400 rotate-0 scale-100'}`}>
        <span className="text-4xl md:text-5xl">{index + 1}</span>
      </div>
      
      <div className="relative z-10 pt-2 text-right">
          <h3 className={`text-2xl md:text-3xl font-black mb-5 transition-colors duration-700 tracking-tight ${isActive ? themeColor : 'text-slate-400'}`}>
            {feature.title}
          </h3>
          <p className={`leading-relaxed text-lg md:text-xl font-bold transition-colors duration-700 ${isActive ? 'text-slate-600' : 'text-slate-300'}`}>
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
                <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">المجال المقترح: <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-purple-400 drop-shadow-sm">{getResult().t}</span></h2>
                <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-2xl mx-auto font-bold opacity-80 leading-relaxed">{getResult().d}</p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="px-10 py-4 bg-white text-slate-900 rounded-2xl font-black hover:bg-primary hover:text-white transition-all">تحدث مع موجه</button>
                  <button onClick={() => {setStep('intro'); setCurrentQuestion(0); setAnswers([]);}} className="px-10 py-4 bg-slate-800 text-white rounded-2xl font-black border border-slate-700 hover:bg-slate-700 transition-all flex items-center gap-2">
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
  let themeColor = 'text-primary';
  let themeBg = 'bg-primary';
  let themeGradient = 'from-blue-600 to-blue-400';
  let lightThemeBg = 'bg-blue-50';
  let borderColor = 'border-blue-100';
  let accentColor = 'text-blue-500';
  
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

  if (!data) return <Navigate to="/" />;

  const stats = [
    { value: "+3500", label: "تلميذ مستفيد", icon: User },
    { value: "98%", label: "نسبة الرضا", icon: CheckCircle },
    { value: "+10", label: "سنوات خبرة", icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 overflow-x-hidden font-sans">
      
      {/* 5. Hero Section with Enhanced Title & Pattern Background */}
      <div className={`relative pt-40 pb-48 lg:pt-60 lg:pb-80 overflow-hidden text-white bg-gradient-to-br ${themeGradient}`}>
        {/* Background Decorative Pattern (Map/Compass feel) */}
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none overflow-hidden select-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] border border-white rounded-full opacity-20"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white rounded-full opacity-30"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white rounded-full opacity-40"></div>
          <Map className="absolute top-20 right-20 w-[400px] h-[400px] rotate-12" />
          <Compass className="absolute bottom-10 left-10 w-[300px] h-[300px] -rotate-12" />
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-6xl mx-auto text-center animate-fade-in-up">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-white/10 backdrop-blur-xl rounded-[3rem] mb-12 shadow-2xl border border-white/20 transform hover:rotate-6 transition-all duration-500 mx-auto flex items-center justify-center group/icon">
              <ProgramIcon size={64} className="text-white group-hover/icon:scale-110 transition-transform" strokeWidth={1.5} />
            </div>
            
            {/* Enhanced Typography */}
            <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black mb-10 tracking-tighter leading-[0.9] drop-shadow-[0_10px_30px_rgba(0,0,0,0.3)] filter">
              {data.title}
            </h1>
            
            <p className="text-xl sm:text-2xl md:text-3xl text-blue-50 font-black leading-relaxed max-w-4xl mx-auto opacity-95">
              {data.subtitle}
            </p>
          </div>
        </div>
        
        {/* Animated Floating Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none opacity-20">
            <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-white rounded-full blur-[120px] animate-blob"></div>
            <div className="absolute bottom-[0%] right-[-10%] w-[500px] h-[500px] bg-white rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 -mt-24 lg:-mt-36 relative z-20">
        
        {/* Polished Stats Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-[3.5rem] shadow-2xl p-6 md:p-12 mb-24 border border-white/60 relative z-30">
           <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 items-center">
             {stats.map((stat, idx) => (
               <div key={idx} className={`flex flex-col items-center text-center gap-4 p-4 md:p-6 rounded-[2.5rem] group transition-all duration-500 ${idx === 2 ? 'col-span-2 md:col-span-1' : ''}`}>
                  <div className={`w-16 h-16 md:w-24 md:h-24 rounded-3xl ${idx === 1 ? 'bg-yellow-50 text-yellow-500 border-yellow-100' : lightThemeBg + ' ' + themeColor + ' ' + borderColor} border-2 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform bg-white relative z-10`}>
                    <stat.icon size={36} strokeWidth={2} className="md:w-12 md:h-12" />
                  </div>
                  <div>
                    <h4 className="text-3xl md:text-5xl font-black text-slate-900 mb-1 tracking-tighter tabular-nums">{stat.value}</h4>
                    <p className="text-[11px] md:text-xs text-slate-400 font-black uppercase tracking-widest leading-none">{stat.label}</p>
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
                <div className={`inline-flex items-center gap-2 px-6 py-2.5 ${lightThemeBg} ${themeColor} rounded-full text-xs font-black uppercase tracking-widest shadow-sm border ${borderColor}`}>
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
                    themeColor={themeColor}
                    lightThemeBg={lightThemeBg}
                    borderColor={borderColor}
                  />
                ))}
              </div>
            </div>

            {/* 3. Exclusive Topics Refactored with Glassmorphism Grid */}
            {data.extraTopics && (
              <section id="extra-topics" className="bg-slate-900 rounded-[4rem] p-10 md:p-20 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary opacity-[0.08] rounded-full blur-[120px] group-hover:scale-125 transition-transform duration-1000"></div>
                
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
                        <div className="absolute inset-0 bg-primary opacity-0 group-hover/topic:opacity-5 transition-opacity"></div>
                        
                        <div className={`w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10 ${accentColor} group-hover/topic:bg-emerald-500 group-hover/topic:text-white group-hover/topic:border-emerald-500 transition-all duration-500`}>
                          <Check size={28} strokeWidth={4} className="scale-75 group-hover/topic:scale-100 transition-transform" />
                        </div>
                        
                        <span className="text-white font-black text-xl group-hover/topic:text-slate-900 transition-colors leading-tight">
                          {topic}
                        </span>
                        
                        <ArrowUpRight size={24} className="absolute left-8 text-white/20 group-hover/topic:text-primary transition-all opacity-0 group-hover/topic:opacity-100 -translate-y-4 group-hover/topic:translate-y-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* 4. Sticky Sidebar Column - Optimized for visibility and containment */}
          <div className="lg:col-span-4 relative">
             <div className="sticky top-32 space-y-10">
                {/* Booking Form Card */}
                <div id="registration-card" className="bg-white rounded-[3.5rem] shadow-[0_40px_80px_-20px_rgba(0,149,255,0.12)] p-10 border border-gray-100 text-center relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
                   <div className={`absolute top-0 left-0 w-full h-4 bg-gradient-to-r ${themeGradient}`}></div>
                   <div className="relative z-10">
                      <div className={`w-28 h-28 mx-auto rounded-[2.5rem] ${lightThemeBg} flex items-center justify-center ${themeColor} mb-10 shadow-xl border-4 border-white group-hover:scale-105 transition-transform duration-700`}>
                         <MessageCircle size={56} strokeWidth={2.5} />
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 mb-5 tracking-tight">هل تحتاج استشارة؟</h3>
                      <p className="text-slate-500 mb-12 text-xl font-bold leading-relaxed">فريقنا المختص جاهز للإجابة على جميع تساؤلاتك وتوجيهك نحو التفوق.</p>
                      
                      <div className="space-y-5">
                          <a href="https://wa.me/message/GN4XKUOMHNHGO1" target="_blank" rel="noreferrer" className="w-full py-6 bg-[#25D366] hover:bg-[#1da851] text-white rounded-[2rem] font-black shadow-2xl flex items-center justify-center gap-4 text-2xl group active:scale-95 transition-all">
                              <MessageCircle size={30} fill="white" className="group-hover:rotate-12 transition-transform" />
                              <span>تحدث معنا الآن</span>
                          </a>
                          <Link to="/contact" className={`w-full py-6 bg-white border-2 rounded-[2rem] font-black transition-all flex items-center justify-center gap-3 text-2xl hover:bg-slate-50 active:scale-95 ${themeColor} ${borderColor.replace('border-', 'border-')}`}>
                              <span>حجز موعد</span>
                              <Calendar size={24} />
                          </Link>
                      </div>
                   </div>
                   
                   <div className="mt-12 pt-10 border-t border-gray-50">
                      <div className="flex flex-col items-center gap-4">
                        <div className="flex -space-x-3 space-x-reverse">
                           {[1,2,3,4].map(i => (
                             <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-100 overflow-hidden shadow-sm hover:z-10 hover:scale-110 transition-all">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+id!}`} alt="Student" />
                             </div>
                           ))}
                           <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-black border-4 border-white shadow-sm">+3k</div>
                        </div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">انضم إلى مجتمع المتفوقين في المغرب</p>
                      </div>
                   </div>
                </div>

                {/* Guarantee Card */}
                <div className={`p-10 rounded-[3rem] ${themeBg} text-white shadow-2xl relative overflow-hidden group hover:rotate-1 transition-all duration-500`}>
                   <div className="absolute -right-16 -bottom-16 opacity-10 rotate-12 group-hover:scale-110 group-hover:rotate-0 transition-all duration-1000">
                      <ProgramIcon size={240} />
                   </div>
                   <div className="relative z-10 flex flex-col gap-6">
                      <div className="flex items-center gap-5">
                        <div className="p-4 bg-white/20 rounded-[1.5rem] backdrop-blur-md shadow-inner ring-1 ring-white/30">
                            <ShieldCheck size={44} />
                        </div>
                        <h4 className="font-black text-3xl tracking-tight leading-none">ضمان تلميـذ</h4>
                      </div>
                      <p className="text-white/95 text-xl leading-relaxed font-bold">
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
