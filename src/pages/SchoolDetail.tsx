import React, { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft, Award, BadgeCheck, BookOpen, Building2, ChevronDown, Clock3,
  Compass, ExternalLink, FileText, GraduationCap, Heart, Info, Landmark,
  MapPin, MapPinned, MessageCircle, Route, Scale, ShieldCheck, WalletCards,
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

const SchoolLogo: React.FC<{ school: School }> = ({ school }) => {
  const initials = (school.acronym || school.name)
    .split(/[\s-]+/).slice(0, 2).map((word) => word[0]).join('').toUpperCase().slice(0, 3);
  return (
    <div className="w-20 h-20 md:w-24 md:h-24 rounded-[1.6rem] bg-blue-50 text-primary flex items-center justify-center font-black text-xl md:text-2xl shrink-0 ring-1 ring-blue-100 shadow-sm">
      {initials || <GraduationCap size={30} />}
    </div>
  );
};

const SectionCard: React.FC<{
  id: string;
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}> = ({ id, icon: Icon, title, subtitle, children }) => (
  <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-32 bg-white border border-slate-200/80 rounded-[1.65rem] shadow-[0_12px_36px_rgba(15,23,42,0.045)] p-5 sm:p-7 lg:p-8">
    <div className="flex items-start gap-3.5 mb-6">
      <span className="w-11 h-11 rounded-2xl bg-blue-50 text-primary flex items-center justify-center shrink-0"><Icon size={21} /></span>
      <div>
        <h2 id={`${id}-title`} className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500 font-medium mt-1 leading-relaxed">{subtitle}</p>}
      </div>
    </div>
    {children}
  </section>
);

const Fact: React.FC<{ icon: React.ElementType; label: string; value: React.ReactNode }> = ({ icon: Icon, label, value }) => (
  <div className="min-w-0 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
    <div className="flex items-center gap-2 text-slate-400 mb-2">
      <Icon size={15} />
      <dt className="text-[11px] font-black uppercase tracking-[0.08em]">{label}</dt>
    </div>
    <dd className="text-sm font-bold text-slate-800 leading-relaxed break-words">{value}</dd>
  </div>
);

const MissingInfo: React.FC<{ text: string }> = ({ text }) => (
  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-5 flex items-start gap-3 text-slate-500">
    <Info size={18} className="shrink-0 mt-0.5 text-slate-400" />
    <p className="text-sm font-medium leading-relaxed">{text}</p>
  </div>
);

export const SchoolDetail: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const school = SCHOOLS.find((item) => item.slug === slug);
  const favorites = useFavorites();
  const compare = useCompareList();
  const { profile } = useSchoolProfile();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);
  if (!school) return <Navigate to="/higher-schools" replace />;

  const isArabic = i18n.language.startsWith('ar');
  const city = t(`higherSchools.cities.${school.city}`, { defaultValue: school.city });
  const family = isArabic
    ? LOCALIZED_SCHOOL_FAMILIES.find((key) => school.acronym === key || school.acronym?.startsWith(`${key} `))
    : undefined;
  const schoolName = family ? `${t(`higherSchools.schoolFamilies.${family}`)} ${city}` : school.name;
  const schoolAcronym = family ? `${family} ${city}` : school.acronym;
  const fields = school.fields.map((field) => t(`higherSchools.fields.${field}`, { defaultValue: field }));
  const accessLevels = school.accessLevels.map((level) => t(`higherSchools.access.${level}`, { defaultValue: level }));
  const admissionMethods = school.admissionMethods.map((method) => t(`higherSchools.admission.${method}`, { defaultValue: method }));
  const isFav = favorites.has(school.id);
  const isCompared = compare.has(school.id);
  const match = computeMatch(school, profile);
  const related = SCHOOLS.filter((item) => item.id !== school.id && (
    item.city === school.city || item.fields.some((field) => school.fields.includes(field))
  )).slice(0, 3);

  const localizeMetadata = (value: string | undefined, fallback = '') => {
    if (!value) return fallback;
    const translationKey = METADATA_TRANSLATION_KEYS[value];
    return isArabic && translationKey
      ? t(`higherSchools.detail.metadata.${translationKey}`, { defaultValue: value })
      : value;
  };

  const rawType = school.rawType.toLocaleLowerCase('fr');
  const typeKey = rawType.includes('militaire')
    ? 'military'
    : rawType.includes('partenariat')
      ? 'partnership'
      : school.type;
  const typeLabel = t(`higherSchools.types.${typeKey}`, { defaultValue: school.rawType });
  const duration = t('higherSchools.detail.durationUnknown');
  const diploma = localizeMetadata(school.degree, t('higherSchools.detail.diplomaUnknown'));
  const bacCompatibility = localizeMetadata(school.bacProfiles, t('higherSchools.detail.bacNotProvided'));
  const domain = isArabic ? fields.join('، ') : (school.domain || fields.join(', '));

  const detailFaq = [
    { q: t('higherSchools.detail.faq.q1.q'), a: t('higherSchools.detail.faq.q1.a') },
    { q: t('higherSchools.detail.faq.q2.q'), a: t('higherSchools.detail.faq.q2.a') },
  ];
  const navItems = [
    ['general', t('higherSchools.detail.generalInfo')],
    ['bacs', t('higherSchools.detail.bacTitle')],
    ['about', t('higherSchools.detail.aboutTitle')],
    ['programs', t('higherSchools.detail.programsTitle')],
    ['campuses', t('higherSchools.detail.campusTitle')],
    ['admissions', t('higherSchools.detail.admissionsTitle')],
  ];

  const jsonLd = [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: t('higherSchools.title'), item: 'https://tilmide.ma/higher-schools' },
        { '@type': 'ListItem', position: 2, name: schoolName, item: `https://tilmide.ma/higher-schools/${school.slug}` },
      ],
    },
    {
      '@type': 'CollegeOrUniversity',
      name: schoolName,
      alternateName: schoolAcronym,
      url: school.sourceUrl || `https://tilmide.ma/higher-schools/${school.slug}`,
      address: { '@type': 'PostalAddress', addressLocality: school.city, addressCountry: 'MA' },
      parentOrganization: school.authority ? { '@type': 'Organization', name: school.authority } : undefined,
    },
  ];

  return (
    <div dir={i18n.dir()} lang={isArabic ? 'ar' : 'fr'} className="min-h-screen bg-[#F6F8FB] pb-24 overflow-x-hidden text-start">
      <SEO
        title={t('higherSchools.detail.seoTitle', { name: schoolName, acronym: schoolAcronym ? ` (${schoolAcronym})` : '' })}
        description={t('higherSchools.detail.seoDescription', { name: schoolName, type: typeLabel, city, fields: fields.join(', ') })}
        url={`/higher-schools/${school.slug}`}
        jsonLd={jsonLd}
      />

      <header className="bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 md:py-9">
          <nav aria-label={t('higherSchools.detail.breadcrumbLabel')} className="mb-6">
            <Link to="/higher-schools" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors">
              <ArrowLeft size={16} className="rtl:rotate-180" />
              {t('higherSchools.detail.backToSchools')}
            </Link>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            <SchoolLogo school={school} />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wide ${typeKey === 'military' ? 'bg-slate-800 text-white' : school.type === 'public' ? 'bg-emerald-50 text-emerald-700' : 'bg-purple-50 text-purple-700'}`}>{typeLabel}</span>
                <span className="inline-flex items-center gap-1.5 text-[13px] text-slate-500 font-bold"><MapPin size={14} />{city}</span>
                {school.verificationLevel && <span className="inline-flex items-center gap-1.5 text-[11px] text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full font-black"><BadgeCheck size={13} />{t('higherSchools.detail.verifiedData')}</span>}
                {match && <MatchScoreBadge match={match} />}
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-[2.6rem] font-black text-slate-950 tracking-tight leading-[1.12] max-w-4xl">{schoolName}</h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm">
                {schoolAcronym && <span className="font-black text-primary">{schoolAcronym}</span>}
                {school.network && <span className="inline-flex items-center gap-1.5 text-slate-500 font-semibold"><Landmark size={14} />{school.network}</span>}
                <span className="inline-flex items-center gap-1.5 text-slate-500 font-semibold"><BookOpen size={14} />{fields.join(isArabic ? '، ' : ', ')}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 lg:max-w-[310px]">
              <button onClick={() => favorites.toggle(school.id)} aria-pressed={isFav} className={`min-h-[46px] px-4 rounded-xl border inline-flex items-center gap-2 text-sm font-black transition-colors ${isFav ? 'bg-red-50 border-red-100 text-red-600' : 'bg-white border-slate-200 text-slate-700 hover:border-red-200'}`}>
                <Heart size={17} fill={isFav ? 'currentColor' : 'none'} />
                {isFav ? t('higherSchools.detail.favorite') : t('higherSchools.card.addToFav')}
              </button>
              <button onClick={() => compare.toggle(school.id)} disabled={!isCompared && compare.isFull} aria-pressed={isCompared} className={`min-h-[46px] px-4 rounded-xl border inline-flex items-center gap-2 text-sm font-black transition-colors disabled:opacity-40 ${isCompared ? 'bg-blue-50 border-blue-200 text-primary' : 'bg-white border-slate-200 text-slate-700 hover:border-blue-200'}`}>
                <Scale size={17} />{isCompared ? t('higherSchools.card.rmFromCompare') : t('higherSchools.detail.compare')}
              </button>
              {school.sourceUrl && <a href={school.sourceUrl} target="_blank" rel="noopener noreferrer" className="min-h-[46px] px-4 rounded-xl bg-slate-900 text-white inline-flex items-center gap-2 text-sm font-black hover:bg-primary transition-colors"><ExternalLink size={16} />{t('higherSchools.detail.officialWebsite')}</a>}
            </div>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-7">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-4 flex items-center gap-3"><span className="w-10 h-10 rounded-xl bg-white text-primary flex items-center justify-center shadow-sm"><Clock3 size={19} /></span><div><dt className="text-[11px] uppercase tracking-wide font-black text-slate-400">{t('higherSchools.detail.studyYears')}</dt><dd className="text-sm font-black text-slate-800 mt-0.5">{duration}</dd></div></div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-4 flex items-center gap-3"><span className="w-10 h-10 rounded-xl bg-white text-primary flex items-center justify-center shadow-sm"><Award size={19} /></span><div className="min-w-0"><dt className="text-[11px] uppercase tracking-wide font-black text-slate-400">{t('higherSchools.detail.diplomasAwarded')}</dt><dd className="text-sm font-black text-slate-800 mt-0.5 line-clamp-2">{diploma}</dd></div></div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-4 flex items-center gap-3"><span className="w-10 h-10 rounded-xl bg-white text-primary flex items-center justify-center shadow-sm"><MapPinned size={19} /></span><div><dt className="text-[11px] uppercase tracking-wide font-black text-slate-400">{t('higherSchools.detail.campuses')}</dt><dd className="text-sm font-black text-slate-800 mt-0.5">{t('higherSchools.detail.oneVerifiedCampus')}</dd></div></div>
          </dl>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_290px] gap-7 lg:gap-8 items-start">
          <main className="space-y-6 min-w-0">
            <SectionCard id="general" icon={Building2} title={t('higherSchools.detail.generalInfo')} subtitle={t('higherSchools.detail.generalInfoSubtitle')}>
              <dl className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
                <Fact icon={Building2} label={t('higherSchools.detail.institutionName')} value={schoolName} />
                <Fact icon={Landmark} label={t('higherSchools.detail.institutionType')} value={typeLabel} />
                <Fact icon={Clock3} label={t('higherSchools.detail.studyYears')} value={duration} />
                <Fact icon={Award} label={t('higherSchools.detail.diplomasAwarded')} value={diploma} />
                <Fact icon={GraduationCap} label={t('higherSchools.detail.authority')} value={localizeMetadata(school.authority, t('higherSchools.detail.notProvided'))} />
                <Fact icon={BookOpen} label={t('higherSchools.detail.mainDomain')} value={domain} />
                <Fact icon={Route} label={t('higherSchools.filters.admissionMethod')} value={admissionMethods.join(isArabic ? '، ' : ', ') || t('higherSchools.detail.notProvided')} />
              </dl>
            </SectionCard>

            <SectionCard id="bacs" icon={ShieldCheck} title={t('higherSchools.detail.bacTitle')} subtitle={t('higherSchools.detail.bacSubtitle')}>
              {school.bacProfiles ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2"><span className="px-3.5 py-2 rounded-xl bg-blue-50 text-blue-800 text-sm font-bold border border-blue-100">{bacCompatibility}</span></div>
                  <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4 flex items-start gap-3"><ShieldCheck size={18} className="text-amber-600 shrink-0 mt-0.5" /><div><p className="text-sm font-black text-amber-900">{t('higherSchools.detail.eligibilityUnknown')}</p><p className="text-[13px] text-amber-800/80 font-medium leading-relaxed mt-1">{t('higherSchools.detail.eligibilityNote')}</p></div></div>
                </div>
              ) : <MissingInfo text={t('higherSchools.detail.bacNotProvided')} />}
            </SectionCard>

            <SectionCard id="about" icon={FileText} title={t('higherSchools.detail.aboutTitle')}>
              <MissingInfo text={t('higherSchools.detail.aboutMissing')} />
            </SectionCard>

            <SectionCard id="programs" icon={BookOpen} title={t('higherSchools.detail.programsTitle')} subtitle={t('higherSchools.detail.programsSubtitle')}>
              <div className="rounded-2xl border border-slate-200 overflow-hidden">
                <div className="p-5 sm:p-6 bg-gradient-to-br from-white to-blue-50/50">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                    <div><span className="text-[11px] font-black uppercase tracking-widest text-primary">{t('higherSchools.detail.referencedDomain')}</span><h3 className="text-lg font-black text-slate-900 mt-1">{domain}</h3></div>
                    <span className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-500">{t('higherSchools.detail.programCountUnknown')}</span>
                  </div>
                  <dl className="grid sm:grid-cols-2 gap-3">
                    <Fact icon={BookOpen} label={t('higherSchools.detail.mainDomain')} value={fields.join(isArabic ? '، ' : ', ')} />
                    <Fact icon={Clock3} label={t('higherSchools.detail.duration')} value={duration} />
                    <Fact icon={Award} label={t('higherSchools.detail.degree')} value={diploma} />
                    <Fact icon={ShieldCheck} label={t('higherSchools.detail.compatibleBacs')} value={bacCompatibility} />
                    <Fact icon={MapPin} label={t('higherSchools.detail.availableCampus')} value={city} />
                    <Fact icon={WalletCards} label={t('higherSchools.detail.tuition')} value={t('higherSchools.detail.notAvailable')} />
                  </dl>
                </div>
                <div className="px-5 sm:px-6 py-4 bg-slate-50 border-t border-slate-100 text-[13px] text-slate-500 font-medium flex items-start gap-2"><Info size={15} className="shrink-0 mt-0.5" />{t('higherSchools.detail.programDataNotice')}</div>
              </div>
            </SectionCard>

            <SectionCard id="campuses" icon={MapPinned} title={t('higherSchools.detail.campusTitle')} subtitle={t('higherSchools.detail.campusSubtitle')}>
              <article className="rounded-2xl border border-slate-200 p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <span className="w-12 h-12 rounded-2xl bg-blue-50 text-primary flex items-center justify-center shrink-0"><Building2 size={22} /></span>
                  <div className="flex-1 min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="font-black text-slate-900 text-lg">{schoolAcronym || schoolName}</h3><span className="text-[10px] uppercase tracking-wide font-black text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">{t('higherSchools.detail.verifiedRecord')}</span></div><p className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 mt-2"><MapPin size={15} />{city}</p></div>
                </div>
                <dl className="grid sm:grid-cols-2 gap-3 mt-5">
                  <Fact icon={BookOpen} label={t('higherSchools.detail.academicAreas')} value={fields.join(isArabic ? '، ' : ', ')} />
                  <Fact icon={MapPinned} label={t('higherSchools.detail.address')} value={t('higherSchools.detail.addressUnknown')} />
                </dl>
              </article>
            </SectionCard>

            <SectionCard id="admissions" icon={Route} title={t('higherSchools.detail.admissionsTitle')} subtitle={t('higherSchools.detail.admissionsSubtitle')}>
              <dl className="grid sm:grid-cols-2 gap-3">
                <Fact icon={GraduationCap} label={t('higherSchools.filters.accessLevel')} value={accessLevels.join(isArabic ? '، ' : ', ')} />
                <Fact icon={Route} label={t('higherSchools.filters.admissionMethod')} value={admissionMethods.join(isArabic ? '، ' : ', ')} />
                <Fact icon={BadgeCheck} label={t('higherSchools.detail.status')} value={localizeMetadata(school.contestStatus2026, t('higherSchools.detail.toVerify'))} />
                <Fact icon={Clock3} label={t('higherSchools.detail.deadline')} value={school.deadline2026 || t('higherSchools.detail.notProvided')} />
              </dl>
              {(school.sourceUrl || school.contestSourceUrl) && <div className="flex flex-wrap gap-3 mt-5">{school.sourceUrl && <a href={school.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-black text-primary hover:underline"><ExternalLink size={15} />{t('higherSchools.detail.schoolSource')}</a>}{school.contestSourceUrl && <a href={school.contestSourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-black text-primary hover:underline"><ExternalLink size={15} />{t('higherSchools.detail.contestSource')}</a>}</div>}
              <p className="mt-5 text-xs text-slate-400 font-medium leading-relaxed">{t('higherSchools.detail.admissionDisclaimer')}</p>
            </SectionCard>

            <SectionCard id="faq" icon={Info} title={t('higherSchools.detail.faqTitle')}>
              <div className="space-y-3">{detailFaq.map((item, index) => { const isOpen = openFaq === index; return <div key={item.q} className="border border-slate-200 rounded-2xl overflow-hidden"><button onClick={() => setOpenFaq(isOpen ? null : index)} aria-expanded={isOpen} className="w-full min-h-[52px] p-4 flex items-center justify-between gap-3 text-start"><span className="text-sm font-bold text-slate-800">{item.q}</span><ChevronDown size={17} className={`text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} /></button>{isOpen && <p className="px-4 pb-4 text-[13px] text-slate-500 font-medium leading-relaxed">{item.a}</p>}</div>; })}</div>
            </SectionCard>
          </main>

          <aside className="lg:sticky lg:top-[112px] space-y-5">
            <div className="bg-white border border-slate-200 rounded-[1.4rem] p-5 shadow-sm hidden lg:block">
              <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3">{t('higherSchools.detail.onThisPage')}</p>
              <nav className="space-y-1" aria-label={t('higherSchools.detail.onThisPage')}>{navItems.map(([id, label]) => <a key={id} href={`#${id}`} className="block px-3 py-2.5 rounded-xl text-[13px] font-bold text-slate-600 hover:bg-blue-50 hover:text-primary transition-colors">{label}</a>)}</nav>
            </div>

            <div className="bg-[#0B1739] text-white rounded-[1.4rem] p-5 shadow-xl shadow-slate-900/10">
              <span className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4"><Compass size={20} /></span>
              <h3 className="font-black text-lg">{t('higherSchools.detail.helpTitle')}</h3>
              <p className="text-blue-100/75 text-[13px] font-medium leading-relaxed mt-2 mb-5">{t('higherSchools.detail.helpText')}</p>
              <Link to="/tawjih" className="w-full min-h-[46px] flex items-center justify-center gap-2 rounded-xl bg-primary text-white text-sm font-black hover:bg-blue-500 transition-colors"><Compass size={16} />{t('higherSchools.orientationCTA.primaryButton')}</Link>
              <a href="https://wa.me/212708838299" target="_blank" rel="noopener noreferrer" className="w-full min-h-[46px] mt-2 flex items-center justify-center gap-2 rounded-xl bg-white/10 text-white text-sm font-black hover:bg-white/15 transition-colors"><MessageCircle size={16} />{t('higherSchools.detail.whatsapp')}</a>
            </div>

            {related.length > 0 && <div className="bg-white border border-slate-200 rounded-[1.4rem] p-5 shadow-sm"><h3 className="font-black text-slate-900 mb-4">{t('higherSchools.detail.similarSchools')}</h3><div className="space-y-3">{related.map((item) => <Link key={item.id} to={`/higher-schools/${item.slug}`} className="flex items-center gap-3 group"><span className="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center text-xs font-black shrink-0">{(item.acronym || item.name).slice(0, 2).toUpperCase()}</span><span className="min-w-0"><span className="block text-[13px] font-bold text-slate-800 group-hover:text-primary truncate">{item.acronym || item.name}</span><span className="block text-[11px] font-semibold text-slate-400 mt-0.5">{t(`higherSchools.cities.${item.city}`, { defaultValue: item.city })}</span></span></Link>)}</div></div>}
          </aside>
        </div>
      </div>
    </div>
  );
};
