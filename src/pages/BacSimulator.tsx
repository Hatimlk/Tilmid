import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Calculator, Sparkles, RotateCcw, Target, AlertTriangle, CheckCircle2,
  TrendingUp, ChevronDown, Compass, GraduationCap,
  NotebookPen, FileCheck2, SlidersHorizontal, ListChecks, LineChart, ArrowLeft
} from 'lucide-react';
import SEO from '../components/SEO';
import {
  DEFAULT_BAC_WEIGHTS, GRADE_MIN, GRADE_MAX, normalizeGradeInput, isValidGrade,
  calculateFinalAverage, calculateRequiredNationalScore, calculateMaximumPossibleAverage,
  formatGrade, formatRequiredGrade, getObjectiveStatus, ObjectiveStatus
} from '../utils/bacCalculator';

/* -------------------------------------------------------------------------- */
/* Shared primitives                                                          */
/* -------------------------------------------------------------------------- */

const useReveal = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) { setVisible(true); return; }
    const el = ref.current;
    if (!el) return;
    const fallback = window.setTimeout(() => setVisible(true), 1800);
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); window.clearTimeout(fallback); observer.disconnect(); }
    }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
    observer.observe(el);
    return () => { observer.disconnect(); window.clearTimeout(fallback); };
  }, []);
  return { ref, visible };
};

const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className = '' }) => {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.16em] bg-primary/5 text-primary ring-1 ring-primary/10">
    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
    {children}
  </span>
);

const SectionHeader: React.FC<{ eyebrow: string; title: string; subtitle?: string; className?: string }> = ({ eyebrow, title, subtitle, className = '' }) => (
  <Reveal className={`text-center max-w-2xl mx-auto space-y-4 ${className}`}>
    <Eyebrow>{eyebrow}</Eyebrow>
    <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">{title}</h2>
    {subtitle && <p className="text-slate-500 text-base md:text-lg font-medium leading-relaxed">{subtitle}</p>}
  </Reveal>
);

/* -------------------------------------------------------------------------- */
/* Grade input                                                                */
/* -------------------------------------------------------------------------- */

interface FieldState {
  raw: string;
  touched: boolean;
}

