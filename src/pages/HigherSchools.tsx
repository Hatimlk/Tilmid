import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft, Award, Building2, ChevronDown, ChevronLeft, ChevronRight,
  Compass, GraduationCap, Heart, MapPin, Search, SlidersHorizontal, X,
} from 'lucide-react';
import SEO from '../components/SEO';
import {
  EMPTY_INSTITUTION_FILTERS, filterInstitutions, Institution, InstitutionFilters,
  INSTITUTION_CITIES, INSTITUTION_DEGREES, INSTITUTION_FIELDS, INSTITUTIONS,
  matchingCampuses,
} from '../constants/institutions';
import { SchoolType, toSlug } from '../constants/schools';
import { useCompareList, useFavorites } from '../hooks/useSchoolCollections';

const PAGE_SIZE = 12;

const parseList = (value: string | null) => value?.split(',').filter(Boolean) || [];
const parseFilters = (params: URLSearchParams): InstitutionFilters => ({
  query: params.get('q') || '',
  types: parseList(params.get('type')).filter((value): value is SchoolType => value === 'public' || value === 'private'),
  cities: parseList(params.get('city')).map((slug) => INSTITUTION_CITIES.find((city) => toSlug(city) === slug)).filter(Boolean) as string[],
  fields: parseList(params.get('field')).map((slug) => INSTITUTION_FIELDS.find((field) => toSlug(field) === slug)).filter(Boolean) as string[],
  degrees: parseList(params.get('degree')).map((slug) => INSTITUTION_DEGREES.find((degree) => toSlug(degree) === slug)).filter(Boolean) as string[],
});

const localizedInstitutionName = (institution: Institution, language: string, t: ReturnType<typeof useTranslation>['t']) => {
  if (!language.startsWith('ar') || !institution.isNetwork || !institution.acronym) return institution.name;
  return t(`higherSchools.schoolFamilies.${institution.acronym}`, { defaultValue: institution.name });
};

const typeLabel = (institution: Institution, t: ReturnType<typeof useTranslation>['t']) => {
  const raw = institution.rawTypes.join(' ').toLocaleLowerCase('fr');
  const key = raw.includes('militaire') ? 'military' : raw.includes('partenariat') ? 'partnership' : institution.type;
  return t(`higherSchools.types.${key}`);
};

