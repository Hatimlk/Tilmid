import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Award, BookOpen, Building2, Clock3, ExternalLink, GraduationCap, Heart, Info, MapPin, MapPinned, Scale, ShieldCheck } from 'lucide-react';
import SEO from '../components/SEO';
import { getInstitutionBySlug } from '../constants/institutions';
import { useCompareList, useFavorites } from '../hooks/useSchoolCollections';

const Block: React.FC<{ id: string; icon: React.ElementType; title: string; children: React.ReactNode }> = ({ id, icon: Icon, title, children }) => <section id={id} className="scroll-mt-28 bg-white border border-slate-200 rounded-[1.6rem] p-5 sm:p-7"><div className="flex items-center gap-3 mb-5"><span className="w-11 h-11 rounded-2xl bg-blue-50 text-primary flex items-center justify-center"><Icon size={21} /></span><h2 className="text-xl font-black text-slate-900">{title}</h2></div>{children}</section>;
const Empty: React.FC<{ children: React.ReactNode }> = ({ children }) => <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 flex items-start gap-3 text-sm text-slate-500 font-medium"><Info size={17} className="shrink-0 mt-0.5" />{children}</div>;

export const InstitutionDetail: React.FC = () => {
  const { institutionSlug } = useParams<{ institutionSlug: string }>();
  const { t, i18n } = useTranslation();
  const institution = getInstitutionBySlug(institutionSlug);
  const favorites = useFavorites();
  const compare = useCompareList();
  if (!institution) return <Navigate to="/higher-schools" replace />;

  const isArabic = i18n.language.startsWith('ar');
  const name = isArabic && institution.isNetwork && institution.acronym
    ? t(`higherSchools.schoolFamilies.${institution.acronym}`, { defaultValue: institution.name })
    : institution.name;
  const ids = [institution.favoriteId, ...institution.campuses.map((campus) => campus.id)];
  const isFavorite = favorites.hasAny(ids);
  const isCompared = compare.hasAny(ids);
  const fields = institution.fields.map((field) => t(`higherSchools.fields.${field}`, field));
  const cities = institution.cities.map((city) => t(`higherSchools.cities.${city}`, city));
  const raw = institution.rawTypes.join(' ').toLocaleLowerCase('fr');
  const typeKey = raw.includes('militaire') ? 'military' : raw.includes('partenariat') ? 'partnership' : institution.type;
  const type = t(`higherSchools.types.${typeKey}`);

  return <div dir={i18n.dir()} lang={isArabic ? 'ar' : 'fr'} className="min-h-screen bg-[#F7F9FC] pb-20 text-start">
    <SEO title={`${institution.acronym ? `${institution.acronym} — ` : ''}${name}`} description={t('higherSchools.directoryV2.institutionSeo', { name, campuses: institution.campuses.length, fields: fields.join(', ') })} url={`/higher-schools/institution/${institution.slug}`} jsonLd={[{ '@type': 'CollegeOrUniversity', name, alternateName: institution.acronym, subOrganization: institution.campuses.map((campus) => ({ '@type': 'CollegeOrUniversity', name: campus.name, address: { '@type': 'PostalAddress', addressLocality: campus.city, addressCountry: 'MA' } })) }]} />
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/higher-schools" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary"><ArrowLeft size={16} className="rtl:rotate-180" />{t('higherSchools.detail.backToSchools')}</Link>
        <div className="mt-7 flex flex-col lg:flex-row lg:items-start gap-6">
          <div className="w-24 h-24 rounded-[1.6rem] bg-blue-50 text-primary flex items-center justify-center text-xl font-black ring-1 ring-blue-100">{(institution.acronym || name.slice(0, 3)).slice(0, 4)}</div>
          <div className="flex-1"><div className="flex flex-wrap gap-2 mb-3"><span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-black uppercase">{type}</span>{institution.isNetwork && <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-black uppercase">{t('higherSchools.directoryV2.globalNetwork')}</span>}</div><h1 className="text-3xl md:text-4xl font-black text-slate-950 tracking-tight">{name}</h1>{institution.acronym && <p className="text-primary font-black mt-2">{institution.acronym}</p>}<p className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 font-semibold mt-3"><span className="inline-flex items-center gap-1.5"><MapPinned size={15} />{t('higherSchools.directoryV2.campusCount', { count: institution.campuses.length })}</span><span className="inline-flex items-center gap-1.5"><BookOpen size={15} />{fields.join(isArabic ? '، ' : ', ')}</span></p></div>
          <div className="flex flex-wrap gap-2"><button onClick={() => favorites.toggleCanonical(institution.favoriteId, institution.campuses.map((campus) => campus.id))} className={`min-h-[46px] px-4 rounded-xl border flex items-center gap-2 font-black text-sm ${isFavorite ? 'bg-red-50 text-red-600 border-red-100' : 'bg-white border-slate-200'}`}><Heart size={17} fill={isFavorite ? 'currentColor' : 'none'} />{isFavorite ? t('higherSchools.detail.favorite') : t('higherSchools.card.addToFav')}</button><button onClick={() => compare.toggleCanonical(institution.favoriteId, institution.campuses.map((campus) => campus.id))} className={`min-h-[46px] px-4 rounded-xl border flex items-center gap-2 font-black text-sm ${isCompared ? 'bg-blue-50 text-primary border-blue-200' : 'bg-white border-slate-200'}`}><Scale size={17} />{t('higherSchools.detail.compare')}</button></div>
        </div>
        <dl className="grid sm:grid-cols-3 gap-3 mt-7"><div className="p-4 rounded-2xl bg-slate-50 border border-slate-200"><dt className="text-[11px] font-black uppercase text-slate-400">{t('higherSchools.detail.studyYears')}</dt><dd className="font-black text-sm mt-1">{t('higherSchools.detail.durationUnknown')}</dd></div><div className="p-4 rounded-2xl bg-slate-50 border border-slate-200"><dt className="text-[11px] font-black uppercase text-slate-400">{t('higherSchools.detail.diplomasAwarded')}</dt><dd className="font-black text-sm mt-1">{institution.degrees.join(' · ') || t('higherSchools.detail.diplomaUnknown')}</dd></div><div className="p-4 rounded-2xl bg-slate-50 border border-slate-200"><dt className="text-[11px] font-black uppercase text-slate-400">{t('higherSchools.detail.campuses')}</dt><dd className="font-black text-sm mt-1">{institution.campuses.length}</dd></div></dl>
      </div>
    </header>

    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Block id="general" icon={Building2} title={t('higherSchools.detail.generalInfo')}><dl className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3"><div className="p-4 rounded-2xl bg-slate-50"><dt className="text-xs font-black text-slate-400 uppercase">{t('higherSchools.detail.institutionType')}</dt><dd className="font-bold mt-2">{type}</dd></div><div className="p-4 rounded-2xl bg-slate-50"><dt className="text-xs font-black text-slate-400 uppercase">{t('higherSchools.detail.mainDomain')}</dt><dd className="font-bold mt-2">{fields.join(isArabic ? '، ' : ', ')}</dd></div><div className="p-4 rounded-2xl bg-slate-50"><dt className="text-xs font-black text-slate-400 uppercase">{t('higherSchools.detail.authority')}</dt><dd className="font-bold mt-2">{institution.authorities.join(' · ') || t('higherSchools.detail.notProvided')}</dd></div><div className="p-4 rounded-2xl bg-slate-50"><dt className="text-xs font-black text-slate-400 uppercase">{t('higherSchools.filters.admissionMethod')}</dt><dd className="font-bold mt-2">{institution.admissionMethods.map((method) => t(`higherSchools.admission.${method}`, method)).join(isArabic ? '، ' : ', ')}</dd></div></dl></Block>
      <Block id="bacs" icon={ShieldCheck} title={t('higherSchools.detail.bacTitle')}>{institution.bacProfiles.length ? <div className="flex flex-wrap gap-2">{institution.bacProfiles.map((bac) => <span key={bac} className="px-3 py-2 rounded-xl bg-blue-50 border border-blue-100 text-sm text-blue-800 font-bold">{bac}</span>)}</div> : <Empty>{t('higherSchools.detail.bacNotProvided')}</Empty>}</Block>
      <Block id="about" icon={GraduationCap} title={t('higherSchools.detail.aboutTitle')}><Empty>{t('higherSchools.detail.aboutMissing')}</Empty></Block>
      <Block id="programs" icon={BookOpen} title={t('higherSchools.detail.programsTitle')}><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">{institution.fields.map((field) => <article key={field} className="p-5 rounded-2xl border border-slate-200"><span className="text-[10px] uppercase tracking-widest font-black text-primary">{t('higherSchools.detail.referencedDomain')}</span><h3 className="font-black text-slate-900 mt-2">{t(`higherSchools.fields.${field}`, field)}</h3><p className="text-xs text-slate-400 font-medium mt-3">{t('higherSchools.detail.programDataNotice')}</p></article>)}</div></Block>
      <Block id="campuses" icon={MapPinned} title={t('higherSchools.detail.campusTitle')}><p className="text-sm text-slate-500 font-medium mb-5">{cities.join(isArabic ? '، ' : ', ')}</p><div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">{institution.campuses.map((campus) => <article key={campus.id} className="p-5 rounded-2xl border border-slate-200 flex flex-col"><div className="flex items-start gap-3"><span className="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center shrink-0"><Building2 size={18} /></span><div><h3 className="font-black text-slate-900 leading-snug">{campus.acronym || campus.name}</h3><p className="text-sm text-slate-500 font-semibold mt-1 inline-flex items-center gap-1"><MapPin size={13} />{t(`higherSchools.cities.${campus.city}`, campus.city)}</p></div></div><p className="text-xs text-slate-400 font-medium mt-4">{campus.degree || t('higherSchools.detail.diplomaUnknown')}</p><div className="mt-auto pt-4 flex items-center gap-3"><Link to={`/higher-schools/${campus.slug}`} className="text-sm font-black text-primary hover:underline">{t('higherSchools.directoryV2.viewCampus')}</Link>{campus.sourceUrl && <a href={campus.sourceUrl} target="_blank" rel="noopener noreferrer" aria-label={t('higherSchools.detail.officialWebsite')} className="text-slate-400 hover:text-primary"><ExternalLink size={15} /></a>}</div></article>)}</div></Block>
    </main>
  </div>;
};
