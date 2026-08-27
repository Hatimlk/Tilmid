import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search, X, MapPin, GraduationCap, Compass, ChevronDown, Heart, Scale,
  SlidersHorizontal, ArrowLeft, Check, Building2, Briefcase,
  Code2, Stethoscope, Ruler, Atom, Sprout, Calculator, MessageCircle,
  Cog, Frown
} from 'lucide-react';
import SEO from '../components/SEO';
import {
  School, SCHOOLS, FIELDS, CITIES, ACCESS_LEVELS, ADMISSION_METHODS,
  SchoolFilters, EMPTY_FILTERS, filterSchools, getFieldCounts, getCityCounts,
  getSuggestions
} from '../constants/schools';
import { useFavorites, useCompareList } from '../hooks/useSchoolCollections';

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

const FIELD_ICONS: Record<string, any> = {
  'Ingénierie': Cog,
  'Informatique & Digital': Code2,
  'Médecine & Santé': Stethoscope,
  'Commerce & Management': Briefcase,
  'Architecture': Ruler,
  'Sciences': Atom,
  'Agriculture & Vétérinaire': Sprout,
  'Économie & Statistique': Calculator,
};

/* -------------------------------------------------------------------------- */
/* School logo / badge / chips                                               */
/* -------------------------------------------------------------------------- */

