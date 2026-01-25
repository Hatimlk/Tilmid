
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
import img0604 from '../assets/Testimonial/IMG_0604.jpg';
import img0605 from '../assets/Testimonial/IMG_0605.jpg';
import img0606 from '../assets/Testimonial/IMG_0606.jpg';
import img0710 from '../assets/Testimonial/IMG_0710.PNG';
import img0726 from '../assets/Testimonial/IMG_0726.PNG';
import img0727 from '../assets/Testimonial/IMG_0727.PNG';
import img2756 from '../assets/Testimonial/IMG_2756.jpg';
import img2944 from '../assets/Testimonial/IMG_2944.jpg';
import img2945 from '../assets/Testimonial/IMG_2945.jpg';
import img2947 from '../assets/Testimonial/IMG_2947.jpg';

const TESTIMONIALS = [
  img0604, img0605, img0606, img0710, img0726, img0727, img2756, img2944, img2945, img2947
];

const Marquee: React.FC<{ children: React.ReactNode; direction?: 'left' | 'right'; speed?: number }> = ({ children, direction = 'left', speed = 40 }) => {
  return (
    <div className="relative flex overflow-hidden group">
      <div
        className={`flex gap-6 animate-scroll-rtl py-4 ${direction === 'right' ? 'direction-reverse' : ''} group-hover:[animation-play-state:paused]`}
        style={{ animationDirection: direction === 'right' ? 'reverse' : 'normal', animationDuration: `${speed}s` }}
      >
        {children}
        {children}
      </div>
      <div
        className={`flex gap-6 animate-scroll-rtl py-4 absolute top-0 ${direction === 'right' ? 'direction-reverse' : ''} group-hover:[animation-play-state:paused]`}
        style={{ animationDirection: direction === 'right' ? 'reverse' : 'normal', animationDuration: `${speed}s`, left: direction === 'left' ? '100%' : 'auto', right: direction === 'right' ? '100%' : 'auto' }}
      >
        {children}
        {children}
      </div>
    </div>
  );
};

