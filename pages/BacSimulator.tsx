
import React, { useState, useEffect, useCallback } from 'react';
import { Calculator, Calendar, Clock, Award, AlertTriangle, CheckCircle2, RotateCcw, BookOpen } from 'lucide-react';

const Countdown: React.FC<{ targetDate: Date; title: string; color: string; icon: any }> = ({ targetDate, title, color, icon: Icon }) => {
  
  // Logic to calculate time difference
  const calculateTimeLeft = useCallback(() => {
    const difference = +targetDate - +new Date();
    let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  }, [targetDate]);

  // Initialize state with the immediate calculation
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    // Update immediately on mount in case of slight delay
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  // Extract tailwind class for text color from bg color (rough approximation)
  const textColor = color.replace('bg-', 'text-');

  return (
    <div className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] transition-all duration-300">
      <div className={`absolute top-0 right-0 w-40 h-40 ${color} opacity-5 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700`}></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
            <div className={`p-3 rounded-2xl ${color} bg-opacity-10 ${textColor}`}>
                <Icon size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        </div>
        
        <div className="grid grid-cols-4 gap-3 text-center" dir="ltr">
          {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Mins', value: timeLeft.minutes },
              { label: 'Secs', value: timeLeft.seconds }
          ].map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                  <div className="bg-gray-50 w-full rounded-2xl py-3 border border-gray-100 group-hover:border-gray-200 transition-colors">
                    <span className={`block text-2xl lg:text-3xl font-black ${i === 0 ? textColor : 'text-gray-800'} tabular-nums`}>
                        {String(item.value).padStart(2, '0')}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase mt-2 tracking-wider">{item.label}</span>
              </div>
          ))}
        </div>
        
        <div className="mt-6 text-center">
            <span className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                <Calendar size={14} />
                تاريخ الامتحان: {targetDate.toLocaleDateString('fr-FR')}
            </span>
        </div>
      </div>
    </div>
  );
};

