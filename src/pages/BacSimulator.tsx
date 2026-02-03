
import React, { useState, useMemo, useEffect } from 'react';
import { Calculator, Award, AlertTriangle, CheckCircle2, RotateCcw, Zap, Target, TrendingUp, Star, ChevronLeft, ArrowLeftIcon, Info, Sparkles } from 'lucide-react';
// Fix: Import Link from react-router-dom to handle internal navigation
// Fix: Import Link from react-router-dom to handle internal navigation
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

// --- Sub-components for better modularity and UX ---

const SmartGradeInput: React.FC<{
  label: string;
  value: string;
  onChange: (val: string) => void;
  icon: React.ElementType;
  placeholder: string;
  isGoal?: boolean;
}> = ({ label, value, onChange, icon: Icon, placeholder, isGoal }) => {
  const numValue = parseFloat(value);
  const isInvalid = numValue > 20 || (isGoal && numValue < 10);

  return (
    <div className="space-y-4 group">
      <div className="flex items-center gap-3 text-slate-500 mr-1 transition-colors group-focus-within:text-primary">
        <div className={`p-2 rounded-xl ${isGoal ? 'bg-yellow-50 text-yellow-600' : 'bg-blue-50 text-blue-600'} group-focus-within:scale-110 transition-transform`}>
          <Icon size={20} className={isGoal ? "fill-yellow-600" : ""} />
        </div>
        <label className="text-sm font-extrabold uppercase tracking-wide">{label}</label>
      </div>
      <div className="relative">
        <input
          type="number" step="0.01" min="0" max="20" required
          value={value}
          onChange={(e) => {
            const val = e.target.value;
            if (parseFloat(val) <= 25) onChange(val); // Buffer for typing
          }}
          className={`
            w-full bg-white border-2 rounded-[1.5rem] px-6 py-5 font-black text-3xl outline-none transition-all text-left dir-ltr shadow-sm
            ${isInvalid ? 'border-red-400 bg-red-50' : 'border-slate-200 focus:border-primary focus:shadow-lg focus:shadow-primary/10 ring-4 ring-transparent focus:ring-primary/5'}
            ${isGoal ? 'text-primary' : 'text-slate-800'}
          `}
          placeholder={placeholder}
        />
        <div className={`absolute right-6 top-1/2 -translate-y-1/2 font-bold ${isGoal ? 'text-primary/30' : 'text-slate-300'}`}>
          {isGoal ? 'الهدف' : '/ 20'}
        </div>
      </div>
      {isInvalid && (
        <p className="text-[10px] font-bold text-red-500 mr-2 animate-pulse">
          {numValue > 20 ? 'النقطة لا يمكن أن تتجاوز 20' : 'المعدل المستهدف يجب أن يكون 10 على الأقل'}
        </p>
      )}
    </div>
  );
};

