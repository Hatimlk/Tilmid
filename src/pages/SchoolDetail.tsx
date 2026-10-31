import React, { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft, MapPin, Heart, Scale, GraduationCap, MessageCircle, Compass,
  ChevronDown, Info
} from 'lucide-react';
import SEO from '../components/SEO';
import { SCHOOLS, School, computeMatch } from '../constants/schools';
import { useFavorites, useCompareList } from '../hooks/useSchoolCollections';
import { useSchoolProfile } from '../hooks/useSchoolProfile';
import { MatchScoreBadge } from '../components/MatchScoreBadge';

const LOCALIZED_SCHOOL_FAMILIES = [
  'ENSAM', 'FSJES', 'ENCG', 'ENSA', 'FST', 'EST', 'FMP', 'FLSH',
  'ESEF', 'ENA', 'ENS', 'FEG', 'FP', 'FS',
];

const METADATA_TRANSLATION_KEYS: Record<string, string> = {
  'Université publique': 'publicUniversity',
  'Diplôme ENCG': 'encgDegree',
  'Bacs économiques, gestion et scientifiques': 'economicManagementScienceBacs',
  'Vérifié / source officielle': 'officialSourceVerified',
  'Expiré': 'expired',
};

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

const TypeBadge: React.FC<{ type: School['type'] }> = ({ type }) => {
  const { t } = useTranslation();
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wide ${type === 'public' ? 'bg-emerald-50 text-emerald-700' : 'bg-purple-50 text-purple-700'}`}>
      {t(`higherSchools.types.${type}`)}
    </span>
  );
};

const NotAvailable: React.FC = () => {
  const { t } = useTranslation();
  return (
    <p className="flex items-center gap-2 text-slate-400 font-medium text-sm italic">
      <Info size={15} />
      {t('higherSchools.detail.notAvailable')}
    </p>
  );
};

const DetailBlock: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="py-8 border-b border-slate-100 last:border-b-0">
    <h2 className="text-xl font-black text-slate-900 mb-4 tracking-tight">{title}</h2>
    {children}
  </div>
);

export const SchoolDetail: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const school = SCHOOLS.find((s) => s.slug === slug);
  const favorites = useFavorites();
  const compare = useCompareList();
  const { profile } = useSchoolProfile();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!school) return <Navigate to="/higher-schools" replace />;

  const match = computeMatch(school, profile);
  const related = SCHOOLS.filter((s) => s.id !== school.id && (s.city === school.city || s.fields.some((f) => school.fields.includes(f)))).slice(0, 3);
  const isFav = favorites.has(school.id);
  const isCompared = compare.has(school.id);
  const isArabic = i18n.language.startsWith('ar');
  const city = t(`higherSchools.cities.${school.city}`, { defaultValue: school.city });
  const family = isArabic
    ? LOCALIZED_SCHOOL_FAMILIES.find((key) => school.acronym === key || school.acronym?.startsWith(`${key} `))
    : undefined;
  const schoolName = family
    ? `${t(`higherSchools.schoolFamilies.${family}`)} ${city}`
    : school.name;
  const schoolAcronym = family ? `${family} ${city}` : school.acronym;
  const fields = school.fields.map((field) => t(`higherSchools.fields.${field}`, { defaultValue: field }));
  const accessLevels = school.accessLevels.map((level) => t(`higherSchools.access.${level}`, { defaultValue: level }));
  const admissionMethods = school.admissionMethods.map((method) => t(`higherSchools.admission.${method}`, { defaultValue: method }));
  const localizeMetadata = (value: string | undefined, fallback = '') => {
    if (!value) return fallback;
    const translationKey = METADATA_TRANSLATION_KEYS[value];
    return isArabic && translationKey
      ? t(`higherSchools.detail.metadata.${translationKey}`, { defaultValue: value })
      : value;
  };
  const detailFaq = [
    { q: t('higherSchools.detail.faq.q1.q'), a: t('higherSchools.detail.faq.q1.a') },
    { q: t('higherSchools.detail.faq.q2.q'), a: t('higherSchools.detail.faq.q2.a') },
  ];

  return (
    <div dir={i18n.dir()} lang={isArabic ? 'ar' : 'fr'} className="min-h-screen bg-slate-50 pb-24 overflow-x-hidden font-sans w-full max-w-full text-start">
      <SEO
        title={t('higherSchools.detail.seoTitle', { name: schoolName, acronym: schoolAcronym ? ` (${schoolAcronym})` : '' })}
        description={t('higherSchools.detail.seoDescription', { name: schoolName, type: t(`higherSchools.types.${school.type}`), city, fields: fields.slice(0, 4).join(', ') })}
      />

      {/* Header */}
      <section className="bg-gradient-to-b from-[#F6FAFF] to-white pt-10 pb-14">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <Link to="/higher-schools" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors mb-8">
            <ArrowLeft size={16} className="transform rtl:rotate-180" />
            {t('higherSchools.detail.backToSchools')}
          </Link>

          <Reveal className="flex flex-col sm:flex-row items-start gap-6">
            <SchoolLogo school={school} />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <TypeBadge type={school.type} />
                <span className="flex items-center gap-1 text-slate-500 text-[13px] font-semibold">
                  <MapPin size={14} className="text-slate-400" />
                  {city}
                </span>
                {match && <MatchScoreBadge match={match} />}
              </div>
              <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-1">{schoolName}</h1>
              {schoolAcronym && <p className="text-primary font-bold text-sm">{schoolAcronym}</p>}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => favorites.toggle(school.id)}
                aria-pressed={isFav}
                className={`min-h-[48px] px-4 rounded-2xl border flex items-center gap-2 font-bold text-sm transition-all ${isFav ? 'bg-red-50 border-red-100 text-red-500' : 'bg-white border-slate-200 text-slate-600 hover:border-red-200'}`}
              >
                <Heart size={16} fill={isFav ? 'currentColor' : 'none'} />
                {isFav ? t('higherSchools.detail.favorite') : t('higherSchools.card.addToFav')}
              </button>
              <button
                onClick={() => compare.toggle(school.id)}
                disabled={!isCompared && compare.isFull}
                aria-pressed={isCompared}
                className={`min-h-[48px] w-12 rounded-2xl border flex items-center justify-center transition-all disabled:opacity-40 ${isCompared ? 'bg-primary/10 border-primary text-primary' : 'bg-white border-slate-200 text-slate-500 hover:border-primary/40'}`}
                title={isCompared ? t('higherSchools.card.rmFromCompare') : t('higherSchools.card.addToCompare')}
                aria-label={isCompared ? t('higherSchools.card.rmFromCompare') : t('higherSchools.card.addToCompare')}
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
              <DetailBlock title={t('higherSchools.detail.overview')}>
                <p className="text-slate-600 font-medium leading-relaxed">
                  {t('higherSchools.detail.overviewText', { name: schoolName, acronym: schoolAcronym ? ` (${schoolAcronym})` : '', type: t(`higherSchools.types.${school.type}`), city, fields: fields.join(', ') })}
                </p>
              </DetailBlock>

              <DetailBlock title={t('higherSchools.detail.fields')}>
                <div className="flex flex-wrap gap-2">
                  {school.fields.map((f, index) => (
                    <span key={f} className="px-3 py-1.5 rounded-full bg-blue-50 text-primary text-[13px] font-bold">{fields[index]}</span>
                  ))}
                </div>
              </DetailBlock>

              <DetailBlock title={t('higherSchools.detail.accessConditions')}>
                <div className="space-y-4">
                  <div>
                    <p className="text-[12px] font-black uppercase tracking-wide text-slate-400 mb-2">{t('higherSchools.filters.accessLevel')}</p>
                    <div className="flex flex-wrap gap-2">
                      {school.accessLevels.map((a, index) => <span key={a} className="px-3 py-1.5 rounded-full bg-slate-50 text-slate-700 text-[13px] font-bold">{accessLevels[index]}</span>)}
                    </div>
                  </div>
                  <div>
                    <p className="text-[12px] font-black uppercase tracking-wide text-slate-400 mb-2">{t('higherSchools.filters.admissionMethod')}</p>
                    <div className="flex flex-wrap gap-2">
                      {school.admissionMethods.map((a, index) => <span key={a} className="px-3 py-1.5 rounded-full bg-slate-50 text-slate-700 text-[13px] font-bold">{admissionMethods[index]}</span>)}
                    </div>
                  </div>
                </div>
              </DetailBlock>

              <DetailBlock title={t('higherSchools.detail.information2026')}>
                <dl className="grid sm:grid-cols-2 gap-4 text-sm">
                  {school.network && <div><dt className="font-black text-slate-400 text-xs uppercase tracking-wide">{t('higherSchools.detail.network')}</dt><dd className="font-bold text-slate-700 mt-1">{school.network}</dd></div>}
                  {school.authority && <div><dt className="font-black text-slate-400 text-xs uppercase tracking-wide">{t('higherSchools.detail.authority')}</dt><dd className="font-bold text-slate-700 mt-1">{localizeMetadata(school.authority)}</dd></div>}
                  {school.domain && <div><dt className="font-black text-slate-400 text-xs uppercase tracking-wide">{t('higherSchools.detail.mainDomain')}</dt><dd className="font-bold text-slate-700 mt-1">{isArabic ? fields.join('، ') : school.domain}</dd></div>}
                  {school.degree && <div><dt className="font-black text-slate-400 text-xs uppercase tracking-wide">{t('higherSchools.detail.degree')}</dt><dd className="font-bold text-slate-700 mt-1">{localizeMetadata(school.degree)}</dd></div>}
                  {school.bacProfiles && <div className="sm:col-span-2"><dt className="font-black text-slate-400 text-xs uppercase tracking-wide">{t('higherSchools.detail.bacProfiles')}</dt><dd className="font-bold text-slate-700 mt-1">{localizeMetadata(school.bacProfiles)}</dd></div>}
                  {school.verificationLevel && <div className="sm:col-span-2"><dt className="font-black text-slate-400 text-xs uppercase tracking-wide">{t('higherSchools.detail.verificationLevel')}</dt><dd className="font-bold text-slate-700 mt-1">{localizeMetadata(school.verificationLevel)}</dd></div>}
                </dl>
              </DetailBlock>

              <DetailBlock title={t('higherSchools.detail.tuition')}><NotAvailable /></DetailBlock>
              <DetailBlock title={t('higherSchools.detail.careers')}><NotAvailable /></DetailBlock>
              <DetailBlock title={t('higherSchools.detail.contests2026')}>
                <div className="space-y-3 text-sm font-medium text-slate-600">
                  <p><span className="font-black text-slate-800">{t('higherSchools.detail.status')} :</span> {localizeMetadata(school.contestStatus2026, t('higherSchools.detail.toVerify'))}</p>
                  <p><span className="font-black text-slate-800">{t('higherSchools.detail.deadline')} :</span> {school.deadline2026 || t('higherSchools.detail.notProvided')}</p>
                  <div className="flex flex-wrap gap-3">
                    {school.sourceUrl && <a href={school.sourceUrl} target="_blank" rel="noopener noreferrer" className="font-black text-primary hover:underline">{t('higherSchools.detail.schoolSource')}</a>}
                    {school.contestSourceUrl && <a href={school.contestSourceUrl} target="_blank" rel="noopener noreferrer" className="font-black text-primary hover:underline">{t('higherSchools.detail.contestSource')}</a>}
                  </div>
                </div>
              </DetailBlock>

              <DetailBlock title={t('higherSchools.detail.faqTitle')}>
                <div className="space-y-3">
                  {detailFaq.map((item, i) => {
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
                  <h3 className="font-black text-slate-900 mb-4">{t('higherSchools.detail.helpTitle')}</h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed mb-5">{t('higherSchools.detail.helpText')}</p>
                  <a href="https://wa.me/212708838299" target="_blank" rel="noopener noreferrer" className="w-full min-h-[48px] mb-3 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebc56] text-white rounded-2xl font-black text-sm transition-all">
                    <MessageCircle size={18} fill="white" />
                    {t('higherSchools.detail.whatsapp')}
                  </a>
                  <Link to="/tawjih" className="w-full min-h-[48px] flex items-center justify-center gap-2 bg-blue-50 text-primary rounded-2xl font-black text-sm hover:bg-blue-100 transition-all">
                    <Compass size={17} />
                    {t('higherSchools.orientationCTA.primaryButton')}
                  </Link>
                </div>
              </Reveal>

              {related.length > 0 && (
                <Reveal delay={100}>
                  <div className="bg-white rounded-[1.75rem] border border-slate-100 shadow-sm p-6">
                    <h3 className="font-black text-slate-900 mb-4">{t('higherSchools.detail.similarSchools')}</h3>
                    <div className="space-y-3">
                      {related.map((r) => (
                        <Link key={r.id} to={`/higher-schools/${r.slug}`} className="flex items-center gap-3 group">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center font-black text-xs shrink-0">
                            {(r.acronym || r.name).slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13px] font-bold text-slate-800 group-hover:text-primary transition-colors truncate">{r.acronym || r.name}</p>
                            <p className="text-[11px] text-slate-400 font-semibold">{t(`higherSchools.cities.${r.city}`, { defaultValue: r.city })}</p>
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