export const BacSimulator: React.FC = () => {
  // Calculation State
  const [grades, setGrades] = useState({
    regional: '',
    controleContinu: '',
    national: ''
  });
  
  const [result, setResult] = useState<number | null>(null);
  const [mention, setMention] = useState<{ text: string; color: string; bg: string; icon: any; advice: string } | null>(null);

  const calculateBac = () => {
    // Convert comma to dot for flexible input
    const reg = parseFloat(grades.regional.replace(',', '.'));
    const cc = parseFloat(grades.controleContinu.replace(',', '.'));
    const nat = parseFloat(grades.national.replace(',', '.'));

    if (isNaN(reg) || isNaN(cc) || isNaN(nat)) {
        alert('المرجو إدخال جميع النقط بشكل صحيح');
        return;
    }

    if ([reg, cc, nat].some(g => g < 0 || g > 20)) {
        alert('النقط يجب أن تكون بين 0 و 20');
        return;
    }

    // Formula: (Regional * 0.25) + (Contrôle Continu * 0.25) + (National * 0.5)
    const finalScore = (reg * 0.25) + (cc * 0.25) + (nat * 0.5);
    setResult(finalScore);

    // Determine Mention
    if (finalScore < 10) {
        setMention({ 
            text: 'راسب / استدراكية', 
            color: 'text-red-600', 
            bg: 'bg-red-50',
            icon: AlertTriangle,
            advice: 'لا تيأس! الدورة الاستدراكية فرصة ثانية. ركز على المواد الأساسية وضاعف مجهودك.'
        });
    } else if (finalScore < 12) {
        setMention({ 
            text: 'مقبول', 
            color: 'text-orange-600', 
            bg: 'bg-orange-50',
            icon: CheckCircle2,
            advice: 'مبارك النجاح! نتيجتك مقبولة، لكن يمكنك دائماً تحسين مهاراتك للمرحلة القادمة.'
        });
    } else if (finalScore < 14) {
        setMention({ 
            text: 'مستحسن', 
            color: 'text-blue-600', 
            bg: 'bg-blue-50',
            icon: Award,
            advice: 'نتيجة جيدة! تفتح لك أبواباً عديدة. استعد جيداً لاختياراتك الجامعية.'
        });
    } else if (finalScore < 16) {
        setMention({ 
            text: 'حسن', 
            color: 'text-purple-600', 
            bg: 'bg-purple-50',
            icon: Award,
            advice: 'عمل ممتاز! هذه النتيجة تمنحك فرصاً قوية في المدارس العليا.'
        });
    } else {
        setMention({ 
            text: 'حسن جداً', 
            color: 'text-emerald-600', 
            bg: 'bg-emerald-50',
            icon: Award,
            advice: 'أداء استثنائي! أنت من النخبة. الآفاق مفتوحة أمامك بالكامل.'
        });
    }
    
    // Scroll to result on mobile
    setTimeout(() => {
        document.getElementById('result-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const resetForm = () => {
      setGrades({ regional: '', controleContinu: '', national: '' });
      setResult(null);
      setMention(null);
  };

  // Dates for exams (Setting generic future dates for 2025)
  const nationalExamDate = new Date('2025-06-10T08:00:00'); 
  const regionalExamDate = new Date('2025-06-02T08:00:00');

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-28 pb-20 font-sans selection:bg-primary/20 selection:text-primary">
        <div className="container mx-auto px-4 lg:px-8">
            
            {/* Header */}
            <div className="text-center mb-16 max-w-4xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-primary font-bold text-sm mb-6 shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-blue-50 animate-fade-in-up">
                    <Calculator size={18} />
                    <span>أدوات التلميذ</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 leading-tight animate-fade-in-up animate-delay-100">
                    حساب معدل البكالوريا <br className="hidden md:block"/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-royal">والعد التنازلي للامتحانات</span>
                </h1>
                <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed animate-fade-in-up animate-delay-200">
                    أداة دقيقة لحساب معدلك المتوقع بناءً على المعاملات الرسمية، مع عداد زمني يجعلك على دراية دائمة بالوقت المتبقي للامتحان.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                
                {/* Left Column: Countdowns */}
                <div className="lg:col-span-5 space-y-6 animate-fade-in-up animate-delay-300">
                    <div className="flex items-center gap-3 mb-2 px-2">
                        <div className="p-2 bg-slate-200 rounded-lg text-slate-700">
                            <Clock size={20} />
                        </div>
                        <h2 className="text-xl font-extrabold text-slate-900">الوقت المتبقي للامتحانات</h2>
                    </div>
                    
                    <Countdown 
                        targetDate={nationalExamDate} 
                        title="الامتحان الوطني (2 باك)" 
                        color="bg-red-500" 
                        icon={Award}
                    />
                    
                    <Countdown 
                        targetDate={regionalExamDate} 
                        title="الامتحان الجهوي (1 باك)" 
                        color="bg-blue-500" 
                        icon={BookOpen}
                    />

                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-[2rem] border border-yellow-100 mt-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                        <div className="relative z-10">
                            <h4 className="font-bold text-yellow-800 mb-3 flex items-center gap-2 text-lg">
                                <Award size={22} className="text-yellow-600" /> نصيحة ذهبية
                            </h4>
                            <p className="text-yellow-900/80 text-base leading-relaxed font-medium">
                                "الوقت كالسيف، إن لم تقطعه قطعك". ابدأ المراجعة الآن ولا تنتظر اللحظة الأخيرة. تنظيم وقتك هو مفتاح نجاحك.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Simulator */}
                <div className="lg:col-span-7 animate-fade-in-up animate-delay-400">
                    <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] border border-gray-100 p-8 lg:p-12 relative overflow-hidden">
                        {/* Decorative background */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-blue-400 to-royal"></div>
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary opacity-[0.03] rounded-full blur-3xl"></div>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
                            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                                <div className="p-3 bg-blue-50 rounded-2xl text-primary">
                                    <Calculator size={24} />
                                </div>
                                محاكي النقط
                            </h2>
                            <button 
                                onClick={resetForm} 
                                className="text-sm font-bold text-gray-400 hover:text-primary flex items-center gap-2 transition-colors px-4 py-2 rounded-xl hover:bg-gray-50"
                            >
                                <RotateCcw size={16} /> إعادة تعيين
                            </button>
                        </div>

                        <div className="space-y-6 relative z-10">
                            {/* Input Field Component */}
                            {[
                                { label: 'الامتحان الجهوي (25%)', key: 'regional', color: 'blue' },
                                { label: 'المراقبة المستمرة (25%)', key: 'controleContinu', color: 'purple' },
                                { label: 'الامتحان الوطني (50%)', key: 'national', color: 'emerald' }
                            ].map((field, idx) => (
                                <div key={idx} className="group">
                                    <label className="block text-sm font-extrabold text-gray-500 mb-2 mr-1">{field.label}</label>
                                    <div className="relative transition-all duration-300 transform group-focus-within:-translate-y-1">
                                        <input 
                                            type="number" 
                                            min="0" max="20" 
                                            step="0.01"
                                            value={grades[field.key as keyof typeof grades]}
                                            onChange={(e) => setGrades({...grades, [field.key]: e.target.value})}
                                            className={`w-full bg-gray-50/50 border-2 border-gray-100 rounded-2xl px-6 py-5 font-black text-2xl outline-none focus:border-${field.color}-500 focus:bg-white focus:shadow-lg focus:shadow-${field.color}-500/10 transition-all text-left dir-ltr text-slate-800 placeholder-gray-300`}
                                            placeholder="00.00"
                                        />
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-end pointer-events-none">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Score</span>
                                            <span className="text-xs font-bold text-gray-300">/ 20</span>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="pt-4">
                                <button 
                                    onClick={calculateBac}
                                    className="w-full py-5 bg-slate-900 text-white font-extrabold rounded-2xl hover:bg-primary shadow-xl hover:shadow-blue-500/30 transition-all transform hover:-translate-y-1 active:scale-[0.98] text-xl flex items-center justify-center gap-3 relative overflow-hidden group"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        <Calculator size={24} />
                                        احسب النتيجة الآن
                                    </span>
                                    {/* Button Shine Effect */}
                                    <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-blob transition-all duration-1000"></div>
                                </button>
                            </div>
                        </div>

                        {/* Result Display */}
                        {result !== null && mention && (
                            <div id="result-card" className="mt-12 animate-in zoom-in slide-in-from-bottom-4 duration-500">
                                <div className={`text-center p-8 lg:p-10 rounded-[2.5rem] ${mention.bg} border-2 ${mention.color.replace('text-', 'border-').replace('600', '100')} relative overflow-hidden`}>
                                    {/* Background Icon */}
                                    <mention.icon size={200} className={`absolute -right-10 -bottom-10 opacity-5 ${mention.color}`} />
                                    
                                    <p className="text-gray-500 font-extrabold mb-4 uppercase tracking-widest text-sm">النتيجة النهائية</p>
                                    
                                    <div className="relative inline-block">
                                        <div className={`text-6xl lg:text-8xl font-black mb-6 tracking-tighter ${mention.color} drop-shadow-sm`}>
                                            {result.toFixed(2)}
                                        </div>
                                        <div className="absolute -top-4 -right-8 bg-white shadow-sm border border-gray-100 px-3 py-1 rounded-lg text-xs font-bold text-gray-500 transform rotate-12">
                                            / 20
                                        </div>
                                    </div>

                                    <div className="flex justify-center mb-8">
                                        <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-lg bg-white shadow-md ${mention.color}`}>
                                            <mention.icon size={24} strokeWidth={2.5} />
                                            {mention.text}
                                        </div>
                                    </div>

                                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50 mx-auto max-w-lg">
                                        <p className="text-gray-700 font-medium leading-relaxed">
                                            {mention.advice}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    </div>
  );
};
