
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TAWJIH_DATA, TILMID_DATA, TALIB_DATA } from '../constants';
import { ORIENTATION_PACKS, OrientationPackDef } from '../constants/orientationPacks';
import { IMAGES } from '../constants/images';
import { ProgramData, SuccessStory } from '../types';
import { dataManager } from '../utils/dataManager';
import {
  CheckCircle,
  MessageCircle,
  Calendar,
  User,
  Compass,
  GraduationCap,
  School,
  Target,
  Sparkles,
  Check,
  ArrowLeft,
  BrainCircuit,
  Cpu,
  Fingerprint,
  RefreshCcw,
  ShieldCheck,
  Clock,
  Map,
  Star,
  Quote,
  FileCheck2,
  ChevronDown,
  ChevronRight,
  Compass as CompassIcon,
  FlaskConical,
  TrendingUp,
  BadgeCheck,
  Building2,
  Info,
  MapPin,
} from 'lucide-react';
import SEO from '../components/SEO';
import { SCHOOLS, toSlug } from '../constants/schools';

/* -------------------------------------------------------------------------- */
/* Shared bits                                                                */
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

const SectionEyebrow: React.FC<{ children: React.ReactNode; tone: string; toneBg: string }> = ({ children, tone, toneBg }) => (
  <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.16em] ring-1 ${toneBg} ${tone} ring-current/10`}>
    <span className={`w-1.5 h-1.5 rounded-full ${tone.replace('text-', 'bg-')}`} />
    {children}
  </span>
);

const FeatureStep: React.FC<{
  feature: { title: string; description: string };
  index: number;
  themeColor: string;
  lightThemeBg: string;
  borderColor: string;
}> = ({ feature, index, themeColor, lightThemeBg, borderColor }) => {
  const { t } = useTranslation();
  const [isActive, setIsActive] = useState(false);
  const stepRef = useRef<HTMLDivElement>(null);

  const Icons = [Target, BrainCircuit, ShieldCheck, User];
  const Icon = Icons[index] || Star;

  useEffect(() => {
    const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setIsActive(true);
      return;
    }
    // Safety net: never let a card stay permanently hidden if the observer
    // doesn't fire (odd embedding context, resized/print viewport, a crawler).
    const fallback = window.setTimeout(() => setIsActive(true), 1800);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsActive(true);
          window.clearTimeout(fallback);
        }
      },
      { threshold: 0.2 }
    );
    if (stepRef.current) observer.observe(stepRef.current);
    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <div
      ref={stepRef}
      className={`group relative p-8 bg-white rounded-[2.5rem] border border-gray-100 hover:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.05)] hover:-translate-y-1 hover:border-${borderColor.split('-')[1]}-200 transition-all duration-700 flex flex-col items-start min-h-[280px] overflow-hidden
      ${isActive
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-12 scale-90'}`}
    >
      <div className={`absolute top-0 end-0 w-48 h-full ltr:bg-gradient-to-l rtl:bg-gradient-to-r from-${themeColor.split('-')[1]}-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
      <div className={`absolute -end-10 -top-10 w-32 h-32 ${lightThemeBg} rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>

      <div className="w-full flex justify-between items-start mb-6 relative z-10">
        <div className={`w-16 h-16 rounded-[1.2rem] flex items-center justify-center transition-all duration-700 shadow-sm border border-transparent group-hover:scale-110
        ${isActive
            ? `${lightThemeBg} ${themeColor} border-${borderColor.split('-')[1]}-100`
            : 'bg-slate-50 text-slate-300'}`}>
          <Icon size={32} strokeWidth={1.5} />
        </div>
        <span className="text-[10px] font-black text-slate-200 group-hover:text-slate-300 transition-colors">0{index + 1}</span>
      </div>

      <div className="relative z-10 text-start w-full mt-auto">
        <h3 className="text-xl md:text-2xl font-black mb-4 transition-colors duration-700 text-slate-900 leading-tight group-hover:text-primary">
          {t(feature.title)}
        </h3>
        <p className="leading-relaxed text-base text-slate-500 font-medium group-hover:text-slate-600 transition-colors">
          {t(feature.description)}
        </p>
      </div>

      <div className={`absolute bottom-0 end-0 h-1 ltr:bg-gradient-to-r rtl:bg-gradient-to-l ${isActive ? 'from-' + themeColor.split('-')[1] + '-500 to-transparent w-full' : 'w-0'} transition-all duration-1000 delay-300`}></div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* AI Orientation Advisor                                                     */
/* -------------------------------------------------------------------------- */

/** Result type -> real fields from the school directory. Not every result maps
 * cleanly (the directory has no dedicated arts/media schools) — in that case
 * the result screen says so rather than inventing a match. */
const RESULT_FIELD_MAP: Record<string, string[]> = {
  eng: ['Ingénierie', 'Informatique & Digital', 'Sciences'],
  med: ['Médecine & Santé'],
  art: ['Architecture'],
  bus: ['Commerce & Management', 'Économie & Statistique'],
};

const TawjihAIAdvisor: React.FC = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState<'intro' | 'level' | 'quiz' | 'analyzing' | 'result'>('intro');
  const [level, setLevel] = useState<string>('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [resultType, setResultType] = useState<string>('');

  const translatedQuestions = t('programDetails.advisor.questions', { returnObjects: true }) as any[];
  const levelOptions = (t('programDetails.advisor.levelOptions', { returnObjects: true }) as unknown as string[]) || [];
  const questionTypes = ["eng", "med", "art", "bus"];
  const questions = translatedQuestions.map((q, i) => ({
    id: i + 1,
    text: q.text,
    options: q.options.map((optLabel: string, optIndex: number) => ({
      label: optLabel,
      type: questionTypes[optIndex]
    }))
  }));

  const handleAnswer = (type: string) => {
    const newAnswers = [...answers, type];
    setAnswers(newAnswers);
    if (currentQuestion < questions.length - 1) setCurrentQuestion(prev => prev + 1);
    else {
      setStep('analyzing');
      setTimeout(() => {
        const counts: any = { eng: 0, med: 0, art: 0, bus: 0 };
        newAnswers.forEach(a => { counts[a] = (counts[a] || 0) + 1; });
        setResultType(Object.keys(counts).reduce((a, b) => counts[a] >= counts[b] ? a : b));
        setStep('result');
      }, 2000);
    }
  };

  const getResult = () => {
    const map: any = t('programDetails.advisor.results', { returnObjects: true });
    return map[resultType] || map.eng;
  };

  const matchedSchools = useMemo(() => {
    const fields = RESULT_FIELD_MAP[resultType] || [];
    if (!fields.length) return [];
    return SCHOOLS.filter((s) => s.fields.some((f) => fields.includes(f))).slice(0, 3);
  }, [resultType]);

  const primaryMatchedField = RESULT_FIELD_MAP[resultType]?.[0];

  return (
    <div className="relative rounded-[1.75rem] bg-gradient-to-br from-[#08142F] via-[#101D48] to-[#0B1330] shadow-2xl overflow-hidden h-full border border-white/5 scroll-mt-24" id="ai-advisor" tabIndex={-1}>
      <div className="absolute top-0 inset-x-0 h-1 bg-blue-500"></div>
      <div className="relative min-h-[480px] h-full flex flex-col">

        {step === 'intro' && (
          <div className="relative z-10 flex-grow flex flex-col items-center text-center gap-8 p-8 md:p-10">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.16em] bg-blue-500/10 text-blue-300 ring-1 ring-blue-400/20">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              {t('orientationPage.advisor.eyebrow')}
            </span>

            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center ring-1 ring-white/10">
              <BrainCircuit size={30} className="text-blue-400" strokeWidth={1.8} />
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tight leading-tight">{t('programDetails.advisor.title')}</h2>
              <p className="text-slate-300 text-sm md:text-base font-medium leading-relaxed max-w-sm mx-auto">
                {t('programDetails.advisor.desc')}
              </p>
            </div>

            <button
              onClick={() => setStep('level')}
              className="w-full px-9 py-4 bg-white text-slate-900 rounded-xl font-bold text-base hover:bg-blue-500 hover:text-white transition-colors active:scale-95 flex items-center justify-center gap-3"
            >
              <span>{t('programDetails.advisor.startBtn')}</span>
              <ArrowLeft size={20} className="transform ltr:rotate-180 ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
            </button>
            <p className="-mt-4 text-slate-400 text-xs font-bold uppercase tracking-widest">{t('orientationPage.advisor.note')}</p>
          </div>
        )}

        {step === 'level' && (
          <div className="relative z-10 flex-grow flex flex-col p-8 md:p-10">
            <h3 className="text-xl md:text-2xl font-black text-white mb-2 text-start leading-tight">{t('programDetails.advisor.levelTitle')}</h3>
            <p className="text-slate-400 text-sm font-medium mb-8 text-start">{t('programDetails.advisor.levelSubtitle')}</p>
            <div className="grid grid-cols-2 gap-3">
              {levelOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => { setLevel(option); setStep('quiz'); }}
                  className="p-4 bg-white/5 hover:bg-white text-slate-200 hover:text-slate-900 text-center transition-colors rounded-xl font-bold text-sm border border-white/10"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'quiz' && (
          <div className="relative z-10 flex-grow flex flex-col p-8 md:p-10">
            <div className="flex justify-between items-center mb-8">
              <span className="text-blue-400 font-black text-xs uppercase tracking-widest">{t('programDetails.advisor.stepTracker', { current: currentQuestion + 1, total: questions.length })}</span>
              <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}></div>
              </div>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-white mb-8 text-start leading-tight">{questions[currentQuestion].text}</h3>
            <div className="grid grid-cols-1 gap-3">
              {questions[currentQuestion].options.map((o: any, i: number) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(o.type)}
                  className="p-5 bg-white/5 hover:bg-white text-slate-200 hover:text-slate-900 text-start transition-colors rounded-xl font-bold text-base border border-white/10 group/opt flex items-center justify-between"
                >
                  <span>{o.label}</span>
                  <div className="w-8 h-8 rounded-full border-2 border-white/20 group-hover/opt:border-blue-500 flex items-center justify-center transition-colors shrink-0">
                    <Check size={16} className="opacity-0 group-hover/opt:opacity-100 text-blue-600" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'analyzing' && (
          <div className="flex-grow flex flex-col items-center justify-center text-white p-10">
            <Cpu size={56} className="animate-spin mb-8 text-blue-400" />
            <h3 className="font-black text-2xl mb-4 text-center">{t('programDetails.advisor.analyzingTitle')}</h3>
            <p className="text-slate-400 font-medium text-center">{t('programDetails.advisor.analyzingDesc')}</p>
          </div>
        )}

        {step === 'result' && (
          <div className="relative z-10 p-8 md:p-10 text-center text-white flex flex-col items-center flex-grow justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 text-blue-400 rounded-full text-xs font-black mb-6 border border-blue-500/20">
              <CheckCircle size={15} /> {t('programDetails.advisor.resultSuccess')}
            </div>
            {level && (
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">{t('programDetails.advisor.yourLevel', { level })}</p>
            )}
            <h2 className="text-2xl md:text-3xl font-black mb-4 leading-tight">{t('programDetails.advisor.resultPrefix')} <br /> <span className="text-blue-400">{getResult().t}</span></h2>
            <p className="text-sm md:text-base text-slate-300 mb-6 max-w-sm mx-auto font-medium leading-relaxed">{getResult().d}</p>

            <div className="w-full max-w-sm text-start bg-white/5 rounded-2xl border border-white/10 p-5 mb-6">
              <h4 className="text-[13px] font-black text-white uppercase tracking-wide mb-3">{t('programDetails.advisor.schoolsTitle')}</h4>
              {matchedSchools.length > 0 ? (
                <div className="space-y-2 mb-4">
                  {matchedSchools.map((school) => (
                    <Link
                      key={school.id}
                      to={`/higher-schools/${school.slug}`}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group/school"
                    >
                      <div className="w-9 h-9 rounded-lg bg-blue-500/15 text-blue-300 flex items-center justify-center shrink-0">
                        <Building2 size={16} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-bold text-white truncate">{school.acronym || school.name}</p>
                        <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1"><MapPin size={10} />{school.city}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-[13px] font-medium leading-relaxed mb-4">{t('programDetails.advisor.schoolsEmpty')}</p>
              )}
              {primaryMatchedField && (
                <Link
                  to={`/higher-schools?field=${toSlug(primaryMatchedField)}`}
                  className="text-[12.5px] font-black text-blue-300 hover:text-blue-200 flex items-center gap-1.5"
                >
                  {t('programDetails.advisor.exploreSchoolsBtn')}
                  <ArrowLeft size={13} className="transform ltr:rotate-180" />
                </Link>
              )}
            </div>

            <p className="flex items-start gap-2 text-[11.5px] text-slate-500 font-medium leading-relaxed max-w-sm mx-auto mb-8 text-start">
              <Info size={14} className="shrink-0 mt-0.5" />
              {t('programDetails.advisor.disclaimer')}
            </p>

            <div className="flex flex-col gap-3 w-full">
              <a href="https://wa.me/212703749901" target="_blank" rel="noreferrer" className="px-8 py-3.5 bg-white text-slate-900 rounded-xl font-black hover:bg-blue-500 hover:text-white transition-colors text-center flex items-center justify-center">{t('programDetails.advisor.chatBtn')}</a>
              <button onClick={() => {
                setStep('intro');
                setLevel('');
                setCurrentQuestion(0);
                setAnswers([]);
                setResultType('');
                document.getElementById('ai-advisor')?.scrollIntoView({ behavior: 'smooth' });
              }} className="px-8 py-3.5 bg-slate-800 text-white rounded-2xl font-black border border-slate-700 hover:bg-slate-700 transition-all flex items-center justify-center gap-2">
                <RefreshCcw size={18} /> {t('programDetails.advisor.retryBtn')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Why orientation matters — paired with the AI advisor card in one section  */
/* -------------------------------------------------------------------------- */

const OrientationWhyAdvisor: React.FC = () => {
  const { t } = useTranslation();
  const points = (t('orientationPage.intro.points', { returnObjects: true }) as unknown as { title: string; desc: string }[]) || [];
  const pointIcons = [Fingerprint, Map, Target];

  return (
    <section className="max-w-6xl mx-auto px-4 py-20 scroll-mt-24" id="pourquoi">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
        <Reveal className="flex flex-col justify-center">
          <SectionEyebrow tone="text-blue-600" toneBg="bg-blue-50">{t('orientationPage.intro.eyebrow')}</SectionEyebrow>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight mt-5 mb-4">{t('orientationPage.intro.title')}</h2>
          <p className="text-slate-500 text-base md:text-lg font-medium leading-relaxed mb-10">{t('orientationPage.intro.desc')}</p>

          <div className="space-y-6">
            {points.map((p, i) => {
              const Icon = pointIcons[i] || Target;
              return (
                <Reveal key={p.title} delay={i * 100} className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Icon size={20} strokeWidth={2.2} />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 mb-1 tracking-tight">{p.title}</h3>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">{p.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={150}>
          <TawjihAIAdvisor />
        </Reveal>
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* What you get — the 4 concrete Tilmid orientation features                 */
/* -------------------------------------------------------------------------- */

const OrientationBenefits: React.FC = () => {
  const { t } = useTranslation();
  const features = TAWJIH_DATA.features;
  const icons = [Compass, FileCheck2, User, Target];

  return (
    <section className="max-w-6xl mx-auto px-4 py-20">
      <Reveal className="max-w-2xl mb-12 space-y-4">
        <SectionEyebrow tone="text-blue-600" toneBg="bg-blue-50">{t('orientationPage.benefits.eyebrow')}</SectionEyebrow>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">{t('orientationPage.benefits.title')}</h2>
      </Reveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {features.map((feature, i) => {
          const Icon = icons[i] || Target;
          return (
            <Reveal key={feature.title} delay={i * 80}>
              <div className="bg-slate-50/70 rounded-2xl border border-slate-100 p-6 h-full hover:border-blue-200 hover:bg-white transition-colors">
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
                  <Icon size={20} strokeWidth={2.2} />
                </div>
                <h3 className="text-[15px] font-black text-slate-900 mb-2 tracking-tight leading-snug">{t(feature.title)}</h3>
                <p className="text-slate-500 text-[13px] font-medium leading-relaxed">{t(feature.description)}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* How it works — 4 step process                                             */
/* -------------------------------------------------------------------------- */

const OrientationProcess: React.FC = () => {
  const { t } = useTranslation();
  const steps = (t('orientationPage.process.steps', { returnObjects: true }) as unknown as { title: string; desc: string }[]) || [];

  return (
    <section className="max-w-6xl mx-auto px-4 py-20 scroll-mt-24" id="etapes">
      <Reveal className="text-center max-w-2xl mx-auto mb-14 space-y-4">
        <SectionEyebrow tone="text-blue-600" toneBg="bg-blue-50">{t('orientationPage.process.eyebrow')}</SectionEyebrow>
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">{t('orientationPage.process.title')}</h2>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-0 relative">
        {steps.map((step, i) => (
          <Reveal key={step.title} delay={i * 100} className="relative flex md:block">
            {i < steps.length - 1 && (
              <div className="hidden md:block absolute top-6 start-[calc(50%+28px)] end-[calc(-50%+28px)] h-px bg-slate-200"></div>
            )}
            <div className="bg-white md:bg-transparent rounded-2xl md:rounded-none border md:border-0 border-slate-100 p-6 md:p-0 md:px-3 h-full relative z-10 text-start md:text-center">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-[15px] mb-5 mx-0 md:mx-auto shrink-0 relative z-10 ring-4 ring-white">
                0{i + 1}
              </div>
              <h3 className="text-base font-black text-slate-900 mb-2 tracking-tight">{step.title}</h3>
              <p className="text-slate-500 text-[13.5px] font-medium leading-relaxed">{step.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* Pricing packs — "Toutes les formules"                                     */
/* -------------------------------------------------------------------------- */

const ORIENTATION_PACK_PREVIEW_COUNT = 5;

const TIER_LABEL: Record<OrientationPackDef['tier'], string> = {
  info: 'Découverte',
  normal: 'Formule Normale',
  complet: 'Formule Complète',
};

const OrientationPackCard: React.FC<{ pack: OrientationPackDef; index: number; onChoose: (name: string) => void }> = ({ pack, index, onChoose }) => {
  const [expanded, setExpanded] = useState(false);
  const Icon = pack.icon;
  const isFeatured = Boolean(pack.badge);
  const hasMore = pack.features.length > ORIENTATION_PACK_PREVIEW_COUNT;
  const visibleFeatures = expanded ? pack.features : pack.features.slice(0, ORIENTATION_PACK_PREVIEW_COUNT);

  return (
    <Reveal delay={index * 80} className="h-full">
      <div className={`group relative h-full flex flex-col rounded-[2rem] bg-white transition-all duration-500 ${isFeatured ? 'border-2 border-blue-500 shadow-[0_20px_50px_-15px_rgba(59,130,246,0.35)] md:-translate-y-2' : 'border border-slate-100 shadow-[0_10px_30px_rgba(15,23,42,0.05)] hover:shadow-[0_18px_40px_rgba(15,23,42,0.09)] hover:-translate-y-1'}`}>
        {pack.badge && (
          <div className="absolute -top-3.5 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-blue-500 text-white shadow-lg shadow-blue-500/30 whitespace-nowrap flex items-center gap-1.5">
            <Star size={11} className="fill-current" />
            {pack.badge}
          </div>
        )}

        <div className="p-7 pb-5">
          <div className="flex items-center justify-between mb-5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${isFeatured ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`}>
              <Icon size={22} strokeWidth={2.2} />
            </div>
            <div className="text-end">
              <span className="block text-2xl font-black text-slate-900 tracking-tight tabular-nums leading-none">{pack.price}</span>
              <span className="block text-[11px] font-bold text-slate-400 mt-1">Paiement unique</span>
            </div>
          </div>

          <h3 className="text-lg font-black text-slate-900 tracking-tight mb-2">{pack.name}</h3>
          <div className="flex flex-wrap items-center gap-1.5 mb-3">
            <span className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-full ${pack.tier === 'complet' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>{TIER_LABEL[pack.tier]}</span>
            <span className="inline-block text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">{pack.audience}</span>
          </div>
          {pack.idealFor && <p className="text-slate-500 text-[13px] leading-relaxed font-medium">{pack.idealFor}</p>}
        </div>

        <div className="px-7 pb-7 flex flex-col flex-grow">
          <ul className="space-y-2.5 mb-4">
            {visibleFeatures.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-[13px] font-semibold text-slate-700 leading-relaxed">
                <CheckCircle size={15} className="text-blue-600 shrink-0 mt-0.5" />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          {hasMore && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="flex items-center gap-1.5 text-[12px] font-black text-blue-600 hover:text-blue-700 mb-5 transition-colors"
            >
              <span>{expanded ? 'Voir moins' : `Voir les ${pack.features.length} avantages`}</span>
              <ChevronDown size={14} className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
            </button>
          )}

          <p className="text-slate-500 text-[12.5px] italic leading-relaxed mb-6 pt-4 border-t border-slate-50">"{pack.positioning}"</p>

          <button
            type="button"
            onClick={() => onChoose(pack.name)}
            className={`mt-auto w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${isFeatured ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/25' : 'bg-slate-50 text-slate-900 hover:bg-slate-100 border border-slate-100'}`}
          >
            <span>Choisir ce pack</span>
            <ArrowLeft size={16} className="transform ltr:rotate-180 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </Reveal>
  );
};

const OrientationInfoBanner: React.FC<{ pack: OrientationPackDef; onChoose: (name: string) => void }> = ({ pack, onChoose }) => {
  const Icon = pack.icon;
  const highlights = pack.features.slice(0, 4);

  return (
    <Reveal>
      <div className="relative rounded-[2rem] bg-white border border-slate-100 shadow-[0_10px_30px_rgba(15,23,42,0.05)] p-7 md:p-9 flex flex-col md:flex-row md:items-center gap-7">
        <div className="flex items-center gap-4 md:w-64 shrink-0">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Icon size={26} strokeWidth={2.2} />
          </div>
          <div>
            <span className="inline-block text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 mb-1.5">{TIER_LABEL[pack.tier]}</span>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">{pack.name}</h3>
          </div>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 flex-grow">
          {highlights.map((f) => (
            <li key={f} className="flex items-start gap-2 text-[13px] font-semibold text-slate-700 leading-snug">
              <CheckCircle size={14} className="text-blue-600 shrink-0 mt-0.5" />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 md:w-44 shrink-0 md:border-s md:border-slate-100 md:ps-7">
          <div className="text-start md:text-end">
            <span className="block text-2xl font-black text-slate-900 tracking-tight tabular-nums leading-none">{pack.price}</span>
            <span className="block text-[11px] font-bold text-slate-400 mt-1">{pack.audience}</span>
          </div>
          <button
            type="button"
            onClick={() => onChoose(pack.name)}
            className="shrink-0 px-5 py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95 bg-slate-50 text-slate-900 hover:bg-slate-100 border border-slate-100 whitespace-nowrap"
          >
            <span>Choisir</span>
            <ArrowLeft size={16} className="transform ltr:rotate-180" />
          </button>
        </div>
      </div>
    </Reveal>
  );
};

const ORIENTATION_TRACK_TABS: { key: 'all' | 'science' | 'eco'; label: string }[] = [
  { key: 'all', label: 'Toutes les filières' },
  { key: 'science', label: 'Scientifique & Technique' },
  { key: 'eco', label: 'Économie & Commerce' },
];

const OrientationPacks: React.FC<{ onChoose: (name: string) => void }> = ({ onChoose }) => {
  const [track, setTrack] = useState<'all' | 'science' | 'eco'>('all');

  const infoPack = ORIENTATION_PACKS.find((p) => p.track === 'universal')!;
  const sciencePacks = ORIENTATION_PACKS.filter((p) => p.track === 'science');
  const ecoPacks = ORIENTATION_PACKS.filter((p) => p.track === 'eco');

  return (
    <section className="max-w-6xl mx-auto px-4 py-20 scroll-mt-24" id="formules">
      <Reveal className="text-center max-w-2xl mx-auto mb-10 space-y-4">
        <SectionEyebrow tone="text-blue-600" toneBg="bg-blue-50">Toutes les formules</SectionEyebrow>
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">Cinq packs, une seule mission</h2>
        <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-xl mx-auto">Comparez les formules et choisissez celle qui correspond à votre filière et à votre niveau d'autonomie.</p>
      </Reveal>

      <Reveal className="flex justify-center mb-14">
        <div className="inline-flex flex-wrap justify-center gap-1.5 p-1.5 rounded-2xl bg-slate-100">
          {ORIENTATION_TRACK_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setTrack(tab.key)}
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${track === tab.key ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </Reveal>

      <div className="space-y-16">
        <OrientationInfoBanner pack={infoPack} onChoose={onChoose} />

        {track !== 'eco' && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <FlaskConical size={18} />
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Filière Scientifique &amp; Technique</h3>
              <span className="text-[13px] font-semibold text-slate-400">PC · SM · SVT · STE · STM…</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {sciencePacks.map((pack, i) => (
                <OrientationPackCard key={pack.name} pack={pack} index={i + 1} onChoose={onChoose} />
              ))}
            </div>
          </div>
        )}

        {track !== 'science' && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <TrendingUp size={18} />
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Filière Économie &amp; Commerce</h3>
              <span className="text-[13px] font-semibold text-slate-400">ECO · SGC…</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {ecoPacks.map((pack, i) => (
                <OrientationPackCard key={pack.name} pack={pack} index={i + 1} onChoose={onChoose} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};


/* -------------------------------------------------------------------------- */
/* Breadcrumb — accessible, feeds BreadcrumbList structured data              */
/* -------------------------------------------------------------------------- */

const OrientationBreadcrumb: React.FC<{ current: string }> = ({ current }) => {
  const { t } = useTranslation();
  return (
    <nav aria-label="Fil d'Ariane" className="border-b border-slate-100 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <ol className="flex items-center gap-1.5 py-3 text-[12.5px] font-bold text-slate-400 overflow-x-auto whitespace-nowrap">
          <li className="flex items-center gap-1.5">
            <Link to="/" className="hover:text-blue-600 transition-colors">{t('nav.home')}</Link>
            <ChevronRight size={13} className="rtl:rotate-180 text-slate-300" />
          </li>
          <li className="text-slate-700" aria-current="page">{current}</li>
        </ol>
      </div>
    </nav>
  );
};

/* -------------------------------------------------------------------------- */
/* Jump nav — in-page table of contents, signals a structured document        */
/* -------------------------------------------------------------------------- */

const JUMP_LINK_IDS = ['pourquoi', 'ai-advisor', 'etapes', 'formules', 'faq'] as const;
const JUMP_LINK_KEYS: Record<typeof JUMP_LINK_IDS[number], string> = {
  pourquoi: 'orientationPage.jumpNav.pourquoi',
  'ai-advisor': 'orientationPage.jumpNav.advisor',
  etapes: 'orientationPage.jumpNav.etapes',
  formules: 'orientationPage.jumpNav.formules',
  faq: 'orientationPage.jumpNav.faq',
};

const OrientationJumpNav: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="border-y border-slate-100 bg-slate-50/60 hidden md:block">
      <div className="container mx-auto px-4 lg:px-8">
        <nav aria-label="Sections de la page" className="flex items-center gap-1 py-2.5 overflow-x-auto">
          {JUMP_LINK_IDS.map((id) => (
            <button
              key={id}
              onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="px-3.5 py-2 rounded-lg text-[13px] font-bold text-slate-500 hover:text-blue-700 hover:bg-white hover:shadow-sm transition-all whitespace-nowrap"
            >
              {t(JUMP_LINK_KEYS[id])}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Orientation hero — editorial two-column layout with real photography       */
/* -------------------------------------------------------------------------- */

const OrientationHero: React.FC<{
  title: string;
  desc: string;
  badge: string;
  primaryCta: string;
  secondaryCta: string;
}> = ({ title, desc, badge, primaryCta, secondaryCta }) => {
  const { t } = useTranslation();
  const stats = [
    { value: '+3500', label: t('programDetails.stats.beneficiaries') },
    { value: '98%', label: t('programDetails.stats.satisfaction') },
    { value: '+10', label: t('programDetails.stats.experience') },
  ];

  return (
    <section className="relative bg-white overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 pt-14 pb-16 lg:pt-20 lg:pb-20">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          <div className="lg:col-span-7">
            <Reveal>
              <div className="inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 text-[12.5px] font-bold ring-1 ring-blue-100">
                <Compass size={13} />
                <span className="tracking-wide">{badge}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold mb-6 tracking-tight leading-[1.1] text-slate-900">
                {title}
              </h1>

              <p className="text-[17px] leading-[1.7] text-slate-600 font-medium max-w-[560px] mb-9">
                {desc}
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-11">
                <button
                  onClick={() => document.getElementById('pourquoi')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full sm:w-auto h-[52px] px-8 bg-blue-600 text-white rounded-xl font-bold text-[15px] hover:bg-blue-700 transition-colors flex items-center justify-center gap-2.5 group"
                >
                  <span>{primaryCta}</span>
                  <ArrowLeft size={18} className="transform ltr:rotate-180 ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                </button>
                <a
                  href="https://wa.me/212703749901"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto h-[52px] px-8 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-[15px] hover:border-blue-200 hover:text-blue-700 hover:bg-blue-50/50 transition-colors flex items-center justify-center gap-2.5"
                >
                  <MessageCircle size={17} />
                  <span>{secondaryCta}</span>
                </a>
              </div>

              <dl className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-7 border-t border-slate-100">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <dt className="sr-only">{stat.label}</dt>
                    <dd className="text-2xl font-black text-slate-900 tabular-nums leading-none">{stat.value}</dd>
                    <span className="block text-[11.5px] font-bold text-slate-400 mt-1.5">{stat.label}</span>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={120}>
              <div className="relative rounded-[1.75rem] overflow-hidden bg-slate-100 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.25)] ring-1 ring-slate-100 aspect-[4/5] lg:aspect-[3/4]">
                <img
                  src={IMAGES.HERO.HOME_MAIN}
                  alt="Élève accompagné dans son orientation scolaire par un conseiller Tilmid"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-slate-900/85 via-slate-900/30 to-transparent">
                  <p className="text-white font-bold text-[13px] flex items-center gap-2">
                    <BadgeCheck size={16} className="text-blue-400 shrink-0" />
                    {t('orientationPage.testimonials.badge')}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* Commitment — trust strip using previously-unused i18n content              */
/* -------------------------------------------------------------------------- */

const OrientationCommitment: React.FC = () => {
  const { t } = useTranslation();
  const points = (t('orientationPage.commitment.points', { returnObjects: true }) as unknown as string[]) || [];

  return (
    <section className="max-w-6xl mx-auto px-4 py-14">
      <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12 bg-slate-50/70 rounded-[1.75rem] border border-slate-100 p-8 md:p-10">
        <Reveal className="lg:w-80 shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck size={20} className="text-blue-600 shrink-0" />
            <h2 className="text-xl font-black text-slate-900 tracking-tight">{t('orientationPage.commitment.title')}</h2>
          </div>
          <p className="text-slate-500 text-[14px] font-medium leading-relaxed">{t('orientationPage.commitment.desc')}</p>
        </Reveal>

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {points.map((point, i) => (
            <Reveal key={point} delay={i * 80} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-slate-100">
              <CheckCircle size={17} className="text-blue-600 shrink-0 mt-0.5" />
              <span className="text-[13.5px] font-bold text-slate-700 leading-snug">{point}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* FAQ — accessible accordion, feeds FAQPage structured data for SEO          */
/* -------------------------------------------------------------------------- */

const OrientationFAQ: React.FC = () => {
  const { t } = useTranslation();
  const items = (t('orientationPage.faq.items', { returnObjects: true }) as unknown as { q: string; a: string }[]) || [];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="max-w-3xl mx-auto px-4 py-20 scroll-mt-24" id="faq">
      <Reveal className="text-center mb-12 space-y-4">
        <SectionEyebrow tone="text-blue-600" toneBg="bg-blue-50">{t('orientationPage.faq.eyebrow')}</SectionEyebrow>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">{t('orientationPage.faq.title')}</h2>
      </Reveal>

      <div className="space-y-3">
        {items.map((item, i) => {
          const isOpen = openIndex === i;
          const panelId = `tawjih-faq-panel-${i}`;
          const buttonId = `tawjih-faq-button-${i}`;
          return (
            <Reveal key={item.q} delay={i * 40}>
              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <h3>
                  <button
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-start min-h-[44px]"
                  >
                    <span className="text-[15px] font-black text-slate-900">{item.q}</span>
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${isOpen ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400'}`}>
                      <ChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`grid transition-all duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                >
                  <div className="overflow-hidden">
                    <p className="text-slate-500 font-medium leading-relaxed text-[14px] px-5 pb-5 border-t border-slate-50 pt-4">{item.a}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* Testimonials                                                               */
/* -------------------------------------------------------------------------- */

const OrientationTestimonials: React.FC = () => {
  const { t } = useTranslation();
  const [stories, setStories] = useState<SuccessStory[]>([]);

  useEffect(() => {
    dataManager.getStories().then(setStories).catch(() => setStories([]));
  }, []);

  if (stories.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 py-20">
      <Reveal className="text-center max-w-2xl mx-auto mb-14 space-y-4">
        <SectionEyebrow tone="text-blue-600" toneBg="bg-blue-50">{t('orientationPage.testimonials.eyebrow')}</SectionEyebrow>
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">{t('orientationPage.testimonials.title')}</h2>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stories.slice(0, 3).map((story, i) => (
          <Reveal key={story.id} delay={i * 100}>
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 hover:border-blue-200 transition-colors duration-300 h-full flex flex-col">
              <div className="flex items-center gap-4 mb-5">
                <img src={story.image} alt={story.name} className="w-14 h-14 rounded-full object-cover ring-4 ring-white shadow-md" />
                <div className="text-start">
                  <h4 className="font-black text-slate-900 text-base">{story.name}</h4>
                  <span className="text-blue-600 text-xs font-bold uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-full">{story.role}</span>
                </div>
                <Quote size={22} className="ms-auto text-slate-200 shrink-0" fill="currentColor" />
              </div>
              <p className="text-slate-600 font-medium leading-relaxed text-[15px] text-start flex-grow">"{story.content}"</p>
              <div className="mt-6 pt-5 border-t border-slate-50 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[11px] font-black">
                  <CheckCircle size={13} />
                  {t('orientationPage.testimonials.badge')}
                </span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(star => <Star key={star} size={13} className="text-yellow-400 fill-yellow-400" />)}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* Final CTA                                                                  */
/* -------------------------------------------------------------------------- */

const OrientationFinalCTA: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="max-w-5xl mx-auto px-4 py-20">
      <Reveal>
        <div className="relative rounded-[1.75rem] overflow-hidden bg-gradient-to-br from-[#08142F] via-[#101D48] to-[#0B1330] border border-white/5 p-10 md:p-14 text-center">
          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.16em] bg-blue-500/10 text-blue-300 ring-1 ring-blue-400/20 mb-6">
              <CompassIcon size={12} />
              {t('orientationPage.finalCta.eyebrow')}
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-5 tracking-tight leading-tight">{t('orientationPage.finalCta.title')}</h2>
            <p className="text-slate-300 text-base md:text-lg font-medium leading-relaxed mb-10 max-w-xl mx-auto">{t('orientationPage.finalCta.desc')}</p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => document.getElementById('ai-advisor')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto px-9 py-4 bg-blue-500 text-white rounded-xl font-black text-base md:text-lg hover:bg-blue-400 transition-colors active:scale-95 flex items-center justify-center gap-3"
              >
                <span>{t('orientationPage.finalCta.primaryCta')}</span>
                <ArrowLeft size={20} className="transform ltr:rotate-180" />
              </button>
              <a
                href="https://wa.me/212703749901"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-9 py-4 bg-white/5 text-white border border-white/15 rounded-xl font-black text-base md:text-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-3"
              >
                <MessageCircle size={20} />
                <span>{t('orientationPage.finalCta.secondaryCta')}</span>
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export const ProgramDetails: React.FC = () => {
  const { t } = useTranslation();
  const { pathname } = window.location;
  const basePath = pathname.replace('/', '');
  const [activeTab, setActiveTab] = useState<'tilmid' | 'talib'>('tilmid');
  const navigate = useNavigate();

  const goToOrientationForm = (packName: string) => {
    navigate('/tawjih/inscription', { state: { pack: packName } });
  };

  const id = basePath === 'tilmid-talib' ? activeTab : basePath;
  const isTawjih = id === 'tawjih';

  let data: ProgramData | null = null;
  let ProgramIcon = School;

  let theme = {
    primary: 'text-primary',
    bg: 'bg-primary',
    gradient: 'from-[#0037ff] via-[#2563eb] to-[#06b6d4]',
    lightBg: 'bg-blue-50',
    border: 'border-blue-100',
    accent: 'text-cyan-600',
    blob1: 'bg-white',
    blob2: 'bg-cyan-200',
    button: 'bg-primary hover:bg-blue-600',
    iconBg: 'bg-white/10'
  };

  switch (id) {
    case 'tawjih':
      data = TAWJIH_DATA;
      ProgramIcon = Compass;
      theme = {
        primary: 'text-blue-600',
        bg: 'bg-blue-600',
        gradient: 'from-[#0B3D91] via-[#1D5FD6] to-[#22A9E0]',
        lightBg: 'bg-blue-50',
        border: 'border-blue-100',
        accent: 'text-cyan-500',
        blob1: 'bg-cyan-200',
        blob2: 'bg-blue-300',
        button: 'bg-blue-600 hover:bg-blue-700',
        iconBg: 'bg-blue-900/10'
      };
      break;
    case 'tilmid':
      data = TILMID_DATA;
      ProgramIcon = School;
      theme = {
        primary: 'text-blue-600',
        bg: 'bg-blue-600',
        gradient: 'from-[#1e3a8a] via-[#2563eb] to-[#06b6d4]',
        lightBg: 'bg-blue-50',
        border: 'border-blue-100',
        accent: 'text-cyan-500',
        blob1: 'bg-blue-300',
        blob2: 'bg-cyan-200',
        button: 'bg-blue-600 hover:bg-blue-700',
        iconBg: 'bg-blue-900/10'
      };
      break;
    case 'talib':
      data = TALIB_DATA;
      ProgramIcon = GraduationCap;
      theme = {
        primary: 'text-violet-600',
        bg: 'bg-violet-600',
        gradient: 'from-[#2e1065] via-[#7c3aed] to-[#d946ef]',
        lightBg: 'bg-violet-50',
        border: 'border-violet-100',
        accent: 'text-fuchsia-500',
        blob1: 'bg-fuchsia-400',
        blob2: 'bg-violet-400',
        button: 'bg-violet-600 hover:bg-violet-700',
        iconBg: 'bg-violet-900/10'
      };
      break;
  }

  useEffect(() => {
    if (data) {
      window.scrollTo(0, 0);
    }
  }, [data]);

  if (!data) return <Navigate to="/" />;

  const stats = [
    { value: "+3500", label: t('programDetails.stats.beneficiaries'), icon: User },
    { value: "98%", label: t('programDetails.stats.satisfaction'), icon: CheckCircle },
    { value: "+10", label: t('programDetails.stats.experience'), icon: Clock },
  ];

  // Copy that differs for the Orientation page vs. the (currently unrouted) Tilmid/Talib themes.
  const badgeLabel = isTawjih ? t('orientationPage.hero.badge') : t('programDetails.mostRequested');
  const heroDesc = isTawjih ? t('orientationPage.hero.description') : t(data.subtitle);
  const primaryCtaLabel = isTawjih ? t('orientationPage.hero.primaryCta') : t('programDetails.discoverProgram');

  const benefitsTitle = t('programDetails.programFeatures');

  const helpTitle = isTawjih ? t('orientationPage.helpCard.title') : t('programDetails.helpCard.title');
  const helpDesc = isTawjih ? t('orientationPage.helpCard.desc') : t('programDetails.helpCard.desc');
  const helpWhatsapp = isTawjih ? t('orientationPage.helpCard.whatsappBtn') : t('programDetails.helpCard.whatsappBtn');
  const helpConsult = isTawjih ? t('orientationPage.helpCard.consultBtn') : t('programDetails.helpCard.consultBtn');

  const commitmentTitle = t('programDetails.guarantee.title');
  const commitmentDesc = t('programDetails.guarantee.desc');

  const faqItems = isTawjih
    ? (t('orientationPage.faq.items', { returnObjects: true }) as unknown as { q: string; a: string }[]) || []
    : [];

  const tawjihJsonLd = isTawjih
    ? [
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: t('nav.home'), item: 'https://tilmide.ma/' },
            { '@type': 'ListItem', position: 2, name: t(data.title), item: 'https://tilmide.ma/tawjih' },
          ],
        },
        {
          '@type': 'Service',
          serviceType: t(data.title),
          name: `${t(data.title)} - Tilmid`,
          description: t(data.subtitle),
          provider: { '@type': 'Organization', name: 'Tilmid', url: 'https://tilmide.ma' },
          areaServed: { '@type': 'Country', name: 'Morocco' },
        },
        ...(faqItems.length > 0
          ? [{
              '@type': 'FAQPage',
              mainEntity: faqItems.map((item) => ({
                '@type': 'Question',
                name: item.q,
                acceptedAnswer: { '@type': 'Answer', text: item.a },
              })),
            }]
          : []),
      ]
    : undefined;

  return (
    <div className="min-h-screen bg-slate-50 pb-20 overflow-x-hidden font-sans selection:bg-primary/30">
      <SEO
        title={`${t(data.title)} - Tilmid`}
        description={t(data.subtitle)}
        url={isTawjih ? '/tawjih' : undefined}
        jsonLd={tawjihJsonLd}
      />

      {isTawjih && <OrientationBreadcrumb current={t(data.title)} />}

      {/* Hero Section */}
      {isTawjih ? (
        <>
          <OrientationHero
            title={t(data.title)}
            desc={heroDesc}
            badge={badgeLabel}
            primaryCta={primaryCtaLabel}
            secondaryCta={t('orientationPage.hero.secondaryCta')}
          />
          <OrientationJumpNav />
        </>
      ) : (
        <div className={`relative pt-16 pb-32 lg:pt-24 lg:pb-64 overflow-hidden text-white bg-gradient-to-br ${theme.gradient} transition-all duration-1000`}>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className={`absolute top-[-20%] start-[-10%] w-[800px] h-[800px] rounded-full blur-[120px] opacity-30 animate-blob ${theme.blob1}`}></div>
            <div className={`absolute bottom-[-20%] end-[-10%] w-[600px] h-[600px] rounded-full blur-[100px] opacity-30 animate-blob animation-delay-2000 ${theme.blob2}`}></div>
            <div className="absolute top-[40%] start-[20%] w-[400px] h-[400px] bg-white rounded-full blur-[90px] opacity-10 animate-pulse"></div>
            <div
              className="absolute inset-0 opacity-[0.25] [mask-image:radial-gradient(ellipse_55%_55%_at_50%_20%,black,transparent)]"
              style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '28px 28px' }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent"></div>
          </div>

          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="max-w-5xl mx-auto text-center animate-fade-in-up">

              {basePath === 'tilmid-talib' && (
                <div className="flex justify-center mb-8 relative z-50">
                  <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-full inline-flex border border-white/20 shadow-lg">
                    <button
                      onClick={() => setActiveTab('tilmid')}
                      className={`px-8 py-2.5 rounded-full text-base md:text-lg font-black transition-all ${activeTab === 'tilmid' ? 'bg-white text-blue-600 shadow-md' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
                    >
                      {t('programDetails.tabTilmid')}
                    </button>
                    <button
                      onClick={() => setActiveTab('talib')}
                      className={`px-8 py-2.5 rounded-full text-base md:text-lg font-black transition-all ${activeTab === 'talib' ? 'bg-white text-violet-600 shadow-md' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
                    >
                      {t('programDetails.tabTalib')}
                    </button>
                  </div>
                </div>
              )}

              <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[13px] font-bold shadow-lg ring-1 ring-white/10">
                <Sparkles size={14} className="text-yellow-300" />
                <span className="tracking-wide">{badgeLabel}</span>
              </div>

              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 backdrop-blur-2xl rounded-[1.4rem] mb-8 shadow-2xl border border-white/20 mx-auto flex items-center justify-center group/icon relative">
                <div className="absolute inset-x-2 top-1 h-1/3 bg-white/20 rounded-full blur-sm"></div>
                <ProgramIcon size={30} className="text-white relative z-10" strokeWidth={1.8} />
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-extrabold mb-6 tracking-tight leading-[1.08] drop-shadow-sm">
                {t(data.title)}
              </h1>

              <p className="text-[18px] leading-[1.6] text-white/90 font-medium max-w-[600px] mx-auto">
                {heroDesc}
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full sm:w-auto h-[52px] px-9 bg-white text-slate-900 rounded-2xl font-bold text-base md:text-lg hover:bg-slate-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 flex items-center justify-center gap-3 group"
                >
                  <span>{primaryCtaLabel}</span>
                  <ArrowLeft size={19} className="transform ltr:rotate-180 ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`container mx-auto px-4 lg:px-8 relative z-20 ${isTawjih ? '' : '-mt-24 lg:-mt-32'}`}>

        {/* Trust metrics */}
        {!isTawjih && (
          <div className="bg-white/80 backdrop-blur-2xl rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] p-6 md:p-10 mb-20 border border-white/50 relative z-30 max-w-5xl mx-auto overflow-hidden group">
            <div className={`absolute top-0 start-0 w-full h-1 ltr:bg-gradient-to-r rtl:bg-gradient-to-l ${theme.gradient} opacity-50`}></div>
            <div className="absolute -start-20 -bottom-20 w-64 h-64 bg-slate-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 items-center relative z-10 md:divide-x md:divide-slate-100 rtl:md:divide-x-reverse">
              {stats.map((stat, idx) => (
                <div key={idx} className={`flex flex-col items-center text-center gap-3 p-4 rounded-3xl group/stat hover:bg-white/50 transition-colors duration-300 ${idx === 2 ? 'col-span-2 md:col-span-1' : ''}`}>
                  <div className={`w-16 h-16 rounded-[1.5rem] ${idx === 1 ? 'bg-yellow-100 text-yellow-600 border-yellow-200' : theme.lightBg + ' ' + theme.primary + ' ' + theme.border} border-2 flex items-center justify-center shadow-lg group-hover/stat:scale-110 transition-transform bg-white relative z-10`}>
                    <stat.icon size={32} strokeWidth={2} />
                  </div>
                  <div>
                    <h4 className="text-3xl font-black text-slate-900 mb-1 tracking-tight tabular-nums">{stat.value}</h4>
                    <p className="text-xs text-slate-500 font-black uppercase tracking-widest">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {isTawjih && <OrientationWhyAdvisor />}
        {isTawjih && <OrientationBenefits />}
        {isTawjih && <OrientationProcess />}
        {isTawjih && <OrientationPacks onChoose={goToOrientationForm} />}
        {isTawjih && <OrientationCommitment />}
        {isTawjih && <OrientationFAQ />}

        {!isTawjih && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24" id="features">

            <div className="lg:col-span-8 space-y-12">
              <div className="relative px-2">
                <div className="flex items-center gap-4 mb-8">
                  <div className={`w-10 h-10 rounded-xl ${theme.lightBg} flex items-center justify-center ${theme.primary}`}>
                    <Sparkles size={20} />
                  </div>
                </div>
                <h2 className="text-2xl md:text-4xl font-bold text-slate-900 tracking-tight mb-8">{benefitsTitle}</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                  {data.features.map((feature, idx) => (
                    <FeatureStep
                      key={idx}
                      feature={feature}
                      index={idx}
                      themeColor={theme.primary}
                      lightThemeBg={theme.lightBg}
                      borderColor={theme.border}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Sticky Sidebar */}
            <div className="lg:col-span-4 relative">
              <div className="lg:sticky lg:top-[110px] space-y-8">
                {/* Advisor contact card */}
                <div id="registration-card" className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 p-6 border border-slate-100 text-center relative overflow-hidden group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 ring-4 ring-slate-50/50">
                  <div className={`absolute top-0 start-0 w-full h-1.5 ltr:bg-gradient-to-r rtl:bg-gradient-to-l ${theme.gradient}`}></div>

                  <div className="relative z-10">
                    <div className={`w-20 h-20 mx-auto rounded-[1.75rem] ${theme.lightBg} flex items-center justify-center ${theme.primary} mb-6 shadow-inner border-4 border-white group-hover:scale-105 transition-transform duration-700 relative`}>
                      <MessageCircle size={34} strokeWidth={2} />
                      <div className="absolute top-0 end-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                    </div>

                    <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">{helpTitle}</h3>
                    <p className="text-slate-500 mb-7 text-sm font-bold leading-relaxed px-2">{helpDesc}</p>

                    <div className="space-y-3">
                      <a href="https://wa.me/message/GN4XKUOMHNHGO1" target="_blank" rel="noreferrer" className="w-full min-h-[52px] py-3.5 bg-[#25D366] hover:bg-[#1ebc56] text-white rounded-2xl font-black shadow-[0_10px_20px_-5px_rgba(37,211,102,0.3)] flex items-center justify-center gap-3 text-base group/btn active:scale-95 transition-all relative overflow-hidden">
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                        <MessageCircle size={22} fill="white" className="relative z-10" />
                        <span className="relative z-10">{helpWhatsapp}</span>
                      </a>

                      <Link to="/contact" className={`w-full min-h-[52px] py-3.5 bg-white border-2 rounded-2xl font-black transition-all flex items-center justify-center gap-2 text-base hover:bg-slate-50 active:scale-95 group/cal ${theme.primary} ${theme.border}`}>
                        <span>{helpConsult}</span>
                        <Calendar size={19} className="group-hover/cal:-translate-y-1 transition-transform" />
                      </Link>
                    </div>
                  </div>

                  <div className="mt-7 pt-6 border-t border-slate-50">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex -space-x-3 rtl:space-x-reverse">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-100 overflow-hidden shadow-sm hover:z-10 hover:scale-110 transition-transform cursor-pointer">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + id! + 'student'}`} alt="Student" className="w-full h-full object-cover" />
                          </div>
                        ))}
                        <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-black border-4 border-white shadow-sm">+3k</div>
                      </div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{t('programDetails.helpCard.communityLabel')}</p>
                    </div>
                  </div>
                </div>

                {/* Commitment / guarantee card */}
                <div className={`p-8 rounded-[2.5rem] ${theme.bg} text-white shadow-2xl relative overflow-hidden group hover:-translate-y-1 transition-all duration-500`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent pointer-events-none"></div>
                  <div className="absolute -end-20 -bottom-20 opacity-20 rotate-12 group-hover:scale-110 group-hover:rotate-6 transition-all duration-1000">
                    <ProgramIcon size={200} />
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 bg-white/20 rounded-2xl backdrop-blur-md flex items-center justify-center shadow-inner ring-1 ring-white/30">
                        <ShieldCheck size={28} strokeWidth={2.5} />
                      </div>
                      <h4 className="font-black text-xl tracking-tight leading-none">{commitmentTitle}</h4>
                    </div>

                    <p className="text-white/90 text-base leading-relaxed font-bold mb-5">
                      {commitmentDesc}
                    </p>

                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg text-xs font-bold border border-white/20">
                      <Check size={12} strokeWidth={4} />
                      <span>{t('programDetails.guarantee.badge')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {isTawjih && <OrientationTestimonials />}
        {isTawjih && <OrientationFinalCTA />}

      </div>
    </div>
  );
};
