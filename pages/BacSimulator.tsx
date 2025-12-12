
import React, { useState, useMemo, useEffect } from 'react';
import { Calculator, Award, AlertTriangle, CheckCircle2, RotateCcw, Zap, Target, TrendingUp, Star, ChevronLeft, ArrowLeftIcon } from 'lucide-react';

const DayCard: React.FC<{ date: Date; label: string }> = ({ date, label }) => {
    const [days, setDays] = useState<number>(0);

    useEffect(() => {
        const calculate = () => {
            const now = new Date();
            const diff = date.getTime() - now.getTime();
            const daysLeft = Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);
            setDays(daysLeft);
        };
        calculate();
        const timer = setInterval(calculate, 60000); 
        return () => clearInterval(timer);
    }, [date]);

    return (
        <div className="flex items-center gap-4 bg-[#1e293b]/30 backdrop-blur-sm px-6 py-4 rounded-[2.5rem] border border-white/5 flex-1 min-w-[220px] group hover:bg-[#1e293b]/50 transition-all">
            <div className="w-16 h-16 bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] rounded-2xl flex items-center justify-center font-black text-3xl text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] group-hover:scale-105 transition-transform border border-white/10 tabular-nums">
                {days}
            </div>
            <div className="text-right">
                <p className="text-[11px] font-black text-blue-400 uppercase tracking-widest mb-0.5">{label}</p>
                <p className="text-sm font-black text-white mb-1">يوماً متبقياً</p>
                <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-[10px] font-bold text-green-400">مباشر الآن</span>
                </div>
            </div>
        </div>
    );
};