export const CoachingOffer: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);


  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    grade: '2 باكالوريا'
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);



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
      <section className="relative pt-16 pb-16 lg:pt-24 lg:pb-24 bg-gradient-to-br from-royal via-blue-900 to-slate-900 text-white overflow-hidden rounded-b-[2rem] lg:rounded-b-[2.5rem] shadow-xl">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-blob"></div>
          <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">


          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight leading-[1.1] animate-fade-in-up animate-delay-100">
            اضمن تفوقك مع <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-cyan-300">المواكبة الذكية</span>
          </h1>

          <p className="text-base md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animate-delay-200 mb-10 font-medium">
            لا تضيع وقتك في المحاولات العشوائية. انضم للبرنامج الذي غيّر مسار آلاف الطلاب المغاربة وحقق حلمك الدراسي.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animate-delay-300">
            <button
              onClick={() => document.getElementById('registration-card')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-10 py-4 bg-primary text-white rounded-full font-bold text-lg hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/30 hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <span>سجل مكاني الآن</span>
              <ArrowDown size={20} />
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="w-full sm:w-auto px-8 py-4 bg-white/5 text-white border border-white/20 rounded-full font-semibold text-base hover:bg-white hover:text-slate-900 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
              <span>تحميل بروشور البرنامج</span>
            </button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 lg:px-8 mt-12 lg:mt-24 relative z-20 space-y-24">

        {/* Form Card with Psychological Triggers */}
        <div id="registration-card" className="grid grid-cols-1 lg:grid-cols-5 gap-8 animate-fade-in-up animate-delay-300">

          <div className="lg:col-span-3 bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden relative group">
            {isSuccess ? (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-gradient-to-b from-white to-green-50">
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
                          <option>التعليم العالي</option><option>2 باكالوريا</option><option>1 باكالوريا</option><option>جذع مشترك</option>
                        </select>
                        <GraduationCap size={24} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
                        <ChevronDown size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button type="submit" className="w-full py-5 bg-primary text-white font-bold rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 text-lg group transform active:scale-95">
                        <span>أريد الانضمام للبرنامج</span>
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </form>


                </div>
              </>
            )}
          </div>

          <div className="lg:col-span-2 space-y-6">


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


        {/* Features Grid - Already Refined */}
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest mb-6">
              <Sparkles size={16} />
              <span>قيمة لا تقدر بثمن</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">ماذا يقدم لك البرنامج؟</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-xl font-bold">نحن لا نعلمك الدروس، نحن نعلمك "كيف تنجح" في مسارك الدراسي بالكامل.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.id} className="group relative bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 overflow-hidden">
                <div className={`absolute top-0 right-0 w-24 h-24 ${feature.color} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity`}></div>

                <div className="relative z-10 flex flex-col h-full">
                  <div className={`w-14 h-14 ${feature.color} text-white rounded-xl flex items-center justify-center mb-5 shadow-md transform group-hover:rotate-6 transition-transform duration-500`}>
                    <feature.icon size={28} />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed font-medium text-sm mt-auto opacity-90">{feature.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials "Wall of Love" Section */}
        <section className="py-16 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-b from-blue-50/50 to-transparent"></div>
          </div>

          <div className="container mx-auto px-4 mb-12 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-emerald-100">
              <Star size={16} fill="currentColor" />
              <span>نتائج تتحدث عن نفسها</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">قصص نجاح حقيقية</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-xl font-bold">انضم إلى مئات التلاميذ الذين حققوا قفزة نوعية في مسارهم الدراسي.</p>
          </div>

          <div className="relative w-full space-y-8" dir="ltr">
            {/* Top Gradient Fade */}
            <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-gray-50 to-transparent z-20"></div>
            <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-gray-50 to-transparent z-20"></div>

            {/* Row 1: Scrolling Left */}
            <div className="flex overflow-hidden relative w-full group">
              <div className="flex gap-6 animate-scroll-rtl w-max group-hover:[animation-play-state:paused]">
                {[...TESTIMONIALS, ...TESTIMONIALS].map((img, i) => (
                  <div key={i} className="w-[280px] md:w-[350px] aspect-[3/4] rounded-3xl overflow-hidden border border-slate-100 shadow-sm relative group/card flex-shrink-0 bg-white">
                    <img
                      src={img}
                      alt="Student Testimonial"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                      <span className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold border border-white/30">تحقق من النتيجة</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Row 2: Scrolling Right (Simulated by reversing animation direction if supported, or just different content) */}
            {/* Note: For simplicity in this single-file edit without complex CSS modules, using same direction but offset images or different speed/set would be easier. 
                 Let's stick to one main row for now to ensure it looks clean, or add a second row if user insists on volume. 
                 Let's do one high-quality row for mobile responsiveness safety first. */}
          </div>
        </section>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mt-24 px-4 pb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">أسئلة شائعة</h2>
            <p className="text-slate-500 text-lg font-bold">كل ما تحتاج معرفته عن برنامج المواكبة</p>
          </div>

          <div className="space-y-4">
            {[
              { q: "هل البرنامج مناسب لتلاميذ السنة الأولى باكالوريا؟", a: "نعم، البرنامج مصمم ليناسب جميع المستويات الثانوية (سانكيام، سيزيام، وباك)، حيث نخصص خطة عمل تناسب كل مستوى." },
              { q: "كيف يتم التواصل مع الأستاذ؟", a: "يتم التواصل بشكل مباشر ويومي عبر مجموعة واتساب خاصة، بالإضافة إلى جلسات فيديو أسبوعية للمتابعة الشخصية." },

              { q: "هل يتعارض البرنامج مع  دروس الدعم (Soutien)؟", a: "على العكس، البرنامج يكمل دروس الدعم بتعليمك كيفية تنظيم وقتك وكيفية استغلال تلك الدروس بفعالية أكبر." }
            ].map((faq, i) => (
              <details key={i} className="group bg-white rounded-[2rem] border border-slate-100 shadow-sm open:shadow-xl open:border-blue-100 transition-all duration-300 overflow-hidden">
                <summary className="flex items-center justify-between p-8 cursor-pointer list-none">
                  <h4 className="text-lg md:text-xl font-black text-slate-800 group-hover:text-primary transition-colors">{faq.q}</h4>
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-open:bg-primary group-open:text-white transition-all duration-300">
                    <ChevronDown size={20} className="group-open:rotate-180 transition-transform duration-300" />
                  </div>
                </summary>
                <div className="px-8 pb-8 pt-0">
                  <p className="text-slate-500 font-medium leading-relaxed border-t border-slate-50 pt-6">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
