
import React, { useState, useEffect, useMemo } from 'react';
import { MAIN_SERVICES, INSTAGRAM_REELS } from '../constants';
import { IMAGES } from '../constants/images';
import { dataManager } from '../utils/dataManager';
import { BlogPost, SuccessStory } from '../types';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, PlayCircle, Sparkles, Star, Quote, ArrowLeftIcon, Zap, TrendingUp, ExternalLink, Globe } from 'lucide-react';

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
                <div className="text-sm font-black text-white mb-1">يوماً متبقياً</div>
                <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-[10px] font-bold text-green-400">مباشر الآن</span>
                </div>
            </div>
        </div>
    );
};

export const Home: React.FC = () => {
  const [successStories, setSuccessStories] = useState<SuccessStory[]>([]);

  useEffect(() => {
    setSuccessStories(dataManager.getStories());
  }, []);

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

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-24 pb-24 lg:pt-44 lg:pb-40 overflow-hidden bg-white">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-5%] w-[400px] lg:w-[700px] h-[400px] lg:h-[700px] bg-blue-50 rounded-full blur-3xl opacity-60 animate-blob"></div>
          <div className="absolute bottom-[-10%] right-[-5%] w-[400px] lg:w-[600px] h-[400px] lg:h-[600px] bg-indigo-50 rounded-full blur-3xl opacity-60 animate-blob animation-delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            <div className="flex-1 text-center lg:text-right space-y-8 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-blue-50 rounded-full text-primary font-bold text-xs lg:text-sm shadow-sm border border-blue-100 mx-auto lg:mx-0">
                <Sparkles size={16} className="text-yellow-500" />
                <span>المنصة رقم #1 للتوجيه والمواكبة في المغرب</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black leading-[1.15] text-slate-900 tracking-tight">
                تلميـذ رفيقك <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-600 to-royal">
                  نحو قمة التفوق الدراسي
                </span>
              </h1>
              
              <p className="text-base lg:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed">
                اكتشف منهجيات التعلم الحديثة، احصل على توجيه مدرسي دقيق، وانضم لآلاف التلاميذ الذين حققوا أحلامهم الدراسية معنا.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full sm:w-auto">
                <Link to="/coaching-offer" className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-bold text-lg hover:bg-primary transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3 transform hover:-translate-y-1">
                  ابدأ رحلتك الآن
                  <ArrowLeft size={20} />
                </Link>
                <Link to="/about" className="w-full sm:w-auto px-10 py-5 bg-white text-slate-700 border-2 border-slate-100 rounded-[2rem] font-bold text-lg hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2">
                  <PlayCircle size={22} />
                  تعرف علينا
                </Link>
              </div>
            </div>

            <div className="flex-1 relative w-full max-w-[550px] lg:max-w-none animate-fade-in-up animate-delay-200">
              <div className="relative z-10 group">
                <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-royal/20 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-white p-3 rounded-[3.5rem] shadow-2xl border border-slate-100 transform hover:rotate-1 transition-transform duration-500">
                    <img src={IMAGES.HERO.HOME_MAIN} alt="Student Achievement Tilmid" className="rounded-[3rem] w-full object-cover h-[350px] sm:h-[500px] lg:h-[600px]" loading="eager" />
                    <div className="absolute -bottom-6 -right-6 bg-white p-5 rounded-3xl shadow-2xl border border-slate-50 animate-float hidden md:flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center"><TrendingUp size={24}/></div>
                        <div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase">معدل النجاح</div>
                            <div className="text-xl font-black text-slate-900">+98% سنوياً</div>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Exam Countdown Banner */}
      <section className="relative z-30 -mt-14 lg:-mt-20 px-4">
          <div className="container mx-auto max-w-7xl">
              <div className="bg-[#0f172a] rounded-[4rem] px-8 py-6 lg:px-12 lg:py-8 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] flex flex-col lg:flex-row items-center gap-8 lg:gap-12 relative overflow-hidden group border border-white/5">
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none"></div>

                <div className="text-right shrink-0 lg:max-w-[250px]">
                    <div className="flex items-center justify-center lg:justify-start gap-2 text-[#38bdf8] font-black text-[11px] uppercase tracking-widest mb-2">
                        <Zap size={16} fill="currentColor" className="animate-pulse" />
                        <span>مباشر: عداد الامتحانات</span>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-black text-white leading-tight">يوم الحسم يقترب!</h2>
                    <p className="text-gray-500 text-[11px] mt-1.5 font-bold italic opacity-80 leading-relaxed">استعد جيداً للوطني والجهوي</p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 lg:gap-6 flex-grow w-full">
                    <DayCard date={nationalDate} label="الوطني (2 باك)" />
                    <DayCard date={regionalDate} label="الجهوي (1 باك)" />
                </div>

                <Link to="/bac-simulator" className="bg-white text-[#0f172a] px-10 py-5 rounded-[2.5rem] font-black text-lg flex items-center gap-3 hover:bg-primary hover:text-white transition-all shadow-xl hover:shadow-primary/20 shrink-0 group/btn transform active:scale-95 w-full lg:w-auto justify-center">
                    <span>احسب معدلك</span>
                    <ArrowLeftIcon size={22} className="group-hover:-translate-x-1 transition-transform" />
                </Link>
              </div>
          </div>
      </section>

      {/* Main Services Grid */}
      <section id="services" className="py-32 bg-white pt-40 lg:pt-52">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-20 space-y-4">
            <span className="text-primary font-black tracking-widest text-xs uppercase block">بماذا نتميز؟</span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">تلميذ يساعد الطلبة على تحقيق أهدافهم</h2>
            <p className="text-slate-500 font-medium text-lg">نقدم باقة من الخدمات المتكاملة التي تغطي الجانب النفسي، الدراسي والتقني.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {MAIN_SERVICES.map((service, idx) => (
              <div key={idx} className="bg-slate-50/50 p-8 lg:p-10 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 flex flex-col md:flex-row items-start gap-8 group hover:-translate-y-1">
                <div className="p-5 rounded-2xl bg-white text-primary shadow-sm border border-slate-100 group-hover:bg-primary group-hover:text-white group-hover:scale-110 transition-all shrink-0">
                  <service.icon size={36} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-slate-900 group-hover:text-primary transition-colors">{service.title}</h3>
                  <p className="text-slate-600 leading-relaxed font-medium text-lg">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-24 overflow-hidden bg-slate-50 relative">
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="flex-1 order-2 lg:order-1 animate-fade-in-up w-full space-y-8">
               <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-50 rounded-full text-pink-600 font-bold text-sm border border-pink-100">
                  <Users size={18} />
                  <span>قصة نجاحكم تبدأ هنا</span>
               </div>
               
               <h2 className="text-4xl lg:text-6xl font-black text-slate-900 leading-[1.1]">
                 شريكك الموثوق في <br/>
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-royal">رحلة التميز الدراسي</span>
               </h2>
               
               <p className="text-slate-600 text-lg lg:text-xl leading-relaxed font-medium">
                 بقيادة <span className="text-slate-900 font-bold underline decoration-primary decoration-4 underline-offset-4">الأستاذ ياسين</span>، نقدم تجربة توجيهية فريدة تدمج بين الدعم النفسي، التفوق الأكاديمي، والتخطيط الاستراتيجي للمستقبل.
               </p>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex items-center gap-4 p-6 rounded-3xl bg-white shadow-sm border border-slate-100 hover:shadow-md transition-all group">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                        <Users size={28} />
                    </div>
                    <div>
                        <span className="block font-black text-slate-900 text-2xl">+3500</span>
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wide">تلميذ مستفيد</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-6 rounded-3xl bg-white shadow-sm border border-slate-100 hover:shadow-md transition-all group">
                    <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all">
                        <Star size={28} fill="currentColor" />
                    </div>
                     <div>
                        <span className="block font-black text-slate-900 text-2xl">+10 سنوات</span>
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wide">خبرة تعليمية</span>
                    </div>
                  </div>
               </div>

               <div className="pt-4">
                 <Link to="/about" className="inline-flex items-center justify-center gap-3 px-10 py-4 bg-slate-900 text-white rounded-[2rem] font-bold text-lg hover:bg-primary transition-all shadow-xl hover:shadow-blue-500/20 group transform hover:-translate-y-1">
                    <span>اقرأ قصتنا كاملة</span>
                    <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
                 </Link>
               </div>
            </div>

            <div className="flex-1 order-1 lg:order-2 relative w-full max-w-[550px] mx-auto">
               <div className="relative z-10 group">
                 <div className="absolute -inset-1 bg-gradient-to-tr from-primary to-royal rounded-[3.5rem] opacity-20 blur-xl group-hover:opacity-40 transition-opacity"></div>
                 <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-[8px] border-white ring-1 ring-slate-100">
                     <img src={IMAGES.ABOUT.FOUNDER} alt="الأستاذ ياسين مؤسس تلميذ" className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700" loading="lazy" />
                 </div>
                 <div className="absolute bottom-8 -right-4 lg:-right-8 bg-white p-5 rounded-3xl shadow-2xl flex items-center gap-4 border border-slate-50 animate-float">
                    <div className="bg-blue-600 text-white p-3 rounded-2xl"><Star size={24} /></div>
                    <div>
                       <span className="block text-2xl font-black text-slate-900 leading-none mb-1" dir="ltr">+90K</span>
                       <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">متابع حقيقي</span>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Internal & External Links Section for SEO */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp size={24} className="text-primary" /> روابط تعليمية هامة
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <li><Link to="/blog?category=توجيه" className="text-slate-600 hover:text-primary flex items-center gap-2 font-medium"><ArrowLeft size={14} /> مقالات التوجيه المدرسي</Link></li>
                <li><Link to="/blog?category=تقنيات" className="text-slate-600 hover:text-primary flex items-center gap-2 font-medium"><ArrowLeft size={14} /> طرق الحفظ السريع</Link></li>
                <li><Link to="/bac-simulator" className="text-slate-600 hover:text-primary flex items-center gap-2 font-medium"><ArrowLeft size={14} /> حساب نقاط البكالوريا</Link></li>
                <li><Link to="/program/tilmid" className="text-slate-600 hover:text-primary flex items-center gap-2 font-medium"><ArrowLeft size={14} /> برنامج تلميذ للنجاح</Link></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Globe size={24} className="text-royal" /> مصادر خارجية موثوقة
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <li><a href="https://massarservice.men.gov.ma/" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-primary flex items-center gap-2 font-medium"><ExternalLink size={14} /> فضاء متمدرس (مسار)</a></li>
                <li><a href="https://www.tawjihi.ma" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-primary flex items-center gap-2 font-medium"><ExternalLink size={14} /> منصة توجيهي الرسمية</a></li>
                <li><a href="https://www.men.gov.ma" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-primary flex items-center gap-2 font-medium"><ExternalLink size={14} /> وزارة التربية الوطنية</a></li>
                <li><a href="https://www.cursussup.gov.ma" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-primary flex items-center gap-2 font-medium"><ExternalLink size={14} /> التعليم العالي بالمغرب</a></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Media & Reels Section */}
      <section id="media" className="py-32 bg-slate-900 relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8 text-center relative z-10">
          <div className="max-w-3xl mx-auto mb-20 space-y-6">
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
                  الأكثر مشاهدة على تلميذ 🔥
              </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {INSTAGRAM_REELS.map((reel, idx) => (
              <div key={reel.id} className="group relative flex flex-col items-center">
                 <div className="relative w-full max-w-[320px] bg-slate-800 rounded-[3rem] p-3 shadow-2xl ring-1 ring-slate-700 transform transition-all duration-500 hover:-translate-y-4">
                     <div className="relative overflow-hidden rounded-[2.5rem] bg-black aspect-[9/16] w-full">
                        <iframe src={`https://www.instagram.com/reel/${reel.reelId}/embed/`} className="w-full h-full border-0" allowFullScreen title={reel.title} scrolling="no" loading="lazy"></iframe>
                     </div>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900">تلاميذنا هم فخرنا الحقيقي</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story) => (
              <div key={story.id} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
                 <div className="absolute -top-6 -left-6 text-slate-50 group-hover:text-blue-50 transition-colors pointer-events-none transform -rotate-12"><Quote size={120} fill="currentColor" /></div>
                 <div className="relative z-10">
                   <div className="flex items-center gap-5 mb-8">
                      <div className="w-16 h-16 rounded-2xl p-0.5 bg-gradient-to-br from-primary to-royal shadow-lg">
                         <img src={story.image} alt={story.name} className="w-full h-full object-cover rounded-[0.9rem] border-2 border-white" loading="lazy" />
                      </div>
                      <div>
                         <h3 className="font-black text-xl text-slate-900">{story.name}</h3>
                         <span className="text-xs text-primary font-bold tracking-wide uppercase">{story.role}</span>
                      </div>
                   </div>
                   <p className="text-slate-600 leading-relaxed font-medium text-lg italic">"{story.content}"</p>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern CTA Footer */}
      <section className="py-20">
          <div className="container mx-auto px-4">
              <div className="bg-slate-900 rounded-[3.5rem] p-10 lg:p-20 text-center relative overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-royal/20 opacity-40"></div>
                  
                  <div className="relative z-10 space-y-8 max-w-4xl mx-auto">
                      <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight">جاهز لتبدأ رحلة النجاح معنا؟</h2>
                      <p className="text-slate-300 text-lg lg:text-xl font-medium max-w-2xl mx-auto">احجز استشارتك الأولى اليوم واكتشف كيف يمكننا تغيير مسارك الدراسي للأفضل.</p>
                      <div className="flex flex-col sm:flex-row justify-center gap-5 pt-4">
                          <Link to="/coaching-offer" className="px-12 py-5 bg-primary text-white rounded-[2rem] font-black text-xl hover:bg-white hover:text-slate-900 transition-all shadow-2xl shadow-primary/30 transform hover:-translate-y-1">سجل الآن</Link>
                          <a href="https://wa.me/message/GN4XKUOMHNHGO1" target="_blank" rel="noreferrer" className="px-12 py-5 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-[2rem] font-black text-xl hover:bg-white hover:text-slate-900 transition-all">تواصل عبر واتساب</a>
                      </div>
                  </div>
              </div>
          </div>
      </section>
    </>
  );
};