
import React, { useState, useRef } from 'react';
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
  Check
} from 'lucide-react';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

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
    
    // Simulate API Call
    setTimeout(() => {
        setIsSubmitting(false);
        setShowConfirm(false);
        setIsSuccess(true);
        setFormData({ name: '', phone: '', grade: '2 باكالوريا' });
        // Scroll to top of form area to ensure user sees the success message
        const formElement = document.getElementById('registration-card');
        if (formElement) {
            formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 1500);
  };

  const features = [
    {
      id: 1,
      title: "تتبع شخصي مستمر",
      text: "متابعة شخصية دقيقة لمسارك الدراسي، نحدد معك نقاط الضعف ونعالجها خطوة بخطوة حتى تصل إلى أعلى مستوى من قدراتك.",
      icon: UserCheck,
      gradient: "from-blue-400 to-blue-600"
    },
    {
      id: 2,
      title: "تقنيات التعلم السريع",
      text: "ستتعلم أحدث التقنيات العلمية في المراجعة الفعالة، تنظيم الوقت، ورفع مستوى التركيز لتنجز في ساعة ما ينجزه غيرك في أربع.",
      icon: Zap,
      gradient: "from-yellow-400 to-orange-500"
    },
    {
      id: 3,
      title: "تبسيط المواد المعقدة",
      text: "استراتيجيات حصرية لفهم المواد الصعبة (رياضيات، فيزياء..) وتحويلها من كابوس إلى نقاط قوة تميزك في الامتحانات.",
      icon: Brain,
      gradient: "from-purple-400 to-purple-600"
    },
    {
      id: 4,
      title: "برامج أسبوعية مفصلة",
      text: "لن تحتار بعد اليوم في ماذا تدرس. نوفر لك برنامج مراجعة أسبوعي مفصل يضمن لك تغطية جميع الدروس بإنتاجية عالية.",
      icon: Calendar,
      gradient: "from-green-400 to-emerald-600"
    },
    {
      id: 5,
      title: "مجتمع الدعم الخاص",
      text: "مجموعة واتساب حصرية لطرح الأسئلة ومشاركة المشاكل الدراسية والحصول على حلول فورية من المشرفين والزملاء.",
      icon: MessageCircle,
      gradient: "from-pink-400 to-rose-600"
    },
    {
      id: 6,
      title: "تحديات ومنافسة",
      text: "بيئة تنافسية إيجابية عبر تطبيق خاص يحفزك على زيادة ساعات المراجعة والالتزام من خلال تحديات وجوائز.",
      icon: Trophy,
      gradient: "from-amber-400 to-red-500"
    },
    {
      id: 7,
      title: "بنك المصادر الحصري",
      text: "مجموعة خاصة لتبادل التلخيصات المركزة، التمارين المختارة، ونماذج الفروض التي لن تجدها في مكان آخر.",
      icon: Users,
      gradient: "from-indigo-400 to-blue-600"
    },
    {
      id: 8,
      title: "مكتبة رقمية شاملة",
      text: "ولوج مباشر لأفضل المواقع والمنصات التي تحتوي على دروس مشروحة، تمارين مصححة، وامتحانات وطنية سابقة مع التصحيح.",
      icon: Globe,
      gradient: "from-cyan-400 to-teal-500"
    }
  ];

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    
    if (pdfRef.current) {
        try {
            // Capture the hidden Arabic content
            const canvas = await html2canvas(pdfRef.current, {
                scale: 2, // Better resolution
                useCORS: true
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            
            // Calculate height to maintain aspect ratio
            const ratio = pdfWidth / imgWidth;
            const pdfImgHeight = imgHeight * ratio;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfImgHeight);
            pdf.save("Tilmid_Coaching_Program.pdf");
        } catch (err) {
            console.error("PDF Generation Error:", err);
            alert("حدث خطأ أثناء إنشاء الملف. يرجى المحاولة مرة أخرى.");
        }
    }
    
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 overflow-x-hidden">
      
      {/* Hidden PDF Template (Off-screen but rendered) */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <div ref={pdfRef} className="w-[210mm] min-h-[297mm] bg-white p-12 text-right" dir="rtl">
             {/* Header */}
             <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-6">
                <div className="flex items-center gap-3">
                    <div className="bg-[#0095ff] p-3 rounded-xl text-white">
                       <GraduationCap size={32} />
                    </div>
                    <div>
                       <h1 className="text-3xl font-bold text-[#0095ff]">تلميـذ</h1>
                       <p className="text-gray-500 text-sm">منصة التوجيه الأولى</p>
                    </div>
                </div>
                <div className="text-left">
                    <p className="text-gray-400 text-sm">تاريخ الإصدار</p>
                    <p className="text-gray-800 font-bold">{new Date().toLocaleDateString('ar-MA')}</p>
                </div>
             </div>

             {/* Title */}
             <div className="text-center mb-8 bg-[#f0f9ff] p-6 rounded-3xl border border-[#0095ff]/20">
                 <h2 className="text-3xl font-extrabold text-gray-900 mb-2">عرض برنامج “تلميذ” للتوجيه الأكاديمي</h2>
                 <p className="text-[#0095ff] font-bold text-lg">طريقك نحو التميز الدراسي</p>
             </div>

             {/* Overview */}
             <div className="mb-8">
                 <h3 className="text-xl font-bold text-gray-900 mb-3 border-r-4 border-[#0095ff] pr-3">نظرة عامة عن البرنامج:</h3>
                 <p className="text-gray-700 leading-relaxed text-lg">
                    هذا البرنامج الحصري مُصمم لمساعدة التلاميذ على تجاوز الصعوبات الدراسية، وتعزيز التركيز، وتحقيق أهدافهم عبر إرشاد شخصي وتقنيات متقدمة للمذاكرة.
                 </p>
             </div>

             {/* Features */}
             <div className="mb-10">
                 <h3 className="text-xl font-bold text-gray-900 mb-6 border-r-4 border-[#0095ff] pr-3">أهم المميزات:</h3>
                 <div className="space-y-4">
                    {[
                        "متابعة شخصية إلى أن تصل إلى أعلى مستوى من قدراتك.",
                        "تقنيات متقدمة لإدارة الوقت وزيادة التركيز.",
                        "استراتيجيات لتبسيط المواد الصعبة.",
                        "برنامج مراجعة أسبوعي لرفع الإنتاجية.",
                        "مجموعة دعم خاصة على واتساب لحل المشكلات.",
                        "نظام تتبع تنافسي لساعات المذاكرة.",
                        "مجموعة حصرية لمشاركة الملخصات والتمارين.",
                        "موارد مختارة، وفروض وامتحانات مصححة."
                    ].map((item, i) => (
                        <div key={i} className="flex items-start gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <div className="w-6 h-6 rounded-full bg-[#0095ff] text-white flex items-center justify-center font-bold shrink-0 text-xs mt-0.5">
                                {i + 1}
                            </div>
                            <p className="text-gray-800 font-medium text-lg leading-snug">{item}</p>
                        </div>
                    ))}
                 </div>
             </div>

             {/* Footer / Contact */}
             <div className="mt-auto pt-8 border-t border-gray-200 bg-gray-50 p-6 rounded-2xl">
                 <h4 className="text-lg font-bold text-gray-900 mb-4 text-center">للتواصل والتسجيل</h4>
                 <div className="flex flex-col gap-3 text-gray-700 text-base items-center">
                     <div className="flex items-center gap-2">
                         <MessageCircle size={18} />
                         <span className="font-bold">واتساب:</span>
                         <span dir="ltr">+212 7 7810 4220</span>
                     </div>
                     <div className="flex items-center gap-2">
                         <span className="font-bold">البريد الإلكتروني:</span>
                         <span>contact@tilmide.ma</span>
                     </div>
                     <div className="flex items-center gap-2">
                         <Globe size={18} />
                         <span className="font-bold">الموقع الإلكتروني:</span>
                         <span dir="ltr">www.tilmide.ma</span>
                     </div>
                 </div>
             </div>
        </div>
      </div>

      {/* Top Spacing */}
      <div className="pt-24 lg:pt-32"></div>

      {/* Hero / Intro Section */}
      <div className="container mx-auto px-4 lg:px-8 mb-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-primary rounded-full font-bold text-sm mb-6 border border-blue-100 animate-fade-in-up">
            <Sparkles size={16} />
            <span>عرض محدود للمتميزين</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-8 leading-tight animate-fade-in-up animate-delay-100">
            المواكبة الشخصية <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-royal">طريقك نحو التفوق</span>
          </h1>

          <div className="space-y-6 text-lg text-gray-600 leading-relaxed animate-fade-in-up animate-delay-200 px-2">
            <p>
              نتا تلميذ كاتعاني من بزاف ديال المشاكل كمثال أنك كاتراجع مزيان و ماكاتجيبش نقط فالمستوى المطلوب، 
              أو كاتراجع بطريقة خاطئة و كاتلقا كولشي تنسى عليك نهار الإمتحان.
            </p>
            <p className="font-medium text-gray-800">
              لهذا جاء <span className="text-primary font-bold">عرض المواكبة الشخصية</span>، الحل الأمثل لاختصار الوقت وضمان أفضل مستوى دراسي.
            </p>
          </div>

          {/* Download Button */}
          <div className="mt-8 flex justify-center animate-fade-in-up animate-delay-300 w-full">
            <button 
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 rounded-xl font-bold text-gray-600 hover:border-primary hover:text-primary transition-all shadow-sm hover:shadow-md group disabled:opacity-70 disabled:cursor-wait w-full sm:w-auto"
            >
              {isGenerating ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Download size={20} className="group-hover:translate-y-1 transition-transform" />
              )}
              <span>{isGenerating ? 'جاري إنشاء الملف...' : 'تحميل دليل العرض (PDF)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Flow */}
      <div className="container mx-auto px-4 lg:px-8 space-y-20">

        {/* 1. Registration Form (High Priority) */}
        <div id="registration-card" className="max-w-3xl mx-auto animate-fade-in-up animate-delay-300 relative z-20">
            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-blue-100 overflow-hidden relative">
                {isSuccess ? (
                    <div className="p-12 text-center bg-gradient-to-b from-white to-green-50">
                        <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-500">
                            <CheckCircle size={48} />
                        </div>
                        <h3 className="text-3xl font-extrabold text-gray-900 mb-4">تم التسجيل بنجاح! 🎉</h3>
                        <p className="text-gray-600 text-lg mb-8 max-w-lg mx-auto leading-relaxed">
                            شكراً لثقتك بنا يا <span className="font-bold text-gray-900">{formData.name}</span>. 
                            تم استلام طلبك، وسيتواصل معك فريقنا عبر الواتساب في أقرب وقت ممكن لتأكيد انضمامك.
                        </p>
                        <button 
                            onClick={() => setIsSuccess(false)}
                            className="px-8 py-3 bg-white border-2 border-green-100 text-green-600 rounded-xl font-bold hover:bg-green-50 transition-all"
                        >
                            تسجيل طالب آخر
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="bg-royal p-8 text-white text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                            <h3 className="text-3xl font-bold relative z-10 mb-2">سجل الآن</h3>
                            <p className="text-blue-100 text-lg relative z-10">الأماكن محدودة جداً!</p>
                            <div className="mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-bold">
                                <Clock size={14} />
                                <span>ينتهي العرض قريباً</span>
                            </div>
                        </div>
                        
                        {/* Body */}
                        <div className="p-6 md:p-10">
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">الاسم الكامل</label>
                                        <input 
                                        type="text" 
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary focus:bg-white outline-none transition-all text-base" 
                                        placeholder="أمين التلميذ" 
                                        required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">رقم الواتساب</label>
                                        <input 
                                        type="tel" 
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary focus:bg-white outline-none transition-all text-base text-left font-mono" 
                                        placeholder="06 00 00 00 00" 
                                        dir="ltr" 
                                        required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">المستوى الدراسي</label>
                                    <select 
                                    name="grade"
                                    value={formData.grade}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary focus:bg-white outline-none transition-all text-base"
                                    >
                                        <option>2 باكالوريا</option>
                                        <option>1 باكالوريا</option>
                                        <option>جذع مشترك</option>
                                    </select>
                                </div>

                                <button type="submit" className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-3 group text-lg mt-4">
                                    <span>حجز المقعد الآن</span>
                                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                                </button>
                            </form>

                            <div className="mt-8 pt-8 border-t border-gray-100 text-center">
                                <p className="text-sm text-gray-500 mb-4 font-bold">أو تواصل معنا مباشرة للإستفسار</p>
                                <a href="https://wa.me/message/GN4XKUOMHNHGO1" target="_blank" rel="noreferrer" className="w-full md:w-auto inline-flex px-8 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all items-center justify-center gap-2 text-sm shadow-lg shadow-green-500/20">
                                    <MessageCircle size={18} />
                                    <span>تواصل عبر واتساب</span>
                                </a>
                            </div>
                            
                            {/* Trust Indicators */}
                            <div className="flex flex-wrap justify-center gap-6 mt-8 text-gray-400 text-xs font-bold">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck size={16} className="text-green-500" />
                                    <span>ضمان الجودة</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users size={16} className="text-blue-500" />
                                    <span>+3500 تلميذ</span>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>

        {/* 2. Features Timeline (PREMIUM DARK REDESIGN) */}
        <div className="max-w-6xl mx-auto mt-12">
            <div className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-[3rem] p-8 md:p-16 overflow-hidden shadow-2xl border border-slate-800 group">
                {/* Decorative Background Effects */}
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')] opacity-5"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-overlay filter blur-[120px] opacity-20 animate-blob"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-overlay filter blur-[120px] opacity-20 animate-blob animation-delay-2000"></div>

                <div className="text-center mb-20 relative z-10">
                    <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-blue-200 font-bold text-sm mb-6">
                        <Sparkles size={16} className="text-yellow-400" />
                        <span>اكتشف الفرق</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                        رحلة متكاملة نحو <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">التميز الدراسي</span>
                    </h2>
                    <p className="text-slate-300 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
                        صممنا هذا البرنامج بعناية ليغطي جميع جوانب حياتك الدراسية، من الدعم النفسي إلى التفوق الأكاديمي.
                    </p>
                </div>

                <div className="relative">
                    {/* Central Line (Desktop) */}
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-slate-800 transform -translate-x-1/2 rounded-full opacity-30"></div>
                    
                    {/* Left Line (Mobile) */}
                    <div className="md:hidden absolute right-6 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-slate-800 rounded-full opacity-30"></div>

                    <div className="space-y-16 relative z-10">
                    {features.map((feature, index) => {
                        const isRightSide = index % 2 === 0; 
                        
                        return (
                        <div 
                            key={feature.id} 
                            className={`flex flex-col md:flex-row items-center w-full relative group/item opacity-0 animate-fade-in-up`}
                            style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
                        >
                            {/* Desktop Layout */}
                            <div className={`hidden md:flex w-full items-center ${isRightSide ? 'justify-start' : 'justify-end'}`}>
                                
                                {/* Content Card */}
                                <div className={`w-[45%] relative ${isRightSide ? 'ml-auto pl-12 text-left' : 'mr-auto pr-12 text-right'}`}>
                                    <div className="relative bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(0,0,0,0.3)] group-hover/item:border-white/20">
                                        <div className={`absolute top-6 ${isRightSide ? 'right-6' : 'left-6'} w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg transform group-hover/item:scale-110 transition-transform duration-500`}>
                                            <feature.icon size={24} className="text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-3 pt-2">{feature.title}</h3>
                                        <p className="text-slate-300 text-base leading-relaxed font-medium" dir="rtl">
                                            {feature.text}
                                        </p>
                                    </div>
                                    
                                    {/* Connector Line */}
                                    <div className={`absolute top-1/2 -translate-y-1/2 h-0.5 w-12 bg-blue-500/30 ${isRightSide ? 'right-0' : 'left-0'}`}></div>
                                </div>

                                {/* Center Node */}
                                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.8)] z-20 border-4 border-slate-900 group-hover/item:scale-150 transition-transform duration-300"></div>
                            </div>

                            {/* Mobile Layout */}
                            <div className="md:hidden w-full pr-16 relative">
                                <div className="absolute right-6 top-8 w-4 h-4 bg-blue-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.8)] z-20 border-4 border-slate-900 transform translate-x-1/2"></div>
                                <div className="relative bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition-all">
                                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg mb-4`}>
                                        <feature.icon size={24} className="text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                                    <p className="text-slate-300 text-sm leading-relaxed font-medium">
                                        {feature.text}
                                    </p>
                                </div>
                            </div>

                        </div>
                        );
                    })}
                    </div>
                </div>
            </div>
        </div>

        {/* 3. Gift Section */}
        <div className="max-w-4xl mx-auto mt-20 transform hover:scale-[1.02] transition-transform duration-500">
            <div className="relative bg-gradient-to-br from-white to-blue-50 border-2 border-primary/20 rounded-[2.5rem] p-8 md:p-12 text-center shadow-xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30"></div>
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
            
            <div className="relative z-10">
                <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto mb-6 text-primary animate-bounce-slow">
                    <Gift size={40} />
                </div>
                
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-snug">
                هدية حصرية <span className="text-primary">مجانية</span>
                </h2>
                <p className="text-xl text-gray-600 font-medium mb-8 max-w-2xl mx-auto">
                حصة توجيهية لما بعد الباكالوريا خاصة بتلاميذ عرض المواكبة الشخصية.
                </p>
                
                <div className="inline-flex items-center gap-2 px-6 py-2 bg-white rounded-full shadow-sm border border-gray-100 text-sm font-bold text-gray-500">
                    <Sparkles size={16} className="text-yellow-400" />
                    <span>مقدمة من فريق تلميذ</span>
                    <Sparkles size={16} className="text-yellow-400" />
                </div>
            </div>
            </div>
        </div>

        {/* 4. Testimonials Section */}
        <div className="max-w-5xl mx-auto pb-12 mt-20">
            <div className="flex flex-col items-center text-center mb-12">
                <div className="p-3 bg-blue-50 text-primary rounded-full mb-4">
                    <Quote size={24} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">آراء التلاميذ</h2>
                <p className="text-gray-500 mt-2">ماذا يقول المشتركون عن تجربتهم؟</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-8 rounded-[2rem] border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="flex gap-1 mb-4">
                        {[1,2,3,4,5].map(star => <div key={star} className="w-4 h-4 bg-yellow-400 rounded-full"></div>)}
                    </div>
                    <p className="text-gray-600 text-base leading-relaxed mb-6 font-medium min-h-[80px]">
                        " ساعدني البرنامج بزاف باش ننظم وقتي ونعرف كيفاش نراجع المواد العلمية. شكراً أستاذ ياسين. "
                    </p>
                    <div className="flex items-center gap-4 pt-6 border-t border-gray-50">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-primary font-bold shadow-inner">
                        {i === 1 ? 'A' : i === 2 ? 'S' : 'M'}
                        </div>
                        <div>
                        <span className="block font-bold text-gray-900 text-sm">تلميذ(ة) مشترك</span>
                        <span className="text-xs text-gray-500">باكالوريا 2023</span>
                        </div>
                    </div>
                </div>
            ))}
            </div>
        </div>

      </div>

        {/* Confirmation Modal */}
        {showConfirm && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-xl font-bold text-gray-900">تأكيد التسجيل</h3>
                        <button onClick={() => setShowConfirm(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <X size={24} />
                        </button>
                    </div>
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle size={32} />
                        </div>
                        <p className="text-gray-600 mb-6 font-medium">
                            هل أنت متأكد من صحة المعلومات المدخلة؟ سيتم إرسال طلبك للمعالجة.
                        </p>
                        <div className="bg-gray-50 p-4 rounded-xl text-right text-sm space-y-2 mb-8 border border-gray-100">
                            <p><span className="text-gray-500 font-bold ml-2">الاسم:</span> <span className="font-bold text-gray-900">{formData.name}</span></p>
                            <p><span className="text-gray-500 font-bold ml-2">الهاتف:</span> <span className="font-bold text-gray-900" dir="ltr">{formData.phone}</span></p>
                            <p><span className="text-gray-500 font-bold ml-2">المستوى:</span> <span className="font-bold text-gray-900">{formData.grade}</span></p>
                        </div>
                        <div className="flex gap-3">
                            <button 
                                onClick={confirmSubmission} 
                                disabled={isSubmitting}
                                className="flex-1 bg-primary text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
                            >
                                {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : 'نعم، تأكيد الطلب'}
                            </button>
                            <button 
                                onClick={() => setShowConfirm(false)} 
                                disabled={isSubmitting}
                                className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all disabled:opacity-70"
                            >
                                تراجع
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

    </div>
  );
};
