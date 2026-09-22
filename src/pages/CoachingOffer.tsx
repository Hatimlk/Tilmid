import React, { useState, useRef, useEffect } from 'react';
import {
  CheckCircle,
  ArrowLeft,
  UserCheck,
  Zap,
  Brain,
  Calendar,
  MessageCircle,
  Sparkles,
  Clock,
  X,
  Check,
  ArrowDown,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  Target,
  ClipboardList,
  BookOpen,
  Minus,
  Compass,
  Star,
  BadgeCheck
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
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
import { PackTier, PackDef, PACKS, NOT_INCLUDED, PREMIUM_JOURNEY } from '../constants/mouwakabaPacks';
import { IMAGES } from '../constants/images';
import SEO from '../components/SEO';

const TESTIMONIALS = [
  img0604, img0605, img0606, img0710, img0726, img0727, img2756, img2944, img2945, img2947
];

const WHATSAPP_URL = 'https://wa.me/message/GN4XKUOMHNHGO1';

/* -------------------------------------------------------------------------- */
/* Shared primitives                                                          */
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
      className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
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

/* Support level — never conveyed by color alone: dots + an explicit text label */
const SupportLevel: React.FC<{ level: 1 | 2 | 3; label: string }> = ({ level, label }) => (
  <div className="flex items-center gap-3">
    <div className="flex items-center gap-1" role="img" aria-label={`Niveau d'accompagnement : ${level} sur 3`}>
      {[1, 2, 3].map((i) => (
        <span key={i} className={`w-2.5 h-2.5 rounded-full ${i <= level ? 'bg-primary' : 'bg-slate-200'}`} />
      ))}
    </div>
    <span className="text-[13px] font-bold text-slate-500">{label}</span>
  </div>
);

/* -------------------------------------------------------------------------- */
/* Breadcrumb — accessible, feeds BreadcrumbList structured data              */
/* -------------------------------------------------------------------------- */

const MouwakabaBreadcrumb: React.FC = () => (
  <nav aria-label="Fil d'Ariane" className="border-b border-slate-100 bg-white">
    <div className="container mx-auto px-4 lg:px-8">
      <ol className="flex items-center gap-1.5 py-3 text-[12.5px] font-bold text-slate-400 overflow-x-auto whitespace-nowrap">
        <li className="flex items-center gap-1.5">
          <Link to="/" className="hover:text-primary transition-colors">Accueil</Link>
          <ChevronRight size={13} className="rtl:rotate-180 text-slate-300" />
        </li>
        <li className="text-slate-700" aria-current="page">Offre d'accompagnement</li>
      </ol>
    </div>
  </nav>
);

/* -------------------------------------------------------------------------- */
/* Jump nav — in-page table of contents, signals a structured document        */
/* -------------------------------------------------------------------------- */

const JUMP_LINKS = [
  { id: 'objectifs', label: 'Objectifs' },
  { id: 'pricing', label: 'Formules' },
  { id: 'comparatif', label: 'Comparatif' },
  { id: 'faq', label: 'Questions' },
];

const MouwakabaJumpNav: React.FC = () => (
  <div className="border-y border-slate-100 bg-slate-50/60 hidden md:block">
    <div className="container mx-auto px-4 lg:px-8">
      <nav aria-label="Sections de la page" className="flex items-center gap-1 py-2.5 overflow-x-auto">
        {JUMP_LINKS.map((link) => (
          <button
            key={link.id}
            onClick={() => document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="px-3.5 py-2 rounded-lg text-[13px] font-bold text-slate-500 hover:text-primary hover:bg-white hover:shadow-sm transition-all whitespace-nowrap"
          >
            {link.label}
          </button>
        ))}
      </nav>
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/* Hero — editorial two-column layout with real photography                  */
/* -------------------------------------------------------------------------- */

const MouwakabaHero: React.FC<{ onPrimaryCta: () => void }> = ({ onPrimaryCta }) => {
  const stats = [
    { value: '+3500', label: 'Élèves bénéficiaires' },
    { value: '98%', label: 'Taux de satisfaction' },
    { value: '+10', label: "Années d'expérience" },
  ];

  return (
    <section className="relative bg-white overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 pt-14 pb-16 lg:pt-20 lg:pb-20">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          <div className="lg:col-span-7">
            <Reveal>
              <div className="inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-full bg-blue-50 text-primary text-[12.5px] font-bold ring-1 ring-blue-100">
                <Sparkles size={13} />
                <span className="tracking-wide">Programme d'accompagnement scolaire</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold mb-6 tracking-tight leading-[1.1] text-slate-900">
                Maximisez votre potentiel avec l'accompagnement Mouwakaba
              </h1>

              <p className="text-[17px] leading-[1.7] text-slate-600 font-medium max-w-[560px] mb-9">
                Un programme d'accompagnement pratique conçu pour vous aider à mieux vous organiser, améliorer vos méthodes d'apprentissage et avancer vers vos objectifs scolaires avec une méthode claire et structurée.
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-11">
                <button
                  onClick={onPrimaryCta}
                  className="w-full sm:w-auto h-[52px] px-8 bg-primary text-white rounded-xl font-bold text-[15px] hover:bg-[#0875E8] transition-colors flex items-center justify-center gap-2.5 group"
                >
                  <span>Je commence maintenant</span>
                  <ArrowLeft size={18} className="transform ltr:rotate-180 ltr:group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full sm:w-auto h-[52px] px-8 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-[15px] hover:border-primary/30 hover:text-primary hover:bg-blue-50/50 transition-colors flex items-center justify-center gap-2.5"
                >
                  <span>Découvrir les formules</span>
                  <ArrowDown size={17} />
                </button>
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
                  alt="Coach Tilmid accompagnant un étudiant dans sa méthode de travail"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-slate-900/85 via-slate-900/30 to-transparent">
                  <p className="text-white font-bold text-[13px] flex items-center gap-2">
                    <BadgeCheck size={16} className="text-blue-400 shrink-0" />
                    +3500 étudiants accompagnés
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
/* Success stories carousel                                                    */
/* -------------------------------------------------------------------------- */

const SuccessStories: React.FC = () => (
  <section className="py-16 bg-white rounded-[2.5rem] shadow-sm border border-slate-100">
    <SectionHeader
      eyebrow="Témoignages"
      title="Des étudiants qui ont transformé leur façon de travailler"
      subtitle="Des progrès qui commencent par une meilleure méthode, une organisation plus claire et des actions concrètes."
      className="mb-10 px-4"
    />

    <div className="relative w-full">
      <div className="absolute top-0 start-0 w-24 md:w-32 h-full bg-gradient-to-r from-white to-transparent rtl:bg-gradient-to-l z-20 pointer-events-none"></div>
      <div className="absolute top-0 end-0 w-24 md:w-32 h-full bg-gradient-to-l from-white to-transparent rtl:bg-gradient-to-r z-20 pointer-events-none"></div>

      <div className="flex overflow-hidden relative w-full group">
        <div className="flex gap-4 animate-scroll-rtl w-max group-hover:[animation-play-state:paused] py-2 px-4" style={{ animationDuration: '45s' }}>
          {[...TESTIMONIALS, ...TESTIMONIALS].map((img, i) => (
            <div key={i} className="w-[200px] md:w-[260px] aspect-[3/4] rounded-2xl overflow-hidden border border-slate-100 shadow-[0_10px_30px_rgba(15,23,42,0.06)] relative group/card flex-shrink-0 bg-white">
              <img
                src={img}
                alt="Témoignage d'un étudiant Mouwakaba"
                className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="text-center mt-10">
      <a
        href="https://www.instagram.com/tilmid.official/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all"
      >
        <span>Voir plus de témoignages</span>
        <ArrowLeft size={17} className="transform ltr:rotate-180" />
      </a>
    </div>
  </section>
);

/* -------------------------------------------------------------------------- */
/* Program objectives                                                         */
/* -------------------------------------------------------------------------- */

const OBJECTIVES = [
  { icon: TrendingUp, title: 'Améliorer les performances scolaires', desc: "Développez une méthode de travail structurée, apprenez à mieux gérer votre temps et identifiez les éléments qui ralentissent votre progression." },
  { icon: Brain, title: "Développer de meilleures méthodes d'apprentissage", desc: 'Découvrez des techniques pratiques pour comprendre, mémoriser et réviser plus efficacement.' },
  { icon: Target, title: 'Définir des objectifs clairs', desc: 'Transformez vos ambitions en objectifs concrets, réalistes et mesurables.' },
  { icon: UserCheck, title: 'Développer votre autonomie', desc: 'Apprenez progressivement à organiser votre travail, prendre de meilleures décisions et avancer avec davantage d’indépendance.' },
];

const ProgramObjectives: React.FC = () => (
  <section id="objectifs" className="scroll-mt-24">
    <SectionHeader
      eyebrow="Votre progression"
      title="Nous vous aidons à atteindre vos objectifs sans pression inutile"
      subtitle="Développez des méthodes de travail durables pour progresser plus efficacement tout au long de votre parcours scolaire."
      className="mb-14"
    />
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {OBJECTIVES.map((obj, i) => (
        <Reveal key={obj.title} delay={i * 90}>
          <div className="bg-white rounded-[1.5rem] border border-slate-100 p-7 h-full shadow-[0_10px_30px_rgba(15,23,42,0.05)] hover:shadow-[0_20px_44px_rgba(15,23,42,0.09)] hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-primary flex items-center justify-center mb-5">
              <obj.icon size={22} strokeWidth={2.2} />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2 tracking-tight">{obj.title}</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">{obj.desc}</p>
          </div>
        </Reveal>
      ))}
    </div>
  </section>
);

/* -------------------------------------------------------------------------- */
/* Program benefits                                                           */
/* -------------------------------------------------------------------------- */

const BENEFITS = [
  { icon: Calendar, title: 'Programmes hebdomadaires structurés', desc: 'Organisez votre semaine autour d’objectifs réalistes.' },
  { icon: Brain, title: "Méthodes d'apprentissage", desc: 'Apprenez à comprendre, mémoriser et réviser efficacement.' },
  { icon: Clock, title: 'Gestion du temps', desc: 'Construisez une organisation adaptée à votre rythme.' },
  { icon: TrendingUp, title: 'Suivi de progression', desc: 'Mesurez vos efforts grâce à des outils concrets.' },
  { icon: ClipboardList, title: 'Outils pratiques', desc: 'Utilisez des modèles directement applicables.' },
  { icon: BookOpen, title: 'Ressources pédagogiques', desc: 'Retrouvez les supports nécessaires pour progresser.' },
  { icon: Zap, title: 'Mise en pratique', desc: 'Transformez les conseils en actions et habitudes.' },
  { icon: MessageCircle, title: 'Communauté privée', desc: 'Posez vos questions et échangez dans un espace dédié.' },
];

const ProgramBenefits: React.FC = () => (
  <section>
    <SectionHeader
      eyebrow="Un accompagnement complet"
      title="Tout ce dont vous avez besoin pour progresser avec méthode"
      className="mb-14"
    />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {BENEFITS.map((b, i) => (
        <Reveal key={b.title} delay={(i % 4) * 80}>
          <div className="group bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-[0_16px_36px_rgba(15,23,42,0.08)] hover:-translate-y-1 transition-all duration-300 h-full">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
              <b.icon size={20} strokeWidth={2.2} />
            </div>
            <h3 className="text-[15px] font-black text-slate-900 mb-1.5 leading-tight">{b.title}</h3>
            <p className="text-slate-500 text-[13px] font-medium leading-relaxed">{b.desc}</p>
          </div>
        </Reveal>
      ))}
    </div>
  </section>
);

/* -------------------------------------------------------------------------- */
/* Pricing — pack data                                                        */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/* Pack card                                                                  */
/* -------------------------------------------------------------------------- */

const PackCard: React.FC<{ pack: PackDef; onChoose: (label: string) => void }> = ({ pack, onChoose }) => {
  const [expanded, setExpanded] = useState(false);
  const [showNotIncluded, setShowNotIncluded] = useState(false);
  const isBoost = pack.tier === 'boost';
  const isPremium = pack.tier === 'premium';

  const cardOrder = isBoost ? 'order-1 md:order-2' : pack.tier === 'essentiel' ? 'order-2 md:order-1' : 'order-3';

  return (
    <div className={`relative h-full flex flex-col ${cardOrder} ${isBoost ? 'md:-mt-4 md:mb-[-1rem] md:scale-[1.03] z-10' : ''}`}>
      {pack.badge && (
        <div className={`absolute -top-4 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 z-20 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider shadow-lg whitespace-nowrap flex items-center gap-1.5 ${isBoost ? 'bg-primary text-white shadow-primary/30' : 'bg-slate-900 text-white'}`}>
          <Star size={11} className="fill-current" />
          {pack.badge}
        </div>
      )}

      <div
        className={`relative flex flex-col h-full rounded-[2rem] overflow-hidden bg-white transition-all duration-300 ${isBoost
          ? 'border-2 border-primary shadow-[0_20px_50px_-15px_rgba(22,139,255,0.35)]'
          : isPremium
            ? 'border border-slate-200 shadow-[0_12px_32px_rgba(15,23,42,0.06)]'
            : 'border border-slate-200 shadow-[0_12px_32px_rgba(15,23,42,0.06)] hover:shadow-[0_20px_44px_rgba(15,23,42,0.09)]'
          }`}
      >
        {/* Header */}
        <div className={`p-7 pb-6 ${isPremium ? 'bg-gradient-to-br from-[#101D48] via-[#18274C] to-[#0B1330] text-white' : ''}`}>
          <div className="flex items-center justify-between mb-4">
            <span className={`text-xs font-black uppercase tracking-[0.15em] ${isPremium ? 'text-purple-300' : 'text-primary'}`}>{pack.label}</span>
            <SupportLevel level={pack.supportLevel} label="" />
          </div>

          <div className="flex items-end gap-2 mb-3">
            <span className={`text-4xl font-black tracking-tight tabular-nums ${isPremium ? 'text-white' : 'text-slate-900'}`}>{pack.price}</span>
          </div>

          <span className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-full mb-4 ${isPremium ? 'bg-white/10 text-purple-200' : 'bg-blue-50 text-primary'}`}>
            {pack.smallLabel}
          </span>

          <p className={`text-[13px] leading-relaxed font-medium ${isPremium ? 'text-slate-300' : 'text-slate-500'}`}>{pack.audience}</p>
        </div>

        {/* Body */}
        <div className="p-7 pt-6 flex flex-col flex-grow">
          <ul className="space-y-3 mb-6">
            {pack.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2.5 text-[13.5px] font-semibold text-slate-700">
                <CheckCircle size={16} className="text-primary shrink-0 mt-0.5" />
                <span>{h}</span>
              </li>
            ))}
          </ul>

          <div className="grid grid-cols-2 gap-3 mb-6 text-[12px]">
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-slate-400 font-bold uppercase tracking-wide mb-1">Durée</p>
              <p className="text-slate-800 font-bold">{pack.duration}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-slate-400 font-bold uppercase tracking-wide mb-1">Suivi personnel</p>
              <p className="text-slate-800 font-bold">{pack.personalSupport}</p>
            </div>
          </div>

          <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 mb-6">
            <p className="text-[13px] text-slate-700 font-semibold leading-relaxed">{pack.result}</p>
          </div>

          <button
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="flex items-center justify-center gap-2 text-primary text-[13px] font-bold mb-6 hover:gap-3 transition-all min-h-[44px]"
          >
            <span>{expanded ? 'Masquer les détails' : 'Voir tous les détails'}</span>
            <ChevronDown size={16} className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
          </button>

          {expanded && (
            <div className="mb-6 space-y-6 text-start animate-in fade-in slide-in-from-top-2 duration-300">
              {pack.tier === 'essentiel' && (
                <>
                  <PackDetailList title="Les 5 axes" items={[
                    'Définition des objectifs et diagnostic de la situation actuelle',
                    'Organisation et création d’un programme hebdomadaire efficace',
                    'Lutte contre la procrastination et les distractions',
                    'Techniques de révision et d’apprentissage efficace',
                    'Préparation aux examens et gestion de la pression',
                  ]} />
                  <PackDetailList title="Outils pratiques" items={[
                    'Modèle de programme hebdomadaire',
                    'Tableau de suivi des révisions',
                    'Habit Tracker',
                    'Plan de préparation aux examens',
                  ]} />
                  <PackDetailList title="Accompagnement collectif" items={[
                    'Groupe WhatsApp privé',
                    'Deux créneaux hebdomadaires pour les questions collectives',
                    'Une session collective de 60 minutes consacrée aux questions et à l’orientation',
                  ]} />
                  <div>
                    <button
                      onClick={() => setShowNotIncluded((v) => !v)}
                      aria-expanded={showNotIncluded}
                      className="flex items-center gap-2 text-slate-500 text-[13px] font-bold hover:text-slate-700 transition-colors min-h-[44px]"
                    >
                      <ChevronDown size={14} className={`transition-transform duration-300 ${showNotIncluded ? 'rotate-180' : ''}`} />
                      <span>Voir ce qui n'est pas inclus</span>
                    </button>
                    {showNotIncluded && (
                      <ul className="mt-3 space-y-2 ps-5">
                        {NOT_INCLUDED.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-[13px] text-slate-400 font-medium">
                            <X size={13} className="shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </>
              )}

              {pack.tier === 'boost' && (
                <>
                  <PackDetailList title="Coaching individuel" items={[
                    '1 séance de coaching individuelle à distance',
                    'Durée : 45 minutes',
                    'Questionnaire de diagnostic avant la séance',
                  ]} />
                  <PackDetailList title="Diagnostic personnalisé — identifier la priorité à travailler" items={[
                    'Organisation et planification',
                    'Discipline et procrastination',
                    'Méthodes de révision et d’apprentissage',
                    'Préparation aux examens',
                  ]} />
                  <PackDetailList title="Après la séance — résumé écrit" items={[
                    'Objectif principal',
                    'Étapes pratiques',
                    'Programme recommandé',
                    'Indicateurs de progression',
                  ]} />
                  <PackDetailList title="Suivi" items={[
                    '1 Check-in après 14 jours',
                    'Formulaire structuré',
                    'Feedback personnel synthétique après le Check-in',
                  ]} />
                </>
              )}

              {pack.tier === 'premium' && (
                <>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-3">Le parcours en 3 séances</p>
                    <div className="space-y-0">
                      {PREMIUM_JOURNEY.map((step, i) => (
                        <div key={step.title} className="relative ps-8 pb-5 last:pb-0">
                          {i < PREMIUM_JOURNEY.length - 1 && (
                            <span className="absolute start-[9px] top-6 bottom-0 w-px bg-slate-200"></span>
                          )}
                          <span className="absolute start-0 top-0 w-5 h-5 rounded-full bg-primary text-white text-[10px] font-black flex items-center justify-center">{i + 1}</span>
                          <p className="text-[12px] font-black text-slate-400 uppercase tracking-wide mb-0.5">Session 0{i + 1}</p>
                          <p className="text-[13.5px] font-black text-slate-900 mb-1.5">{step.title}</p>
                          <ul className="space-y-1">
                            {step.items.map((it) => (
                              <li key={it} className="text-[12.5px] text-slate-500 font-medium">— {it}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                  <PackDetailList title="Suivi entre les séances" items={[
                    'Résumé et étapes pratiques après chaque séance',
                    'Check-in toutes les deux semaines',
                    'Feedback personnel sur chaque Check-in',
                    'Priorité pour la réservation des séances',
                    'Rapport final de progression',
                  ]} />
                  <PackDetailList title="Le rapport final couvre" items={[
                    'Point de départ',
                    "Niveau d'engagement",
                    'Mise en application',
                    'Progrès réalisés',
                    'Éléments restant à améliorer',
                    "Recommandations pour la prochaine étape",
                  ]} />
                  <p className="text-[12px] text-slate-400 font-medium italic border-t border-slate-100 pt-4">
                    Pour un étudiant mineur, une synthèse peut être transmise au parent ou au responsable légal à la fin du programme.
                  </p>
                </>
              )}
            </div>
          )}

          <button
            onClick={() => onChoose(pack.label)}
            className={`w-full min-h-[52px] rounded-2xl font-black text-base flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] mt-auto group ${isBoost
              ? 'bg-primary text-white hover:bg-[#0875E8] shadow-lg shadow-primary/25 hover:-translate-y-0.5'
              : isPremium
                ? 'bg-[#101D48] text-white hover:bg-[#18274C] hover:-translate-y-0.5'
                : 'bg-slate-900 text-white hover:bg-slate-800 hover:-translate-y-0.5'
              }`}
          >
            <span>{pack.ctaLabel}</span>
            <ArrowLeft size={17} className="transform ltr:rotate-180 ltr:group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-center text-[12px] text-slate-400 font-semibold mt-3">{pack.microcopy}</p>
        </div>
      </div>
    </div>
  );
};

const PackDetailList: React.FC<{ title: string; items: string[] }> = ({ title, items }) => (
  <div>
    <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2.5">{title}</p>
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-[13px] text-slate-600 font-medium leading-relaxed">
          <Check size={14} className="text-primary shrink-0 mt-0.5" strokeWidth={2.5} />
          {item}
        </li>
      ))}
    </ul>
  </div>
);

/* -------------------------------------------------------------------------- */
/* Pricing section                                                            */
/* -------------------------------------------------------------------------- */

const MouwakabaPricing = React.forwardRef<HTMLDivElement, { onChoose: (label: string) => void }>(({ onChoose }, ref) => (
  <section id="pricing" ref={ref} className="scroll-mt-24">
    <SectionHeader
      eyebrow="Nos formules"
      title="Choisissez le niveau d'accompagnement qui vous correspond"
      subtitle="Chaque étudiant a des besoins différents. Choisissez la formule adaptée au niveau d'autonomie, de personnalisation et de suivi dont vous avez besoin."
      className="mb-8"
    />

    <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
      {[
        { name: 'Essentiel', desc: 'Méthode + outils' },
        { name: 'Boost', desc: 'Méthode + diagnostic + plan personnalisé' },
        { name: 'Premium', desc: 'Méthode + plan + suivi individuel' },
      ].map((s) => (
        <div key={s.name} className="flex items-center gap-2 bg-white border border-slate-100 rounded-full px-4 py-2 shadow-sm">
          <span className="text-[13px] font-black text-slate-900">{s.name}</span>
          <span className="text-slate-300">·</span>
          <span className="text-[12px] font-semibold text-slate-500">{s.desc}</span>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-6 items-start max-w-6xl mx-auto pt-4">
      {PACKS.map((pack) => (
        <Reveal key={pack.tier} className={pack.tier === 'boost' ? 'order-1 md:order-2' : pack.tier === 'essentiel' ? 'order-2 md:order-1' : 'order-3'}>
          <PackCard pack={pack} onChoose={onChoose} />
        </Reveal>
      ))}
    </div>
  </section>
));
MouwakabaPricing.displayName = 'MouwakabaPricing';

/* -------------------------------------------------------------------------- */
/* Comparison                                                                 */
/* -------------------------------------------------------------------------- */

const COMPARISON_ROWS: { label: string; essentiel: string | boolean; boost: string | boolean; premium: string | boolean }[] = [
  { label: 'Accès plateforme', essentiel: true, boost: true, premium: true },
  { label: '10 vidéos', essentiel: true, boost: true, premium: true },
  { label: 'Outils pratiques', essentiel: true, boost: true, premium: true },
  { label: 'Groupe WhatsApp', essentiel: true, boost: true, premium: true },
  { label: 'Session collective', essentiel: true, boost: true, premium: true },
  { label: 'Coaching individuel', essentiel: false, boost: '1 séance', premium: '3 séances' },
  { label: 'Plan personnalisé', essentiel: false, boost: '30 jours', premium: '90 jours' },
  { label: 'Check-in', essentiel: false, boost: '1', premium: 'Toutes les 2 semaines' },
  { label: 'Feedback personnel', essentiel: false, boost: 'Synthétique', premium: 'Personnalisé' },
  { label: 'Priorité de réservation', essentiel: false, boost: false, premium: true },
  { label: 'Rapport final', essentiel: false, boost: false, premium: true },
];

const ComparisonValue: React.FC<{ value: string | boolean }> = ({ value }) => {
  if (value === true) return <Check size={18} className="text-emerald-600 mx-auto" strokeWidth={2.5} />;
  if (value === false) return <Minus size={16} className="text-slate-300 mx-auto" />;
  return <span className="text-[13px] font-bold text-slate-700">{value}</span>;
};

const PackComparison: React.FC = () => {
  const [openTier, setOpenTier] = useState<PackTier | null>(null);

  return (
    <section id="comparatif" className="scroll-mt-24">
      <SectionHeader eyebrow="Comparaison" title="Comparez les formules Mouwakaba" className="mb-12" />

      {/* Desktop table */}
      <Reveal className="hidden md:block max-w-4xl mx-auto overflow-hidden rounded-[22px] border border-slate-200 shadow-[0_12px_32px_rgba(15,23,42,0.06)]">
        <table className="w-full text-start border-collapse">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-start p-5 text-[13px] font-black text-slate-500 uppercase tracking-wide">Service</th>
              <th className="p-5 text-[13px] font-black text-slate-700">Essentiel</th>
              <th className="p-5 text-[13px] font-black text-primary bg-blue-50/70">Boost</th>
              <th className="p-5 text-[13px] font-black text-slate-700">Premium</th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((row, i) => (
              <tr key={row.label} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}>
                <td className="p-5 text-[13.5px] font-semibold text-slate-700">{row.label}</td>
                <td className="p-5 text-center"><ComparisonValue value={row.essentiel} /></td>
                <td className="p-5 text-center bg-blue-50/70"><ComparisonValue value={row.boost} /></td>
                <td className="p-5 text-center"><ComparisonValue value={row.premium} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>

      {/* Mobile: expandable per-pack cards */}
      <div className="md:hidden max-w-lg mx-auto space-y-4">
        {(['essentiel', 'boost', 'premium'] as PackTier[]).map((tier) => {
          const isOpen = openTier === tier;
          const packLabel = tier === 'essentiel' ? 'Essentiel' : tier === 'boost' ? 'Boost' : 'Premium';
          return (
            <Reveal key={tier}>
              <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <button
                  onClick={() => setOpenTier(isOpen ? null : tier)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between p-5 min-h-[44px]"
                >
                  <span className="font-black text-slate-900">Comparer {packLabel}</span>
                  <ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 space-y-3 border-t border-slate-50 pt-4">
                    {COMPARISON_ROWS.map((row) => (
                      <div key={row.label} className="flex items-center justify-between text-[13px]">
                        <span className="text-slate-500 font-semibold">{row.label}</span>
                        <ComparisonValue value={row[tier]} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* Which pack for you                                                        */
/* -------------------------------------------------------------------------- */

const SCENARIOS = [
  { pack: 'Essentiel', title: 'Essentiel est fait pour vous si...', desc: 'Vous êtes suffisamment autonome pour appliquer une méthode par vous-même, mais vous avez besoin d’une structure et d’outils efficaces.', label: 'Autonomie élevée' },
  { pack: 'Boost', title: 'Boost est fait pour vous si...', desc: 'Vous avez besoin d’un regard extérieur pour comprendre ce qui bloque votre progression et construire un plan personnel précis.', label: 'Accompagnement intermédiaire' },
  { pack: 'Premium', title: 'Premium est fait pour vous si...', desc: 'Vous avez besoin d’un suivi régulier pour appliquer votre plan, résoudre les obstacles et ajuster progressivement votre méthode.', label: 'Accompagnement renforcé' },
];

const PackRecommendation: React.FC = () => (
  <section>
    <SectionHeader eyebrow="Besoin d'aide pour choisir ?" title="Quelle formule correspond à votre situation ?" className="mb-12" />

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
      {SCENARIOS.map((s, i) => (
        <Reveal key={s.pack} delay={i * 100}>
          <div className="bg-white rounded-[1.5rem] border border-slate-100 p-7 h-full shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
            <h3 className="text-lg font-black text-slate-900 mb-3 tracking-tight">{s.title}</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-5">{s.desc}</p>
            <span className="inline-block text-[11px] font-black uppercase tracking-wide px-3 py-1.5 rounded-full bg-blue-50 text-primary">{s.label}</span>
          </div>
        </Reveal>
      ))}
    </div>

    <div className="text-center">
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-7 py-3.5 min-h-[48px] bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all hover:-translate-y-0.5"
      >
        <span>Aidez-moi à choisir ma formule</span>
        <ArrowLeft size={17} className="transform ltr:rotate-180" />
      </a>
    </div>
  </section>
);

/* -------------------------------------------------------------------------- */
/* How it works                                                              */
/* -------------------------------------------------------------------------- */

const PROCESS_STEPS = [
  { icon: ClipboardList, title: 'Choisissez votre formule', desc: 'Sélectionnez le niveau d’accompagnement correspondant à vos besoins.' },
  { icon: BookOpen, title: 'Accédez à votre méthode', desc: 'Découvrez vos contenus, outils et ressources pratiques.' },
  { icon: Zap, title: 'Passez à l’action', desc: 'Organisez votre travail et commencez à appliquer votre système.' },
  { icon: TrendingUp, title: 'Suivez votre progression', desc: 'Selon votre formule, bénéficiez de Coaching, de Check-ins et de feedback personnalisé.' },
];

const MouwakabaProcess: React.FC = () => (
  <section>
    <SectionHeader eyebrow="Comment ça marche ?" title="Votre parcours Mouwakaba en 4 étapes" className="mb-14" />

    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4 max-w-6xl mx-auto">
      {PROCESS_STEPS.map((step, i) => (
        <Reveal key={step.title} delay={i * 100}>
          <div className="bg-white rounded-[1.75rem] border border-slate-100 p-6 h-full shadow-[0_10px_30px_rgba(15,23,42,0.05)] hover:shadow-[0_18px_40px_rgba(15,23,42,0.09)] hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-5">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-primary flex items-center justify-center">
                <step.icon size={22} strokeWidth={2.2} />
              </div>
              <span className="w-7 h-7 rounded-full bg-slate-900 text-white text-[12px] font-black flex items-center justify-center shrink-0">{i + 1}</span>
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2 tracking-tight">{step.title}</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">{step.desc}</p>
          </div>
        </Reveal>
      ))}
    </div>
  </section>
);

/* -------------------------------------------------------------------------- */
/* Advisor / support card                                                    */
/* -------------------------------------------------------------------------- */

const AdvisorCTA: React.FC = () => (
  <Reveal>
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_12px_32px_rgba(15,23,42,0.06)] p-8 md:p-12 max-w-4xl mx-auto text-center">
      <div className="flex -space-x-3 rtl:space-x-reverse justify-center mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="w-11 h-11 rounded-full border-4 border-white bg-slate-100 overflow-hidden shadow-sm">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=advisor${i}`} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight leading-tight">Vous hésitez encore entre deux formules ?</h2>
      <p className="text-slate-500 text-base md:text-lg font-medium leading-relaxed max-w-xl mx-auto mb-8">
        Expliquez-nous votre situation et l'équipe Tilmid vous aidera à identifier le niveau d'accompagnement le plus adapté à vos besoins.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-5">
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto min-h-[52px] px-8 bg-[#25D366] hover:bg-[#1ebc56] text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-lg shadow-green-500/20 transition-all hover:-translate-y-0.5"
        >
          <MessageCircle size={20} fill="white" />
          <span>Parler avec nous sur WhatsApp</span>
        </a>
        <Link
          to="/contact"
          className="w-full sm:w-auto min-h-[52px] px-8 bg-white border-2 border-slate-200 text-slate-800 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
        >
          <Calendar size={19} />
          <span>Réserver une consultation</span>
        </Link>
      </div>

      <p className="text-slate-400 text-[12px] font-semibold">Notre objectif est de vous orienter vers la formule réellement adaptée à votre besoin.</p>
    </div>
  </Reveal>
);

/* -------------------------------------------------------------------------- */
/* FAQ                                                                       */
/* -------------------------------------------------------------------------- */

const FAQ_ITEMS = [
  { q: 'Quelle est la différence entre Essentiel et Boost ?', a: "Essentiel donne principalement accès à la méthode, aux contenus, aux outils et à l'accompagnement collectif. Boost ajoute un diagnostic personnel, une séance individuelle de Coaching, un plan de 30 jours et un Check-in." },
  { q: 'Quelle est la différence entre Boost et Premium ?', a: 'Boost permet principalement d’obtenir un diagnostic et de construire un plan personnel. Premium propose un accompagnement de 90 jours avec 3 séances individuelles, des Check-ins réguliers et un rapport final.' },
  { q: 'Essentiel comprend-il un Coaching individuel ?', a: 'Non. Essentiel est destiné aux étudiants capables d’appliquer la méthode de façon autonome.' },
  { q: 'Comment se déroulent les séances de Coaching ?', a: 'Les séances sont réalisées à distance et durent 45 minutes.' },
  { q: 'Combien de temps dure le Pack Premium ?', a: "L'accompagnement Premium s'étend sur 90 jours." },
  { q: 'Premium comprend-il un suivi entre les séances ?', a: 'Oui. Des Check-ins sont prévus toutes les deux semaines avec un feedback personnalisé.' },
  { q: 'Les parents peuvent-ils recevoir un suivi ?', a: 'Pour un étudiant mineur, une synthèse peut être transmise au parent ou au responsable légal à la fin du programme.' },
  { q: 'Je ne sais pas quelle formule choisir. Que faire ?', a: "Contactez l'équipe Tilmid afin que nous puissions vous orienter vers le niveau d'accompagnement correspondant à votre situation." },
];

const MouwakabaFAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="max-w-3xl mx-auto scroll-mt-24">
      <SectionHeader eyebrow="Questions fréquentes" title="Tout savoir sur Mouwakaba" className="mb-12" />

      <div className="space-y-4">
        {FAQ_ITEMS.map((item, i) => {
          const isOpen = openIndex === i;
          const panelId = `mouwakaba-faq-panel-${i}`;
          const buttonId = `mouwakaba-faq-button-${i}`;
          return (
            <div key={item.q} className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <h3>
                <button
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-6 text-start min-h-[44px]"
                >
                  <span className="text-base md:text-lg font-black text-slate-900">{item.q}</span>
                  <span className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${isOpen ? 'bg-primary text-white' : 'bg-slate-50 text-slate-400'}`}>
                    <ChevronDown size={18} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
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

const FinalCTA = React.forwardRef<HTMLDivElement, {}>((_, ref) => (
  <section ref={ref}>
    <Reveal>
      <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-[#08142F] via-[#101D48] to-[#0B1330] border border-white/5 shadow-2xl p-10 md:p-16 text-center max-w-5xl mx-auto">
        <div className="absolute top-0 start-1/2 -translate-x-1/2 w-96 h-96 bg-primary/15 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.16em] bg-primary/10 text-blue-300 ring-1 ring-primary/20 mb-6">
            <Compass size={12} />
            Prêt à commencer ?
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-5 tracking-tight leading-tight">Votre progression commence par une méthode claire</h2>
          <p className="text-slate-300 text-base md:text-lg font-medium leading-relaxed mb-10 max-w-xl mx-auto">
            Choisissez le niveau d'accompagnement qui correspond à vos besoins et avancez avec une structure, des outils et un suivi conçus pour vous rendre progressivement plus autonome.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <button
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto min-h-[52px] px-9 bg-primary text-white rounded-2xl font-black text-base md:text-lg shadow-xl shadow-primary/20 hover:bg-[#0875E8] hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              <span>Découvrir les formules</span>
              <ArrowLeft size={20} className="transform ltr:rotate-180" />
            </button>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto min-h-[52px] px-9 bg-white/5 text-white border border-white/15 rounded-2xl font-black text-base md:text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-3"
            >
              <MessageCircle size={20} />
              <span>Parler à un conseiller</span>
            </a>
          </div>
          <p className="text-slate-400 text-[13px] font-semibold">Vous hésitez ? L'équipe Tilmid peut vous aider à choisir.</p>
        </div>
      </div>
    </Reveal>
  </section>
));
FinalCTA.displayName = 'FinalCTA';

/* -------------------------------------------------------------------------- */
/* Mobile sticky CTA                                                         */
/* -------------------------------------------------------------------------- */

const MobileStickyCta: React.FC<{ pricingRef: React.RefObject<HTMLDivElement>; finalCtaRef: React.RefObject<HTMLDivElement> }> = ({ pricingRef, finalCtaRef }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const pricingTop = pricingRef.current?.getBoundingClientRect().top ?? Infinity;
      const finalCtaTop = finalCtaRef.current?.getBoundingClientRect().top ?? Infinity;
      setShow(pricingTop < window.innerHeight * 0.6 && finalCtaTop > 80);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pricingRef, finalCtaRef]);

  return (
    <div
      className={`md:hidden fixed bottom-0 inset-x-0 z-40 p-4 bg-white/95 backdrop-blur-xl border-t border-slate-100 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] transition-transform duration-300 ${show ? 'translate-y-0' : 'translate-y-full'
        }`}
    >
      <button
        onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
        className="w-full min-h-[48px] bg-primary text-white rounded-2xl font-black flex items-center justify-center gap-2"
      >
        <span>Choisir ma formule</span>
        <ArrowLeft size={17} className="transform ltr:rotate-180" />
      </button>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export const CoachingOffer: React.FC = () => {
  const navigate = useNavigate();
  const pricingRef = useRef<HTMLDivElement>(null);
  const finalCtaRef = useRef<HTMLDivElement>(null);

  const goToRegistration = (packLabel?: string) => {
    navigate('/coaching-offer/inscription', { state: { pack: packLabel } });
  };

  const jsonLd = [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://tilmide.ma/' },
        { '@type': 'ListItem', position: 2, name: "Offre d'accompagnement", item: 'https://tilmide.ma/coaching-offer' },
      ],
    },
    {
      '@type': 'Service',
      serviceType: "Accompagnement scolaire Mouwakaba",
      name: "Offre d'accompagnement Mouwakaba - Tilmid",
      description: "Programme d'accompagnement Mouwakaba : méthode, outils et coaching pour progresser avec structure. Formules Essentiel, Boost et Premium.",
      provider: { '@type': 'Organization', name: 'Tilmid', url: 'https://tilmide.ma' },
      areaServed: { '@type': 'Country', name: 'Morocco' },
      offers: PACKS.map((p) => ({
        '@type': 'Offer',
        name: p.label,
        price: p.price.replace(/\D/g, ''),
        priceCurrency: 'MAD',
      })),
    },
    {
      '@type': 'FAQPage',
      mainEntity: FAQ_ITEMS.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20 overflow-x-hidden font-sans w-full max-w-full text-start">
      <SEO
        title="Offre d'accompagnement Mouwakaba"
        description="Le programme d'accompagnement Mouwakaba de Tilmid : méthode, outils et coaching pour progresser avec structure. Trois formules, Essentiel, Boost et Premium, adaptées à chaque étudiant."
        url="/coaching-offer"
        jsonLd={jsonLd}
      />

      <MouwakabaBreadcrumb />
      <MouwakabaHero onPrimaryCta={() => goToRegistration()} />
      <MouwakabaJumpNav />

      <div className="container mx-auto px-4 lg:px-8 mt-16 lg:mt-24 relative z-20 space-y-24 lg:space-y-28">
        <SuccessStories />
        <ProgramObjectives />
        <ProgramBenefits />
        <MouwakabaPricing ref={pricingRef} onChoose={goToRegistration} />
        <PackComparison />
        <PackRecommendation />
        <MouwakabaProcess />
        <AdvisorCTA />
        <MouwakabaFAQ />
        <FinalCTA ref={finalCtaRef} />
      </div>

      <MobileStickyCta pricingRef={pricingRef} finalCtaRef={finalCtaRef} />
    </div>
  );
};