const InstitutionCard: React.FC<{
  institution: Institution;
  filters: InstitutionFilters;
  favorite: ReturnType<typeof useFavorites>;
  compare: ReturnType<typeof useCompareList>;
}> = ({ institution, filters, favorite, compare }) => {
  const { t, i18n } = useTranslation();
  const ids = [institution.favoriteId, ...institution.campuses.map((campus) => campus.id)];
  const isFavorite = favorite.hasAny(ids);
  const isCompared = compare.hasAny(ids);
  const matched = matchingCampuses(institution, filters);
  const queryMatchedCities = [...new Set(matched.map((campus) => campus.city))];
  const name = localizedInstitutionName(institution, i18n.language, t);
  const initials = institution.acronym || name.split(/\s+/).slice(0, 2).map((word) => word[0]).join('').toUpperCase();
  const diplomaText = institution.degrees.slice(0, 2).join(' · ') || t('higherSchools.detail.diplomaUnknown');

  return (
    <article className="bg-white border border-slate-200 rounded-[1.35rem] p-5 flex flex-col min-h-[330px] shadow-[0_8px_24px_rgba(15,23,42,0.035)] hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(15,23,42,0.075)] transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-primary ring-1 ring-blue-100 flex items-center justify-center text-sm font-black shrink-0">{initials.slice(0, 4)}</div>
        <button onClick={() => favorite.toggleCanonical(institution.favoriteId, institution.campuses.map((campus) => campus.id))} aria-pressed={isFavorite} aria-label={isFavorite ? t('higherSchools.card.rmFromFav') : t('higherSchools.card.addToFav')} className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isFavorite ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400 hover:text-red-500'}`}><Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} /></button>
      </div>

      <div className="mt-4">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {institution.acronym && <span className="font-black text-primary text-sm">{institution.acronym}</span>}
          <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${institution.type === 'public' ? 'bg-emerald-50 text-emerald-700' : 'bg-purple-50 text-purple-700'}`}>{typeLabel(institution, t)}</span>
        </div>
        <h2 className="text-[17px] font-black text-slate-900 leading-snug line-clamp-2 min-h-[46px]">{name}</h2>
      </div>

      <div className="mt-4 space-y-2.5 text-[12.5px] font-semibold text-slate-500">
        <p className="flex items-start gap-2"><GraduationCap size={15} className="text-slate-400 shrink-0 mt-0.5" /><span className="line-clamp-2">{institution.fields.slice(0, 2).map((field) => t(`higherSchools.fields.${field}`, field)).join(' · ')}</span></p>
        <p className="flex items-start gap-2"><Building2 size={15} className="text-slate-400 shrink-0 mt-0.5" /><span>{institution.campuses.length === 1 ? t('higherSchools.directoryV2.oneCampus') : t('higherSchools.directoryV2.campusCount', { count: institution.campuses.length })}</span></p>
        <p className="flex items-start gap-2"><Award size={15} className="text-slate-400 shrink-0 mt-0.5" /><span className="line-clamp-2">{diplomaText}</span></p>
        {filters.query && queryMatchedCities.length > 0 && queryMatchedCities.length < institution.cities.length && <p className="flex items-start gap-2 text-primary"><MapPin size={15} className="shrink-0 mt-0.5" /><span>{t('higherSchools.directoryV2.matchingCampus')} : {queryMatchedCities.map((city) => t(`higherSchools.cities.${city}`, city)).join(', ')}</span></p>}
      </div>

      <div className="mt-auto pt-5 flex items-center gap-2">
        <Link to={`/higher-schools/institution/${institution.slug}`} className="flex-1 min-h-[44px] px-3 rounded-xl bg-slate-900 text-white flex items-center justify-center gap-1.5 text-xs font-black whitespace-nowrap hover:bg-primary transition-colors">{t('higherSchools.directoryV2.discover')}<ArrowLeft size={14} className="ltr:rotate-180 shrink-0" /></Link>
        <button onClick={() => compare.toggleCanonical(institution.favoriteId, institution.campuses.map((campus) => campus.id))} disabled={!isCompared && compare.isFull} aria-pressed={isCompared} aria-label={isCompared ? t('higherSchools.card.rmFromCompare') : t('higherSchools.card.addToCompare')} className={`w-11 min-h-[44px] rounded-xl border flex items-center justify-center text-xs font-black disabled:opacity-40 ${isCompared ? 'bg-blue-50 border-primary text-primary' : 'border-slate-200 text-slate-500'}`}>⇄</button>
      </div>
    </article>
  );
};

const CheckboxGroup: React.FC<{
  title: string;
  options: string[];
  selected: string[];
  labels?: Record<string, string>;
  onToggle: (value: string) => void;
}> = ({ title, options, selected, labels = {}, onToggle }) => (
  <details open className="group border-b border-slate-100 pb-4 last:border-0">
    <summary className="list-none cursor-pointer flex items-center justify-between min-h-[40px] font-black text-sm text-slate-800"><span>{title}</span><ChevronDown size={16} className="text-slate-400 group-open:rotate-180 transition-transform" /></summary>
    <div className="space-y-2 mt-2 max-h-48 overflow-y-auto pe-1">
      {options.map((option) => <label key={option} className="flex items-start gap-2.5 cursor-pointer text-[13px] text-slate-600 font-semibold"><input type="checkbox" checked={selected.includes(option)} onChange={() => onToggle(option)} className="mt-0.5 w-4 h-4 rounded border-slate-300 accent-primary" /><span>{labels[option] || option}</span></label>)}
    </div>
  </details>
);

const FiltersPanel: React.FC<{
  filters: InstitutionFilters;
  toggle: (key: 'types' | 'cities' | 'fields' | 'degrees', value: string) => void;
  clear: () => void;
  activeCount: number;
}> = ({ filters, toggle, clear, activeCount }) => {
  const { t } = useTranslation();
  return <div className="bg-white border border-slate-200 rounded-[1.35rem] p-5 space-y-4">
    <div className="flex items-center justify-between"><h2 className="font-black text-slate-900 flex items-center gap-2"><SlidersHorizontal size={17} />{t('higherSchools.explorer.filters')}{activeCount > 0 && <span className="w-6 h-6 rounded-full bg-primary text-white text-[11px] flex items-center justify-center">{activeCount}</span>}</h2>{activeCount > 0 && <button onClick={clear} className="text-xs font-black text-primary hover:underline">{t('higherSchools.explorer.resetButton')}</button>}</div>
    <CheckboxGroup title={t('higherSchools.filters.type')} options={['public', 'private']} selected={filters.types} labels={{ public: t('higherSchools.types.public'), private: t('higherSchools.types.private') }} onToggle={(value) => toggle('types', value)} />
    <CheckboxGroup title={t('higherSchools.filters.city')} options={INSTITUTION_CITIES} selected={filters.cities} labels={Object.fromEntries(INSTITUTION_CITIES.map((city) => [city, t(`higherSchools.cities.${city}`, city)]))} onToggle={(value) => toggle('cities', value)} />
    <CheckboxGroup title={t('higherSchools.filters.field')} options={INSTITUTION_FIELDS} selected={filters.fields} labels={Object.fromEntries(INSTITUTION_FIELDS.map((field) => [field, t(`higherSchools.fields.${field}`, field)]))} onToggle={(value) => toggle('fields', value)} />
    <CheckboxGroup title={t('higherSchools.directoryV2.diplomaFilter')} options={INSTITUTION_DEGREES} selected={filters.degrees} onToggle={(value) => toggle('degrees', value)} />
  </div>;
};

const ComparisonModal: React.FC<{ institutions: Institution[]; onClose: () => void; onClear: () => void }> = ({ institutions, onClose, onClear }) => {
  const { t } = useTranslation();
  const rows = [
    [t('higherSchools.compare.typeLabel'), (item: Institution) => typeLabel(item, t)],
    [t('higherSchools.compare.cityLabel'), (item: Institution) => item.cities.join(', ')],
    [t('higherSchools.compare.fieldsLabel'), (item: Institution) => item.fields.join(', ')],
    [t('higherSchools.compare.durationLabel'), () => t('higherSchools.detail.durationUnknown')],
    [t('higherSchools.compare.diplomaLabel'), (item: Institution) => item.degrees.join(' · ') || t('higherSchools.compare.notAvailable')],
    [t('higherSchools.compare.bacsLabel'), (item: Institution) => item.bacProfiles.join(' · ') || t('higherSchools.compare.notAvailable')],
    [t('higherSchools.directoryV2.campusesLabel'), (item: Institution) => String(item.campuses.length)],
  ] as const;
  return <div className="fixed inset-0 z-[120]" role="dialog" aria-modal="true"><button className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} aria-label={t('higherSchools.directoryV2.close')} /><div className="absolute inset-x-0 bottom-0 md:inset-0 md:m-auto md:max-w-5xl md:h-fit max-h-[88vh] bg-white rounded-t-[2rem] md:rounded-[2rem] overflow-auto shadow-2xl"><div className="sticky top-0 bg-white border-b border-slate-100 p-5 flex items-center justify-between z-10"><h2 className="font-black text-lg">{t('higherSchools.compare.title')}</h2><div className="flex gap-3"><button onClick={onClear} className="text-xs font-black text-red-500">{t('higherSchools.compare.clearAll')}</button><button onClick={onClose} className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center"><X size={17} /></button></div></div><div className="p-5 overflow-x-auto"><table className="w-full min-w-[700px] text-sm"><thead><tr><th className="p-3 text-start text-slate-400">—</th>{institutions.map((item) => <th key={item.id} className="p-3 text-start font-black text-slate-900">{item.acronym || item.name}</th>)}</tr></thead><tbody>{rows.map(([label, render]) => <tr key={label} className="border-t border-slate-100"><th className="p-3 text-start text-xs text-slate-500">{label}</th>{institutions.map((item) => <td key={item.id} className="p-3 text-slate-700 font-semibold align-top">{render(item)}</td>)}</tr>)}</tbody></table></div></div></div>;
};

export const HigherSchools: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => parseFilters(params), [params]);
  const [searchValue, setSearchValue] = useState(filters.query);
  const [mobileFilters, setMobileFilters] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const favorites = useFavorites();
  const compare = useCompareList();
  const sort = params.get('sort') || 'az';
  const requestedPage = Math.max(1, Number(params.get('page') || 1));

  useEffect(() => { setSearchValue(filters.query); }, [filters.query]);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (searchValue === filters.query) return;
      const next = new URLSearchParams(params);
      searchValue.trim() ? next.set('q', searchValue.trim()) : next.delete('q');
      next.delete('page');
      setParams(next, { replace: true });
    }, 250);
    return () => window.clearTimeout(timer);
  }, [searchValue, filters.query, params, setParams]);

  const updateList = (key: 'types' | 'cities' | 'fields' | 'degrees', value: string) => {
    const current = filters[key] as string[];
    const values = current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
    const nextFilters = { ...filters, [key]: values } as InstitutionFilters;
    const next = new URLSearchParams(params);
    const paramKey = key === 'types' ? 'type' : key === 'cities' ? 'city' : key === 'fields' ? 'field' : 'degree';
    nextFilters[key].length ? next.set(paramKey, nextFilters[key].map(toSlug).join(',')) : next.delete(paramKey);
    next.delete('page');
    setParams(next, { replace: true });
  };
  const clearFilters = () => { const next = new URLSearchParams(); if (filters.query) next.set('q', filters.query); if (sort !== 'az') next.set('sort', sort); setParams(next, { replace: true }); };

  const activeCount = filters.types.length + filters.cities.length + filters.fields.length + filters.degrees.length;
  const sorted = useMemo(() => {
    const result = filterInstitutions(INSTITUTIONS, filters);
    return [...result].sort((a, b) => {
      if (sort === 'za') return (b.acronym || b.name).localeCompare(a.acronym || a.name, 'fr');
      if (sort === 'city') return (a.cities[0] || '').localeCompare(b.cities[0] || '', 'fr');
      return (a.acronym || a.name).localeCompare(b.acronym || b.name, 'fr');
    });
  }, [filters, sort]);
  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const page = Math.min(requestedPage, pageCount);
  const visible = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const setPage = (value: number) => { const next = new URLSearchParams(params); value > 1 ? next.set('page', String(value)) : next.delete('page'); setParams(next); window.scrollTo({ top: 280, behavior: 'smooth' }); };

  const selectedInstitutions = useMemo(() => {
    const found = compare.ids.map((id) => INSTITUTIONS.find((institution) => institution.favoriteId === id || institution.campuses.some((campus) => campus.id === id))).filter(Boolean) as Institution[];
    return found.filter((institution, index) => found.findIndex((item) => item.id === institution.id) === index);
  }, [compare.ids]);

  return <div dir={i18n.dir()} lang={i18n.language.startsWith('ar') ? 'ar' : 'fr'} className="min-h-screen bg-[#F7F9FC] pb-16 text-start">
    <SEO title={t('higherSchools.directoryV2.title')} description={t('higherSchools.directoryV2.subtitle')} url="/higher-schools" />
    <section className="bg-gradient-to-b from-blue-50/70 to-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-9 md:py-12 text-center">
        <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] font-black text-primary mb-3"><GraduationCap size={15} />{t('higherSchools.hero.guide')}</span>
        <h1 className="text-3xl md:text-4xl font-black text-slate-950 tracking-tight">{t('higherSchools.directoryV2.title')}</h1>
        <p className="max-w-2xl mx-auto mt-3 text-slate-500 font-medium leading-relaxed">{t('higherSchools.directoryV2.subtitle')}</p>
        <div className="max-w-3xl mx-auto mt-7 relative"><Search size={20} className="absolute start-5 top-1/2 -translate-y-1/2 text-slate-400" /><input value={searchValue} onChange={(event) => setSearchValue(event.target.value)} type="search" placeholder={t('higherSchools.directoryV2.searchPlaceholder')} className="w-full h-14 ps-14 pe-12 rounded-2xl bg-white border border-slate-200 shadow-[0_10px_30px_rgba(15,23,42,0.06)] outline-none focus:border-primary focus:ring-4 focus:ring-blue-100 text-[15px] font-semibold" />{searchValue && <button onClick={() => setSearchValue('')} aria-label={t('higherSchools.hero.searchClear')} className="absolute end-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><X size={15} /></button>}</div>
      </div>
    </section>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex lg:hidden mb-4"><button onClick={() => setMobileFilters(true)} className="min-h-[44px] px-4 rounded-xl bg-white border border-slate-200 flex items-center gap-2 font-black text-sm"><SlidersHorizontal size={17} />{t('higherSchools.explorer.filters')}{activeCount > 0 && <span className="bg-primary text-white rounded-full px-2 py-0.5 text-xs">{activeCount}</span>}</button></div>
      <div className="grid lg:grid-cols-[250px_minmax(0,1fr)] gap-7 items-start">
        <aside className="hidden lg:block sticky top-[112px]"><FiltersPanel filters={filters} toggle={updateList} clear={clearFilters} activeCount={activeCount} /></aside>
        <main>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div><p className="font-black text-slate-900">{t(sorted.length === 1 ? 'higherSchools.directoryV2.resultCount' : 'higherSchools.directoryV2.resultCountMany', { count: sorted.length })}</p>{activeCount > 0 && <p className="text-xs text-slate-400 font-semibold mt-1">{t(activeCount === 1 ? 'higherSchools.directoryV2.activeFilters' : 'higherSchools.directoryV2.activeFiltersMany', { count: activeCount })}</p>}</div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500">{t('higherSchools.explorer.sortBy')}<select value={sort} onChange={(event) => { const next = new URLSearchParams(params); event.target.value === 'az' ? next.delete('sort') : next.set('sort', event.target.value); next.delete('page'); setParams(next); }} className="h-10 px-3 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-700 outline-none"><option value="az">{t('higherSchools.explorer.sortOptions.name')}</option><option value="za">{t('higherSchools.directoryV2.nameZa')}</option><option value="city">{t('higherSchools.explorer.sortOptions.city')}</option></select></label>
          </div>

          {visible.length > 0 ? <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">{visible.map((institution) => <InstitutionCard key={institution.id} institution={institution} filters={filters} favorite={favorites} compare={compare} />)}</div> : <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center"><Search size={28} className="mx-auto text-slate-300" /><h2 className="font-black text-slate-900 mt-4">{t('higherSchools.empty.title')}</h2><p className="text-sm text-slate-500 mt-2">{t('higherSchools.empty.description')}</p><button onClick={() => { setSearchValue(''); setParams(new URLSearchParams()); }} className="mt-5 px-5 min-h-[44px] rounded-xl bg-primary text-white font-black text-sm">{t('higherSchools.empty.resetButton')}</button></div>}

          {pageCount > 1 && <nav className="flex items-center justify-center gap-2 mt-8" aria-label={t('higherSchools.directoryV2.pagination')}><button onClick={() => setPage(page - 1)} disabled={page === 1} className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center disabled:opacity-40" aria-label={t('higherSchools.directoryV2.previous')}><ChevronLeft size={18} className="rtl:rotate-180" /></button>{Array.from({ length: pageCount }, (_, index) => index + 1).filter((number) => number === 1 || number === pageCount || Math.abs(number - page) <= 1).map((number, index, list) => <React.Fragment key={number}>{index > 0 && number - list[index - 1] > 1 && <span className="text-slate-400">…</span>}<button onClick={() => setPage(number)} aria-current={number === page ? 'page' : undefined} className={`w-10 h-10 rounded-xl text-sm font-black ${number === page ? 'bg-primary text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>{number}</button></React.Fragment>)}<button onClick={() => setPage(page + 1)} disabled={page === pageCount} className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center disabled:opacity-40" aria-label={t('higherSchools.directoryV2.next')}><ChevronRight size={18} className="rtl:rotate-180" /></button></nav>}
        </main>
      </div>

      <section className="mt-12 rounded-[1.5rem] bg-[#0B1739] px-6 py-7 md:px-9 flex flex-col md:flex-row md:items-center justify-between gap-5 text-white"><div><h2 className="text-xl font-black">{t('higherSchools.directoryV2.ctaTitle')}</h2><p className="text-sm text-blue-100/75 font-medium mt-1">{t('higherSchools.directoryV2.ctaText')}</p></div><Link to="/tawjih" className="shrink-0 min-h-[46px] px-5 rounded-xl bg-primary flex items-center justify-center gap-2 text-sm font-black"><Compass size={17} />{t('higherSchools.orientationCTA.primaryButton')}</Link></section>
    </div>

    {mobileFilters && <div className="fixed inset-0 z-[120] lg:hidden"><button className="absolute inset-0 bg-slate-950/50" onClick={() => setMobileFilters(false)} aria-label={t('higherSchools.directoryV2.close')} /><div className="absolute inset-y-0 start-0 w-[min(88vw,360px)] bg-[#F7F9FC] p-4 overflow-y-auto shadow-2xl"><div className="flex items-center justify-between mb-4"><h2 className="font-black text-lg">{t('higherSchools.explorer.mobileFilterTitle')}</h2><button onClick={() => setMobileFilters(false)} className="w-10 h-10 rounded-full bg-white flex items-center justify-center"><X size={18} /></button></div><FiltersPanel filters={filters} toggle={updateList} clear={clearFilters} activeCount={activeCount} /><button onClick={() => setMobileFilters(false)} className="sticky bottom-3 w-full h-12 mt-4 rounded-xl bg-primary text-white font-black">{t('higherSchools.explorer.showResults', { count: sorted.length })}</button></div></div>}

    {selectedInstitutions.length > 0 && <div className="fixed bottom-4 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 z-50 bg-slate-900 text-white rounded-2xl px-4 py-3 shadow-2xl flex items-center gap-4"><span className="text-sm font-black">{t('higherSchools.stickyBar.selectedPlural', { count: selectedInstitutions.length })} : {selectedInstitutions.length}</span><button onClick={() => setCompareOpen(true)} className="px-4 py-2 rounded-xl bg-primary text-xs font-black">{t('higherSchools.stickyBar.compare')}</button><button onClick={compare.clear} className="text-xs font-bold text-slate-300">{t('higherSchools.stickyBar.clear')}</button></div>}
    {compareOpen && <ComparisonModal institutions={selectedInstitutions} onClose={() => setCompareOpen(false)} onClear={() => { compare.clear(); setCompareOpen(false); }} />}
  </div>;
};
