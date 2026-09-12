import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, GraduationCap, MapPin, Compass, CornerDownLeft, X } from 'lucide-react';
import { SCHOOLS, FIELDS, CITIES, toSlug } from '../constants/schools';

interface SearchResult {
  id: string;
  icon: React.ElementType;
  label: string;
  meta: string;
  onSelect: () => void;
}

/** Static index of real, existing destinations — no invented pages or content. */
const usePageIndex = (t: (key: string) => string) => useMemo(() => ([
  { keywords: ['orientation', 'tawjih', 'filiere', 'filière'], label: t('nav.tawjih'), meta: t('search.metaPage'), to: '/tawjih' },
  { keywords: ['accompagnement', 'coaching', 'mouwakaba'], label: t('nav.coaching'), meta: t('search.metaPage'), to: '/coaching-offer' },
  { keywords: ['ecoles', 'écoles', 'schools', 'ecole', 'école'], label: t('nav.higherSchools'), meta: t('search.metaPage'), to: '/higher-schools' },
  { keywords: ['bac', 'moyenne', 'simulateur', 'calcul'], label: t('footer.bacSimulator'), meta: t('search.metaTool'), to: '/bac-simulator' },
  { keywords: ['contact'], label: t('footer.contactUs'), meta: t('search.metaPage'), to: '/contact' },
  { keywords: ['apropos', 'about', 'qui sommes'], label: t('footer.aboutUs'), meta: t('search.metaPage'), to: '/about' },
]), [t]);

const normalize = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export const GlobalSearch: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const pageIndex = usePageIndex(t);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  const results: SearchResult[] = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return [];
    const out: SearchResult[] = [];

    SCHOOLS
      .filter((s) => normalize(s.name).includes(q) || (s.acronym && normalize(s.acronym).includes(q)) || normalize(s.city).includes(q))
      .slice(0, 5)
      .forEach((s) => out.push({
        id: `school-${s.id}`,
        icon: GraduationCap,
        label: s.acronym ? `${s.acronym} — ${s.name}` : s.name,
        meta: `${t('search.metaSchool')} · ${s.city}`,
        onSelect: () => { navigate(`/higher-schools/${s.slug}`); onClose(); },
      }));

    FIELDS
      .filter((f) => normalize(f).includes(q))
      .slice(0, 3)
      .forEach((f) => out.push({
        id: `field-${f}`,
        icon: Compass,
        label: f,
        meta: t('search.metaField'),
        onSelect: () => { navigate(`/higher-schools?field=${toSlug(f)}`); onClose(); },
      }));

    CITIES
      .filter((c) => normalize(c).includes(q))
      .slice(0, 3)
      .forEach((c) => out.push({
        id: `city-${c}`,
        icon: MapPin,
        label: c,
        meta: t('search.metaCity'),
        onSelect: () => { navigate(`/higher-schools?city=${toSlug(c)}`); onClose(); },
      }));

    pageIndex
      .filter((p) => p.keywords.some((k) => normalize(k).includes(q)) || normalize(p.label).includes(q))
      .slice(0, 4)
      .forEach((p) => out.push({
        id: `page-${p.to}`,
        icon: Search,
        label: p.label,
        meta: p.meta,
        onSelect: () => { navigate(p.to); onClose(); },
      }));

    return out;
  }, [query, navigate, onClose, pageIndex, t]);

  useEffect(() => { setActiveIndex(0); }, [results.length]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex((i) => Math.min(i + 1, results.length - 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex((i) => Math.max(i - 1, 0)); }
      if (e.key === 'Enter' && results[activeIndex]) { results[activeIndex].onSelect(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose, results, activeIndex]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center pt-[10vh] sm:pt-[14vh] px-4" role="dialog" aria-modal="true" aria-label={t('search.ariaLabel')}>
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-white rounded-ds-xl shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-5 h-14 border-b border-slate-100">
          <Search size={18} className="text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('search.placeholder')}
            className="flex-1 h-full outline-none font-medium text-[15px] text-slate-800 placeholder:text-slate-400 bg-transparent"
          />
          <button onClick={onClose} className="sm:hidden p-1.5 -me-1 text-slate-400 hover:text-slate-600" aria-label={t('search.close')}>
            <X size={18} />
          </button>
          <kbd className="hidden sm:inline text-[11px] font-bold text-slate-400 bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5">Échap</kbd>
        </div>

        <div className="max-h-[55vh] overflow-y-auto p-2">
          {query.trim() && results.length === 0 && (
            <p className="text-center py-10 text-[13px] font-bold text-slate-400">{t('search.noResults', { query })}</p>
          )}
          {!query.trim() && (
            <p className="text-center py-10 text-[13px] font-bold text-slate-400">{t('search.hint')}</p>
          )}
          {results.map((r, i) => (
            <button
              key={r.id}
              onClick={r.onSelect}
              onMouseEnter={() => setActiveIndex(i)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 min-h-[44px] rounded-xl text-start group ${i === activeIndex ? 'bg-slate-50' : ''}`}
            >
              <span className={`w-9 h-9 rounded-ds-sm bg-slate-50 text-slate-500 flex items-center justify-center shrink-0 ${i === activeIndex ? 'bg-blue-50 text-primary' : ''}`}>
                <r.icon size={16} />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block font-bold text-[13.5px] text-slate-800 truncate">{r.label}</span>
                <span className="block text-[12px] font-medium text-slate-400 truncate">{r.meta}</span>
              </span>
              <CornerDownLeft size={14} className={`text-slate-300 shrink-0 ${i === activeIndex ? 'opacity-100' : 'opacity-0'}`} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
