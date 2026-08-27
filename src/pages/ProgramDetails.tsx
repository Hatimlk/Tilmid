
import React, { useEffect, useState, useRef } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TAWJIH_DATA, TILMID_DATA, TALIB_DATA } from '../constants';
import { ORIENTATION_PACKS, OrientationPackDef } from '../constants/orientationPacks';
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
  Compass as CompassIcon,
  FlaskConical,
  TrendingUp
} from 'lucide-react';
import SEO from '../components/SEO';

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

const TawjihAIAdvisor: React.FC = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState<'intro' | 'quiz' | 'analyzing' | 'result'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [resultType, setResultType] = useState<string>('');

  const translatedQuestions = t('programDetails.advisor.questions', { returnObjects: true }) as any[];
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

  return (
    <div className="relative group p-1 rounded-[3rem] bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 transition-all duration-700 hover:shadow-[0_0_80px_-20px_rgba(0,149,255,0.3)] h-full" id="ai-advisor">
      <div className="bg-slate-900 rounded-[2.75rem] shadow-2xl overflow-hidden relative min-h-[480px] h-full flex flex-col border border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,149,255,0.08)_0%,transparent_70%)] animate-pulse"></div>

        {step === 'intro' && (
          <div className="relative z-10 flex-grow flex flex-col items-center text-center gap-8 p-8 md:p-10">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.16em] bg-blue-500/10 text-blue-300 ring-1 ring-blue-400/20">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              {t('orientationPage.advisor.eyebrow')}
            </span>

            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 rounded-[1.6rem] blur-xl animate-glow-pulse"></div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-royal rounded-[1.4rem] flex items-center justify-center relative shadow-xl overflow-hidden">
                <BrainCircuit size={32} className="text-white relative z-10" />
              </div>
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tight leading-tight">{t('programDetails.advisor.title')}</h2>
              <p className="text-blue-200 text-sm md:text-base font-medium opacity-80 leading-relaxed max-w-sm mx-auto">
                {t('programDetails.advisor.desc')}
              </p>
            </div>

            <button
              onClick={() => setStep('quiz')}
              className="w-full px-9 py-4 bg-white text-slate-900 rounded-2xl font-bold text-base shadow-xl hover:bg-primary hover:text-white hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              <span>{t('programDetails.advisor.startBtn')}</span>
              <ArrowLeft size={20} className="transform ltr:rotate-180 ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
            </button>
            <p className="-mt-4 text-blue-300/70 text-xs font-bold uppercase tracking-widest">{t('orientationPage.advisor.note')}</p>
          </div>
        )}

        {step === 'quiz' && (
          <div className="relative z-10 flex-grow flex flex-col p-8 md:p-10">
            <div className="flex justify-between items-center mb-8">
              <span className="text-blue-400 font-black text-xs uppercase tracking-widest">{t('programDetails.advisor.stepTracker', { current: currentQuestion + 1, total: questions.length })}</span>
              <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}></div>
              </div>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-white mb-8 text-start leading-tight">{questions[currentQuestion].text}</h3>
            <div className="grid grid-cols-1 gap-4">
              {questions[currentQuestion].options.map((o: any, i: number) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(o.type)}
                  className="p-5 bg-slate-800/50 hover:bg-white text-gray-200 hover:text-slate-900 text-start transition-all rounded-2xl font-black text-base border border-slate-700 shadow-lg group/opt flex items-center justify-between"
                >
                  <span>{o.label}</span>
                  <div className="w-8 h-8 rounded-full border-2 border-slate-600 group-hover/opt:border-primary flex items-center justify-center transition-colors shrink-0">
                    <Check size={16} className="opacity-0 group-hover/opt:opacity-100" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'analyzing' && (
          <div className="flex-grow flex flex-col items-center justify-center text-white p-10">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 animate-pulse"></div>
              <Cpu size={64} className="animate-spin mb-8 text-blue-400 relative z-10" />
            </div>
            <h3 className="font-black text-2xl mb-4 text-center">{t('programDetails.advisor.analyzingTitle')}</h3>
            <p className="text-blue-100 opacity-60 font-bold text-center">{t('programDetails.advisor.analyzingDesc')}</p>
          </div>
        )}

        {step === 'result' && (
          <div className="relative z-10 p-8 md:p-10 text-center text-white animate-in zoom-in duration-500 flex flex-col items-center flex-grow justify-center">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-green-500/10 text-green-400 rounded-full text-xs font-black mb-6 border border-green-500/20">
              <CheckCircle size={16} /> {t('programDetails.advisor.resultSuccess')}
            </div>
            <h2 className="text-2xl md:text-3xl font-black mb-4 leading-tight">{t('programDetails.advisor.resultPrefix')} <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-purple-400 drop-shadow-sm">{getResult().t}</span></h2>
            <p className="text-sm md:text-base text-blue-100 mb-8 max-w-sm mx-auto font-bold opacity-80 leading-relaxed">{getResult().d}</p>

            <div className="flex flex-col gap-3 w-full">
              <a href="https://wa.me/212703749901" target="_blank" rel="noreferrer" className="px-8 py-3.5 bg-white text-slate-900 rounded-2xl font-black hover:bg-primary hover:text-white transition-all text-center flex items-center justify-center">{t('programDetails.advisor.chatBtn')}</a>
              <button onClick={() => {
                setStep('intro');
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
    <section className="max-w-6xl mx-auto px-4 my-24" id="features">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
        <Reveal className="flex flex-col justify-center">
          <SectionEyebrow tone="text-emerald-600" toneBg="bg-emerald-50">{t('orientationPage.intro.eyebrow')}</SectionEyebrow>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight mt-5 mb-4">{t('orientationPage.intro.title')}</h2>
          <p className="text-slate-500 text-base md:text-lg font-medium leading-relaxed mb-10">{t('orientationPage.intro.desc')}</p>

          <div className="space-y-6">
            {points.map((p, i) => {
              const Icon = pointIcons[i] || Target;
              return (
                <Reveal key={p.title} delay={i * 100} className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
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
/* How it works — 4 step process                                             */
/* -------------------------------------------------------------------------- */

const OrientationProcess: React.FC = () => {
  const { t } = useTranslation();
  const steps = (t('orientationPage.process.steps', { returnObjects: true }) as unknown as { title: string; desc: string }[]) || [];
  const stepIcons = [User, Compass, Map, FileCheck2];

  return (
    <section className="max-w-6xl mx-auto px-4 my-24">
      <Reveal className="text-center max-w-2xl mx-auto mb-14 space-y-4">
        <SectionEyebrow tone="text-emerald-600" toneBg="bg-emerald-50">{t('orientationPage.process.eyebrow')}</SectionEyebrow>
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">{t('orientationPage.process.title')}</h2>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4 relative">
        {steps.map((step, i) => {
          const Icon = stepIcons[i] || Target;
          return (
            <Reveal key={step.title} delay={i * 100} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 start-full w-full h-px bg-gradient-to-r from-emerald-200 to-transparent rtl:bg-gradient-to-l -z-0" style={{ width: '2rem' }}></div>
              )}
              <div className="bg-white rounded-[1.75rem] border border-slate-100 p-6 h-full shadow-[0_10px_30px_rgba(15,23,42,0.05)] hover:shadow-[0_18px_40px_rgba(15,23,42,0.09)] hover:-translate-y-1 transition-all duration-500 relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Icon size={22} strokeWidth={2.2} />
                  </div>
                  <span className="text-4xl font-black text-slate-100 tabular-nums leading-none">0{i + 1}</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-2 tracking-tight">{step.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{step.desc}</p>
              </div>
            </Reveal>
          );
        })}
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
      <div className={`group relative h-full flex flex-col rounded-[2rem] bg-white transition-all duration-500 ${isFeatured ? 'border-2 border-emerald-500 shadow-[0_20px_50px_-15px_rgba(16,185,129,0.35)] md:-translate-y-2' : 'border border-slate-100 shadow-[0_10px_30px_rgba(15,23,42,0.05)] hover:shadow-[0_18px_40px_rgba(15,23,42,0.09)] hover:-translate-y-1'}`}>
        {pack.badge && (
          <div className="absolute -top-3.5 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 whitespace-nowrap flex items-center gap-1.5">
            <Star size={11} className="fill-current" />
            {pack.badge}
          </div>
        )}

        <div className="p-7 pb-5">
          <div className="flex items-center justify-between mb-5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${isFeatured ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-600'}`}>
              <Icon size={22} strokeWidth={2.2} />
            </div>
            <div className="text-end">
              <span className="block text-2xl font-black text-slate-900 tracking-tight tabular-nums leading-none">{pack.price}</span>
              <span className="block text-[11px] font-bold text-slate-400 mt-1">Paiement unique</span>
            </div>
          </div>

          <h3 className="text-lg font-black text-slate-900 tracking-tight mb-2">{pack.name}</h3>
          <div className="flex flex-wrap items-center gap-1.5 mb-3">
            <span className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-full ${pack.tier === 'complet' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>{TIER_LABEL[pack.tier]}</span>
            <span className="inline-block text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">{pack.audience}</span>
          </div>
          {pack.idealFor && <p className="text-slate-500 text-[13px] leading-relaxed font-medium">{pack.idealFor}</p>}
        </div>

        <div className="px-7 pb-7 flex flex-col flex-grow">
          <ul className="space-y-2.5 mb-4">
            {visibleFeatures.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-[13px] font-semibold text-slate-700 leading-relaxed">
                <CheckCircle size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          {hasMore && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="flex items-center gap-1.5 text-[12px] font-black text-emerald-600 hover:text-emerald-700 mb-5 transition-colors"
            >
              <span>{expanded ? 'Voir moins' : `Voir les ${pack.features.length} avantages`}</span>
              <ChevronDown size={14} className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
            </button>
          )}

          <p className="text-slate-500 text-[12.5px] italic leading-relaxed mb-6 pt-4 border-t border-slate-50">"{pack.positioning}"</p>

          <button
            type="button"
            onClick={() => onChoose(pack.name)}
            className={`mt-auto w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${isFeatured ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/25' : 'bg-slate-50 text-slate-900 hover:bg-slate-100 border border-slate-100'}`}
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
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
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
              <CheckCircle size={14} className="text-emerald-600 shrink-0 mt-0.5" />
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
    <section className="max-w-6xl mx-auto px-4 my-24">
      <Reveal className="text-center max-w-2xl mx-auto mb-10 space-y-4">
        <SectionEyebrow tone="text-emerald-600" toneBg="bg-emerald-50">Toutes les formules</SectionEyebrow>
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
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${track === tab.key ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
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
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
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
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
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
/* Orientation hero — distinct light-mode layout w/ a compass visual          */
/* -------------------------------------------------------------------------- */

const OrientationHero: React.FC<{
  title: string;
  desc: string;
  badge: string;
  primaryCta: string;
  secondaryCta: string;
}> = ({ title, desc, badge, primaryCta, secondaryCta }) => {
  const badgeIcons = [School, Target, BrainCircuit];

  return (
    <div className="relative pt-16 pb-20 lg:pt-24 lg:pb-24 overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-white">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-15%] end-[-10%] w-[500px] h-[500px] bg-emerald-200/40 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-15%] start-[-10%] w-[400px] h-[400px] bg-teal-200/40 rounded-full blur-[90px]"></div>
        <div
          className="absolute inset-0 opacity-[0.35] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]"
          style={{ backgroundImage: 'radial-gradient(rgba(16,185,129,0.15) 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        ></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <Reveal className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-[13px] font-bold ring-1 ring-emerald-200">
            <Compass size={14} />
            <span className="tracking-wide">{badge}</span>
          </div>

          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-8 bg-emerald-600 rounded-[1.4rem] shadow-xl shadow-emerald-600/20 flex items-center justify-center relative">
            <div className="absolute inset-x-2 top-1 h-1/3 bg-white/20 rounded-full blur-sm"></div>
            <Compass size={30} className="text-white relative z-10" strokeWidth={1.8} />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-tight leading-[1.08] text-slate-900">
            {title}
          </h1>

          <p className="text-[18px] leading-[1.6] text-slate-600 font-medium max-w-[600px] mx-auto mb-10">
            {desc}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto h-[52px] px-9 bg-emerald-600 text-white rounded-2xl font-bold text-base md:text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 hover:-translate-y-0.5 flex items-center justify-center gap-3 group"
            >
              <span>{primaryCta}</span>
              <ArrowLeft size={19} className="transform ltr:rotate-180 ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
            </button>
            <a
              href="https://wa.me/212703749901"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto h-[52px] px-9 bg-white text-emerald-700 border-2 border-emerald-100 rounded-2xl font-bold text-base md:text-lg hover:bg-emerald-50 transition-all flex items-center justify-center gap-3"
            >
              <MessageCircle size={19} />
              <span>{secondaryCta}</span>
            </a>
          </div>

          <div className="flex items-center justify-center gap-3">
            {badgeIcons.map((Icon, i) => (
              <div key={i} className="w-11 h-11 bg-white rounded-2xl shadow-lg border border-slate-100 flex items-center justify-center">
                <Icon size={20} className="text-emerald-600" />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
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
    <section className="max-w-6xl mx-auto px-4 my-24">
      <Reveal className="text-center max-w-2xl mx-auto mb-14 space-y-4">
        <SectionEyebrow tone="text-emerald-600" toneBg="bg-emerald-50">{t('orientationPage.testimonials.eyebrow')}</SectionEyebrow>
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">{t('orientationPage.testimonials.title')}</h2>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stories.slice(0, 3).map((story, i) => (
          <Reveal key={story.id} delay={i * 100}>
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-[0_10px_30px_rgba(15,23,42,0.05)] hover:shadow-[0_18px_40px_rgba(15,23,42,0.09)] hover:-translate-y-1 transition-all duration-500 h-full flex flex-col">
              <div className="flex items-center gap-4 mb-5">
                <img src={story.image} alt={story.name} className="w-14 h-14 rounded-full object-cover ring-4 ring-white shadow-md" />
                <div className="text-start">
                  <h4 className="font-black text-slate-900 text-base">{story.name}</h4>
                  <span className="text-emerald-600 text-xs font-bold uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-full">{story.role}</span>
                </div>
                <Quote size={22} className="ms-auto text-slate-200 shrink-0" fill="currentColor" />
              </div>
              <p className="text-slate-600 font-medium leading-relaxed text-[15px] text-start flex-grow">"{story.content}"</p>
              <div className="mt-6 pt-5 border-t border-slate-50 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-black">
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
    <section className="max-w-5xl mx-auto px-4 my-24">
      <Reveal>
        <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-[#08142F] via-[#0D1B3D] to-[#064e3b] border border-white/5 shadow-2xl p-10 md:p-16 text-center">
          <div className="absolute top-0 start-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.16em] bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-400/20 mb-6">
              <CompassIcon size={12} />
              {t('orientationPage.finalCta.eyebrow')}
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-5 tracking-tight leading-tight">{t('orientationPage.finalCta.title')}</h2>
            <p className="text-slate-300 text-base md:text-lg font-medium leading-relaxed mb-10 max-w-xl mx-auto">{t('orientationPage.finalCta.desc')}</p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => document.getElementById('ai-advisor')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto px-9 py-4 bg-emerald-500 text-white rounded-2xl font-black text-base md:text-lg shadow-xl shadow-emerald-500/20 hover:bg-emerald-400 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                <span>{t('orientationPage.finalCta.primaryCta')}</span>
                <ArrowLeft size={20} className="transform ltr:rotate-180" />
              </button>
              <a
                href="https://wa.me/212703749901"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-9 py-4 bg-white/5 text-white border border-white/15 rounded-2xl font-black text-base md:text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-3"
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
        primary: 'text-emerald-600',
        bg: 'bg-emerald-600',
        gradient: 'from-[#087F66] via-[#0DAA79] to-[#13B981]',
        lightBg: 'bg-emerald-50',
        border: 'border-emerald-100',
        accent: 'text-teal-500',
        blob1: 'bg-teal-200',
        blob2: 'bg-emerald-300',
        button: 'bg-emerald-600 hover:bg-emerald-700',
        iconBg: 'bg-emerald-900/10'
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

  return (
    <div className="min-h-screen bg-slate-50 pb-20 overflow-x-hidden font-sans selection:bg-primary/30">
      <SEO
        title={`${t(data.title)} - Tilmid`}
        description={t(data.subtitle)}
      />

      {/* Hero Section */}
      {isTawjih ? (
        <OrientationHero
          title={t(data.title)}
          desc={heroDesc}
          badge={badgeLabel}
          primaryCta={primaryCtaLabel}
          secondaryCta={t('orientationPage.hero.secondaryCta')}
        />
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
        {isTawjih && <OrientationProcess />}
        {isTawjih && <OrientationPacks onChoose={goToOrientationForm} />}

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