const RequirementCard: React.FC<{ goal: string; required: number; color: string; label: string; isHighlight?: boolean }> = ({ goal, required, color, label, isHighlight }) => {
  const isPossible = required <= 20;
  const isAlreadyAchieved = required <= 0;

  const colorClasses: Record<string, string> = {
    emerald: 'border-emerald-100 bg-white hover:border-emerald-300 text-emerald-600 bg-emerald-50',
    blue: 'border-blue-100 bg-white hover:border-blue-300 text-blue-600 bg-blue-50',
    purple: 'border-purple-100 bg-white hover:border-purple-300 text-purple-600 bg-purple-50',
    orange: 'border-orange-100 bg-white hover:border-orange-300 text-orange-600 bg-orange-50',
    primary: 'border-primary/20 bg-primary/5 hover:border-primary/40 text-primary bg-primary/10'
  };

  return (
    <div className={`p-6 rounded-[2.5rem] border-2 transition-all duration-300 ${isHighlight ? 'ring-4 ring-primary/10 shadow-xl' : ''} ${isPossible ? colorClasses[color].split(' ').slice(0,3).join(' ') : 'bg-gray-50 border-gray-200 opacity-60'}`}>
      <div className="flex justify-between items-start mb-4">
        <span className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full ${isPossible ? colorClasses[color].split(' ').slice(3).join(' ') : 'bg-gray-200 text-gray-500'}`}>
          معدل {goal}
        </span>
        {isPossible && !isAlreadyAchieved && (
            <span className="text-[10px] font-bold text-gray-400">نقطة الوطني</span>
        )}
      </div>
      
      <div className="text-center py-2">
        {isAlreadyAchieved ? (
          <div className="space-y-1">
            <span className="text-2xl font-black text-emerald-500">تم الضمان! 🎉</span>
            <p className="text-[10px] text-gray-400 font-bold">تحقق الهدف مسبقاً</p>
          </div>
        ) : isPossible ? (
          <div className="flex flex-col items-center">
            <span className={`text-5xl font-black ${required > 16 ? 'text-orange-500' : isHighlight ? 'text-primary' : colorClasses[color].split(' ').find(c => c.startsWith('text-'))} tracking-tighter tabular-nums`}>
              {required.toFixed(2)}
            </span>
            <span className="text-xs font-bold text-gray-400 mt-1">/ 20</span>
          </div>
        ) : (
          <div className="space-y-1">
            <span className="text-xl font-black text-red-400">غير ممكن ⚠️</span>
            <p className="text-[10px] text-gray-400 font-bold">يتطلب أكثر من 20/20</p>
          </div>
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-50 text-center">
         <p className="text-xs font-bold text-gray-500">{label}</p>
      </div>
    </div>
  );
};

export const BacSimulator: React.FC = () => {
  const [grades, setGrades] = useState({ regional: '', controleContinu: '', targetAverage: '14' });
  const [showResults, setShowResults] = useState(false);

  const getExamDate = (month: number, day: number) => {
    const now = new Date();
    let year = now.getFullYear();
    let target = new Date(year, month, day, 8, 0);
    if (target.getTime() < now.getTime()) {
      target = new Date(year + 1, month, day, 8, 0);
    }
    return target;
  };

  const nationalDate = useMemo(() => getExamDate(5, 10), []);
  const regionalDate = useMemo(() => getExamDate(5, 2), []);

  const calculateRequired = (targetTotal: number) => {
    const reg = parseFloat(grades.regional.replace(',', '.')) || 0;
    const cc = parseFloat(grades.controleContinu.replace(',', '.')) || 0;
    const currentPoints = (reg * 0.25) + (cc * 0.25);
    const needed = (targetTotal - currentPoints) / 0.5;
    return needed;
  };

  const results = useMemo(() => {
    if (!showResults) return null;
    const customTarget = parseFloat(grades.targetAverage) || 10;
    return {
      custom: calculateRequired(customTarget),
      pass: calculateRequired(10),
      mustahsan: calculateRequired(12),
      hassan: calculateRequired(14),
      veryGood: calculateRequired(16)
    };
  }, [grades, showResults]);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const reg = parseFloat(grades.regional);
    const cc = parseFloat(grades.controleContinu);
    const target = parseFloat(grades.targetAverage);

    if (isNaN(reg) || isNaN(cc) || isNaN(target)) {
      alert('المرجو إدخال النقط والمعدل المستهدف بشكل صحيح');
      return;
    }
    setShowResults(true);
    setTimeout(() => {
        document.getElementById('results-area')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const reset = () => {
    setGrades({ regional: '', controleContinu: '', targetAverage: '14' });
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-28 pb-20 font-sans selection:bg-primary/20 selection:text-primary">
      <div className="container mx-auto px-4 lg:px-8">
        
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-primary font-bold text-sm mb-6 shadow-sm border border-blue-50">
            <Target size={18} className="animate-pulse" />
            <span>محاكي أهداف البكالوريا الذكي</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
            شحال خاصني نجيب <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-royal font-black text-5xl md:text-7xl tracking-tighter">في الوطني؟</span>
          </h1>
          <p className="text-gray-500 text-lg md:text-xl leading-relaxed">
            حدد معدلك العام المنشود، وأدخل نقطك الحالية، وسنخبرك بالضبط بالمجهود المطلوب منك في الامتحان الوطني.
          </p>
        </div>

        {/* Exam Countdown Banner - Integrated into Simulator page */}
        <div className="max-w-5xl mx-auto mb-16">
            <div className="bg-[#0f172a] rounded-[4rem] px-8 py-6 lg:px-12 lg:py-8 shadow-[0_30px_60px_-10px_rgba(0,0,0,0.3)] flex flex-col lg:flex-row items-center gap-8 lg:gap-12 relative overflow-hidden group border border-white/5">
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none"></div>

                <div className="text-right shrink-0 lg:max-w-[250px]">
                    <div className="flex items-center justify-center lg:justify-start gap-2 text-[#38bdf8] font-black text-[11px] uppercase tracking-widest mb-2">
                        <Zap size={16} fill="currentColor" className="animate-pulse" />
                        <span>مباشر: عداد الامتحانات</span>
                    </div>
                    <h2 className="text-3xl font-black text-white leading-tight">يوم الحسم يقترب!</h2>
                    <p className="text-gray-500 text-[11px] mt-1.5 font-bold italic opacity-80 leading-relaxed">تخطى مخاوفك وابدأ التخطيط الآن</p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 lg:gap-6 flex-grow w-full">
                    <DayCard date={nationalDate} label="الوطني (2 باك)" />
                    <DayCard date={regionalDate} label="الجهوي (1 باك)" />
                </div>
            </div>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-blue-900/5 border border-white p-8 md:p-12 relative overflow-hidden mb-12 group">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-blue-400 to-royal"></div>
            
            <form onSubmit={handleCalculate} className="space-y-10">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-500 mr-1">
                    <Award size={18} className="text-blue-500" />
                    <label className="text-sm font-extrabold uppercase tracking-wide">الامتحان الجهوي (25%)</label>
                  </div>
                  <div className="relative">
                    <input 
                      type="number" step="0.01" min="0" max="20" required
                      value={grades.regional}
                      onChange={(e) => setGrades({...grades, regional: e.target.value})}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 font-black text-3xl outline-none focus:border-blue-500 focus:bg-white focus:shadow-xl focus:shadow-blue-500/10 transition-all text-left dir-ltr"
                      placeholder="00.00"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 font-bold">/ 20</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-500 mr-1">
                    <TrendingUp size={18} className="text-purple-500" />
                    <label className="text-sm font-extrabold uppercase tracking-wide">المراقبة المستمرة (25%)</label>
                  </div>
                  <div className="relative">
                    <input 
                      type="number" step="0.01" min="0" max="20" required
                      value={grades.controleContinu}
                      onChange={(e) => setGrades({...grades, controleContinu: e.target.value})}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 font-black text-3xl outline-none focus:border-purple-500 focus:bg-white focus:shadow-xl focus:shadow-purple-500/10 transition-all text-left dir-ltr"
                      placeholder="00.00"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 font-bold">/ 20</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-500 mr-1">
                    <Star size={18} className="text-yellow-500" fill="currentColor" />
                    <label className="text-sm font-extrabold uppercase tracking-wide">المعدل العام المستهدف</label>
                  </div>
                  <div className="relative">
                    <input 
                      type="number" step="0.1" min="10" max="20" required
                      value={grades.targetAverage}
                      onChange={(e) => setGrades({...grades, targetAverage: e.target.value})}
                      className="w-full bg-blue-50 border-2 border-primary/20 rounded-2xl px-6 py-5 font-black text-3xl outline-none focus:border-primary focus:bg-white focus:shadow-xl focus:shadow-primary/10 transition-all text-left dir-ltr text-primary"
                      placeholder="14.0"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-primary/30 font-bold">Goal</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button type="submit" className="flex-grow py-6 bg-slate-900 text-white font-extrabold rounded-3xl hover:bg-primary shadow-xl hover:shadow-blue-500/30 transition-all transform hover:-translate-y-1 active:scale-[0.98] text-xl flex items-center justify-center gap-3 group">
                   <Calculator size={28} className="group-hover:rotate-12 transition-transform" />
                   احسب النقطة المطلوبة
                </button>
                <button type="button" onClick={reset} className="px-10 py-6 bg-gray-50 text-gray-400 font-bold rounded-3xl hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
                   <RotateCcw size={20} />
                </button>
              </div>
            </form>
          </div>

          {showResults && results && (
            <div id="results-area" className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-12">
               <div className="bg-white rounded-[3.5rem] p-10 border-4 border-primary/10 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                     <div className="text-center md:text-right">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full font-black text-xs uppercase tracking-widest mb-6">
                            <Star size={14} fill="currentColor" />
                            هدفك الشخصي المختار
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight mb-4">
                          لتحقيق معدل <span className="text-primary">{grades.targetAverage}</span> <br className="hidden md:block" />
                          خاصك تجيب في الوطني:
                        </h2>
                     </div>
                     <div className="shrink-0 flex flex-col items-center bg-slate-900 px-12 py-10 rounded-[3rem] text-white shadow-2xl transform hover:scale-105 transition-transform">
                        <span className={`text-7xl font-black tracking-tighter ${results.custom > 20 ? 'text-red-400' : 'text-white'}`}>
                            {results.custom > 20 ? '!!' : results.custom.toFixed(2)}
                        </span>
                        <div className="h-px w-full bg-white/20 my-4"></div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                           {results.custom > 20 ? 'معدل مستحيل حالياً' : 'نقطة الامتحان الوطني'}
                        </p>
                        {results.custom > 20 && <p className="text-[10px] text-red-300 mt-2 font-medium">يتطلب أكثر من 20/20</p>}
                     </div>
                  </div>
               </div>

               <div>
                  <div className="flex items-center gap-4 mb-8 px-4">
                      <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><Zap size={24} fill="currentColor" /></div>
                      <div>
                        <h2 className="text-2xl font-black text-slate-900">مقارنة مع باقي الميزات</h2>
                        <p className="text-sm font-bold text-slate-400">إليك ما تحتاجه للوصول إلى العتبات الرسمية:</p>
                      </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      <RequirementCard goal="10/20" required={results.pass} color="emerald" label="عتبة النجاح" />
                      <RequirementCard goal="12/20" required={results.mustahsan} color="blue" label="ميزة مستحسن" />
                      <RequirementCard goal="14/20" required={results.hassan} color="purple" label="ميزة حسن" />
                      <RequirementCard goal="16/20" required={results.veryGood} color="orange" label="ميزة حسن جداً" />
                  </div>
               </div>

               <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[3.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                  <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
                    <div className="lg:col-span-2">
                       <h3 className="text-3xl font-black mb-6 flex items-center gap-3">
                         <TrendingUp className="text-primary" size={32} />
                         كيفاش توصل لهاد النتيجة؟
                       </h3>
                       <p className="text-slate-300 text-lg leading-relaxed font-medium mb-8">
                         تذكر أن الامتحان الوطني يشكل <span className="text-white font-bold underline decoration-primary decoration-4">50% من المعدل العام</span>. هادشي كيعني أن أي مجهود إضافي في الوطني كيتدوبل مفعوله في النتيجة النهائية. التركيز التام هو مفتاحك دابا.
                       </p>
                       <div className="flex flex-wrap gap-4">
                          <div className="flex items-center gap-2 bg-white/10 px-5 py-3 rounded-2xl border border-white/10 text-sm font-bold hover:bg-white/20 transition-colors">
                             <CheckCircle2 size={18} className="text-emerald-400" /> مراجعة ذكية
                          </div>
                          <div className="flex items-center gap-2 bg-white/10 px-5 py-3 rounded-2xl border border-white/10 text-sm font-bold hover:bg-white/20 transition-colors">
                             <CheckCircle2 size={18} className="text-emerald-400" /> تمارين مكثفة
                          </div>
                          <div className="flex items-center gap-2 bg-white/10 px-5 py-3 rounded-2xl border border-white/10 text-sm font-bold hover:bg-white/20 transition-colors">
                             <CheckCircle2 size={18} className="text-emerald-400" /> تتبع يومي
                          </div>
                       </div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md rounded-[3rem] p-10 border border-white/10 text-center relative group">
                       <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-5 transition-opacity rounded-[3rem]"></div>
                       <Award size={72} className="mx-auto mb-6 text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)] animate-bounce-slow" />
                       <h4 className="text-2xl font-black mb-3">أنت قدها!</h4>
                       <p className="text-xs text-slate-400 font-bold tracking-wide leading-relaxed">
                         مئات التلاميذ بدأوا بمعدلات جهوي أقل، ولكن بفضل الوطني والالتزام حققوا أحلامهم.
                       </p>
                    </div>
                  </div>
               </div>
            </div>
          )}

          <div className="mt-16 p-8 bg-blue-50/50 rounded-[3rem] border border-blue-100 flex flex-col md:flex-row items-center gap-8 backdrop-blur-sm">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm text-primary shrink-0 flex items-center justify-center">
                <AlertTriangle size={32} />
              </div>
              <div className="text-center md:text-right">
                <h4 className="text-lg font-black text-slate-900 mb-1">توضيح منهجي</h4>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  تمت برمجة هذا المحاكي وفقاً للصيغة الرسمية المعتمدة (25% جهوي، 25% مراقبة مستمرة، 50% وطني). النتائج هي مؤشرات حسابية لتوجيه مسار مراجعتك ورفع سقف طموحك.
                </p>
              </div>
              <div className="hidden lg:block mr-auto">
                 <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="p-4 bg-white rounded-2xl shadow-sm text-slate-400 hover:text-primary hover:shadow-md transition-all">
                    <RotateCcw size={20} />
                 </button>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};