const SchoolLogo: React.FC<{ school: School; size?: 'sm' | 'md' | 'lg' }> = ({ school, size = 'md' }) => {
  const dims = size === 'lg' ? 'w-16 h-16 text-lg' : size === 'sm' ? 'w-10 h-10 text-xs' : 'w-12 h-12 text-sm';
  const initials = (school.acronym || school.name).split(/[\s-]+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase().slice(0, 3);
  return (
    <div className={`${dims} rounded-2xl bg-blue-50 text-primary flex items-center justify-center font-black shrink-0 ring-1 ring-blue-100`}>
      {initials || <GraduationCap size={20} />}
    </div>
  );
};

const TypeBadge: React.FC<{ type: School['type'] }> = ({ type }) => (
  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wide ${type === 'public' ? 'bg-emerald-50 text-emerald-700' : 'bg-purple-50 text-purple-700'}`}>
    {type === 'public' ? 'Public' : 'Privé'}
  </span>
);

/* -------------------------------------------------------------------------- */
/* School card                                                               */
/* -------------------------------------------------------------------------- */

const SchoolCard: React.FC<{
  school: School;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  isCompared: boolean;
  onToggleCompare: () => void;
  compareDisabled: boolean;
}> = ({ school, isFavorite, onToggleFavorite, isCompared, onToggleCompare, compareDisabled }) => {
  const extraFields = Math.max(0, school.fields.length - 2);
  return (
    <div className="group relative bg-white border border-slate-200 rounded-[22px] shadow-[0_10px_30px_rgba(15,23,42,0.05)] hover:shadow-[0_20px_42px_rgba(15,23,42,0.09)] hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <SchoolLogo school={school} />
          <div>
            <TypeBadge type={school.type} />
          </div>
        </div>
        <button
          onClick={onToggleFavorite}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors ${isFavorite ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-300 hover:text-red-400'}`}
        >
          <Heart size={17} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      <h3 className="text-[17px] font-black text-slate-900 mb-1.5 leading-snug line-clamp-2">{school.name}</h3>
      {school.acronym && <p className="text-xs font-bold text-primary mb-3">{school.acronym}</p>}

      <div className="flex items-center gap-1.5 text-slate-500 text-[13px] font-semibold mb-4">
        <MapPin size={14} className="text-slate-400" />
        {school.city}
      </div>

      <div className="flex flex-wrap gap-1.5 mb-5">
        {school.fields.slice(0, 2).map((f) => (
          <span key={f} className="px-2.5 py-1 rounded-full bg-slate-50 text-slate-600 text-[11px] font-bold">{f}</span>
        ))}
        {extraFields > 0 && (
          <span className="px-2.5 py-1 rounded-full bg-slate-50 text-slate-400 text-[11px] font-bold">+{extraFields} filière{extraFields > 1 ? 's' : ''}</span>
        )}
      </div>

      <div className="mt-auto pt-4 border-t border-slate-50 flex items-center gap-2">
        <Link
          to={`/higher-schools/${school.slug}`}
          className="flex-1 min-h-[44px] flex items-center justify-center gap-2 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all"
        >
          <span>Voir l'école</span>
          <ArrowLeft size={15} className="transform ltr:rotate-180" />
        </Link>
        <button
          onClick={onToggleCompare}
          disabled={!isCompared && compareDisabled}
          aria-pressed={isCompared}
          title={isCompared ? 'Retirer du comparateur' : 'Ajouter au comparateur'}
          className={`w-11 min-h-[44px] rounded-xl flex items-center justify-center border transition-all shrink-0 disabled:opacity-40 disabled:cursor-not-allowed ${isCompared ? 'bg-primary/10 border-primary text-primary' : 'bg-white border-slate-200 text-slate-400 hover:text-primary hover:border-primary/40'}`}
        >
          <Scale size={16} />
        </button>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Hero + search                                                             */
/* -------------------------------------------------------------------------- */

const POPULAR_CHIPS = ['Ingénierie', 'Médecine & Santé', 'Commerce & Management', 'Informatique & Digital', 'Architecture', 'Écoles publiques', 'Écoles privées'];

const SchoolsHero: React.FC<{
  query: string;
  onQueryChange: (q: string) => void;
  onSubmit: () => void;
  onQuickFilter: (chip: string) => void;
}> = ({ query, onQueryChange, onSubmit, onQuickFilter }) => {
  const [focused, setFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => getSuggestions(query), [query]);
  const flatSuggestions = useMemo(
    () => [
      ...suggestions.schools.map((s) => ({ type: 'school' as const, value: s.acronym || s.name, slug: s.slug })),
      ...suggestions.fields.map((f) => ({ type: 'field' as const, value: f })),
      ...suggestions.cities.map((c) => ({ type: 'city' as const, value: c })),
    ],
    [suggestions]
  );
  const showDropdown = focused && query.trim().length > 0 && flatSuggestions.length > 0;

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setFocused(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const selectSuggestion = (item: (typeof flatSuggestions)[number]) => {
    if (item.type === 'field' || item.type === 'city') {
      onQueryChange(item.value);
    } else {
      onQueryChange(item.value);
    }
    setFocused(false);
    onSubmit();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) {
      if (e.key === 'Enter') onSubmit();
      return;
    }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex((i) => Math.min(i + 1, flatSuggestions.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex((i) => Math.max(i - 1, -1)); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && flatSuggestions[activeIndex]) selectSuggestion(flatSuggestions[activeIndex]);
      else { setFocused(false); onSubmit(); }
    } else if (e.key === 'Escape') { setFocused(false); inputRef.current?.blur(); }
  };

  return (
    <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-24 overflow-hidden bg-gradient-to-b from-[#F6FAFF] to-white">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] start-[10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[130px]"></div>
        <div className="absolute top-[10%] end-[5%] w-[420px] h-[420px] bg-purple-500/[0.06] rounded-full blur-[120px]"></div>
        <div
          className="absolute inset-0 opacity-[0.4] [mask-image:radial-gradient(ellipse_55%_55%_at_50%_10%,black,transparent)]"
          style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        ></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
        <Reveal className="inline-flex items-center gap-2 mb-7 px-4 py-2 rounded-full bg-white border border-blue-100 shadow-sm text-[13px] font-bold text-slate-700">
          <Compass size={14} className="text-primary" />
          <span>Guide des écoles supérieures</span>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[60px] font-extrabold text-slate-900 mb-6 tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Trouvez l'école qui correspond <span className="text-primary">vraiment à votre projet</span>
          </h1>
        </Reveal>

        <Reveal delay={140}>
          <p className="text-[17px] md:text-lg text-slate-500 max-w-[650px] mx-auto leading-[1.65] font-medium mb-10">
            Découvrez les écoles supérieures au Maroc, explorez leurs filières, leurs conditions d'accès et leurs villes, puis comparez les options qui correspondent à votre profil et à vos ambitions.
          </p>
        </Reveal>

        <Reveal delay={200} className="max-w-2xl mx-auto relative z-30">
          <div ref={wrapperRef} className="relative">
            <div className="flex items-center gap-2 bg-white rounded-2xl border border-slate-200 shadow-[0_12px_32px_rgba(15,23,42,0.08)] p-2 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/15 transition-all">
              <Search size={20} className="text-slate-400 ms-3 shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => { onQueryChange(e.target.value); setActiveIndex(-1); }}
                onFocus={() => setFocused(true)}
                onKeyDown={handleKeyDown}
                placeholder="Rechercher une école, une filière ou une ville..."
                aria-label="Rechercher une école, une filière ou une ville"
                aria-expanded={showDropdown}
                role="combobox"
                aria-autocomplete="list"
                className="flex-1 min-w-0 h-11 outline-none text-slate-900 font-medium placeholder:text-slate-400 bg-transparent"
              />
              {query && (
                <button onClick={() => { onQueryChange(''); inputRef.current?.focus(); }} aria-label="Effacer la recherche" className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-50 shrink-0">
                  <X size={16} />
                </button>
              )}
              <button
                onClick={() => { setFocused(false); onSubmit(); }}
                className="h-11 px-6 bg-primary text-white rounded-xl font-bold text-sm hover:bg-[#0875E8] transition-all shrink-0 hidden sm:flex items-center"
              >
                Rechercher
              </button>
            </div>

            {showDropdown && (
              <div className="absolute top-full inset-x-0 mt-2 bg-white rounded-2xl border border-slate-100 shadow-[0_20px_50px_rgba(15,23,42,0.12)] p-3 text-start z-30 max-h-80 overflow-y-auto" role="listbox">
                {suggestions.schools.length > 0 && (
                  <div className="mb-2">
                    <p className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-400">Écoles</p>
                    {suggestions.schools.map((s) => {
                      const idx = flatSuggestions.findIndex((f) => f.type === 'school' && f.slug === s.slug);
                      return (
                        <button key={s.id} role="option" aria-selected={activeIndex === idx} onClick={() => selectSuggestion(flatSuggestions[idx])} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-start ${activeIndex === idx ? 'bg-blue-50' : 'hover:bg-slate-50'}`}>
                          <SchoolLogo school={s} size="sm" />
                          <span className="text-sm font-bold text-slate-700 truncate">{s.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
                {suggestions.fields.length > 0 && (
                  <div className="mb-2">
                    <p className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-400">Filières</p>
                    {suggestions.fields.map((f) => {
                      const idx = flatSuggestions.findIndex((x) => x.type === 'field' && x.value === f);
                      return (
                        <button key={f} role="option" aria-selected={activeIndex === idx} onClick={() => selectSuggestion(flatSuggestions[idx])} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-start ${activeIndex === idx ? 'bg-blue-50' : 'hover:bg-slate-50'}`}>
                          <span className="text-sm font-bold text-slate-700">{f}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
                {suggestions.cities.length > 0 && (
                  <div>
                    <p className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-400">Villes</p>
                    {suggestions.cities.map((c) => {
                      const idx = flatSuggestions.findIndex((x) => x.type === 'city' && x.value === c);
                      return (
                        <button key={c} role="option" aria-selected={activeIndex === idx} onClick={() => selectSuggestion(flatSuggestions[idx])} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-start ${activeIndex === idx ? 'bg-blue-50' : 'hover:bg-slate-50'}`}>
                          <MapPin size={14} className="text-slate-400" />
                          <span className="text-sm font-bold text-slate-700">{c}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => { setFocused(false); onSubmit(); }}
            className="sm:hidden w-full mt-3 h-12 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2"
          >
            <Search size={17} /> Rechercher
          </button>
        </Reveal>

        <Reveal delay={260} className="mt-8">
          <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wide mb-3">Recherches populaires</p>
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
            {POPULAR_CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => onQuickFilter(chip)}
                className="px-4 py-2 min-h-[40px] rounded-full bg-white border border-slate-200 text-[13px] font-bold text-slate-600 hover:border-primary/40 hover:text-primary transition-all"
              >
                {chip}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal delay={320} className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {[
            { icon: Building2, label: 'Écoles publiques & privées' },
            { icon: MapPin, label: 'Plusieurs villes du Maroc' },
            { icon: GraduationCap, label: "Filières et conditions d'accès" },
          ].map((item) => (
            <span key={item.label} className="flex items-center gap-2 text-[13px] font-bold text-slate-500">
              <item.icon size={16} className="text-primary" />
              {item.label}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* Featured schools                                                          */
/* -------------------------------------------------------------------------- */

const FeaturedSchools: React.FC<{
  favorites: ReturnType<typeof useFavorites>;
  compare: ReturnType<typeof useCompareList>;
}> = ({ favorites, compare }) => {
  const featured = SCHOOLS.slice(0, 6);
  return (
    <section>
      <SectionHeader eyebrow="À découvrir" title="Établissements à explorer" subtitle="Commencez votre recherche parmi les écoles et établissements disponibles dans notre base." className="mb-12" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {featured.map((s, i) => (
          <Reveal key={s.id} delay={(i % 3) * 90}>
            <SchoolCard
              school={s}
              isFavorite={favorites.has(s.id)}
              onToggleFavorite={() => favorites.toggle(s.id)}
              isCompared={compare.has(s.id)}
              onToggleCompare={() => compare.toggle(s.id)}
              compareDisabled={compare.isFull}
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* Filters                                                                    */
/* -------------------------------------------------------------------------- */

const FilterCheckboxGroup: React.FC<{
  title: string;
  options: readonly string[] | string[];
  selected: string[];
  onToggle: (value: string) => void;
  counts?: Map<string, number>;
  labels?: Record<string, string>;
}> = ({ title, options, selected, onToggle, counts, labels }) => (
  <div className="py-5 border-b border-slate-100 last:border-b-0">
    <p className="text-[12px] font-black uppercase tracking-wide text-slate-400 mb-3">{title}</p>
    <div className="space-y-2.5">
      {options.map((opt) => (
        <label key={opt} className="flex items-center justify-between gap-2 cursor-pointer group min-h-[28px]">
          <span className="flex items-center gap-2.5">
            <span className={`w-[18px] h-[18px] rounded-md border-2 flex items-center justify-center transition-colors ${selected.includes(opt) ? 'bg-primary border-primary' : 'border-slate-300 group-hover:border-primary/50'}`}>
              {selected.includes(opt) && <Check size={12} className="text-white" strokeWidth={3.5} />}
            </span>
            <input type="checkbox" className="sr-only" checked={selected.includes(opt)} onChange={() => onToggle(opt)} />
            <span className="text-[13.5px] font-semibold text-slate-700">{labels?.[opt] || opt}</span>
          </span>
          {counts && <span className="text-[11px] font-bold text-slate-400">{counts.get(opt) || 0}</span>}
        </label>
      ))}
    </div>
  </div>
);

const FilterPanelContent: React.FC<{ filters: SchoolFilters; setFilters: (f: SchoolFilters) => void }> = ({ filters, setFilters }) => {
  const fieldCounts = useMemo(getFieldCounts, []);
  const cityCounts = useMemo(getCityCounts, []);

  const toggleIn = (key: keyof SchoolFilters, value: string) => {
    const current = filters[key] as string[];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    setFilters({ ...filters, [key]: next });
  };

  return (
    <div>
      <FilterCheckboxGroup
        title="Type d'établissement"
        options={['public', 'private']}
        selected={filters.types}
        onToggle={(v) => toggleIn('types', v)}
        counts={new Map([['public', SCHOOLS.filter(s => s.type === 'public').length], ['private', SCHOOLS.filter(s => s.type === 'private').length]])}
        labels={{ public: 'Public', private: 'Privé' }}
      />
      <FilterCheckboxGroup title="Ville" options={CITIES} selected={filters.cities} onToggle={(v) => toggleIn('cities', v)} counts={cityCounts} />
      <FilterCheckboxGroup title="Domaine d'études" options={FIELDS as unknown as string[]} selected={filters.fields} onToggle={(v) => toggleIn('fields', v)} counts={fieldCounts} />
      <FilterCheckboxGroup title="Niveau d'accès" options={ACCESS_LEVELS as unknown as string[]} selected={filters.accessLevels} onToggle={(v) => toggleIn('accessLevels', v)} />
      <FilterCheckboxGroup title="Mode d'admission" options={ADMISSION_METHODS as unknown as string[]} selected={filters.admissionMethods} onToggle={(v) => toggleIn('admissionMethods', v)} />
    </div>
  );
};


/* -------------------------------------------------------------------------- */
/* Results                                                                    */
/* -------------------------------------------------------------------------- */

type SortOption = 'pertinence' | 'name' | 'city';

const PAGE_SIZE = 9;

const EmptyState: React.FC<{ onReset: () => void }> = ({ onReset }) => (
  <div className="text-center py-16 px-6">
    <div className="w-16 h-16 rounded-full bg-slate-50 text-slate-300 flex items-center justify-center mx-auto mb-5">
      <Frown size={28} />
    </div>
    <h3 className="text-xl font-black text-slate-900 mb-2">Aucun établissement trouvé</h3>
    <p className="text-slate-500 font-medium max-w-md mx-auto mb-7">Essayez de modifier vos filtres ou recherchez une autre filière, école ou ville.</p>
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
      <button onClick={onReset} className="px-6 py-3 min-h-[44px] bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all">Réinitialiser les filtres</button>
      <a href="https://wa.me/message/GN4XKUOMHNHGO1" target="_blank" rel="noopener noreferrer" className="px-6 py-3 min-h-[44px] bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all">Parler à un conseiller</a>
    </div>
  </div>
);

const SchoolsExplorer: React.FC<{
  filters: SchoolFilters;
  setFilters: (f: SchoolFilters) => void;
  favorites: ReturnType<typeof useFavorites>;
  compare: ReturnType<typeof useCompareList>;
}> = ({ filters, setFilters, favorites, compare }) => {
  const [sort, setSort] = useState<SortOption>('pertinence');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    const results = filterSchools(SCHOOLS, filters);
    const sorted = [...results];
    if (sort === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name, 'fr'));
    else if (sort === 'city') sorted.sort((a, b) => a.city.localeCompare(b.city, 'fr'));
    return sorted;
  }, [filters, sort]);

  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [filters, sort]);

  const activeFilterCount = filters.types.length + filters.cities.length + filters.fields.length + filters.accessLevels.length + filters.admissionMethods.length;
  const visible = filtered.slice(0, visibleCount);

  return (
    <section id="explorer">
      <SectionHeader eyebrow="Annuaire des écoles" title="Explorez les écoles supérieures au Maroc" subtitle="Utilisez les filtres pour trouver les établissements adaptés à votre projet académique." className="mb-10" />

      {/* Mobile filter trigger */}
      <div className="lg:hidden max-w-6xl mx-auto mb-6 px-4">
        <button onClick={() => setMobileFiltersOpen(true)} className="w-full min-h-[48px] flex items-center justify-center gap-2 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 shadow-sm">
          <SlidersHorizontal size={18} />
          <span>Filtres{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}</span>
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 px-4 lg:px-0">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-[110px] bg-white rounded-[22px] border border-slate-100 shadow-sm p-6 max-h-[calc(100vh-140px)] overflow-y-auto">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-black text-slate-900">Filtres</h3>
              {activeFilterCount > 0 && (
                <button onClick={() => setFilters(EMPTY_FILTERS)} className="text-xs font-bold text-primary hover:underline">Réinitialiser</button>
              )}
            </div>
            <FilterPanelContent filters={filters} setFilters={setFilters} />
          </div>
        </aside>

        {/* Results */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <p className="text-sm font-bold text-slate-500">{filtered.length} école{filtered.length !== 1 ? 's' : ''} trouvée{filtered.length !== 1 ? 's' : ''}</p>
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-xs font-bold text-slate-400">Trier par</label>
              <select id="sort" value={sort} onChange={(e) => setSort(e.target.value as SortOption)} className="h-10 px-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 bg-white outline-none focus:border-primary/50">
                <option value="pertinence">Pertinence</option>
                <option value="name">Nom A–Z</option>
                <option value="city">Ville</option>
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <EmptyState onReset={() => setFilters(EMPTY_FILTERS)} />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {visible.map((s) => (
                  <SchoolCard
                    key={s.id}
                    school={s}
                    isFavorite={favorites.has(s.id)}
                    onToggleFavorite={() => favorites.toggle(s.id)}
                    isCompared={compare.has(s.id)}
                    onToggleCompare={() => compare.toggle(s.id)}
                    compareDisabled={compare.isFull}
                  />
                ))}
              </div>
              {visibleCount < filtered.length && (
                <div className="text-center mt-10">
                  <button onClick={() => setVisibleCount((v) => v + PAGE_SIZE)} className="px-7 py-3.5 min-h-[48px] bg-white border-2 border-slate-200 text-slate-700 rounded-2xl font-bold hover:border-primary/40 hover:text-primary transition-all">
                    Afficher plus d'écoles
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile filter sheet */}
      {mobileFiltersOpen && (
        <div className="lg:hidden fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute bottom-0 inset-x-0 bg-white rounded-t-[2rem] max-h-[85vh] flex flex-col shadow-[0_-20px_50px_rgba(0,0,0,0.2)]">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
              <h3 className="text-lg font-black text-slate-900">Filtrer les écoles</h3>
              <button onClick={() => setMobileFiltersOpen(false)} aria-label="Fermer" className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center"><X size={18} /></button>
            </div>
            <div className="overflow-y-auto px-6 flex-1">
              <FilterPanelContent filters={filters} setFilters={setFilters} />
            </div>
            <div className="p-6 border-t border-slate-100 flex items-center gap-3 shrink-0">
              <button onClick={() => setFilters(EMPTY_FILTERS)} className="flex-1 min-h-[48px] bg-white border border-slate-200 rounded-2xl font-bold text-slate-700">Réinitialiser</button>
              <button onClick={() => setMobileFiltersOpen(false)} className="flex-1 min-h-[48px] bg-primary text-white rounded-2xl font-bold">Afficher {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* Explore by field / city                                                   */
/* -------------------------------------------------------------------------- */

const StudyFieldsExplorer: React.FC<{ onSelectField: (field: string) => void }> = ({ onSelectField }) => {
  const counts = useMemo(getFieldCounts, []);
  return (
    <section>
      <SectionHeader eyebrow="Par domaine" title="Explorez selon votre domaine d'études" className="mb-12" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
        {FIELDS.map((field, i) => {
          const Icon = FIELD_ICONS[field] || GraduationCap;
          const count = counts.get(field) || 0;
          return (
            <Reveal key={field} delay={(i % 4) * 70}>
              <button onClick={() => onSelectField(field)} className="group w-full text-start bg-white rounded-[1.5rem] border border-slate-100 p-5 shadow-sm hover:shadow-[0_16px_36px_rgba(15,23,42,0.08)] hover:-translate-y-1 transition-all duration-300 h-full">
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  <Icon size={20} strokeWidth={2.2} />
                </div>
                <h3 className="text-[14px] font-black text-slate-900 mb-3 leading-tight">{field}</h3>
                <span className="flex items-center gap-1 text-[12px] font-bold text-primary">
                  {count} établissement{count !== 1 ? 's' : ''}
                  <ArrowLeft size={13} className="transform ltr:rotate-180 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </button>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
};

const CitiesExplorer: React.FC<{ onSelectCity: (city: string) => void }> = ({ onSelectCity }) => {
  const counts = useMemo(getCityCounts, []);
  return (
    <section>
      <SectionHeader eyebrow="Par ville" title="Où souhaitez-vous étudier ?" subtitle="Explorez les établissements disponibles dans les principales villes étudiantes du Maroc." className="mb-12" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
        {CITIES.map((city, i) => {
          const count = counts.get(city) || 0;
          return (
            <Reveal key={city} delay={(i % 4) * 70}>
              <button onClick={() => onSelectCity(city)} className="group w-full text-start relative overflow-hidden bg-gradient-to-br from-slate-900 to-[#101D48] rounded-[1.5rem] p-5 h-32 flex flex-col justify-between shadow-sm hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(15,23,42,0.2)] transition-all duration-300">
                <div className="absolute -end-6 -bottom-6 w-24 h-24 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-colors"></div>
                <Building2 size={20} className="text-blue-300 relative z-10" />
                <div className="relative z-10">
                  <h3 className="text-white font-black text-[15px] mb-0.5">{city}</h3>
                  <span className="text-blue-200 text-[11px] font-bold">{count} établissement{count !== 1 ? 's' : ''}</span>
                </div>
              </button>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* Public vs private                                                         */
/* -------------------------------------------------------------------------- */

const PublicPrivateGuide: React.FC<{ onSelectType: (type: 'public' | 'private') => void }> = ({ onSelectType }) => (
  <section>
    <SectionHeader eyebrow="Comprendre vos options" title="École publique ou privée ?" className="mb-12" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      <Reveal>
        <div className="bg-white rounded-[1.75rem] border border-slate-100 p-8 h-full shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          <span className="inline-flex px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-black uppercase tracking-wide mb-4">Public</span>
          <h3 className="text-xl font-black text-slate-900 mb-3">Établissements publics</h3>
          <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">Les établissements publics proposent différents parcours accessibles selon les conditions définies par chaque établissement : sélection, concours, dossier ou accès spécifique.</p>
          <button onClick={() => onSelectType('public')} className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:gap-3 transition-all">
            Explorer les écoles publiques <ArrowLeft size={15} className="transform ltr:rotate-180" />
          </button>
        </div>
      </Reveal>
      <Reveal delay={100}>
        <div className="bg-white rounded-[1.75rem] border border-slate-100 p-8 h-full shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          <span className="inline-flex px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-[11px] font-black uppercase tracking-wide mb-4">Privé</span>
          <h3 className="text-xl font-black text-slate-900 mb-3">Établissements privés</h3>
          <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">Les établissements privés proposent des programmes et conditions d'admission propres à chaque institution. Vérifiez toujours l'accréditation, le programme et les modalités d'accès avant de choisir.</p>
          <button onClick={() => onSelectType('private')} className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:gap-3 transition-all">
            Explorer les écoles privées <ArrowLeft size={15} className="transform ltr:rotate-180" />
          </button>
        </div>
      </Reveal>
    </div>
  </section>
);

/* -------------------------------------------------------------------------- */
/* Comparison CTA + modal                                                    */
/* -------------------------------------------------------------------------- */

const ComparisonModal: React.FC<{ schoolIds: string[]; onClose: () => void; onClear: () => void; onRemove: (id: string) => void }> = ({ schoolIds, onClose, onClear, onRemove }) => {
  const schools = schoolIds.map((id) => SCHOOLS.find((s) => s.id === id)).filter(Boolean) as School[];
  const rows: { label: string; render: (s: School) => React.ReactNode }[] = [
    { label: 'Type', render: (s) => <TypeBadge type={s.type} /> },
    { label: 'Ville', render: (s) => s.city },
    { label: 'Filières', render: (s) => s.fields.join(', ') },
    { label: "Niveau d'accès", render: (s) => s.accessLevels.join(', ') },
    { label: "Mode d'admission", render: (s) => s.admissionMethods.join(', ') },
    { label: 'Frais de scolarité', render: () => <span className="text-slate-400 italic">Information non disponible</span> },
  ];

  return (
    <div className="fixed inset-0 z-[110]" role="dialog" aria-modal="true" aria-label="Comparateur d'écoles">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 md:inset-0 md:m-auto md:max-w-4xl md:h-fit md:max-h-[85vh] bg-white rounded-t-[2rem] md:rounded-[2rem] max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
          <h3 className="text-lg font-black text-slate-900">Comparer les écoles</h3>
          <button onClick={onClose} aria-label="Fermer le comparateur" className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center"><X size={18} /></button>
        </div>
        <div className="overflow-auto flex-1 p-6">
          {schools.length === 0 ? (
            <p className="text-slate-500 font-medium text-center py-10">Ajoutez des écoles au comparateur pour les visualiser ici.</p>
          ) : (
            <table className="w-full text-start border-collapse min-w-[500px]">
              <thead>
                <tr>
                  <th className="text-start p-3 text-[12px] font-black text-slate-400 uppercase w-32"></th>
                  {schools.map((s) => (
                    <th key={s.id} className="p-3 text-start align-top">
                      <div className="flex items-start gap-2">
                        <SchoolLogo school={s} size="sm" />
                        <div>
                          <p className="text-[13px] font-black text-slate-900 leading-tight">{s.acronym || s.name}</p>
                          <button onClick={() => onRemove(s.id)} className="text-[11px] font-bold text-slate-400 hover:text-red-500 mt-1">Retirer</button>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={row.label} className={i % 2 === 0 ? 'bg-slate-50/50' : ''}>
                    <td className="p-3 text-[12.5px] font-bold text-slate-500 align-top">{row.label}</td>
                    {schools.map((s) => (
                      <td key={s.id} className="p-3 text-[13px] font-semibold text-slate-700 align-top">{row.render(s)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {schools.length > 0 && (
          <div className="p-6 border-t border-slate-100 shrink-0">
            <button onClick={onClear} className="text-sm font-bold text-slate-400 hover:text-red-500">Effacer la comparaison</button>
          </div>
        )}
      </div>
    </div>
  );
};

const ComparisonCTA: React.FC<{ onOpen: () => void }> = ({ onOpen }) => (
  <section>
    <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#F4F8FF] to-white border border-blue-100 rounded-[2rem] p-8 md:p-12 text-center">
      <Eyebrow>Comparez avant de choisir</Eyebrow>
      <h2 className="text-2xl md:text-4xl font-black text-slate-900 mt-4 mb-4 tracking-tight">Comparez vos écoles préférées côte à côte</h2>
      <p className="text-slate-500 font-medium max-w-lg mx-auto mb-8">Sélectionnez plusieurs établissements et comparez leurs filières, villes, conditions d'accès et autres informations disponibles.</p>

      <div className="flex items-center justify-center gap-3 mb-8 flex-wrap">
        {['École A', 'École B', 'École C'].map((label, i) => (
          <React.Fragment key={label}>
            <div className="w-24 h-16 rounded-2xl bg-white border-2 border-dashed border-slate-200 flex items-center justify-center text-[11px] font-bold text-slate-400">{label}</div>
            {i < 2 && <span className="text-slate-300 font-black text-xs">VS</span>}
          </React.Fragment>
        ))}
      </div>

      <button onClick={onOpen} className="inline-flex items-center gap-2 px-7 py-3.5 min-h-[48px] bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all hover:-translate-y-0.5">
        <Scale size={17} />
        <span>Comparer des écoles</span>
      </button>
    </div>
  </section>
);

const StickyCompareBar: React.FC<{ count: number; onOpen: () => void; onClear: () => void }> = ({ count, onOpen, onClear }) => (
  <div className={`fixed bottom-0 inset-x-0 z-40 transition-transform duration-300 ${count >= 2 ? 'translate-y-0' : 'translate-y-full'}`}>
    <div className="max-w-2xl mx-auto m-4 bg-slate-900 text-white rounded-2xl shadow-2xl p-4 flex items-center justify-between gap-4">
      <span className="font-bold text-sm">{count} écoles sélectionnées</span>
      <div className="flex items-center gap-2">
        <button onClick={onClear} className="px-4 py-2.5 min-h-[44px] rounded-xl text-sm font-bold text-slate-300 hover:bg-white/10 transition-colors">Effacer</button>
        <button onClick={onOpen} className="px-5 py-2.5 min-h-[44px] rounded-xl text-sm font-bold bg-primary text-white hover:bg-[#0875E8] transition-colors">Comparer</button>
      </div>
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/* Orientation CTA                                                           */
/* -------------------------------------------------------------------------- */

const OrientationCTA: React.FC = () => (
  <Reveal>
    <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-50 to-[#F4F8FF] border border-blue-100 rounded-[2rem] p-8 md:p-12 text-center">
      <div className="w-14 h-14 rounded-2xl bg-white text-primary flex items-center justify-center mx-auto mb-6 shadow-sm">
        <Compass size={26} />
      </div>
      <Eyebrow>Vous ne savez pas par où commencer ?</Eyebrow>
      <h2 className="text-2xl md:text-4xl font-black text-slate-900 mt-4 mb-4 tracking-tight">Vous hésitez encore entre plusieurs parcours ?</h2>
      <p className="text-slate-500 font-medium max-w-lg mx-auto mb-8">Découvrez les filières qui correspondent à votre profil avant de choisir vos établissements.</p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link to="/tawjih" className="w-full sm:w-auto min-h-[48px] px-7 flex items-center justify-center gap-2 bg-primary text-white rounded-2xl font-bold hover:bg-[#0875E8] transition-all hover:-translate-y-0.5">
          <span>Commencer mon orientation</span>
          <ArrowLeft size={16} className="transform ltr:rotate-180" />
        </Link>
        <a href="https://wa.me/message/GN4XKUOMHNHGO1" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto min-h-[48px] px-7 flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-all">
          <MessageCircle size={16} />
          <span>Parler à un conseiller</span>
        </a>
      </div>
    </div>
  </Reveal>
);

/* -------------------------------------------------------------------------- */
/* FAQ                                                                       */
/* -------------------------------------------------------------------------- */

const FAQ_ITEMS = [
  { q: 'Comment trouver une école adaptée à mon profil ?', a: "Utilisez les filtres par domaine, ville, type d'établissement et niveau d'accès. Vous pouvez également utiliser le programme d'orientation Tilmid pour mieux identifier les parcours adaptés à votre projet." },
  { q: 'Quelle est la différence entre une école publique et une école privée ?', a: 'Chaque établissement possède ses propres conditions d\'accès, programmes et modalités. Consultez toujours la fiche détaillée de l\'école avant de prendre une décision.' },
  { q: "Comment connaître les conditions d'accès à une école ?", a: 'Les conditions disponibles sont indiquées sur la fiche de chaque établissement lorsqu\'elles ont été renseignées et vérifiées.' },
  { q: 'Puis-je comparer plusieurs écoles ?', a: 'Oui. Ajoutez les établissements qui vous intéressent au comparateur pour visualiser leurs principales différences côte à côte.' },
  { q: 'Puis-je enregistrer mes écoles préférées ?', a: "Oui, utilisez l'icône Favoris pour conserver les établissements que vous souhaitez consulter plus tard sur cet appareil." },
  { q: 'Les informations sur les écoles sont-elles mises à jour ?', a: "Nous nous appuyons sur des informations publiques générales. Les conditions d'accès et modalités peuvent évoluer : vérifiez toujours les détails directement auprès de l'établissement avant de vous engager." },
];

const SchoolsFAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <section className="max-w-3xl mx-auto">
      <SectionHeader eyebrow="Questions fréquentes" title="Tout savoir sur les écoles supérieures au Maroc" className="mb-12" />
      <div className="space-y-4">
        {FAQ_ITEMS.map((item, i) => {
          const isOpen = openIndex === i;
          const panelId = `schools-faq-panel-${i}`;
          const buttonId = `schools-faq-button-${i}`;
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

const FinalCTA: React.FC = () => (
  <Reveal>
    <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-[#08142F] via-[#101D48] to-[#0B1330] border border-white/5 shadow-2xl p-10 md:p-16 text-center max-w-5xl mx-auto">
      <div className="absolute top-0 start-1/2 -translate-x-1/2 w-96 h-96 bg-primary/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="relative z-10 max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.16em] bg-primary/10 text-blue-300 ring-1 ring-primary/20 mb-6">
          <GraduationCap size={12} />
          Préparez votre avenir
        </span>
        <h2 className="text-3xl md:text-5xl font-black text-white mb-5 tracking-tight leading-tight">
          Une école n'est pas seulement un nom.<br />Choisissez un parcours qui vous correspond.
        </h2>
        <p className="text-slate-300 text-base md:text-lg font-medium leading-relaxed mb-10 max-w-xl mx-auto">
          Explorez vos options, comparez les établissements et avancez vers votre orientation avec plus de clarté.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={() => document.getElementById('explorer')?.scrollIntoView({ behavior: 'smooth' })} className="w-full sm:w-auto min-h-[52px] px-9 bg-primary text-white rounded-2xl font-black text-base md:text-lg shadow-xl shadow-primary/20 hover:bg-[#0875E8] hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3">
            <span>Explorer les écoles</span>
            <ArrowLeft size={20} className="transform ltr:rotate-180" />
          </button>
          <Link to="/tawjih" className="w-full sm:w-auto min-h-[52px] px-9 bg-white/5 text-white border border-white/15 rounded-2xl font-black text-base md:text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-3">
            <Compass size={19} />
            <span>Commencer mon orientation</span>
          </Link>
        </div>
      </div>
    </div>
  </Reveal>
);

/* -------------------------------------------------------------------------- */
/* URL <-> filters                                                           */
/* -------------------------------------------------------------------------- */

const toSlug = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const buildSlugMap = (values: readonly string[]) => {
  const map = new Map<string, string>();
  values.forEach((v) => map.set(toSlug(v), v));
  return map;
};

const CITY_SLUGS = buildSlugMap(CITIES);
const FIELD_SLUGS = buildSlugMap(FIELDS);
const ACCESS_SLUGS = buildSlugMap(ACCESS_LEVELS);
const ADMISSION_SLUGS = buildSlugMap(ADMISSION_METHODS);

const filtersFromParams = (params: URLSearchParams): SchoolFilters => ({
  types: (params.get('type')?.split(',').filter((t) => t === 'public' || t === 'private') as ('public' | 'private')[]) || [],
  cities: params.get('city')?.split(',').map((s) => CITY_SLUGS.get(s)).filter(Boolean) as string[] || [],
  fields: params.get('field')?.split(',').map((s) => FIELD_SLUGS.get(s)).filter(Boolean) as string[] || [],
  accessLevels: params.get('access')?.split(',').map((s) => ACCESS_SLUGS.get(s)).filter(Boolean) as string[] || [],
  admissionMethods: params.get('admission')?.split(',').map((s) => ADMISSION_SLUGS.get(s)).filter(Boolean) as string[] || [],
  query: params.get('q') || '',
});

const paramsFromFilters = (filters: SchoolFilters): URLSearchParams => {
  const params = new URLSearchParams();
  if (filters.types.length) params.set('type', filters.types.join(','));
  if (filters.cities.length) params.set('city', filters.cities.map(toSlug).join(','));
  if (filters.fields.length) params.set('field', filters.fields.map(toSlug).join(','));
  if (filters.accessLevels.length) params.set('access', filters.accessLevels.map(toSlug).join(','));
  if (filters.admissionMethods.length) params.set('admission', filters.admissionMethods.map(toSlug).join(','));
  if (filters.query) params.set('q', filters.query);
  return params;
};

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export const HigherSchools: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFiltersState] = useState<SchoolFilters>(() => filtersFromParams(searchParams));
  const [heroQuery, setHeroQuery] = useState(filters.query);
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  const favorites = useFavorites();
  const compare = useCompareList();

  const setFilters = (next: SchoolFilters) => {
    setFiltersState(next);
    setSearchParams(paramsFromFilters(next), { replace: true });
  };

  const runHeroSearch = () => setFilters({ ...EMPTY_FILTERS, query: heroQuery });

  const applyQuickFilter = (chip: string) => {
    if (chip === 'Écoles publiques') setFilters({ ...EMPTY_FILTERS, types: ['public'] });
    else if (chip === 'Écoles privées') setFilters({ ...EMPTY_FILTERS, types: ['private'] });
    else setFilters({ ...EMPTY_FILTERS, fields: [chip] });
    document.getElementById('explorer')?.scrollIntoView({ behavior: 'smooth' });
  };

  const selectField = (field: string) => { setFilters({ ...EMPTY_FILTERS, fields: [field] }); document.getElementById('explorer')?.scrollIntoView({ behavior: 'smooth' }); };
  const selectCity = (city: string) => { setFilters({ ...EMPTY_FILTERS, cities: [city] }); document.getElementById('explorer')?.scrollIntoView({ behavior: 'smooth' }); };
  const selectType = (type: 'public' | 'private') => { setFilters({ ...EMPTY_FILTERS, types: [type] }); document.getElementById('explorer')?.scrollIntoView({ behavior: 'smooth' }); };

  return (
    <div dir="ltr" className="min-h-screen bg-slate-50 pb-4 overflow-x-hidden font-sans w-full max-w-full text-start">
      <SEO
        title="Écoles Supérieures au Maroc"
        description="Découvrez les écoles supérieures au Maroc, explorez leurs filières, villes et conditions d'accès et comparez les établissements qui correspondent à votre projet."
      />

      <SchoolsHero query={heroQuery} onQueryChange={setHeroQuery} onSubmit={runHeroSearch} onQuickFilter={applyQuickFilter} />

      <div className="container mx-auto px-4 lg:px-8 mt-16 lg:mt-24 relative z-20 space-y-24 lg:space-y-28">
        <FeaturedSchools favorites={favorites} compare={compare} />
        <SchoolsExplorer filters={filters} setFilters={setFilters} favorites={favorites} compare={compare} />
        <StudyFieldsExplorer onSelectField={selectField} />
        <CitiesExplorer onSelectCity={selectCity} />
        <PublicPrivateGuide onSelectType={selectType} />
        <ComparisonCTA onOpen={() => setCompareModalOpen(true)} />
        <OrientationCTA />
        <SchoolsFAQ />
        <FinalCTA />
      </div>

      <StickyCompareBar count={compare.ids.length} onOpen={() => setCompareModalOpen(true)} onClear={compare.clear} />
      {compareModalOpen && (
        <ComparisonModal schoolIds={compare.ids} onClose={() => setCompareModalOpen(false)} onClear={compare.clear} onRemove={compare.toggle} />
      )}
    </div>
  );
};
