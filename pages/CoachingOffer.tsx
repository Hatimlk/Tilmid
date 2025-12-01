
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
  Check, 
  Star, 
  ArrowDown, 
  ChevronDown 
} from 'lucide-react';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Link } from 'react-router-dom';

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
      text: "متابعة دقيقة لمسارك الدراسي، نحدد معك نقاط الضعف ونعالجها خطوة بخطوة.",
      icon: UserCheck,
      color: "bg-blue-500"
    },
    {
      id: 2,
      title: "تقنيات التعلم السريع",
      text: "تعلم أحدث طرق المراجعة لرفع مستوى التركيز والإنجاز في وقت قياسي.",
      icon: Zap,
      color: "bg-yellow-500"
    },
    {
      id: 3,
      title: "تبسيط المواد المعقدة",
      text: "استراتيجيات حصرية لفهم الرياضيات والفيزياء وتحويلها لنقاط قوة.",
      icon: Brain,
      color: "bg-purple-500"
    },
    {
      id: 4,
      title: "برامج أسبوعية مفصلة",
      text: "خطط مراجعة مخصصة تضمن لك تغطية جميع الدروس بإنتاجية عالية.",
      icon: Calendar,
      color: "bg-green-500"
    },
    {
      id: 5,
      title: "مجتمع الدعم الخاص",
      text: "مجموعة واتساب حصرية لطرح الأسئلة والحصول على حلول فورية.",
      icon: MessageCircle,
      color: "bg-pink-500"
    },
    {
      id: 6,
      title: "تحديات ومنافسة",
      text: "بيئة تنافسية إيجابية تحفزك على زيادة ساعات المراجعة والالتزام.",
      icon: Trophy,
      color: "bg-orange-500"
    },
    {
      id: 7,
      title: "بنك المصادر الحصري",
      text: "مجموعة خاصة لتبادل التلخيصات المركزة والتمارين المختارة.",
      icon: Users,
      color: "bg-indigo-500"
    },
    {
      id: 8,
      title: "مكتبة رقمية شاملة",
      text: "ولوج مباشر لأفضل الدروس المشروحة والامتحانات الوطنية السابقة.",
      icon: Globe,
      color: "bg-cyan-500"
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
    <div className="min-h-screen bg-gray-50 pb-20 overflow-x-hidden font-sans w-full max-w-full">
      
      {/* Hidden PDF Template - Positioned vertically off-screen to avoid horizontal scroll */}
      <div style={{ position: 'fixed', top: '-9999px', left: 0, zIndex: -100 }}>
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

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 bg-slate-900 text-white overflow-hidden rounded-b-[2.5rem] lg:rounded-b-[4rem] shadow-2xl">
         {/* Background Effects */}
         <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-blob"></div>
            <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
         </div>

         <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
             <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-yellow-300 font-bold text-sm mb-8 animate-fade-in-up">
                <Sparkles size={16} fill="currentColor" />
                <span>عرض محدود للمتميزين</span>
             </div>

             <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-8 tracking-tight leading-tight animate-fade-in-up animate-delay-100">
               استثمر في مستقبلك مع <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">المواكبة الشخصية</span>
             </h1>

             <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animate-delay-200 mb-10">
               هل تعاني من التشتت؟ هل تبذل مجهوداً كبيراً دون نتائج مرضية؟ <br className="hidden md:block"/>
               انضم لبرنامجنا الحصري واكتشف الطريق المختصر نحو التفوق الدراسي.
             </p>

             <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animate-delay-300">
                 <button 
                   onClick={() => document.getElementById('registration-card')?.scrollIntoView({ behavior: 'smooth' })}
                   className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-full font-bold text-lg hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/30 hover:-translate-y-1 flex items-center justify-center gap-2"
                 >
                   <span>سجل الآن</span>
                   <ArrowDown size={20} />
                 </button>
                 
                 <button 
                   onClick={handleDownloadPDF}
                   disabled={isGenerating}
                   className="w-full sm:w-auto px-8 py-4 bg-white/10 text-white border border-white/20 rounded-full font-bold text-lg hover:bg-white hover:text-slate-900 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
                 >
                   {isGenerating ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
                   <span>تحميل الدليل (PDF)</span>
                 </button>
             </div>
         </div>
      </section>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 lg:px-8 -mt-20 relative z-20 space-y-20">

        {/* 1. Registration Card + Benefits Summary */}
        <div id="registration-card" className="grid grid-cols-1 lg:grid-cols-5 gap-8 animate-fade-in-up animate-delay-300">
            
            {/* Form Section */}
            <div className="lg:col-span-3 bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden relative">
                 {isSuccess ? (
                    <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-gradient-to-b from-white to-green-50">
                        <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6 animate-bounce-slow">
                            <CheckCircle size={48} />
                        </div>
                        <h3 className="text-3xl font-extrabold text-gray-900 mb-4">تم التسجيل بنجاح! 🎉</h3>
                        <p className="text-gray-600 text-lg mb-8 max-w-lg mx-auto leading-relaxed">
                            شكراً لثقتك بنا يا <span className="font-bold text-gray-900">{formData.name}</span>. 
                            سيتواصل معك فريقنا عبر الواتساب قريباً لتأكيد انضمامك.
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
                        <div className="bg-gradient-to-r from-primary to-royal p-8 text-white relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                            <div className="relative z-10 flex justify-between items-start">
                                <div>
                                    <h3 className="text-2xl font-bold mb-1">احجز مقعدك الآن</h3>
                                    <p className="text-blue-100 opacity-90">الأماكن محدودة جداً لهذا الموسم</p>
                                </div>
                                <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold border border-white/20">
                                    خصم خاص %20
                                </div>
                            </div>
                        </div>

                        <div className="p-8 lg:p-10">
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">الاسم الكامل</label>
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full pl-4 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-gray-900" 
                                            placeholder="أدخل اسمك الكامل" 
                                            required
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                            <UserCheck size={20} />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">رقم الواتساب</label>
                                        <div className="relative">
                                            <input 
                                                type="tel" 
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full pl-4 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-gray-900 font-mono text-left" 
                                                placeholder="06 00 00 00 00" 
                                                dir="ltr" 
                                                required
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                                <MessageCircle size={20} />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">المستوى الدراسي</label>
                                        <div className="relative">
                                            <select 
                                                name="grade"
                                                value={formData.grade}
                                                onChange={handleInputChange}
                                                className="w-full pl-4 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-gray-900 appearance-none cursor-pointer"
                                            >
                                                <option>2 باكالوريا</option>
                                                <option>1 باكالوريا</option>
                                                <option>جذع مشترك</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                                <GraduationCap size={20} />
                                            </div>
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                                <ChevronDown size={16} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-primary transition-all shadow-lg hover:shadow-blue-500/20 flex items-center justify-center gap-3 group text-lg mt-4">
                                    <span>تأكيد التسجيل</span>
                                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                                </button>
                            </form>
                            
                            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-gray-400">
                                <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-green-500"/> بيانات محمية 100%</span>
                                <span className="flex items-center gap-1"><Clock size={14} className="text-orange-500"/> رد سريع خلال 24 ساعة</span>
                            </div>
                        </div>
                    </>
                 )}
            </div>

            {/* Side Info */}
            <div className="lg:col-span-2 space-y-6">
                 {/* WhatsApp Card */}
                 <div className="bg-[#25D366]/10 p-8 rounded-[2.5rem] border border-[#25D366]/20 text-center">
                     <div className="w-16 h-16 bg-[#25D366] text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/20">
                         <MessageCircle size={32} />
                     </div>
                     <h3 className="font-bold text-xl text-gray-900 mb-2">تفضل التواصل المباشر؟</h3>
                     <p className="text-gray-600 text-sm mb-6">فريقنا جاهز للإجابة على جميع استفساراتك عبر الواتساب.</p>
                     <a href="https://wa.me/message/GN4XKUOMHNHGO1" target="_blank" rel="noreferrer" className="block w-full py-3 bg-white border border-[#25D366]/30 text-[#25D366] font-bold rounded-xl hover:bg-[#25D366] hover:text-white transition-all">
                         تحدث معنا الآن
                     </a>
                 </div>

                 {/* Trust Badges */}
                 <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                     <h4 className="font-bold text-gray-900 mb-6 text-center">لماذا يختارنا الطلاب؟</h4>
                     <ul className="space-y-4">
                         <li className="flex items-center gap-3 text-sm font-medium text-gray-600">
                             <div className="p-1.5 bg-blue-50 text-blue-600 rounded-full"><Check size={14} /></div>
                             <span>مواكبة شاملة (نفسية، دراسية، تقنية)</span>
                         </li>
                         <li className="flex items-center gap-3 text-sm font-medium text-gray-600">
                             <div className="p-1.5 bg-blue-50 text-blue-600 rounded-full"><Check size={14} /></div>
                             <span>نتائج مثبتة (+95% نسبة نجاح)</span>
                         </li>
                         <li className="flex items-center gap-3 text-sm font-medium text-gray-600">
                             <div className="p-1.5 bg-blue-50 text-blue-600 rounded-full"><Check size={14} /></div>
                             <span>خبرة تزيد عن 10 سنوات</span>
                         </li>
                         <li className="flex items-center gap-3 text-sm font-medium text-gray-600">
                             <div className="p-1.5 bg-blue-50 text-blue-600 rounded-full"><Check size={14} /></div>
                             <span>أسعار تناسب الجميع</span>
                         </li>
                     </ul>
                 </div>
            </div>
        </div>

        {/* 2. Features Grid */}
        <div className="max-w-6xl mx-auto">
             <div className="text-center mb-16">
                 <h2 className="text-3xl font-bold text-gray-900 mb-4">ماذا ستستفيد من العرض؟</h2>
                 <p className="text-gray-500 max-w-2xl mx-auto">
                    باقة متكاملة من الخدمات صممت خصيصاً لتغطية كل احتياجاتك الدراسية.
                 </p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {features.map((feature) => (
                     <div key={feature.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                         <div className={`w-14 h-14 ${feature.color} text-white rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform`}>
                             <feature.icon size={28} />
                         </div>
                         <h3 className="font-bold text-lg text-gray-900 mb-3">{feature.title}</h3>
                         <p className="text-gray-500 text-sm leading-relaxed">{feature.text}</p>
                     </div>
                 ))}
             </div>
        </div>

        {/* 3. Gift Section */}
        <div className="max-w-4xl mx-auto transform hover:scale-[1.02] transition-transform duration-500">
            <div className="relative bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-[3rem] p-8 md:p-12 text-center shadow-lg overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-200 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-200 rounded-full blur-3xl opacity-50"></div>
                
                <div className="relative z-10">
                    <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto mb-6 text-yellow-500 animate-bounce-slow ring-4 ring-white/50">
                        <Gift size={40} />
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-snug">
                    هدية حصرية <span className="text-yellow-600 underline decoration-wavy decoration-yellow-300">مجانية</span>
                    </h2>
                    <p className="text-xl text-gray-700 font-medium mb-8 max-w-2xl mx-auto">
                    عند اشتراكك اليوم، ستحصل مجاناً على <strong>دورة التوجيه الجامعي</strong> لتخطيط مسارك ما بعد الباكالوريا.
                    </p>
                    
                    <div className="inline-flex items-center gap-2 px-6 py-2 bg-white rounded-full shadow-sm border border-yellow-100 text-sm font-bold text-yellow-700">
                        <Sparkles size={16} fill="currentColor" />
                        <span>عرض لفترة محدودة</span>
                    </div>
                </div>
            </div>
        </div>

        {/* 4. Testimonials */}
        <div className="max-w-5xl mx-auto pb-12">
            <div className="flex flex-col items-center text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900">قصص نجاح حقيقية</h2>
                <p className="text-gray-500 mt-2">انضم لمئات الطلاب الذين حققوا أهدافهم معنا</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white p-8 rounded-[2rem] border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative group">
                        <div className="absolute top-6 left-6 text-gray-100 group-hover:text-primary/10 transition-colors">
                            <Quote size={40} />
                        </div>
                        <div className="relative z-10">
                            <div className="flex gap-1 mb-4 text-yellow-400">
                                {[1,2,3,4,5].map(star => <Star key={star} size={16} fill="currentColor" />)}
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed mb-6 font-medium min-h-[80px]">
                                {i === 1 ? '" ساعدني البرنامج بزاف باش ننظم وقتي ونعرف كيفاش نراجع المواد العلمية. شكراً أستاذ ياسين على الدعم المستمر. "' :
                                 i === 2 ? '" كنت ضايع وماعارفش منين نبدا، ولكن بفضل التوجيه ديالكم قدرت نرجع الثقة فراسي ونجيب نقط ممتازة. "' :
                                 '" التجربة كانت رائعة بكل المقاييس. استفدت بزاف من تقنيات الحفظ والمراجعة اللي ماكنتش عارفها من قبل. "'}
                            </p>
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md ${i===1 ? 'bg-blue-500' : i===2 ? 'bg-purple-500' : 'bg-orange-500'}`}>
                                    {i === 1 ? 'A' : i === 2 ? 'K' : 'S'}
                                </div>
                                <div>
                                    <span className="block font-bold text-gray-900 text-sm">{i===1 ? 'أمين' : i===2 ? 'كوثر' : 'سارة'}</span>
                                    <span className="text-xs text-gray-500">مشترك سابق</span>
                                </div>
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
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="text-xl font-bold text-gray-900">تأكيد التسجيل</h3>
                    <button onClick={() => setShowConfirm(false)} className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-200 rounded-full">
                        <X size={24} />
                    </button>
                </div>
                <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-yellow-50">
                        <AlertTriangle size={32} />
                    </div>
                    <p className="text-gray-600 mb-8 font-medium leading-relaxed">
                        هل أنت متأكد من صحة المعلومات المدخلة؟ <br/> سيتم إرسال طلبك للمعالجة فوراً.
                    </p>
                    <div className="bg-blue-50/50 p-4 rounded-2xl text-right text-sm space-y-3 mb-8 border border-blue-100">
                        <div className="flex justify-between border-b border-blue-100 pb-2">
                             <span className="text-gray-500">الاسم</span>
                             <span className="font-bold text-gray-900">{formData.name}</span>
                        </div>
                        <div className="flex justify-between border-b border-blue-100 pb-2">
                             <span className="text-gray-500">الهاتف</span>
                             <span className="font-bold text-gray-900 font-mono" dir="ltr">{formData.phone}</span>
                        </div>
                        <div className="flex justify-between">
                             <span className="text-gray-500">المستوى</span>
                             <span className="font-bold text-gray-900">{formData.grade}</span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={confirmSubmission} 
                            disabled={isSubmitting}
                            className="flex-1 bg-primary text-white py-3.5 rounded-xl font-bold hover:bg-blue-600 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait shadow-lg shadow-blue-500/20"
                        >
                            {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : 'نعم، تأكيد الطلب'}
                        </button>
                        <button 
                            onClick={() => setShowConfirm(false)} 
                            disabled={isSubmitting}
                            className="flex-1 bg-gray-100 text-gray-600 py-3.5 rounded-xl font-bold hover:bg-gray-200 transition-all disabled:opacity-70"
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