const ComparisonCard: React.FC<{ goal: string; required: number; color: string; label: string }> = ({ goal, required, color, label }) => {
  const isPossible = required <= 20;

  const colors: Record<string, { border: string, text: string, bg: string, badge: string }> = {
    emerald: { border: 'group-hover:border-emerald-200', text: 'text-emerald-600', bg: 'bg-emerald-50', badge: 'bg-emerald-100 text-emerald-700' },
    blue: { border: 'group-hover:border-blue-200', text: 'text-blue-600', bg: 'bg-blue-50', badge: 'bg-blue-100 text-blue-700' },
    purple: { border: 'group-hover:border-purple-200', text: 'text-purple-600', bg: 'bg-purple-50', badge: 'bg-purple-100 text-purple-700' },
    orange: { border: 'group-hover:border-orange-200', text: 'text-orange-600', bg: 'bg-orange-50', badge: 'bg-orange-100 text-orange-700' },
  };

  const c = colors[color];

  return (
    <div className={`
      relative p-6 rounded-[2.5rem] border border-slate-100 transition-all duration-300 bg-white group hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]
      ${isPossible ? `${c.border}` : 'bg-slate-50 opacity-60 grayscale'}
    `}>
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 rounded-full ${isPossible ? c.text.replace('text-', 'bg-') : 'bg-gray-200'}`}></div>

      <div className="flex justify-between items-start mb-6">
        <span className={`text-[10px] font-black px-3 py-1 rounded-full ${isPossible ? c.badge : 'bg-gray-200 text-gray-500'}`}>
          معدل {goal}
        </span>
        {isPossible && <TrendingUp size={14} className={c.text} />}
      </div>

      <div className="text-center py-4">
        {!isPossible ? (
          <div className="space-y-2">
            <AlertTriangle className="mx-auto text-red-300" size={24} />
            <span className="text-lg font-black text-red-400 block">غير ممكن</span>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <span className={`text-4xl font-black ${c.text} tracking-tighter tabular-nums`}>
              {required <= 0 ? '0.00' : required.toFixed(2)}
            </span>
            <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-widest">{label}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export const BacSimulator: React.FC = () => {
  const [grades, setGrades] = useState({ regional: '', controleContinu: '', targetAverage: '14' });
  const [showResults, setShowResults] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  // Stats Logic
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
    setIsCalculating(true);

    // Simulate thinking/calculating for "Wow" effect
    setTimeout(() => {
      setShowResults(true);
      setIsCalculating(false);
      setTimeout(() => {
        document.getElementById('results-area')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }, 800);
  };

  const reset = () => {
    setGrades({ regional: '', controleContinu: '', targetAverage: '14' });
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-24 font-sans selection:bg-primary/20 selection:text-primary">
      <SEO
        title="محاكي النقط - تلميذ"
        description="احسب النقطة المطلوبة في الامتحان الوطني لتحقيق معدلك المستهدف. أداة ذكية لتخطيط نجاحك في البكالوريا."
      />
      <div className="container mx-auto px-4 lg:px-8">

        {/* Header Section */}
        <div className="text-center mb-16 max-w-3xl mx-auto animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-white rounded-full text-slate-600 font-bold text-xs uppercase tracking-widest mb-8 shadow-sm border border-slate-100 ring-1 ring-slate-50">
            <Sparkles size={14} className="text-yellow-400 fill-current" />
            <span>محاكي النجاح الذكي 2025</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-slate-900 mb-8 leading-[1.1] tracking-tight">
            خطط لمعدلك وحقق <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-primary to-indigo-600">حلم الباكالوريا</span>
          </h1>
          <p className="text-slate-500 text-xl font-medium leading-relaxed max-w-2xl mx-auto">
            أدخل نقطك الحالية واكتشف المجهود الدقيق المطلوب منك في الامتحان الوطني للوصول لمعدلك المنشود.
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-12">

          {/* Main Input Form - Optimized for Mobile */}
          <div className="bg-white rounded-[3.5rem] shadow-[0_30px_60px_-15px_rgba(15,23,42,0.1)] border border-white p-8 md:p-14 relative overflow-hidden group ring-1 ring-slate-100">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-primary to-indigo-500"></div>

            <form onSubmit={handleCalculate} className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                <SmartGradeInput
                  label="الامتحان الجهوي (25%)"
                  value={grades.regional}
                  onChange={(v) => setGrades({ ...grades, regional: v })}
                  icon={Award}
                  placeholder="00.00"
                />
                <SmartGradeInput
                  label="المراقبة المستمرة (25%)"
                  value={grades.controleContinu}
                  onChange={(v) => setGrades({ ...grades, controleContinu: v })}
                  icon={TrendingUp}
                  placeholder="00.00"
                />
                <SmartGradeInput
                  label="المعدل العام المستهدف"
                  value={grades.targetAverage}
                  onChange={(v) => setGrades({ ...grades, targetAverage: v })}
                  icon={Star}
                  placeholder="14.0"
                  isGoal
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-5 pt-4">
                <button
                  type="submit"
                  disabled={isCalculating}
                  className="flex-grow py-6 bg-slate-900 text-white font-black rounded-[2rem] hover:bg-primary shadow-2xl hover:shadow-blue-500/30 transition-all transform hover:-translate-y-1 active:scale-[0.98] text-xl flex items-center justify-center gap-4 group disabled:opacity-70"
                >
                  {isCalculating ? (
                    <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Calculator size={28} className="group-hover:rotate-12 transition-transform" />
                      <span>احسب النقطة المطلوبة</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="px-10 py-6 bg-slate-50 text-slate-400 font-bold rounded-[2rem] hover:bg-slate-100 hover:text-slate-600 transition-all flex items-center justify-center"
                >
                  <RotateCcw size={24} />
                </button>
              </div>
            </form>
          </div>

          {/* Results Reveal Area */}
          {showResults && results && (
            <div id="results-area" className="animate-fade-in-up space-y-16">

              {/* 3. The "Required Score" Card - Dramatic Styling */}
              <div className="relative group">
                {/* Outer Glow Effect */}
                <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-[4rem] opacity-50 group-hover:opacity-80 transition-opacity"></div>

                <div className="relative bg-slate-900 bg-gradient-to-br from-slate-900 via-[#0f172a] to-slate-900 rounded-[4rem] p-10 md:p-16 text-white border border-white/10 shadow-[0_40px_80px_-20px_rgba(15,23,42,0.5)] overflow-hidden ring-1 ring-white/5">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] -mr-40 -mt-40"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-royal/10 rounded-full blur-[80px] -ml-32 -mb-32"></div>

                  <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                    <div className="text-center lg:text-right space-y-6">
                      <div className="inline-flex items-center gap-3 px-6 py-2 bg-primary text-white rounded-full font-black text-sm shadow-xl shadow-primary/20">
                        <Star size={16} fill="currentColor" />
                        <span>هدفك: معدل {grades.targetAverage}</span>
                      </div>
                      <h2 className="text-4xl md:text-6xl font-black leading-tight tracking-tight">
                        باش توصل لهاد الهدف، <br className="hidden md:block" />
                        خاصك تجيب في <span className="text-primary">الوطني</span>:
                      </h2>
                      <p className="text-slate-400 text-lg font-medium opacity-80">ركز على الوطني، راه كيمثل 50% من النتيجة!</p>
                    </div>

                    <div className="shrink-0 relative group/score">
                      <div className="absolute inset-0 bg-primary/20 blur-3xl scale-125 opacity-0 group-hover/score:opacity-100 transition-opacity"></div>
                      <div className="relative flex flex-col items-center bg-white/5 backdrop-blur-2xl px-16 py-14 rounded-[4rem] border border-white/10 shadow-2xl ring-1 ring-white/5">
                        <span className={`text-8xl md:text-9xl font-black tracking-tighter tabular-nums drop-shadow-[0_0_30px_rgba(0,149,255,0.3)] ${results.custom > 20 ? 'text-red-400' : 'text-white'}`}>
                          {results.custom > 20 ? '!!' : (results.custom <= 0 ? '0.00' : results.custom.toFixed(2))}
                        </span>
                        <div className="h-1 w-24 bg-primary/50 my-6 rounded-full"></div>
                        <p className="text-xs font-black text-primary uppercase tracking-[0.3em]">
                          {results.custom > 20 ? 'هدف غير متاح حالياً' : 'نقطة الامتحان الوطني'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. "What-If" Scenarios Grid - Color Coded & Responsive */}
              <div className="space-y-10">
                <div className="flex items-center justify-between px-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-primary rounded-2xl"><Zap size={24} fill="currentColor" /></div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-900">سيناريوهات بديلة</h2>
                      <p className="text-sm font-bold text-slate-400">إليك ما تحتاجه للوصول لأفضل الميزات:</p>
                    </div>
                  </div>
                </div>
                {/* Grid 2x2 on Mobile, 4 columns on Desktop */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <ComparisonCard goal="10/20" required={results.pass} color="emerald" label="عتبة النجاح" />
                  <ComparisonCard goal="12/20" required={results.mustahsan} color="blue" label="ميزة مستحسن" />
                  <ComparisonCard goal="14/20" required={results.hassan} color="purple" label="ميزة حسن" />
                  <ComparisonCard goal="16/20" required={results.veryGood} color="orange" label="ميزة حسن جداً" />
                </div>
              </div>

              {/* 5. Dynamic Motivational Feedback Card */}
              <div className={`
                 p-8 md:p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden transition-all duration-500 ring-1 ring-white/10
                 ${results.custom > 20 ? 'bg-gradient-to-br from-red-600 to-red-700' : results.custom <= 10 ? 'bg-gradient-to-br from-emerald-600 to-emerald-700' : 'bg-gradient-to-br from-slate-800 to-slate-900'}
               `}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                  <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-[2.5rem] flex items-center justify-center shrink-0 shadow-xl border border-white/20">
                    {results.custom > 20 ? <AlertTriangle size={48} /> : results.custom <= 10 ? <Trophy size={48} /> : <Target size={48} />}
                  </div>
                  <div className="text-center md:text-right flex-grow">
                    <h3 className="text-2xl md:text-3xl font-black mb-4">
                      {results.custom > 20
                        ? 'هذا الهدف مستحيل رياضياً حالياً!'
                        : results.custom <= 10
                          ? 'الهدف في المتناول جداً! 🔥'
                          : 'أنت قادر على تحقيق هذا وأكثر!'}
                    </h3>
                    <p className="text-white/80 text-lg font-medium leading-relaxed">
                      {results.custom > 20
                        ? 'النقطة المطلوبة تتجاوز 20/20. حاول تقليل المعدل المستهدف قليلاً ليكون واقعياً وقابلاً للتحقيق.'
                        : results.custom <= 10
                          ? 'نقطة الوطني المطلوبة بسيطة جداً. لماذا لا ترفع سقف طموحك وتستهدف ميزة أعلى؟'
                          : 'بإمكانك الوصول لهاد النقطة إذا نظمتي وقتك وتبعتي منهجية ذكية. مئات التلاميذ بدلو مجهود في الوطني وصلو لأفضل المدارس.'}
                    </p>
                  </div>
                  <div className="shrink-0">
                    <Link
                      to={results.custom > 20 ? "/bac-simulator" : "/coaching-offer"}
                      className="px-10 py-5 bg-white text-slate-900 rounded-[2rem] font-black text-lg hover:scale-105 transition-all block text-center"
                    >
                      {results.custom > 20 ? 'تعديل الهدف' : 'كيفاش نضمنها؟'}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contextual Guidance */}
          <div className="bg-blue-50/50 p-8 rounded-[3rem] border border-blue-100 flex flex-col md:flex-row items-center gap-8 backdrop-blur-sm shadow-sm">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm text-primary shrink-0 flex items-center justify-center border border-blue-50">
              <Info size={32} />
            </div>
            <div className="text-center md:text-right">
              <h4 className="text-lg font-black text-slate-900 mb-1">كيف يتم الحساب؟</h4>
              <p className="text-sm text-slate-500 leading-relaxed font-bold">
                تعتمد النتيجة على الصيغة الرسمية: (الجهوي × 0.25) + (المراقبة × 0.25) + (الوطني × 0.50) = المعدل العام. <br />
                النتائج أعلاه هي تقديرية لمساعدتك على وضع خطة دراسية فعالة.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Trophy = ({ size }: { size: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 4H6v7a6 6 0 0 0 12 0V4Z" />
  </svg>
);
