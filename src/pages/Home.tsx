
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { TAWJIH_DATA, INSTAGRAM_REELS } from '../constants';
import { IMAGES } from '../constants/images';
import { dataManager } from '../utils/dataManager';
import { SuccessStory, VideoReel } from '../types';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, PlayCircle, Sparkles, Star, Quote, ArrowLeftIcon, Zap, TrendingUp,
  Globe, Play, MessageCircle, Compass, BookOpen, GraduationCap, Target, Check,
  BadgeCheck, ChevronLeft, ChevronRight, Building2
} from 'lucide-react';
import SEO from '../components/SEO';
import { useTranslation } from 'react-i18next';

/* -------------------------------------------------------------------------- */
/* Scroll reveal — restrained fade + rise, respects prefers-reduced-motion    */
/* -------------------------------------------------------------------------- */

const useReveal = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;

    // Safety net: if the observer never fires (odd embedding context, a
    // resized/print viewport, a crawler), content must not stay hidden.
    const fallback = window.setTimeout(() => setVisible(true), 1800);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          window.clearTimeout(fallback);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -5% 0px' }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  return { ref, visible };
};

const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className = '' }) => {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Section eyebrow                                                            */
/* -------------------------------------------------------------------------- */

const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.18em] ring-1 bg-primary/5 text-primary ring-primary/10">
    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
    {children}
  </span>
);

/* -------------------------------------------------------------------------- */
/* Exam countdown day card                                                    */
/* -------------------------------------------------------------------------- */

