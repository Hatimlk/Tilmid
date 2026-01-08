
import React, { useState, useEffect, useMemo } from 'react';
import { MAIN_SERVICES, INSTAGRAM_REELS, TAWJIH_DATA, TILMID_DATA, TALIB_DATA } from '../constants';
import { IMAGES } from '../constants/images';
import { dataManager } from '../utils/dataManager';
import { BlogPost, SuccessStory, VideoReel } from '../types';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, PlayCircle, Sparkles, Star, Quote, ArrowLeftIcon, Zap, TrendingUp, ExternalLink, Globe, Play, MessageCircle, Compass, BookOpen, GraduationCap, ArrowUp } from 'lucide-react';

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
    <div className="relative overflow-hidden flex items-center gap-5 bg-slate-800/40 backdrop-blur-md px-6 py-5 rounded-[2.5rem] border border-white/10 flex-1 w-full md:min-w-[240px] group hover:bg-slate-800/60 transition-all duration-300 ring-1 ring-white/5 hover:ring-white/20">
      {/* Background Glow */}
      <div className="absolute -left-10 -top-10 w-32 h-32 bg-blue-500/10 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity"></div>

      <div className="relative w-18 h-18 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-3xl text-white shadow-[0_0_30px_rgba(37,99,235,0.4)] group-hover:scale-110 transition-transform tabular-nums border border-blue-400/30">
        {days}
      </div>
      <div className="text-right flex-1 select-none">
        <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1">{label}</p>
        <div className="text-lg font-black text-white">يوماً متبقياً</div>
        <div className="flex items-center justify-between mt-1.5 ">
          <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
            <div className="flex gap-0.5">
              <span className="w-1 h-3 bg-emerald-500/80 rounded-full animate-pulse"></span>
              <span className="w-1 h-2 bg-emerald-500/60 rounded-full"></span>
              <span className="w-1 h-1.5 bg-emerald-500/40 rounded-full"></span>
            </div>
            <span className="text-[10px] font-bold text-emerald-400">العداد شغال</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-x-2 group-hover:translate-x-0">
            {date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
          </span>
        </div>
      </div>
    </div>
  );
};

