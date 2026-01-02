
import React, { useState, useRef, useEffect } from 'react';
import {
  CheckCircle,
  Gift,
  Quote,
  ArrowLeft,
  UserCheck,
  Zap,
  Brain,
  Calendar,
  MessageCircle,
  Trophy,
  Users,
  Globe,
  Sparkles,
  Clock,
  ShieldCheck,
  Download,
  Loader2,
  GraduationCap,
  X,
  AlertTriangle,
  Check,
  Star,
  ArrowDown,
  ChevronDown,
  Flame,
  TrendingUp,
  Award
} from 'lucide-react';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Link } from 'react-router-dom';

export const CoachingOffer: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);
  const [spotsLeft, setSpotsLeft] = useState(7);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    grade: '2 باكالوريا'
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Randomly decrease spots for scarcity effect
    const interval = setInterval(() => {
      setSpotsLeft(prev => prev > 2 ? prev - 1 : prev);
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('المرجو ملء جميع المعلومات المطلوبة.');
      return;
    }
    setShowConfirm(true);
  };

  const confirmSubmission = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowConfirm(false);
      setIsSuccess(true);
      setFormData({ name: '', phone: '', grade: '2 باكالوريا' });
      const formElement = document.getElementById('registration-card');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 1500);
  };

  const features = [
    { id: 1, title: "تتبع شخصي مستمر", text: "متابعة دقيقة لمسارك الدراسي، نحدد معك نقاط الضعف ونعالجها خطوة بخطوة.", icon: UserCheck, color: "bg-blue-500" },
    { id: 2, title: "تقنيات التعلم السريع", text: "تعلم أحدث طرق المراجعة لرفع مستوى التركيز والإنجاز في وقت قياسي.", icon: Zap, color: "bg-yellow-500" },
    { id: 3, title: "تبسيط المواد المعقدة", text: "استراتيجيات حصرية لفهم الرياضيات والفيزياء وتحويلها لنقاط قوة.", icon: Brain, color: "bg-purple-500" },
    { id: 4, title: "برامج أسبوعية مفصلة", text: "خطط مراجعة مخصصة تضمن لك تغطية جميع الدروس بإنتاجية عالية.", icon: Calendar, color: "bg-green-500" },
    { id: 5, title: "مجتمع الدعم الخاص", text: "مجموعة واتساب حصرية لطرح الأسئلة والحصول على حلول فورية.", icon: MessageCircle, color: "bg-pink-500" },
    { id: 6, title: "تحديات ومنافسة", text: "بيئة تنافسية إيجابية تحفزك على زيادة ساعات المراجعة والالتزام.", icon: Trophy, color: "bg-orange-500" },
    { id: 7, title: "بنك المصادر الحصري", text: "مجموعة خاصة لتبادل التلخيصات المركزة والتمارين المختارة.", icon: Users, color: "bg-indigo-500" },
    { id: 8, title: "مكتبة رقمية شاملة", text: "ولوج مباشر لأفضل الدروس المشروحة والامتحانات الوطنية السابقة.", icon: Globe, color: "bg-cyan-500" }
  ];

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    if (pdfRef.current) {
      try {
        const canvas = await html2canvas(pdfRef.current, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const ratio = pdfWidth / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, canvas.height * ratio);
        pdf.save("Tilmid_Coaching_Program.pdf");
      } catch (err) { alert("حدث خطأ أثناء إنشاء الملف."); }
    }
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 overflow-x-hidden font-sans w-full max-w-full">

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 lg:pt-36 lg:pb-24 bg-slate-900 text-white overflow-hidden rounded-b-[2.5rem] lg:rounded-b-[3rem] shadow-2xl">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-blob"></div>
          <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-yellow-300 font-black text-sm mb-8 animate-fade-in-up">
            <Flame size={18} fill="currentColor" className="animate-pulse" />
            <span>عرض محدود لـ 20 تلميذ فقط هذا الشهر</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black mb-6 tracking-tight leading-[1.1] animate-fade-in-up animate-delay-100">
            اضمن تفوقك مع <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-cyan-300">المواكبة الذكية</span>
          </h1>

          <p className="text-lg md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animate-delay-200 mb-12 font-medium">
            لا تضيع وقتك في المحاولات العشوائية. انضم للبرنامج الذي غيّر مسار آلاف الطلاب المغاربة وحقق حلمك الدراسي.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 animate-fade-in-up animate-delay-300">
            <button
              onClick={() => document.getElementById('registration-card')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-12 py-5 bg-primary text-white rounded-full font-black text-xl hover:bg-blue-600 transition-all shadow-2xl shadow-blue-500/40 hover:-translate-y-1 flex items-center justify-center gap-3"
            >
              <span>سجل مكاني الآن</span>
              <ArrowDown size={22} />
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="w-full sm:w-auto px-10 py-5 bg-white/5 text-white border-2 border-white/20 rounded-full font-bold text-lg hover:bg-white hover:text-slate-900 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isGenerating ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
              <span>تحميل بروشور البرنامج</span>
            </button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 lg:px-8 mt-12 lg:mt-24 relative z-20 space-y-24">

        {/* Form Card with Psychological Triggers */}
        <div id="registration-card" className="grid grid-cols-1 lg:grid-cols-5 gap-8 animate-fade-in-up animate-delay-300">

          <div className="lg:col-span-3 bg-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden relative group">
            {isSuccess ? (
              <div className="h-full flex flex-col items-center justify-center p-16 text-center bg-gradient-to-b from-white to-green-50">
                <div className="w-28 h-28 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-8 animate-bounce-slow shadow-lg shadow-green-200">
                  <CheckCircle size={56} />
                </div>
                <h3 className="text-4xl font-black text-gray-900 mb-6 tracking-tight">تم حجز مقعدك! 🎉</h3>
                <p className="text-gray-600 text-xl mb-10 max-w-lg mx-auto leading-relaxed">
                  سيتواصل معك الأستاذ <span className="font-black text-primary">ياسين</span> شخصياً عبر الواتساب خلال الساعات القادمة لتحديد موعد الجلسة الأولى.
                </p>
                <button onClick={() => setIsSuccess(false)} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-primary transition-all">تسجيل طالب آخر</button>
              </div>
            ) : (
              <>
                <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-right">
                      <h3 className="text-3xl font-black mb-2 tracking-tight">استمارة الانضمام</h3>
                      <p className="text-blue-200 font-bold opacity-80">املأ بياناتك لنتواصل معك فوراً</p>
                    </div>
                    <div className="flex flex-col items-center bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 shadow-inner">
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-300">المقاعد المتبقية</span>
                      <span className="text-3xl font-black text-yellow-400 tabular-nums">{spotsLeft} / 20</span>
                    </div>
                  </div>
                </div>


                <div className="p-8 lg:p-10">
                  <form className="space-y-8" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="block text-sm font-black text-slate-700 mr-2 uppercase tracking-wide">الاسم الكامل</label>
                        <div className="relative group">
                          <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full pl-4 pr-12 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-lg" placeholder="مثال: محمد البركاني" required />
                          <UserCheck size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="block text-sm font-black text-slate-700 mr-2 uppercase tracking-wide">رقم الواتساب</label>
                        <div className="relative group">
                          <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full pl-4 pr-12 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-lg text-left font-mono" placeholder="06XXXXXXXX" dir="ltr" required />
                          <MessageCircle size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-black text-slate-700 mr-2 uppercase tracking-wide">المستوى الدراسي</label>
                      <div className="relative">
                        <select name="grade" value={formData.grade} onChange={handleInputChange} className="w-full pl-4 pr-12 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary outline-none transition-all font-black text-lg appearance-none cursor-pointer">
                          <option>2 باكالوريا</option><option>1 باكالوريا</option><option>جذع مشترك</option>
                        </select>
                        <GraduationCap size={24} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
                        <ChevronDown size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                      </div>
                    </div>

                    <div className="pt-4">
                      <button type="submit" className="w-full py-6 bg-primary text-white font-black rounded-3xl hover:bg-blue-600 transition-all shadow-2xl shadow-blue-500/30 flex items-center justify-center gap-4 text-xl group transform active:scale-95">
                        <span>أريد الانضمام للبرنامج</span>
                        <ArrowLeft size={24} className="group-hover:-translate-x-2 transition-transform" />
                      </button>
                    </div>
                  </form>

                  <div className="mt-12 pt-8 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2 text-xs font-black text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
                      <ShieldCheck size={16} /> ضمان استرجاع الأموال في حال عدم الرضا
                    </div>
                    <div className="flex items-center -space-x-3 space-x-reverse">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 overflow-hidden shadow-sm">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 50}`} alt="Student" />
                        </div>
                      ))}
                      <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-black border-2 border-white shadow-sm">+500</div>
                      <span className="mr-4 text-xs font-bold text-slate-400">انضموا إلينا هذا الشهر</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gradient-to-br from-primary to-royal p-6 rounded-[2.5rem] text-white shadow-2xl shadow-blue-500/20 text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-white/20 shadow-xl group-hover:rotate-6 transition-transform">
                <Award size={40} className="text-yellow-300" />
              </div>
              <h3 className="font-black text-2xl mb-3">توجيه VIP</h3>
              <p className="text-blue-100 font-medium text-sm leading-relaxed mb-8 opacity-90">ستحصل على وصول مباشر لرقم الأستاذ ياسين الشخصي للاستشارات الطارئة.</p>
              <div className="py-3 px-6 bg-white/10 rounded-2xl border border-white/20 text-xs font-black uppercase tracking-widest">ميزة حصرية للمشتركين</div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
              <h4 className="font-black text-slate-900 text-lg mb-8 text-center flex items-center justify-center gap-2">
                <TrendingUp size={20} className="text-primary" /> لماذا نحن الأفضل؟
              </h4>
              <ul className="space-y-6">
                {[
                  "متابعة يومية دقيقة",
                  "تقنيات مراجعة مثبتة علمياً",
                  "أكبر قاعدة بيانات للملخصات",
                  "دعم نفسي وتدريب على التركيز"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4 text-sm font-bold text-slate-600">
                    <div className="p-1.5 bg-blue-50 text-blue-600 rounded-xl shrink-0 shadow-sm"><Check size={16} strokeWidth={3} /></div>
                    <span className="leading-tight">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Enhanced Premium Special Offer Card */}
        <div className="max-w-5xl mx-auto">
          <div className="relative p-1 lg:p-2 rounded-[3.5rem] bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-500 shadow-2xl shadow-yellow-500/20 overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/white-diamond.png')] opacity-20 group-hover:scale-110 transition-transform duration-1000"></div>

            <div className="relative bg-slate-900 rounded-[3rem] p-8 md:p-12 text-center overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[100px] -ml-32 -mb-32"></div>

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-5 py-2 bg-yellow-400 text-slate-900 rounded-full text-xs font-black uppercase tracking-widest mb-10 shadow-lg animate-bounce-slow">
                  <Gift size={16} /> هدية حصرية مجانية
                </div>

                <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight leading-tight">
                  دورة <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500 italic">"أسرار التوجيه الجامعي"</span>
                </h2>

                <p className="text-xl md:text-2xl text-slate-300 font-medium mb-12 max-w-3xl mx-auto leading-relaxed">
                  احصل مجاناً على أقوى دليل شامل للتخطيط لمسارك بعد الباكالوريا (المدارس العليا، الأقسام التحضيرية، كليات الطب) بقيمة <span className="text-white font-black line-through opacity-50">499 درهم</span>.
                </p>

                <div className="flex flex-col md:flex-row items-center justify-center gap-10">
                  <div className="flex items-center gap-5 text-right">
                    <div className="w-16 h-16 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10">
                      <CheckCircle size={32} className="text-yellow-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg">تحليل جميع المدارس</h4>
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-wide">عتبات الانتقاء وطرق الولوج</p>
                    </div>
                  </div>
                  <div className="w-px h-12 bg-white/10 hidden md:block"></div>
                  <div className="flex items-center gap-5 text-right">
                    <div className="w-16 h-16 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10">
                      <Brain size={32} className="text-yellow-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg">تحديد الشغف المهني</h4>
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-wide">اختبارات الميول الذكية</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid - Already Refined */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">ماذا يقدم لك البرنامج؟</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium">نحن لا نعلمك الدروس، نحن نعلمك "كيف تنجح" في مسارك الدراسي بالكامل.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div key={feature.id} className="group relative bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-1.5 ${feature.color}`}></div>
                <div className={`absolute -right-10 -top-10 w-48 h-48 ${feature.color} opacity-5 rounded-full blur-3xl group-hover:opacity-10 transition-opacity`}></div>

                <div className="relative z-10">
                  <div className={`w-20 h-20 ${feature.color} text-white rounded-3xl flex items-center justify-center mb-8 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                    <feature.icon size={40} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4 leading-tight">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed font-bold text-sm">{feature.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
