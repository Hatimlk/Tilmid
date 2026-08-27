import React, { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Heart, Scale, GraduationCap, MessageCircle, Compass,
  ChevronDown, Info
} from 'lucide-react';
import SEO from '../components/SEO';
import { SCHOOLS, School } from '../constants/schools';
import { useFavorites, useCompareList } from '../hooks/useSchoolCollections';

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

const SchoolLogo: React.FC<{ school: School }> = ({ school }) => {
  const initials = (school.acronym || school.name).split(/[\s-]+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase().slice(0, 3);
  return (
    <div className="w-20 h-20 rounded-[1.5rem] bg-blue-50 text-primary flex items-center justify-center font-black text-xl shrink-0 ring-1 ring-blue-100">
      {initials || <GraduationCap size={28} />}
    </div>
  );
};

const TypeBadge: React.FC<{ type: School['type'] }> = ({ type }) => (
  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wide ${type === 'public' ? 'bg-emerald-50 text-emerald-700' : 'bg-purple-50 text-purple-700'}`}>
    {type === 'public' ? 'Public' : 'Privé'}
  </span>
);

const NotAvailable: React.FC = () => (
  <p className="flex items-center gap-2 text-slate-400 font-medium text-sm italic">
    <Info size={15} />
    Information non disponible
  </p>
);

const DetailBlock: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="py-8 border-b border-slate-100 last:border-b-0">
    <h2 className="text-xl font-black text-slate-900 mb-4 tracking-tight">{title}</h2>
    {children}
  </div>
);

const DETAIL_FAQ = [
  { q: "Ces informations sont-elles garanties exactes ?", a: "Les informations affichées sont générales et à titre indicatif. Vérifiez toujours les conditions d'accès, le programme et les modalités directement auprès de l'établissement avant de vous engager." },
  { q: "Puis-je comparer cette école avec d'autres ?", a: "Oui, utilisez le bouton comparateur pour l'ajouter à votre sélection et la comparer à d'autres établissements." },
];

export const SchoolDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const school = SCHOOLS.find((s) => s.slug === slug);
  const favorites = useFavorites();
  const compare = useCompareList();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!school) return <Navigate to="/higher-schools" replace />;

  const related = SCHOOLS.filter((s) => s.id !== school.id && (s.city === school.city || s.fields.some((f) => school.fields.includes(f)))).slice(0, 3);
  const isFav = favorites.has(school.id);
  const isCompared = compare.has(school.id);

  return (
    <div dir="ltr" className="min-h-screen bg-slate-50 pb-24 overflow-x-hidden font-sans w-full max-w-full text-start">
      <SEO
        title={`${school.name}${school.acronym ? ` (${school.acronym})` : ''} — Écoles Supérieures`}
        description={`${school.name} — établissement ${school.type === 'public' ? 'public' : 'privé'} à ${school.city}. Filières : ${school.fields.join(', ')}.`}
      />

      {/* Header */}
      <section className="bg-gradient-to-b from-[#F6FAFF] to-white pt-10 pb-14">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <Link to="/higher-schools" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors mb-8">
            <ArrowLeft size={16} className="transform rtl:rotate-180" />
            Retour aux écoles
          </Link>

          <Reveal className="flex flex-col sm:flex-row items-start gap-6">
            <SchoolLogo school={school} />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <TypeBadge type={school.type} />
                <span className="flex items-center gap-1 text-slate-500 text-[13px] font-semibold">
                  <MapPin size={14} className="text-slate-400" />
                  {school.city}
                </span>
              </div>
              <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-1">{school.name}</h1>
              {school.acronym && <p className="text-primary font-bold text-sm">{school.acronym}</p>}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => favorites.toggle(school.id)}
                aria-pressed={isFav}
                className={`min-h-[48px] px-4 rounded-2xl border flex items-center gap-2 font-bold text-sm transition-all ${isFav ? 'bg-red-50 border-red-100 text-red-500' : 'bg-white border-slate-200 text-slate-600 hover:border-red-200'}`}
              >
                <Heart size={16} fill={isFav ? 'currentColor' : 'none'} />
                {isFav ? 'Favori' : 'Ajouter aux favoris'}
              </button>
              <button
                onClick={() => compare.toggle(school.id)}
                disabled={!isCompared && compare.isFull}
                aria-pressed={isCompared}
                className={`min-h-[48px] w-12 rounded-2xl border flex items-center justify-center transition-all disabled:opacity-40 ${isCompared ? 'bg-primary/10 border-primary text-primary' : 'bg-white border-slate-200 text-slate-500 hover:border-primary/40'}`}
                title="Ajouter au comparateur"
              >
                <Scale size={17} />
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
          {/* Main content */}
          <Reveal>
            <div className="bg-white rounded-[1.75rem] border border-slate-100 shadow-sm px-7">
              <DetailBlock title="Aperçu">
                <p className="text-slate-600 font-medium leading-relaxed">
                  {school.name}{school.acronym ? ` (${school.acronym})` : ''} est un établissement {school.type === 'public' ? 'public' : 'privé'} situé à {school.city}, proposant des formations en {school.fields.join(', ')}.
                </p>
              </DetailBlock>

              <DetailBlock title="Filières">
                <div className="flex flex-wrap gap-2">
                  {school.fields.map((f) => (
                    <span key={f} className="px-3 py-1.5 rounded-full bg-blue-50 text-primary text-[13px] font-bold">{f}</span>
                  ))}
                </div>
              </DetailBlock>

              <DetailBlock title="Conditions d'accès">
                <div className="space-y-4">
                  <div>
                    <p className="text-[12px] font-black uppercase tracking-wide text-slate-400 mb-2">Niveau d'accès</p>
                    <div className="flex flex-wrap gap-2">
                      {school.accessLevels.map((a) => <span key={a} className="px-3 py-1.5 rounded-full bg-slate-50 text-slate-700 text-[13px] font-bold">{a}</span>)}
                    </div>
                  </div>
                  <div>
                    <p className="text-[12px] font-black uppercase tracking-wide text-slate-400 mb-2">Mode d'admission</p>
                    <div className="flex flex-wrap gap-2">
                      {school.admissionMethods.map((a) => <span key={a} className="px-3 py-1.5 rounded-full bg-slate-50 text-slate-700 text-[13px] font-bold">{a}</span>)}
                    </div>
                  </div>
                </div>
              </DetailBlock>

              <DetailBlock title="Frais de scolarité"><NotAvailable /></DetailBlock>
              <DetailBlock title="Débouchés"><NotAvailable /></DetailBlock>
              <DetailBlock title="Dates importantes"><NotAvailable /></DetailBlock>

              <DetailBlock title="Questions fréquentes">
                <div className="space-y-3">
                  {DETAIL_FAQ.map((item, i) => {
                    const isOpen = openFaq === i;
                    return (
                      <div key={item.q} className="border border-slate-100 rounded-2xl overflow-hidden">
                        <button onClick={() => setOpenFaq(isOpen ? null : i)} aria-expanded={isOpen} className="w-full flex items-center justify-between gap-3 p-4 text-start min-h-[44px]">
                          <span className="text-sm font-bold text-slate-800">{item.q}</span>
                          <ChevronDown size={16} className={`shrink-0 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isOpen && <p className="px-4 pb-4 text-[13px] text-slate-500 font-medium leading-relaxed">{item.a}</p>}
                      </div>
                    );
                  })}
                </div>
              </DetailBlock>
            </div>
          </Reveal>

          {/* Sidebar */}
          <div>
            <div className="lg:sticky lg:top-[110px] space-y-6">
              <Reveal>
                <div className="bg-white rounded-[1.75rem] border border-slate-100 shadow-sm p-6">
                  <h3 className="font-black text-slate-900 mb-4">Besoin d'aide pour choisir ?</h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed mb-5">Notre équipe peut vous aider à comprendre si cet établissement correspond à votre profil.</p>
                  <a href="https://wa.me/message/GN4XKUOMHNHGO1" target="_blank" rel="noopener noreferrer" className="w-full min-h-[48px] mb-3 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebc56] text-white rounded-2xl font-black text-sm transition-all">
                    <MessageCircle size={18} fill="white" />
                    Parler sur WhatsApp
                  </a>
                  <Link to="/tawjih" className="w-full min-h-[48px] flex items-center justify-center gap-2 bg-blue-50 text-primary rounded-2xl font-black text-sm hover:bg-blue-100 transition-all">
                    <Compass size={17} />
                    Commencer mon orientation
                  </Link>
                </div>
              </Reveal>

              {related.length > 0 && (
                <Reveal delay={100}>
                  <div className="bg-white rounded-[1.75rem] border border-slate-100 shadow-sm p-6">
                    <h3 className="font-black text-slate-900 mb-4">Écoles similaires</h3>
                    <div className="space-y-3">
                      {related.map((r) => (
                        <Link key={r.id} to={`/higher-schools/${r.slug}`} className="flex items-center gap-3 group">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center font-black text-xs shrink-0">
                            {(r.acronym || r.name).slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13px] font-bold text-slate-800 group-hover:text-primary transition-colors truncate">{r.acronym || r.name}</p>
                            <p className="text-[11px] text-slate-400 font-semibold">{r.city}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </Reveal>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