const DayCard: React.FC<{ date: Date; label: string; t: any }> = ({ date, label, t }) => {
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
    <div className="relative overflow-hidden flex items-center gap-5 bg-white/5 backdrop-blur-md px-6 py-5 rounded-[2.5rem] border border-white/10 flex-1 w-full md:min-w-[240px] group hover:bg-white/10 transition-all duration-300 ring-1 ring-white/5 hover:ring-white/20 hover:shadow-lg hover:shadow-blue-500/10">
      <div className="absolute -start-10 -top-10 w-32 h-32 bg-blue-500/10 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity"></div>

      <div className="relative w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-3xl text-white shadow-[0_0_30px_rgba(37,99,235,0.4)] group-hover:scale-110 transition-transform tabular-nums border border-blue-400/30">
        {days}
      </div>
      <div className="text-end flex-1 select-none">
        <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1">{label}</p>
        <div className="text-lg font-black text-white">{t('home.daysRemaining')}</div>
        <div className="flex items-center justify-between mt-1.5 ">
          <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
            <div className="flex gap-0.5">
              <span className="w-1 h-3 bg-emerald-500/80 rounded-full animate-pulse"></span>
              <span className="w-1 h-2 bg-emerald-500/60 rounded-full"></span>
              <span className="w-1 h-1.5 bg-emerald-500/40 rounded-full"></span>
            </div>
            <span className="text-[10px] font-bold text-emerald-400">{t('home.timerActive')}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-x-2 group-hover:translate-x-0 rtl:translate-x-2 rtl:group-hover:translate-x-0">
            {date.toLocaleDateString(t('nav.home') === 'الرئيسية' ? 'ar-MA' : 'fr-FR', { day: 'numeric', month: 'short' })}
          </span>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Popular content video card                                                 */
/* -------------------------------------------------------------------------- */

const VideoCard: React.FC<{ reel: VideoReel; t: any }> = ({ reel, t }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="group relative flex flex-col items-center w-full">
      <div className="relative w-full max-w-[340px] p-[2px] rounded-[3rem] bg-gradient-to-b from-slate-200 via-white to-slate-200 group-hover:from-primary/60 group-hover:via-blue-500/30 group-hover:to-primary/60 transition-all duration-500 shadow-xl shadow-slate-200/50 group-hover:shadow-primary/20 group-hover:-translate-y-4">
        <div className="relative bg-white rounded-[2.9rem] p-3 h-full mix-blend-normal ring-1 ring-slate-100">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-black aspect-[9/16] w-full shadow-inner ring-1 ring-white/10">
            <iframe
              src={`https://www.instagram.com/reel/${reel.reelId}/embed/`}
              className="w-full h-full border-0"
              allowFullScreen
              title={t(reel.title)}
              scrolling="no"
              loading="lazy"
            ></iframe>

            <div
              onClick={() => setIsPlaying(true)}
              className={`absolute inset-0 bg-black/30 group-hover:bg-transparent transition-all duration-500 flex items-center justify-center z-20 cursor-pointer ${isPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
              <div className="w-20 h-20 relative flex items-center justify-center">
                <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-0 group-hover:opacity-100 duration-1000"></div>
                <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 shadow-[0_0_30px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform duration-500">
                  <Play size={36} fill="white" className="text-white ms-2 opacity-90" />
                </div>
              </div>
            </div>

            <div className={`absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/95 via-black/60 to-transparent z-10 pointer-events-none transition-opacity duration-300 ${isPlaying ? 'opacity-0' : 'opacity-100'}`}></div>

            <div className={`absolute bottom-6 inset-x-6 z-20 text-start pointer-events-none transition-opacity duration-300 ${isPlaying ? 'opacity-0' : 'opacity-100'}`}>
              <div className="flex items-center justify-end gap-2 mb-2">
                <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold text-white border border-white/10 flex items-center gap-1.5">
                  <Globe size={10} className="text-blue-400" />
                  {t('home.reels')}
                </span>
              </div>
              <h4 className="text-white font-black text-sm leading-relaxed line-clamp-2 drop-shadow-md pb-2 text-end">
                {t(reel.title)}
              </h4>
              <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/10">
                <span className="text-[10px] font-black text-blue-300 uppercase tracking-widest flex items-center gap-1">
                  {reel.views} {t('home.views')}
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
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Program / service card                                                     */
/* -------------------------------------------------------------------------- */

// Fully static class names so Tailwind's JIT scanner can find every one of
// them in the source — building class names via string concat/replace at
// runtime (e.g. `${color.replace('bg-','text-')}`) silently drops classes
// that aren't otherwise used literally elsewhere in the codebase.
const PROGRAM_TONES = {
  emerald: {
    iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', label: 'text-emerald-600',
    blob: 'bg-emerald-600', hoverGradient: 'from-white via-white to-emerald-50',
  },
  blue: {
    iconBg: 'bg-blue-50', iconColor: 'text-blue-600', label: 'text-blue-600',
    blob: 'bg-blue-600', hoverGradient: 'from-white via-white to-blue-50',
  },
  purple: {
    iconBg: 'bg-purple-50', iconColor: 'text-purple-600', label: 'text-purple-600',
    blob: 'bg-purple-600', hoverGradient: 'from-white via-white to-purple-50',
  },
} as const;

const ProgramCard: React.FC<{
  data: any; icon: any; tone: keyof typeof PROGRAM_TONES; link: string; t: any;
  number: string; category: string; ctaLabel: string;
}> = ({ data, icon: Icon, tone, link, t, number, category, ctaLabel }) => {
  const c = PROGRAM_TONES[tone];
  return (
    <Link to={link} className="group relative bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 lg:p-10 border border-white/50 shadow-[0_12px_32px_-16px_rgba(15,23,42,0.12)] hover:shadow-[0_30px_60px_-20px_rgba(15,23,42,0.18)] transition-all duration-500 hover:-translate-y-3 overflow-hidden flex flex-col h-full ring-1 ring-slate-100 text-start">
      <div className={`absolute inset-0 bg-gradient-to-br ${c.hoverGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
      <div className={`absolute -top-10 -end-10 w-40 h-40 ${c.blob} opacity-10 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700`}></div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between mb-8">
          <div className={`w-16 h-16 rounded-2xl ${c.iconBg} flex items-center justify-center group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500`}>
            <Icon size={28} className={c.iconColor} strokeWidth={2.2} />
          </div>
          <div className="text-end">
            <span className="block text-3xl font-black text-slate-100 group-hover:text-slate-200 transition-colors tabular-nums leading-none">{number}</span>
            <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${c.label}`}>{category}</span>
          </div>
        </div>

        <h3 className="text-2xl lg:text-[26px] font-black text-slate-900 mb-3 tracking-tight group-hover:text-primary transition-colors">{t(data.title)}</h3>
        <p className="text-slate-500 font-medium text-[15px] leading-relaxed mb-8 line-clamp-3 opacity-90">{t(data.subtitle)}</p>

        <div className="flex items-center gap-2 text-sm font-black text-slate-900 group-hover:text-primary group-hover:gap-4 transition-all mt-auto pt-6 border-t border-slate-100/70">
          <span>{ctaLabel}</span>
          <ArrowLeftIcon size={18} className="transform rtl:group-hover:-translate-x-1 ltr:rotate-180 ltr:group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};

/* -------------------------------------------------------------------------- */
/* Hero visual — portrait card, ambient glow, skill chips, trust badges       */
/* -------------------------------------------------------------------------- */

const SkillChip: React.FC<{ label: string; index: number }> = ({ label, index }) => (
  <span
    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/95 backdrop-blur-md text-[12px] font-bold text-slate-800 shadow-[0_4px_16px_rgba(0,0,0,0.12)] ring-1 ring-white/60 animate-fade-in-up"
    style={{ animationDelay: `${300 + index * 80}ms` }}
  >
    <Check size={12} className="text-primary shrink-0" strokeWidth={3} />
    {label}
  </span>
);

const HeroImage: React.FC<{ t: any }> = ({ t }) => {
  const skills = (t('home.heroSkills', { returnObjects: true }) as unknown as string[]) || [];

  return (
    <div className="relative z-10 animate-float">
      <div className="relative rounded-[30px] overflow-hidden shadow-[0_30px_70px_-20px_rgba(8,20,47,0.35)] ring-1 ring-white/10 bg-gradient-to-br from-[#0D1B3D] to-[#08142F]">
        <img
          src={IMAGES.HERO.HOME_MAIN}
          alt="Mentor Tilmid"
          className="w-full h-auto object-cover"
          loading="eager"
        />

        {/* Bottom gradient so chips sit legibly over the image */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#08142F] via-[#08142F]/70 to-transparent pointer-events-none"></div>

        {/* Skill chips overlay — hidden below lg (too narrow to wrap cleanly); end gutter kept clear so the success-rate badge never covers a chip */}
        <div className="absolute inset-x-0 bottom-0 ps-5 lg:ps-6 pb-5 lg:pb-6 pe-32 lg:pe-40 hidden lg:flex flex-wrap gap-2 justify-start">
          {skills.map((skill, i) => (
            <SkillChip key={skill} label={skill} index={i} />
          ))}
        </div>
      </div>

      {/* Floating badge — success rate */}
      <div className="absolute -bottom-6 -end-4 lg:-end-8 bg-white p-4 lg:p-5 rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.12)] border border-slate-100 flex items-center gap-4 animate-bounce-slow z-20">
        <div className="bg-green-100 p-3 rounded-xl text-green-600">
          <TrendingUp size={24} />
        </div>
        <div className="text-start">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('home.successRate')}</p>
          <p className="text-lg font-black text-slate-900">{t('home.yearlyRate')}</p>
        </div>
      </div>

      {/* Floating badge — students accompanied */}
      <div className="absolute -top-6 -start-4 lg:-start-8 bg-white/90 backdrop-blur-xl px-5 py-4 rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.12)] border border-white/50 animate-bounce-reverse z-20">
        <div className="flex -space-x-3 rtl:space-x-reverse">
          <div className="w-9 h-9 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="" />
          </div>
          <div className="w-9 h-9 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka" alt="" />
          </div>
          <div className="w-9 h-9 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" alt="" />
          </div>
        </div>
        <p className="text-center text-[11px] font-black text-slate-700 mt-2 whitespace-nowrap">{t('home.studentsBadge')}</p>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Trust metrics                                                              */
/* -------------------------------------------------------------------------- */

const StatItem: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div className="text-center px-4">
    <p className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight tabular-nums">{value}</p>
    <p className="text-slate-500 font-bold text-sm mt-2">{label}</p>
  </div>
);

/* -------------------------------------------------------------------------- */
/* How it works                                                               */
/* -------------------------------------------------------------------------- */

const StepCard: React.FC<{ number: string; icon: any; title: string; desc: string }> = ({ number, icon: Icon, title, desc }) => (
  <div className="relative flex-1 bg-white rounded-[2rem] p-8 border border-slate-100 shadow-[0_12px_32px_-20px_rgba(15,23,42,0.1)] hover:-translate-y-2 hover:shadow-[0_24px_48px_-20px_rgba(15,23,42,0.16)] transition-all duration-500">
    <div className="flex items-center justify-between mb-6">
      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
        <Icon size={26} strokeWidth={2.2} />
      </div>
      <span className="text-5xl font-black text-slate-100 tabular-nums leading-none">{number}</span>
    </div>
    <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">{title}</h3>
    <p className="text-slate-500 font-medium text-[15px] leading-relaxed">{desc}</p>
  </div>
);

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export const Home: React.FC = () => {
  const { t } = useTranslation();
  const [successStories, setSuccessStories] = useState<SuccessStory[]>([]);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -400, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 400, behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchStories = async () => {
      const stories = await dataManager.getStories();
      setSuccessStories(stories);
    };
    fetchStories();
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

  const nationalDate = useMemo(() => getExamDate(5, 4), []);
  const regionalDate = useMemo(() => getExamDate(5, 1), []);

  const stats = (t('home.stats', { returnObjects: true }) as unknown as { value: string; label: string }[]) || [];
  const steps = (t('home.howItWorksSteps', { returnObjects: true }) as unknown as { title: string; desc: string }[]) || [];
  const stepIcons = [Target, BookOpen, GraduationCap];

  return (
    <>
      <SEO
        title={t('home.seoTitle')}
        description={t('home.seoDesc')}
      />

      {/* ============================== HERO ============================== */}
      <section className="relative pt-20 pb-32 lg:pt-20 lg:pb-52 overflow-hidden bg-[#f8fafc]">
        <div className="absolute inset-0 pointer-events-none">
          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-[0.35] [mask-image:radial-gradient(ellipse_55%_55%_at_50%_20%,black,transparent)]"
            style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '28px 28px' }}
          ></div>
          {/* Noise */}
          <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" /></filter>
              <rect width="100%" height="100%" filter="url(#noiseFilter)" />
            </svg>
          </div>
          {/* Ambient glows */}
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[120px] mix-blend-multiply opacity-70 animate-blob"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-400/10 rounded-full blur-[120px] mix-blend-multiply opacity-70 animate-blob animation-delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Text Content */}
            <div className="w-full lg:w-1/2 text-center lg:text-start space-y-7 order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full border border-blue-100 shadow-sm mx-auto lg:mx-0 animate-fade-in-up ring-1 ring-blue-50/50">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span className="text-sm font-bold text-slate-700">{t('home.badge')}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-black text-slate-900 leading-[1.08] tracking-tight animate-fade-in-up animate-delay-100">
                {t('home.heroTitle1')} <br />
                <span className="relative inline-block">
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{t('home.heroTitle2')}</span>
                  <svg className="absolute w-full h-3 -bottom-1 left-0 text-blue-200/50 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                  </svg>
                </span>
                <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-[40px] mt-3 text-slate-400 font-extrabold tracking-tight">{t('home.heroTitle3')}</span>
              </h1>

              {/* Mobile Hero Image */}
              <div className="block lg:hidden w-full max-w-md mx-auto my-8 px-4">
                <HeroImage t={t} />
              </div>

              <p className="text-[17px] text-slate-500 font-medium leading-[1.7] max-w-[520px] mx-auto lg:mx-0 animate-fade-in-up animate-delay-200">
                {t('home.heroDesc')}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4 animate-fade-in-up animate-delay-300">
                <Link to="/coaching-offer" className="w-full sm:w-auto h-[52px] px-9 bg-blue-600 text-white rounded-full font-bold text-[17px] hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/40 flex items-center justify-center gap-2 group ring-4 ring-transparent hover:ring-blue-100">
                  <span>{t('home.startJourney')}</span>
                  <ArrowLeft size={20} className="transform rtl:group-hover:-translate-x-1 ltr:rotate-180 ltr:group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/about" className="w-full sm:w-auto h-[52px] px-9 bg-white text-slate-700 border border-slate-200 rounded-full font-bold text-[17px] hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 group shadow-sm hover:shadow-md">
                  <PlayCircle size={20} className="group-hover:text-blue-600" />
                  <span>{t('home.discoverUs')}</span>
                </Link>
              </div>
            </div>

            {/* Hero Image - Desktop Only */}
            <div className="hidden lg:block w-full lg:w-1/2 relative order-1 lg:order-2 px-4 lg:px-0">
              <HeroImage t={t} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-blue-100/50 to-purple-100/50 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================== TRUST METRICS ========================== */}
      <section className="relative z-20 -mt-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <Reveal>
            <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_-20px_rgba(15,23,42,0.15)] ring-1 ring-slate-100 py-8 px-6 lg:px-12 grid grid-cols-2 lg:grid-cols-4 gap-y-8">
              {stats.map((stat, i) => (
                <div key={i} className="border-slate-100 [&:nth-child(odd)]:border-e lg:[&:nth-child(odd)]:border-e-0 lg:[&:not(:last-child)]:border-e">
                  <StatItem value={stat.value} label={stat.label} />
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ PROGRAMS ============================= */}
      <section className="relative z-10 pt-16 pb-4 px-4">
        <div className="container mx-auto max-w-6xl">
          <Reveal className="text-center max-w-2xl mx-auto mb-14 space-y-4">
            <Eyebrow>{t('home.programsEyebrow')}</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{t('home.programsTitle')}</h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Reveal delay={0}>
              <ProgramCard
                data={TAWJIH_DATA}
                icon={Compass}
                tone="emerald"
                link="/tawjih"
                t={t}
                number={t('home.programNumber1')}
                category={t('home.programCategory1')}
                ctaLabel={t('home.discoverProgram')}
              />
            </Reveal>
            <Reveal delay={120}>
              <ProgramCard
                data={{ title: 'programs.coaching.title', subtitle: 'programs.coaching.subtitle' }}
                icon={Star}
                tone="blue"
                link="/coaching-offer"
                t={t}
                number={t('home.programNumber2')}
                category={t('home.programCategory2')}
                ctaLabel={t('home.exploreCoaching')}
              />
            </Reveal>
            <Reveal delay={240}>
              <ProgramCard
                data={{ title: 'programs.higherSchools.title', subtitle: 'programs.higherSchools.subtitle' }}
                icon={Building2}
                tone="purple"
                link="/higher-schools"
                t={t}
                number={t('home.programNumber3')}
                category={t('home.programCategory3')}
                ctaLabel={t('home.exploreSchools')}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================ COUNTDOWN ============================ */}
      <section className="relative z-30 mt-8 lg:mt-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <Reveal>
            <div className="bg-slate-900 bg-gradient-to-br from-slate-900 via-[#0f172a] to-slate-900 rounded-[3.5rem] md:rounded-[4rem] px-6 py-10 lg:px-12 lg:py-8 shadow-[0_40px_80px_-20px_rgba(15,23,42,0.6)] flex flex-col lg:flex-row items-center gap-8 lg:gap-12 relative overflow-hidden group border border-white/10 ring-1 ring-white/5">
              <div className="absolute top-0 end-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] -me-40 -mt-40 pointer-events-none"></div>

              <div className="text-center lg:text-start shrink-0 lg:max-w-[250px] space-y-2">
                <div className="flex items-center justify-center lg:justify-start gap-2 text-[#38bdf8] font-black text-[11px] uppercase tracking-[0.2em]">
                  <Zap size={16} fill="currentColor" className="animate-pulse" />
                  <span>{t('home.liveCountdown')}</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-black text-white leading-tight">{t('home.decisiveDay')}</h2>
                <p className="text-gray-500 text-[11px] font-bold italic opacity-80">{t('home.prepareWell')}</p>
              </div>

              <div className="flex flex-col md:flex-row gap-5 lg:gap-6 flex-grow w-full">
                <DayCard date={nationalDate} label={t('home.nationalExam')} t={t} />
                <DayCard date={regionalDate} label={t('home.regionalExam')} t={t} />
              </div>

              <div className="flex flex-col items-center lg:items-end gap-3 shrink-0">
                <Link to="/bac-simulator" className="bg-white text-[#0f172a] px-10 py-5 rounded-[2.5rem] font-black text-lg flex items-center gap-3 hover:bg-primary hover:text-white transition-all shadow-xl hover:shadow-primary/20 group/btn transform active:scale-95 w-full lg:w-auto justify-center">
                  <span>{t('home.calculateAverage')}</span>
                  <ArrowLeftIcon size={22} className="transform rtl:group-hover:-translate-x-1 ltr:rotate-180 ltr:group-hover:translate-x-1 transition-transform" />
                </Link>
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {t('home.autoUpdated')}
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========================== HOW IT WORKS ============================ */}
      <section className="py-24 lg:py-28 px-4 bg-[#f8fafc]">
        <div className="container mx-auto max-w-6xl">
          <Reveal className="text-center max-w-2xl mx-auto mb-14 space-y-4">
            <Eyebrow>{t('home.howItWorksEyebrow')}</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{t('home.howItWorksTitle')}</h2>
          </Reveal>

          <div className="flex flex-col lg:flex-row gap-6">
            {steps.map((step, i) => (
              <Reveal key={i} delay={i * 120} className="flex-1">
                <StepCard number={`0${i + 1}`} icon={stepIcons[i] || Target} title={step.title} desc={step.desc} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========================== POPULAR CONTENT ========================= */}
      <section id="media" className="py-10 bg-[#f8fafc] relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] mix-blend-multiply opacity-50 animate-blob"></div>
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[120px] mix-blend-multiply opacity-50 animate-blob animation-delay-2000"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150 mix-blend-multiply"></div>
        </div>
        <div className="container mx-auto px-4 lg:px-8 text-center relative z-10">
          <Reveal className="max-w-3xl mx-auto mb-16 space-y-5">
            <Eyebrow>{t('home.reelsEyebrow')}</Eyebrow>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              {t('home.mostWatched')}
            </h2>
            <p className="text-slate-500 text-lg font-bold">{t('home.motivationDoses')}</p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8 max-w-6xl mx-auto">
            {INSTAGRAM_REELS.map((reel, i) => (
              <Reveal key={reel.id} delay={i * 100}>
                <VideoCard reel={reel} t={t} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* =========================== TESTIMONIALS =========================== */}
      {successStories.length > 0 && (
        <section className="py-10 bg-[#f8fafc] overflow-hidden border-t border-slate-100 relative">
          <Reveal className="container mx-auto px-4 lg:px-8 mb-16 text-center relative z-10 space-y-4">
            <Eyebrow>{t('home.successStories')}</Eyebrow>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">{t('home.heroesShare1')} <span className="text-primary">{t('home.heroesShare2')}</span> {t('home.heroesShare3')}</h2>
          </Reveal>

          <div className="relative w-full group/slider">
            <div className="absolute top-1/2 -translate-y-1/2 start-4 z-20 opacity-0 group-hover/slider:opacity-100 transition-opacity">
              <button onClick={scrollLeft} className="w-14 h-14 bg-white rounded-full shadow-xl flex items-center justify-center text-slate-700 hover:text-primary hover:scale-110 transition-all border border-slate-100" aria-label="Précédent">
                <ChevronLeft size={28} className="rtl:rotate-180" />
              </button>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 end-4 z-20 opacity-0 group-hover/slider:opacity-100 transition-opacity">
              <button onClick={scrollRight} className="w-14 h-14 bg-white rounded-full shadow-xl flex items-center justify-center text-slate-700 hover:text-primary hover:scale-110 transition-all border border-slate-100" aria-label="Suivant">
                <ChevronRight size={28} className="rtl:rotate-180" />
              </button>
            </div>

            <div
              ref={scrollContainerRef}
              className="flex gap-8 overflow-x-auto snap-x snap-mandatory px-8 lg:px-16 py-10 no-scrollbar scroll-smooth"
            >
              {successStories.map((story, i) => (
                <div key={i} className="w-[85vw] md:w-[480px] bg-white p-10 rounded-[3rem] shadow-sm ring-1 ring-slate-100 flex-shrink-0 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group snap-center">
                  <div className="flex items-center gap-5 mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <img src={story.image} alt={story.name} className="w-16 h-16 rounded-full object-cover ring-4 ring-white shadow-md relative z-10" />
                    </div>
                    <div className="text-start">
                      <h4 className="font-black text-slate-900 text-xl">{story.name}</h4>
                      <span className="text-primary text-xs font-bold uppercase tracking-wider bg-primary/5 px-2 py-1 rounded-full">{story.role}</span>
                    </div>
                    <div className="ms-auto w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 shadow-sm border border-slate-100 group-hover:text-primary/20 group-hover:scale-110 transition-all">
                      <Quote size={24} fill="currentColor" />
                    </div>
                  </div>
                  <p className="text-slate-600 font-bold leading-[1.8] text-lg opacity-80 group-hover:opacity-100 transition-opacity text-start">"{story.content}"</p>
                  <div className="mt-8 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-black">
                      <BadgeCheck size={14} />
                      {t('home.successBadge')}
                    </span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(star => <Star key={star} size={16} className="text-yellow-400 fill-yellow-400" />)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================ FINAL CTA ============================= */}
      <section className="py-16 bg-[#f8fafc]">
        <div className="container mx-auto px-4">
          <Reveal>
            <div className="bg-[#0f172a] rounded-[3rem] p-8 lg:p-12 text-center relative overflow-hidden shadow-2xl border border-white/5 max-w-5xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-royal/20 opacity-40"></div>
              <div className="absolute -top-24 -end-24 w-80 h-80 bg-primary/10 rounded-full blur-[100px]"></div>

              <div className="relative z-10 space-y-6 max-w-3xl mx-auto">
                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto shadow-2xl border border-primary/30">
                  <Sparkles size={32} className="text-primary animate-pulse" />
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">{t('home.readySuccess')}</h2>
                <p className="text-slate-400 text-lg font-bold max-w-xl mx-auto leading-relaxed">{t('home.bookConsultation')}</p>

                <div className="flex flex-col md:flex-row justify-center items-center gap-4 pt-4">
                  <Link
                    to="/coaching-offer"
                    className="w-full md:w-auto px-10 py-4 bg-primary text-white rounded-[2rem] font-black text-lg hover:bg-white hover:text-[#0f172a] transition-all shadow-xl shadow-primary/30 transform hover:-translate-y-1 active:scale-95"
                  >
                    {t('home.registerNow')}
                  </Link>

                  <a
                    href="https://wa.me/message/GN4XKUOMHNHGO1"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full md:w-auto px-8 py-4 bg-transparent text-white border-2 border-white/20 hover:border-white hover:bg-white/5 rounded-[2rem] font-black text-lg transition-all flex items-center justify-center gap-3 group active:scale-95"
                  >
                    <MessageCircle size={22} className="group-hover:rotate-12 transition-transform" />
                    {t('home.contactWhatsapp')}
                  </a>
                </div>

                <p className="text-slate-500 text-xs font-bold pt-2">{t('home.trustLine')}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
};
