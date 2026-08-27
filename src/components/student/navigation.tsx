import React, { useState } from 'react';
import {
  LayoutGrid, Compass, Target, CalendarDays, TrendingUp, PlayCircle, Library,
  Wrench, Users, CheckSquare, MessageSquare, LifeBuoy, Lock, X, Menu
} from 'lucide-react';
import { Entitlements } from '../../utils/entitlements';

export type StudentTab =
  | 'dashboard' | 'parcours' | 'plan' | 'planning' | 'progression'
  | 'contenus' | 'bibliotheque' | 'outils'
  | 'coaching' | 'checkins' | 'feedback'
  | 'support' | 'profil';

interface NavItem {
  id: StudentTab;
  label: string;
  icon: React.ElementType;
  locked?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const getNavSections = (entitlements: Entitlements): NavSection[] => [
  { title: '', items: [{ id: 'dashboard', label: 'Vue d’ensemble', icon: LayoutGrid }] },
  {
    title: 'Mon parcours',
    items: [
      { id: 'parcours', label: 'Mon parcours', icon: Compass },
      { id: 'plan', label: 'Mon plan', icon: Target },
      { id: 'planning', label: 'Planning', icon: CalendarDays },
      { id: 'progression', label: 'Progression', icon: TrendingUp },
    ],
  },
  {
    title: 'Apprendre',
    items: [
      { id: 'contenus', label: 'Mes contenus', icon: PlayCircle },
      { id: 'bibliotheque', label: 'Bibliothèque', icon: Library },
      { id: 'outils', label: 'Mes outils', icon: Wrench },
    ],
  },
  {
    title: 'Mouwakaba',
    items: [
      { id: 'coaching', label: 'Mes séances', icon: Users, locked: entitlements.coachingSessions === 0 },
      { id: 'checkins', label: 'Check-ins', icon: CheckSquare, locked: !entitlements.checkInCount && !entitlements.checkInFrequencyDays },
      { id: 'feedback', label: 'Feedback', icon: MessageSquare, locked: !entitlements.personalFeedback },
    ],
  },
  { title: 'Aide', items: [{ id: 'support', label: 'Support', icon: LifeBuoy }] },
];

/* -------------------------------------------------------------------------- */
/* Desktop sidebar                                                           */
/* -------------------------------------------------------------------------- */

export const StudentSidebar: React.FC<{ active: StudentTab; onSelect: (tab: StudentTab) => void; entitlements: Entitlements }> = ({ active, onSelect, entitlements }) => {
  const sections = getNavSections(entitlements);
  return (
    <nav aria-label="Navigation espace étudiant" className="hidden lg:block w-[248px] shrink-0 bg-white border-e border-slate-100 min-h-[calc(100vh-64px)] py-6 px-3">
      {sections.map((section, si) => (
        <div key={si} className={si > 0 ? 'mt-6' : ''}>
          {section.title && <p className="px-3 mb-2 text-[10.5px] font-black uppercase tracking-widest text-slate-400">{section.title}</p>}
          <div className="space-y-0.5">
            {section.items.map((item) => {
              const isActive = active === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelect(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 min-h-[44px] rounded-xl text-[13.5px] font-bold transition-colors ${isActive ? 'bg-blue-50 text-primary' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  <item.icon size={17} className={isActive ? 'text-primary' : 'text-slate-400'} />
                  <span className="flex-1 text-start">{item.label}</span>
                  {item.locked && <Lock size={13} className="text-slate-300" />}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
};

/* -------------------------------------------------------------------------- */
/* Mobile bottom nav + "Plus" drawer                                         */
/* -------------------------------------------------------------------------- */

const PRIMARY_MOBILE: NavItem[] = [
  { id: 'dashboard', label: 'Accueil', icon: LayoutGrid },
  { id: 'plan', label: 'Plan', icon: Target },
  { id: 'planning', label: 'Planning', icon: CalendarDays },
  { id: 'contenus', label: 'Contenus', icon: PlayCircle },
];

export const StudentMobileNav: React.FC<{ active: StudentTab; onSelect: (tab: StudentTab) => void; entitlements: Entitlements }> = ({ active, onSelect, entitlements }) => {
  const [moreOpen, setMoreOpen] = useState(false);
  const sections = getNavSections(entitlements);
  const moreItems = sections.flatMap((s) => s.items).filter((i) => !PRIMARY_MOBILE.some((p) => p.id === i.id));
  const isMoreActive = moreItems.some((i) => i.id === active);

  return (
    <>
      <nav aria-label="Navigation espace étudiant" className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-100 grid grid-cols-5 pb-[max(env(safe-area-inset-bottom),4px)]">
        {PRIMARY_MOBILE.map((item) => {
          const isActive = active === item.id;
          return (
            <button key={item.id} onClick={() => onSelect(item.id)} aria-current={isActive ? 'page' : undefined} className="flex flex-col items-center justify-center gap-1 py-2.5 min-h-[52px]">
              <item.icon size={19} className={isActive ? 'text-primary' : 'text-slate-400'} />
              <span className={`text-[10px] font-bold ${isActive ? 'text-primary' : 'text-slate-400'}`}>{item.label}</span>
            </button>
          );
        })}
        <button onClick={() => setMoreOpen(true)} className="flex flex-col items-center justify-center gap-1 py-2.5 min-h-[52px]">
          <Menu size={19} className={isMoreActive ? 'text-primary' : 'text-slate-400'} />
          <span className={`text-[10px] font-bold ${isMoreActive ? 'text-primary' : 'text-slate-400'}`}>Plus</span>
        </button>
      </nav>

      {moreOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setMoreOpen(false)} />
          <div className="absolute bottom-0 inset-x-0 bg-white rounded-t-[1.75rem] max-h-[75vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 bg-white">
              <h3 className="font-black text-slate-900">Plus</h3>
              <button onClick={() => setMoreOpen(false)} aria-label="Fermer" className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center"><X size={17} /></button>
            </div>
            <div className="p-3 grid grid-cols-2 gap-2">
              {moreItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { onSelect(item.id); setMoreOpen(false); }}
                  className={`flex items-center gap-2.5 p-4 min-h-[44px] rounded-2xl border text-start ${active === item.id ? 'bg-blue-50 border-primary/30 text-primary' : 'bg-slate-50 border-transparent text-slate-700'}`}
                >
                  <item.icon size={17} className={active === item.id ? 'text-primary' : 'text-slate-400'} />
                  <span className="text-[13px] font-bold flex-1">{item.label}</span>
                  {item.locked && <Lock size={12} className="text-slate-300" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