const GradeInput: React.FC<{
  id: string;
  label: string;
  helper: string;
  coefficientLabel?: string;
  icon: React.ElementType;
  accent?: 'blue' | 'primary';
  field: FieldState;
  onChange: (raw: string) => void;
  onBlur: () => void;
}> = ({ id, label, helper, coefficientLabel, icon: Icon, accent = 'blue', field, onChange, onBlur }) => {
  const { t } = useTranslation();
  const parsed = normalizeGradeInput(field.raw);
  const hasError = field.touched && field.raw.trim() !== '' && !isValidGrade(parsed);
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;

  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <label htmlFor={id} className="flex items-center gap-2 text-[13px] font-black text-slate-700">
          <span className={`w-7 h-7 rounded-lg flex items-center justify-center ${accent === 'primary' ? 'bg-primary/10 text-primary' : 'bg-blue-50 text-blue-600'}`}>
            <Icon size={14} />
          </span>
          {label}
        </label>
        {coefficientLabel && (
          <span className="text-[11px] font-black text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">{coefficientLabel}</span>
        )}
      </div>

      <div className="relative">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={field.raw}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder="00,00"
          aria-describedby={hasError ? errorId : helperId}
          aria-invalid={hasError}
          className={`w-full h-14 md:h-[54px] ps-4 pe-14 rounded-2xl border-2 font-black text-2xl outline-none transition-all bg-white text-slate-900 ${hasError ? 'border-red-300 focus:border-red-400' : 'border-slate-200 focus:border-primary'
            }`}
          style={hasError ? undefined : { boxShadow: 'none' }}
          onFocus={(e) => { if (!hasError) e.currentTarget.style.boxShadow = '0 0 0 4px rgba(22,139,255,.10)'; }}
        />
        <span className="absolute end-4 top-1/2 -translate-y-1/2 text-slate-300 font-black text-sm pointer-events-none">/20</span>
      </div>

      {hasError ? (
        <p id={errorId} className="mt-2 text-[12px] font-bold text-red-500">{t('bacSimulator.invalidGrade')}</p>
      ) : (
        <p id={helperId} className="mt-2 text-[12px] font-medium text-slate-400">{helper}</p>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Gauge                                                                      */
/* -------------------------------------------------------------------------- */

const Gauge: React.FC<{ value: number; target: number }> = ({ value, target }) => {
  const clampedValue = Math.max(GRADE_MIN, Math.min(GRADE_MAX, value));
  const valuePct = (clampedValue / GRADE_MAX) * 100;
  const targetPct = (Math.max(GRADE_MIN, Math.min(GRADE_MAX, target)) / GRADE_MAX) * 100;

  const { t } = useTranslation();
  return (
    <div className="pt-8 pb-2">
      <div className="relative h-2 rounded-full bg-slate-100">
        <div className="absolute inset-y-0 start-0 rounded-full bg-primary/40" style={{ width: `${valuePct}%` }} />
        <div className="absolute top-1/2 -translate-y-1/2 w-1 h-4 bg-slate-300 rounded-full" style={{ insetInlineStart: `calc(${(10 / GRADE_MAX) * 100}% - 2px)` }} title={t('bacSimulator.averageTitle')} />
        <div
          className="absolute -top-7 -translate-x-1/2 rtl:translate-x-1/2 flex flex-col items-center"
          style={{ insetInlineStart: `${targetPct}%` }}
        >
          <span className="w-4 h-4 rounded-full bg-white border-4 border-primary shadow-md" />
        </div>
      </div>
      <div className="flex justify-between mt-3 text-[11px] font-bold text-slate-400">
        <span>0</span>
        <span>10</span>
        <span>20</span>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Result panel                                                              */
/* -------------------------------------------------------------------------- */

const getStatusContent = (t: any): Record<ObjectiveStatus, { label: string; text: (target: number) => string; icon: React.ElementType; tone: string }> => ({
  'already-met': {
    label: t('bacSimulator.status.alreadyMet.label'),
    text: () => t('bacSimulator.status.alreadyMet.text'),
    icon: CheckCircle2,
    tone: 'emerald',
  },
  'already-secured': {
    label: t('bacSimulator.status.alreadySecured.label'),
    text: (target) => t('bacSimulator.status.alreadySecured.text', { target: formatGrade(target) }),
    icon: CheckCircle2,
    tone: 'emerald',
  },
  accessible: {
    label: t('bacSimulator.status.accessible.label'),
    text: () => t('bacSimulator.status.accessible.text'),
    icon: TrendingUp,
    tone: 'blue',
  },
  ambitious: {
    label: t('bacSimulator.status.ambitious.label'),
    text: () => t('bacSimulator.status.ambitious.text'),
    icon: Target,
    tone: 'amber',
  },
  impossible: {
    label: t('bacSimulator.status.impossible.label'),
    text: () => t('bacSimulator.status.impossible.text'),
    icon: AlertTriangle,
    tone: 'red',
  },
});

const TONE_CLASSES: Record<string, { bg: string; text: string; ring: string }> = {
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-100' },
  blue: { bg: 'bg-blue-50', text: 'text-primary', ring: 'ring-blue-100' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-700', ring: 'ring-amber-100' },
  red: { bg: 'bg-red-50', text: 'text-red-700', ring: 'ring-red-100' },
};

const ResultPanel = React.forwardRef<HTMLDivElement, { continuous: number; regional: number; target: number }>(
  ({ continuous, regional, target }, ref) => {
    const { t } = useTranslation();
    const required = calculateRequiredNationalScore(continuous, regional, target);
    const status = getObjectiveStatus(required);
    const content = getStatusContent(t)[status];
    const tone = TONE_CLASSES[content.tone];
    const maxPossible = calculateMaximumPossibleAverage(continuous, regional);
    const isImpossible = status === 'impossible';
    const isAlreadyMet = status === 'already-met';

    const displayRequired = isImpossible ? '20,00+' : isAlreadyMet ? '0,00' : formatRequiredGrade(required);
    const gaugeValue = isImpossible ? GRADE_MAX : isAlreadyMet ? 0 : required;

    return (
      <div ref={ref} tabIndex={-1} aria-live="polite" className="bg-white rounded-[28px] border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.08)] p-7 md:p-12">
        <div className="text-center max-w-xl mx-auto mb-8">
          <Eyebrow>{t('bacSimulator.result.yourResult')}</Eyebrow>
          <p className="text-slate-500 font-bold text-sm mt-4">{t('bacSimulator.result.youMustGet')}</p>
          <div className="flex items-end justify-center gap-2 my-2">
            <span className={`text-6xl md:text-8xl font-black tracking-tight tabular-nums ${isImpossible ? 'text-red-500' : 'text-slate-900'}`}>
              {displayRequired}
            </span>
            <span className="text-2xl md:text-3xl font-black text-slate-300 mb-2 md:mb-4">/20</span>
          </div>
          <p className="text-slate-500 font-medium">
            {t('bacSimulator.result.toReachAverage')} <span className="font-bold text-slate-700">{formatGrade(target)}/20</span>.
          </p>
        </div>

        {!isImpossible && <Gauge value={gaugeValue} target={target} />}

        <div className={`mt-6 rounded-2xl p-5 ring-1 ${tone.bg} ${tone.ring} flex items-start gap-4`}>
          <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-white ${tone.text}`}>
            <content.icon size={20} />
          </span>
          <div>
            <p className={`font-black text-[15px] mb-1 ${tone.text}`}>{content.label}</p>
            <p className="text-slate-600 text-[13.5px] font-medium leading-relaxed">{content.text(target)}</p>
            {isImpossible && (
              <p className="text-slate-700 text-[13.5px] font-bold mt-2">{t('bacSimulator.result.maxPossible', { max: formatGrade(maxPossible) })}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-slate-50 rounded-2xl p-4 text-center">
            <p className="text-[11px] font-black uppercase tracking-wide text-slate-400 mb-1">{t('bacSimulator.result.yourGoal')}</p>
            <p className="text-xl font-black text-slate-900 tabular-nums">{formatGrade(target)}/20</p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-4 text-center">
            <p className="text-[11px] font-black uppercase tracking-wide text-slate-400 mb-1">{t('bacSimulator.result.withNational', { score: isImpossible ? '20' : displayRequired.replace(',00', '') })}</p>
            <p className="text-xl font-black text-primary tabular-nums">
              {formatGrade(isImpossible ? maxPossible : target)}/20
            </p>
          </div>
        </div>
      </div>
    );
  }
);
ResultPanel.displayName = 'ResultPanel';

/* -------------------------------------------------------------------------- */
/* Scenario slider                                                           */
/* -------------------------------------------------------------------------- */

const ScenarioSlider: React.FC<{ continuous: number; regional: number }> = ({ continuous, regional }) => {
  const { t } = useTranslation();
  const [national, setNational] = useState(14);
  const finalAverage = calculateFinalAverage(continuous, regional, national);
  const presets = [10, 12, 14, 16];

  return (
    <div className="bg-white rounded-[24px] border border-slate-200 shadow-[0_14px_40px_rgba(15,23,42,0.06)] p-7 md:p-10">
      <div className="flex items-center gap-3 mb-6">
        <span className="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center shrink-0">
          <SlidersHorizontal size={19} />
        </span>
        <div>
          <h3 className="font-black text-slate-900 text-lg">{t('bacSimulator.slider.simulateNational')}</h3>
          <p className="text-slate-400 text-[13px] font-medium">{t('bacSimulator.slider.moveSlider')}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-8">
        <div className="flex-1 w-full">
          <input
            type="range"
            min={0}
            max={20}
            step={0.5}
            value={national}
            onChange={(e) => setNational(Number(e.target.value))}
            aria-label={t('bacSimulator.slider.ariaLabel')}
            aria-valuetext={`${formatGrade(national)} sur 20`}
            className="w-full h-2 rounded-full appearance-none bg-slate-100 accent-primary cursor-pointer"
          />
          <div className="flex justify-between mt-2 text-[11px] font-bold text-slate-400">
            <span>0</span>
            <span className="text-primary font-black">{formatGrade(national)}/20</span>
            <span>20</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {presets.map((p) => (
              <button
                key={p}
                onClick={() => setNational(p)}
                className={`px-3.5 py-2 min-h-[36px] rounded-full text-[12.5px] font-bold border transition-all ${national === p ? 'bg-primary text-white border-primary' : 'bg-white text-slate-600 border-slate-200 hover:border-primary/40'}`}
              >
                {p}/20
              </button>
            ))}
          </div>
        </div>

        <div className="shrink-0 text-center bg-slate-50 rounded-2xl px-8 py-6 w-full sm:w-auto">
          <p className="text-[11px] font-black uppercase tracking-wide text-slate-400 mb-1">{t('bacSimulator.slider.yourAverage')}</p>
          <p className="text-4xl font-black text-slate-900 tabular-nums">{formatGrade(finalAverage)}<span className="text-lg text-slate-300">/20</span></p>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Formula explanation                                                       */
/* -------------------------------------------------------------------------- */

const FormulaExplanation: React.FC = () => {
  const { t } = useTranslation();
  const w = DEFAULT_BAC_WEIGHTS;
  const pct = (v: number) => `${Math.round(v * 100)} %`;
  return (
    <section>
      <SectionHeader eyebrow={t('bacSimulator.formula.howItWorks')} title={t('bacSimulator.formula.howIsCalculated')} className="mb-10" />
      <div className="max-w-3xl mx-auto bg-white rounded-[24px] border border-slate-200 shadow-[0_14px_40px_rgba(15,23,42,0.06)] p-7 md:p-10">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center mb-8">
          {[
            { label: t('bacSimulator.formula.continuous'), value: pct(w.continuous) },
            { label: t('bacSimulator.formula.regional'), value: pct(w.regional) },
            { label: t('bacSimulator.formula.national'), value: pct(w.national) },
          ].map((item, i) => (
            <React.Fragment key={item.label}>
              <div className="bg-blue-50 rounded-2xl px-5 py-4 min-w-[140px]">
                <p className="text-primary font-black text-lg">{item.value}</p>
                <p className="text-slate-500 text-[12px] font-bold">{item.label}</p>
              </div>
              {i < 2 && <span className="text-slate-300 font-black text-xl">+</span>}
            </React.Fragment>
          ))}
        </div>
        <div className="text-center border-t border-slate-100 pt-6">
          <p className="font-mono text-[13px] text-slate-500 bg-slate-50 rounded-xl px-4 py-4 inline-block leading-relaxed">
            {t('bacSimulator.formula.equation', { continuous: w.continuous.toFixed(2), regional: w.regional.toFixed(2), national: w.national.toFixed(2) })}
          </p>
          <p className="text-slate-500 text-sm font-medium mt-5 max-w-xl mx-auto">
            {t('bacSimulator.formula.explanation')}
          </p>
        </div>
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* Improvement tips + Mouwakaba CTA                                          */
/* -------------------------------------------------------------------------- */

const ImprovementSection: React.FC = () => {
  const { t } = useTranslation();
  const TIPS = [
    { icon: ListChecks, title: t('bacSimulator.tips.tip1Title'), text: t('bacSimulator.tips.tip1Text') },
    { icon: Target, title: t('bacSimulator.tips.tip2Title'), text: t('bacSimulator.tips.tip2Text') },
    { icon: LineChart, title: t('bacSimulator.tips.tip3Title'), text: t('bacSimulator.tips.tip3Text') },
  ];

  return (
    <section>
      <SectionHeader eyebrow={t('bacSimulator.tips.nextSteps')} title={t('bacSimulator.tips.howToIncrease')} className="mb-12" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto mb-10">
        {TIPS.map((tip, i) => (
          <Reveal key={tip.title} delay={i * 90}>
            <div className="bg-white rounded-[1.5rem] border border-slate-100 p-6 h-full shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-primary flex items-center justify-center mb-4">
                <tip.icon size={20} strokeWidth={2.2} />
              </div>
              <h3 className="text-[15px] font-black text-slate-900 mb-1.5">{tip.title}</h3>
              <p className="text-slate-500 text-[13px] font-medium leading-relaxed">{tip.text}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="max-w-3xl mx-auto">
        <div className="bg-gradient-to-br from-[#F4F8FF] to-white border border-blue-100 rounded-[1.75rem] p-7 md:p-9 flex flex-col md:flex-row items-center gap-6 text-center md:text-start">
          <div className="w-14 h-14 rounded-2xl bg-white text-primary flex items-center justify-center shrink-0 shadow-sm">
            <Compass size={26} />
          </div>
          <div className="flex-1">
            <h3 className="font-black text-slate-900 text-lg mb-1.5">{t('bacSimulator.tips.needPlan')}</h3>
            <p className="text-slate-500 text-[13.5px] font-medium leading-relaxed">{t('bacSimulator.tips.mouwakabaHelp')}</p>
          </div>
          <div className="flex flex-col gap-2 shrink-0 w-full md:w-auto">
            <Link to="/coaching-offer" className="min-h-[44px] px-6 flex items-center justify-center gap-2 bg-primary text-white rounded-xl font-bold text-sm hover:bg-[#0875E8] transition-all whitespace-nowrap">
              {t('bacSimulator.tips.discoverCoaching')}
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
};

const OrientationCrossLink: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Reveal className="max-w-3xl mx-auto">
      <div className="bg-white border border-slate-100 rounded-[1.5rem] p-6 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-start shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <GraduationCap size={22} />
        </div>
        <div className="flex-1">
          <h3 className="font-black text-slate-900 mb-0.5">{t('bacSimulator.afterBac.title')}</h3>
          <p className="text-slate-500 text-[13px] font-medium">{t('bacSimulator.afterBac.text')}</p>
        </div>
        <Link to="/higher-schools" className="shrink-0 inline-flex items-center gap-2 text-primary font-bold text-sm hover:gap-3 transition-all whitespace-nowrap">
          {t('bacSimulator.afterBac.exploreSchools')} <ArrowLeft size={15} className="transform ltr:rotate-180" />
        </Link>
      </div>
    </Reveal>
  );
};

/* -------------------------------------------------------------------------- */
/* FAQ                                                                       */
/* -------------------------------------------------------------------------- */

const SimulatorFAQ: React.FC = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const FAQ_ITEMS = [
    { q: t('bacSimulator.faq.q1'), a: t('bacSimulator.faq.a1') },
    { q: t('bacSimulator.faq.q2'), a: t('bacSimulator.faq.a2') },
    { q: t('bacSimulator.faq.q3'), a: t('bacSimulator.faq.a3') },
    { q: t('bacSimulator.faq.q4'), a: t('bacSimulator.faq.a4') },
    { q: t('bacSimulator.faq.q5'), a: t('bacSimulator.faq.a5') },
    { q: t('bacSimulator.faq.q6'), a: t('bacSimulator.faq.a6') },
  ];

  return (
    <section className="max-w-3xl mx-auto">
      <SectionHeader eyebrow={t('bacSimulator.faq.eyebrow')} title={t('bacSimulator.faq.title')} className="mb-12" />
      <div className="space-y-4">
        {FAQ_ITEMS.map((item, i) => {
          const isOpen = openIndex === i;
          const panelId = `bac-faq-panel-${i}`;
          const buttonId = `bac-faq-button-${i}`;
          return (
            <div key={item.q} className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <h3>
                <button id={buttonId} aria-expanded={isOpen} aria-controls={panelId} onClick={() => setOpenIndex(isOpen ? null : i)} className="w-full flex items-center justify-between gap-4 p-6 text-start min-h-[44px]">
                  <span className="text-base md:text-lg font-black text-slate-900">{item.q}</span>
                  <span className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${isOpen ? 'bg-primary text-white' : 'bg-slate-50 text-slate-400'}`}>
                    <ChevronDown size={18} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </span>
                </button>
              </h3>
              <div id={panelId} role="region" aria-labelledby={buttonId} className={`grid transition-all duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                  <p className="text-slate-500 font-medium leading-relaxed px-6 pb-6 border-t border-slate-50 pt-5">{item.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* Final CTA                                                                 */
/* -------------------------------------------------------------------------- */

const FinalCTA: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Reveal>
      <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-[#08142F] via-[#101D48] to-[#0B1330] border border-white/5 shadow-2xl p-9 md:p-14 text-center max-w-4xl mx-auto">
        <div className="absolute top-0 start-1/2 -translate-x-1/2 w-96 h-96 bg-primary/15 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="relative z-10 max-w-xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.16em] bg-primary/10 text-blue-300 ring-1 ring-primary/20 mb-6">
            <Target size={12} />
            {t('bacSimulator.finalCta.eyebrow')}
          </span>
          <h2 className="text-2xl md:text-4xl font-black text-white mb-4 tracking-tight leading-tight">
            {t('bacSimulator.finalCta.title')}
          </h2>
          <p className="text-slate-300 text-sm md:text-base font-medium leading-relaxed mb-9 max-w-lg mx-auto">
            {t('bacSimulator.finalCta.text')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/coaching-offer" className="w-full sm:w-auto min-h-[48px] px-8 flex items-center justify-center gap-2 bg-primary text-white rounded-2xl font-black text-sm md:text-base hover:bg-[#0875E8] hover:-translate-y-0.5 transition-all">
              <span>{t('bacSimulator.finalCta.discoverMouwakaba')}</span>
            </Link>
            <Link to="/higher-schools" className="w-full sm:w-auto min-h-[48px] px-8 flex items-center justify-center gap-2 bg-white/5 text-white border border-white/15 rounded-2xl font-black text-sm md:text-base hover:bg-white/10 transition-all">
              <span>{t('bacSimulator.finalCta.exploreSchools')}</span>
            </Link>
          </div>
        </div>
      </div>
    </Reveal>
  );
};

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

const DEFAULT_TARGET = '14';
const TARGET_PRESETS = [10, 12, 14, 16, 18];

export const BacSimulator: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [continuousField, setContinuousField] = useState<FieldState>({ raw: '', touched: false });
  const [regionalField, setRegionalField] = useState<FieldState>({ raw: '', touched: false });
  const [targetField, setTargetField] = useState<FieldState>({ raw: DEFAULT_TARGET, touched: false });
  const [showResult, setShowResult] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  const continuousValue = normalizeGradeInput(continuousField.raw);
  const regionalValue = normalizeGradeInput(regionalField.raw);
  const targetValue = normalizeGradeInput(targetField.raw);

  const allValid = isValidGrade(continuousValue) && isValidGrade(regionalValue) && isValidGrade(targetValue);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setContinuousField((f) => ({ ...f, touched: true }));
    setRegionalField((f) => ({ ...f, touched: true }));
    setTargetField((f) => ({ ...f, touched: true }));
    if (!allValid) return;
    setShowResult(true);
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  const handleReset = () => {
    setContinuousField({ raw: '', touched: false });
    setRegionalField({ raw: '', touched: false });
    setTargetField({ raw: DEFAULT_TARGET, touched: false });
    setShowResult(false);
    firstInputRef.current?.focus();
  };

  return (
    <div dir={i18n.dir()} lang={i18n.language} className="min-h-screen bg-white pb-4 overflow-x-hidden font-sans w-full max-w-full text-start">
      <SEO
        title={t('bacSimulator.hero.seoTitle')}
        description={t('bacSimulator.hero.seoDesc')}
      />

      {/* Compact hero */}
      <section className="relative pt-14 pb-8 lg:pt-16 lg:pb-10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 5%, rgba(22,139,255,.08), transparent 35%), linear-gradient(180deg, #F7FAFE 0%, #FFFFFF 100%)' }}></div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center max-w-3xl">
          <Reveal className="inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-full bg-white border border-blue-100 shadow-sm text-[13px] font-bold text-slate-700">
            <Sparkles size={14} className="text-primary" />
            <span>{t('bacSimulator.hero.badge')}</span>
          </Reveal>
          <Reveal delay={70}>
            <h1 className="text-3xl sm:text-4xl md:text-[52px] font-extrabold text-slate-900 mb-4 tracking-tight leading-[1.12]">
              {t('bacSimulator.hero.title1')} <span className="text-primary">{t('bacSimulator.hero.title2')}</span>
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-[16px] md:text-lg text-slate-500 max-w-[680px] mx-auto leading-[1.65] font-medium">
              {t('bacSimulator.hero.subtitle')}
            </p>
          </Reveal>
        </div>
      </section>

      <div className="container mx-auto px-4 lg:px-8 space-y-16 lg:space-y-20">
        {/* Calculator card */}
        <Reveal delay={160} className="max-w-[960px] mx-auto">
          <div className="bg-white rounded-[28px] border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.08)] overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-blue-500 via-primary to-indigo-500"></div>
            <div className="p-6 md:p-10">
              <div className="text-center mb-8">
                <Eyebrow>{t('bacSimulator.calculator.eyebrow')}</Eyebrow>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-3 mb-2 tracking-tight">{t('bacSimulator.calculator.title')}</h2>
                <p className="text-slate-500 text-sm font-medium">{t('bacSimulator.calculator.subtitle')}</p>
              </div>

              <form onSubmit={handleCalculate} noValidate>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <GradeInput
                    id="continuous"
                    label={t('bacSimulator.calculator.continuousLabel')}
                    helper={t('bacSimulator.calculator.continuousHelper')}
                    coefficientLabel={`${Math.round(DEFAULT_BAC_WEIGHTS.continuous * 100)} %`}
                    icon={NotebookPen}
                    field={continuousField}
                    onChange={(raw) => setContinuousField({ raw, touched: continuousField.touched })}
                    onBlur={() => setContinuousField((f) => ({ ...f, touched: true }))}
                  />
                  <GradeInput
                    id="regional"
                    label={t('bacSimulator.calculator.regionalLabel')}
                    helper={t('bacSimulator.calculator.regionalHelper')}
                    coefficientLabel={`${Math.round(DEFAULT_BAC_WEIGHTS.regional * 100)} %`}
                    icon={FileCheck2}
                    field={regionalField}
                    onChange={(raw) => setRegionalField({ raw, touched: regionalField.touched })}
                    onBlur={() => setRegionalField((f) => ({ ...f, touched: true }))}
                  />
                  <div>
                    <GradeInput
                      id="target"
                      label={t('bacSimulator.calculator.targetLabel')}
                      helper={t('bacSimulator.calculator.targetHelper')}
                      icon={Target}
                      accent="primary"
                      field={targetField}
                      onChange={(raw) => setTargetField({ raw, touched: targetField.touched })}
                      onBlur={() => setTargetField((f) => ({ ...f, touched: true }))}
                    />
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {TARGET_PRESETS.map((p) => (
                        <button
                          type="button"
                          key={p}
                          onClick={() => setTargetField({ raw: String(p), touched: true })}
                          className={`px-2.5 py-1.5 min-h-[32px] rounded-full text-[12px] font-bold border transition-all ${targetField.raw === String(p) ? 'bg-primary/10 border-primary text-primary' : 'bg-white border-slate-200 text-slate-500 hover:border-primary/40'}`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    className="flex-1 min-h-[56px] bg-slate-900 text-white rounded-2xl font-black text-base md:text-lg flex items-center justify-center gap-3 hover:bg-primary transition-all hover:-translate-y-0.5 active:scale-[0.99]"
                  >
                    <Calculator size={22} />
                    <span>{t('bacSimulator.calculator.submit')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    title={t('bacSimulator.calculator.reset')}
                    className="min-h-[56px] px-6 bg-slate-50 text-slate-500 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-100 hover:text-slate-700 transition-all"
                  >
                    <RotateCcw size={19} />
                    <span className="sm:hidden">{t('bacSimulator.calculator.reset')}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Reveal>

        {/* Result */}
        {showResult && allValid && continuousValue !== null && regionalValue !== null && targetValue !== null && (
          <div className="max-w-[960px] mx-auto space-y-6">
            <ResultPanel ref={resultRef} continuous={continuousValue} regional={regionalValue} target={targetValue} />
            <ScenarioSlider continuous={continuousValue} regional={regionalValue} />
          </div>
        )}

        <FormulaExplanation />
        <ImprovementSection />
        <OrientationCrossLink />
        <SimulatorFAQ />
        <FinalCTA />
      </div>
    </div>
  );
};
