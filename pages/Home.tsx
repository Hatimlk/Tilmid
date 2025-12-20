
import React, { useState, useEffect, useMemo } from 'react';
import { MAIN_SERVICES, INSTAGRAM_REELS } from '../constants';
import { IMAGES } from '../constants/images';
import { dataManager } from '../utils/dataManager';
import { BlogPost, SuccessStory, VideoReel } from '../types';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, PlayCircle, Sparkles, Star, Quote, ArrowLeftIcon, Zap, TrendingUp, ExternalLink, Globe, Play, MessageCircle } from 'lucide-react';

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
        <div className="flex items-center gap-4 bg-slate-800/40 backdrop-blur-md px-6 py-5 rounded-[2rem] border border-white/5 flex-1 w-full md:min-w-[240px] group hover:bg-slate-800/60 transition-all duration-300">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-3xl text-white shadow-[0_0_25px_rgba(37,99,235,0.3)] group-hover:scale-110 transition-transform tabular-nums border border-white/10">
                {days}
            </div>
            <div className="text-right">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1">{label}</p>
                <div className="text-base font-black text-white">يوماً متبقياً</div>
                <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] font-bold text-emerald-400">مباشر الآن</span>
                </div>
            </div>
        </div>
    );
};

const VideoCard: React.FC<{ reel: VideoReel }> = ({ reel }) => (
  <div className="group relative flex flex-col items-center w-full">
    <div className="relative w-full max-w-[340px] bg-slate-800 rounded-[3rem] p-3 shadow-2xl ring-1 ring-slate-700 transition-all duration-500 hover:-translate-y-4 hover:shadow-primary/10">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-black aspect-[9/16] w-full">
        <iframe 
          src={`https://www.instagram.com/reel/${reel.reelId}/embed/`} 
          className="w-full h-full border-0 pointer-events-none" 
          allowFullScreen 
          title={reel.title} 
          scrolling="no" 
          loading="lazy"
        ></iframe>
        
        {/* Play Overlay */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all flex items-center justify-center z-20 pointer-events-none">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500">
            <Play size={40} fill="white" className="text-white ml-1" />
          </div>
        </div>

        {/* Bottom Gradient Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 pointer-events-none"></div>
        
        {/* Caption */}
        <div className="absolute bottom-6 inset-x-6 z-20 text-right pointer-events-none">
          <h4 className="text-white font-black text-sm leading-relaxed line-clamp-2 drop-shadow-md">
            {reel.title}
          </h4>
          <div className="flex items-center justify-end gap-3 mt-3 text-blue-300">
             <span className="text-[10px] font-black uppercase tracking-widest">{reel.views} مشاهدة</span>
          </div>
        </div>
      </div>
    </div>
    <a 
      href={reel.url} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="mt-6 text-slate-400 hover:text-primary font-bold text-sm flex items-center gap-2 transition-colors"
    >
      عرض على إنستغرام <ArrowLeftIcon size={14} />
    </a>
  </div>
);

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
      {/* Hero Section - Optimized Stacking for Mobile */}
      <section className="relative pt-24 pb-24 lg:pt-44 lg:pb-40 overflow-hidden bg-white">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-5%] w-[400px] lg:w-[700px] h-[400px] lg:h-[700px] bg-blue-50 rounded-full blur-3xl opacity-60 animate-blob"></div>
          <div className="absolute bottom-[-10%] right-[-5%] w-[400px] lg:w-[600px] h-[400px] lg:h-[600px] bg-indigo-50 rounded-full blur-3xl opacity-60 animate-blob animation-delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            {/* Text Content - Always First on Mobile */}
            <div className="w-full lg:flex-1 text-center lg:text-right space-y-8 animate-fade-in-up">
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
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full sm:w-auto pt-4">
                <Link to="/coaching-offer" className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-lg hover:bg-primary transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3 transform hover:-translate-y-1">
                  ابدأ رحلتك الآن
                  <ArrowLeft size={20} />
                </Link>
                <Link to="/about" className="w-full sm:w-auto px-10 py-5 bg-white text-slate-700 border-2 border-slate-100 rounded-[2rem] font-black text-lg hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2">
                  <PlayCircle size={22} />
                  تعرف علينا
                </Link>
              </div>
            </div>

            {/* Hero Image - Below Text on Mobile */}
            <div className="w-full lg:flex-1 relative max-w-[550px] lg:max-w-none animate-fade-in-up animate-delay-200">
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

      {/* Modern Exam Countdown Banner - Responsive & High Contrast */}
      <section className="relative z-30 -mt-14 lg:-mt-20 px-4">
          <div className="container mx-auto max-w-7xl">
              <div className="bg-[#0f172a] rounded-[3.5rem] md:rounded-[4rem] px-6 py-10 lg:px-12 lg:py-8 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] flex flex-col lg:flex-row items-center gap-8 lg:gap-12 relative overflow-hidden group border border-white/5">
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none"></div>

                <div className="text-center lg:text-right shrink-0 lg:max-w-[250px] space-y-2">
                    <div className="flex items-center justify-center lg:justify-start gap-2 text-[#38bdf8] font-black text-[11px] uppercase tracking-[0.2em]">
                        <Zap size={16} fill="currentColor" className="animate-pulse" />
                        <span>مباشر: عداد الامتحانات</span>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-black text-white leading-tight">يوم الحسم يقترب!</h2>
                    <p className="text-gray-500 text-[11px] font-bold italic opacity-80">استعد جيداً للوطني والجهوي</p>
                </div>

                <div className="flex flex-col md:flex-row gap-5 lg:gap-6 flex-grow w-full">
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

      {/* Services Grid - Interactive Cards */}
      <section id="services" className="py-32 bg-white pt-40 lg:pt-52">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-20 space-y-4">
            <span className="text-primary font-black tracking-widest text-xs uppercase block">بماذا نتميز؟</span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">تلميذ يساعد الطلبة على تحقيق أهدافهم</h2>
            <p className="text-slate-500 font-medium text-lg">نقدم باقة من الخدمات المتكاملة التي تغطي الجانب النفسي، الدراسي والتقني.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {MAIN_SERVICES.map((service, idx) => (
              <div key={idx} className="bg-white p-8 lg:p-12 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,149,255,0.08)] hover:-translate-y-2 transition-all duration-500 flex flex-col md:flex-row items-start gap-8 group">
                <div className="p-6 rounded-[2rem] bg-slate-50 text-primary shadow-sm border border-slate-100 group-hover:bg-primary group-hover:text-white group-hover:scale-110 transition-all shrink-0">
                  <service.icon size={36} />
                </div>
                <div className="text-right">
                  <h3 className="text-2xl font-black mb-4 text-slate-900 group-hover:text-primary transition-colors">{service.title}</h3>
                  <p className="text-slate-600 leading-relaxed font-bold text-lg opacity-80">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media & Reels Section - Visual Video Cards */}
      <section id="media" className="py-32 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,149,255,0.05)_0%,_transparent_70%)]"></div>
        <div className="container mx-auto px-4 lg:px-8 text-center relative z-10">
          <div className="max-w-3xl mx-auto mb-20 space-y-6">
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
                  الأكثر مشاهدة على تلميذ 🔥
              </h2>
              <p className="text-slate-400 text-lg font-bold">جرعات من التحفيز والنصائح الدراسية السريعة</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8 max-w-6xl mx-auto">
            {INSTAGRAM_REELS.map((reel) => (
              <VideoCard key={reel.id} reel={reel} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section - High Button Hierarchy */}
      <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
              <div className="bg-[#0f172a] rounded-[4rem] p-12 lg:p-24 text-center relative overflow-hidden shadow-2xl border border-white/5">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-royal/20 opacity-40"></div>
                  <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"></div>
                  
                  <div className="relative z-10 space-y-10 max-w-4xl mx-auto">
                      <div className="w-24 h-24 bg-primary/20 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl border border-primary/30">
                          <Sparkles size={48} className="text-primary animate-pulse" />
                      </div>
                      <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight">جاهز لتبدأ رحلة النجاح معنا؟</h2>
                      <p className="text-slate-400 text-xl lg:text-2xl font-bold max-w-2xl mx-auto leading-relaxed">احجز استشارتك الأولى اليوم واكتشف كيف يمكننا تغيير مسارك الدراسي للأفضل.</p>
                      
                      <div className="flex flex-col md:flex-row justify-center items-center gap-6 pt-6">
                          {/* Primary Action */}
                          <Link 
                            to="/coaching-offer" 
                            className="w-full md:w-auto px-16 py-6 bg-primary text-white rounded-[2.5rem] font-black text-2xl hover:bg-white hover:text-[#0f172a] transition-all shadow-2xl shadow-primary/30 transform hover:-translate-y-2 active:scale-95"
                          >
                            سجل الآن
                          </Link>
                          
                          {/* Secondary Action */}
                          <a 
                            href="https://wa.me/message/GN4XKUOMHNHGO1" 
                            target="_blank" 
                            rel="noreferrer" 
                            className="w-full md:w-auto px-12 py-6 bg-transparent text-white border-2 border-white/20 hover:border-white hover:bg-white/5 rounded-[2.5rem] font-black text-2xl transition-all flex items-center justify-center gap-4 group active:scale-95"
                          >
                            <MessageCircle size={28} className="group-hover:rotate-12 transition-transform" />
                            تواصل عبر واتساب
                          </a>
                      </div>
                  </div>
              </div>
          </div>
      </section>
    </>
  );
};