const VideoCard: React.FC<{ reel: VideoReel }> = ({ reel }) => (
  <div className="group relative flex flex-col items-center w-full">
    {/* Gradient Border Container */}
    <div className="relative w-full max-w-[340px] p-[2px] rounded-[3rem] bg-gradient-to-b from-white/20 via-white/5 to-white/10 group-hover:from-primary/60 group-hover:via-blue-500/30 group-hover:to-primary/60 transition-all duration-500 shadow-xl group-hover:shadow-primary/20 group-hover:-translate-y-4">
      {/* Glassmorphic Card Content */}
      <div className="relative bg-slate-900/60 backdrop-blur-xl rounded-[2.9rem] p-3 h-full mix-blend-normal">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-black aspect-[9/16] w-full shadow-inner ring-1 ring-white/10">
          <iframe
            src={`https://www.instagram.com/reel/${reel.reelId}/embed/`}
            className="w-full h-full border-0"
            allowFullScreen
            title={reel.title}
            scrolling="no"
            loading="lazy"
          ></iframe>

          {/* Play Overlay - Visible on Hover (Click-through enabled) */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-all duration-500 flex items-center justify-center z-20 pointer-events-none">
            <div className="w-20 h-20 relative flex items-center justify-center">
              {/* Pulse Effect */}
              <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-0 group-hover:opacity-100 duration-1000"></div>
              {/* Button */}
              <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 shadow-[0_0_30px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform duration-500">
                <Play size={36} fill="white" className="text-white ml-2 opacity-90" />
              </div>
            </div>
          </div>

          {/* Bottom Gradient Overlay */}
          <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/95 via-black/60 to-transparent z-10 pointer-events-none"></div>

          {/* Caption */}
          <div className="absolute bottom-6 inset-x-6 z-20 text-right pointer-events-none">
            <div className="flex items-center justify-end gap-2 mb-2">
              <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold text-white border border-white/10 flex items-center gap-1.5 direction-rtl">
                <Globe size={10} className="text-blue-400" />
                ريلز
              </span>
            </div>
            <h4 className="text-white font-black text-sm leading-relaxed line-clamp-2 drop-shadow-md pb-2" dir="rtl">
              {reel.title}
            </h4>
            <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/10">
              <span className="text-[10px] font-black text-blue-300 uppercase tracking-widest flex items-center gap-1">
                {reel.views} مشاهدة
              </span>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <a
      href={reel.url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-6 group/link flex items-center gap-3 px-6 py-3 rounded-full bg-slate-800/50 border border-slate-700 hover:border-primary/50 hover:bg-slate-800 transition-all duration-300"
    >
      <span className="text-slate-300 font-bold text-sm group-hover/link:text-white transition-colors">مشاهدة على إنستغرام</span>
      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-orange-500 flex items-center justify-center text-white scale-90 group-hover/link:scale-110 transition-transform">
        <ArrowLeftIcon size={14} />
      </div>
    </a>
  </div>
);

const ProgramCard: React.FC<{ data: any; icon: any; color: string; link: string }> = ({ data, icon: Icon, color, link }) => (
  <Link to={link} className="group relative bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/50 shadow-lg hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-3 overflow-hidden flex flex-col h-full ring-1 ring-slate-100">
    {/* Animated Gradient Background on Hover */}
    <div className={`absolute inset-0 bg-gradient-to-br from-white via-white to-${color.split('-')[1]}-50 opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>

    {/* Decorative Blob */}
    <div className={`absolute -top-10 -right-10 w-40 h-40 ${color} opacity-10 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700`}></div>

    <div className="relative z-10">
      <div className={`w-18 h-18 ${color.replace('bg-', 'bg-')}/10 text-${color.split('-')[1]}-${color.split('-')[2] || '600'} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-sm border border-${color.split('-')[1]}-100`}>
        <Icon size={36} className={`${color.replace('bg-', 'text-')} drop-shadow-sm`} />
      </div>

      <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight group-hover:text-primary transition-colors">{data.title}</h3>
      <p className="text-slate-500 font-bold text-sm leading-relaxed mb-8 line-clamp-3 opacity-90">{data.subtitle}</p>

      <div className="flex items-center gap-2 text-sm font-black text-slate-900 group-hover:text-primary group-hover:gap-4 transition-all mt-auto pt-6 border-t border-slate-100/50">
        <span>اكتشف البرنامج</span>
        <ArrowLeftIcon size={18} className="transform group-hover:-translate-x-1 transition-transform" />
      </div>
    </div>
  </Link>
);

export const Home: React.FC = () => {
  const [successStories, setSuccessStories] = useState<SuccessStory[]>([]);

  useEffect(() => {
    setSuccessStories(dataManager.getStories());
    setSuccessStories(dataManager.getStories());
  }, []);

  const [showScroll, setShowScroll] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;

      setScrollProgress(Number(scroll));

      if (totalScroll > 100) {
        setShowScroll(true);
      } else {
        setShowScroll(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
  const regionalDate = useMemo(() => getExamDate(5, 15), []);

  return (
    <>
      {/* Hero Section - Optimized Stacking for Mobile */}
      <section className="relative pt-24 pb-32 lg:pt-48 lg:pb-48 overflow-hidden bg-[#f8fafc]">
        {/* Global Grain Overlay */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100] mix-blend-overlay">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" /></filter>
            <rect width="100%" height="100%" filter="url(#noiseFilter)" />
          </svg>
        </div>

        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-5%] w-[400px] lg:w-[800px] h-[400px] lg:h-[800px] bg-blue-100/50 rounded-full blur-[100px] opacity-60 animate-blob mix-blend-multiply"></div>
          <div className="absolute bottom-[10%] right-[-5%] w-[400px] lg:w-[600px] h-[400px] lg:h-[600px] bg-indigo-100/50 rounded-full blur-[100px] opacity-60 animate-blob animation-delay-2000 mix-blend-multiply"></div>
          <div className="absolute top-[20%] right-[20%] w-[300px] h-[300px] bg-purple-100/40 rounded-full blur-[80px] opacity-50 animate-blob animation-delay-4000 mix-blend-multiply"></div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            {/* Text Content */}
            <div className="w-full lg:flex-1 text-center lg:text-right space-y-8 animate-fade-in-up">
              <div className="inline-flex items-center gap-2.5 px-6 py-2.5 bg-white/60 backdrop-blur-md rounded-full text-primary font-bold text-xs lg:text-sm shadow-sm border border-white/60 mx-auto lg:mx-0 ring-1 ring-blue-50">
                <Sparkles size={16} className="text-yellow-500 fill-yellow-500 animate-pulse" />
                <span className="tracking-wide">المنصة رقم #1 للتوجيه والمواكبة في المغرب</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-[5.5rem] font-black leading-[1.1] text-slate-900 tracking-tight lg:-mr-1">
                تلميـذ رفيقك <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-600 to-indigo-600 drop-shadow-sm">
                  نحو قمة التفوق
                </span>
                <span className="block text-3xl sm:text-5xl lg:text-6xl mt-2 text-slate-400 font-extrabold tracking-tight">الدراسي والمهني</span>
              </h1>

              <p className="text-base lg:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed opacity-90">
                اكتشف منهجيات التعلم الحديثة، احصل على توجيه مدرسي دقيق، وانضم لآلاف التلاميذ الذين حققوا أحلامهم الدراسية معنا.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5 w-full sm:w-auto pt-6">
                <Link to="/coaching-offer" className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-lg hover:bg-primary transition-all duration-300 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.3)] hover:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.4)] flex items-center justify-center gap-3 transform hover:-translate-y-1 ring-4 ring-transparent hover:ring-blue-100 group">
                  ابدأ رحلتك الآن
                  <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                </Link>
                <Link to="/about" className="w-full sm:w-auto px-10 py-5 bg-white text-slate-700 border border-slate-200 rounded-[2rem] font-black text-lg hover:border-primary/30 hover:text-primary hover:bg-blue-50/30 transition-all duration-300 flex items-center justify-center gap-3 shadow-sm hover:shadow-md transform hover:-translate-y-1">
                  <PlayCircle size={22} className="fill-slate-100 text-slate-400 group-hover:text-primary group-hover:fill-blue-100 transition-colors" />
                  تعرف علينا
                </Link>
              </div>
            </div>

            {/* Hero Image */}
            <div className="w-full lg:flex-1 relative max-w-[550px] lg:max-w-none animate-fade-in-up animate-delay-200">
              <div className="relative z-10 group perspective-1000">
                <div className="absolute -inset-4 bg-gradient-to-tr from-primary/30 to-purple-600/30 rounded-[3.5rem] blur-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-700 animate-pulse-slow"></div>
                <div className="relative bg-white/40 backdrop-blur-sm p-4 rounded-[3.5rem] shadow-2xl border border-white/50 transform transition-transform duration-700 hover:rotate-1 hover:scale-[1.01]">
                  <img src={IMAGES.HERO.HOME_MAIN} alt="Student Achievement Tilmid" className="rounded-[3rem] w-full object-cover h-[400px] sm:h-[550px] lg:h-[650px] shadow-lg" loading="eager" />

                  {/* Floating Stats Card - Glassmorphism */}
                  <div className="absolute -bottom-8 -right-8 bg-white/90 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.15)] border border-white/60 animate-float hidden md:flex items-center gap-5 ring-1 ring-slate-100">
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner"><TrendingUp size={28} /></div>
                    <div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">معدل النجاح</div>
                      <div className="text-2xl font-black text-slate-900">+98% سنوياً</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Showcase Section */}
      <section className="relative z-20 -mt-20 px-4 mb-24">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ProgramCard
              data={TAWJIH_DATA}
              icon={Compass}
              color="bg-purple-600"
              link="/program/tawjih"
            />
            <ProgramCard
              data={TILMID_DATA}
              icon={BookOpen}
              color="bg-blue-600"
              link="/program/tilmid"
            />
            <ProgramCard
              data={TALIB_DATA}
              icon={GraduationCap}
              color="bg-emerald-600"
              link="/program/talib"
            />
          </div>
        </div>
      </section>

      {/* Modern Exam Countdown Banner - Responsive & High Contrast */}
      <section className="relative z-30 mt-12 lg:mt-24 px-4">
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
      <section id="services" className="py-32 bg-[#f8fafc] pt-40 lg:pt-52 relative">
        {/* Decorative Background Elements */}
        <div className="absolute top-1/4 left-0 w-full h-[500px] bg-gradient-to-b from-white/0 via-white/80 to-white/0 skew-y-3 pointer-events-none"></div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-24 space-y-6">
            <span className="inline-block px-4 py-1.5 bg-blue-100 text-primary font-black tracking-widest text-[10px] uppercase rounded-full">بماذا نتميز؟</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight">نساعدك تحقق <span className="text-primary">أهدافك</span> <br />بدون ضغط وتوتر</h2>
            <p className="text-slate-500 font-medium text-xl max-w-2xl mx-auto leading-relaxed">نقدم باقة من الخدمات المتكاملة التي تغطي الجانب النفسي، الدراسي والتقني.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {MAIN_SERVICES.map((service, idx) => (
              <div key={idx} className="bg-white p-10 lg:p-12 rounded-[3.5rem] border border-slate-100 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_-20px_rgba(37,99,235,0.15)] hover:-translate-y-2 transition-all duration-500 flex flex-col md:flex-row items-center md:items-start gap-8 group relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[100%] transition-transform duration-700 group-hover:scale-150 z-0`}></div>

                <div className="relative z-10 p-5 rounded-[2.5rem] bg-slate-50 text-slate-900 shadow-sm ring-1 ring-slate-100 group-hover:bg-primary group-hover:text-white group-hover:scale-110 transition-all duration-500 shrink-0">
                  <service.icon size={42} strokeWidth={1.5} />
                </div>
                <div className="text-center md:text-right relative z-10">
                  <h3 className="text-2xl font-black mb-4 text-slate-900 group-hover:text-primary transition-colors">{service.title}</h3>
                  <p className="text-slate-500 leading-relaxed font-bold text-lg opacity-80 group-hover:opacity-100 transition-opacity">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Slider */}
      <section className="py-32 bg-white overflow-hidden border-t border-slate-100 relative">
        <div className="container mx-auto px-4 lg:px-8 mb-20 text-center relative z-10">
          <span className="text-primary font-black tracking-widest text-xs uppercase block mb-4">قصص نجاح</span>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">أبطال تلميذ <span className="text-primary">يشاركون</span> تجربتهم</h2>
        </div>

        <div className="relative w-full overflow-hidden">
          {/* Fade Edges */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

          <div className="flex gap-8 animate-scroll-rtl hover:[animation-play-state:paused] w-max px-4 py-10">
            {[...successStories, ...successStories, ...successStories].map((story, i) => (
              <div key={i} className="w-[380px] md:w-[480px] bg-slate-50/50 p-10 rounded-[3rem] shadow-sm ring-1 ring-slate-100 flex-shrink-0 hover:shadow-xl hover:bg-white transition-all duration-500 hover:-translate-y-2 group">
                <div className="flex items-center gap-5 mb-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <img src={story.image} alt={story.name} className="w-16 h-16 rounded-full object-cover ring-4 ring-white shadow-md relative z-10" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-xl">{story.name}</h4>
                    <span className="text-primary text-xs font-bold uppercase tracking-wider bg-primary/5 px-2 py-1 rounded-full">{story.role}</span>
                  </div>
                  <div className="mr-auto w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-200 shadow-sm border border-slate-50 group-hover:text-primary/20 group-hover:scale-110 transition-all">
                    <Quote size={24} fill="currentColor" />
                  </div>
                </div>
                <p className="text-slate-600 font-bold leading-[1.8] text-lg opacity-80 group-hover:opacity-100 transition-opacity">"{story.content}"</p>
                <div className="mt-8 flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => <Star key={star} size={16} className="text-yellow-400 fill-yellow-400" />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media & Reels Section - Visual Video Cards */}
      <section id="media" className="py-32 bg-[#0a0f1c] relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen opacity-30 animate-blob"></div>
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
        </div>
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
      {/* Scroll To Top Button with Progress Ring */}
      <div className={`fixed bottom-8 right-8 z-50 transition-all duration-500 ${showScroll ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <button
          onClick={scrollToTop}
          className="relative w-14 h-14 bg-white rounded-full shadow-xl flex items-center justify-center group hover:-translate-y-1 transition-transform duration-300"
        >
          {/* Progress Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="48" fill="none" class="stroke-slate-100" stroke-width="4" />
            <circle
              cx="50" cy="50" r="48"
              fill="none"
              className="stroke-primary transition-all duration-200"
              strokeWidth="4"
              strokeDasharray="301.59"
              strokeDashoffset={301.59 - (301.59 * scrollProgress)}
              strokeLinecap="round"
            />
          </svg>

          <ArrowUp size={24} className="text-slate-700 group-hover:text-primary transition-colors" strokeWidth={2.5} />
        </button>
      </div>
    </>
  );
};
