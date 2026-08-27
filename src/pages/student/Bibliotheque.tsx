import React, { useMemo, useState } from 'react';
import { Search, FileText, DownloadCloud, CalendarDays, ClipboardList, ListChecks, AlertOctagon, GraduationCap, Library } from 'lucide-react';
import { StudyResource } from '../../types';
import { Entitlements } from '../../utils/entitlements';
import { PageHeader, Card, LockedState, EmptyState } from '../../components/student/primitives';
import { StudentTab } from '../../components/student/navigation';

const TOOL_CARDS = [
  { icon: CalendarDays, title: 'Programme hebdomadaire', desc: 'Organisez votre semaine selon vos priorités et disponibilités.', tab: 'planning' as StudentTab },
  { icon: ListChecks, title: 'Tableau de suivi des révisions', desc: 'Consignez vos sessions de révision et suivez votre régularité.', tab: 'outils' as StudentTab },
  { icon: ClipboardList, title: 'Habit Tracker', desc: 'Suivez vos habitudes de travail au quotidien.', tab: 'outils' as StudentTab },
  { icon: AlertOctagon, title: 'Error Log', desc: 'Transformez vos erreurs en points de progression.', tab: 'outils' as StudentTab },
  { icon: GraduationCap, title: 'Plan de préparation aux examens', desc: 'Organisez votre révision à l\'approche des examens.', tab: 'outils' as StudentTab },
];

const FILTERS = ['Tous', 'Organisation', 'Révision', 'Examens', 'Productivité', 'Méthodes'];

export const Bibliotheque: React.FC<{ entitlements: Entitlements; resources: StudyResource[]; onNavigate: (tab: StudentTab) => void }> = ({ entitlements, resources, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('Tous');

  const filteredResources = useMemo(
    () => resources.filter((r) => (!query || r.title.toLowerCase().includes(query.toLowerCase()) || r.subject.toLowerCase().includes(query.toLowerCase()))),
    [resources, query]
  );

  if (!entitlements.practicalTools) {
    return (
      <div>
        <PageHeader title="Bibliothèque" />
        <LockedState title="Bibliothèque non disponible" description="La bibliothèque d'outils et de ressources est incluse avec les formules Essentiel, Boost et Premium." />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Bibliothèque" subtitle="Retrouvez vos outils, modèles et ressources pratiques." />

      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher une ressource..." className="w-full h-11 ps-10 pe-3 rounded-xl border border-slate-200 text-[13.5px] font-medium outline-none focus:border-primary" />
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3.5 py-1.5 min-h-[36px] rounded-full text-[12.5px] font-bold border transition-all ${filter === f ? 'bg-primary/10 border-primary text-primary' : 'bg-white border-slate-200 text-slate-500'}`}>
            {f}
          </button>
        ))}
      </div>

      <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3">Outils Mouwakaba</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {TOOL_CARDS.map((t) => (
          <Card key={t.title} className="p-5">
            <span className="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center mb-3"><t.icon size={18} /></span>
            <p className="font-black text-slate-900 text-[13.5px] mb-1">{t.title}</p>
            <p className="text-slate-400 text-[12px] font-medium mb-3 leading-relaxed">{t.desc}</p>
            <span className="text-[11px] font-black text-slate-300 uppercase tracking-wide mb-3 block">Outil interactif</span>
            <button onClick={() => onNavigate(t.tab)} className="text-[12.5px] font-bold text-primary hover:underline">Utiliser</button>
          </Card>
        ))}
      </div>

      <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3">Documents</p>
      {filteredResources.length === 0 ? (
        <Card className="p-8">
          <EmptyState icon={Library} title="Aucun document disponible pour le moment" description="Vos ressources et documents apparaîtront ici lorsqu'ils seront ajoutés." />
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map((r) => (
            <Card key={r.id} className="p-5">
              <div className="flex items-start justify-between mb-3">
                <span className="w-10 h-10 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center"><FileText size={18} /></span>
                <span className="text-[10.5px] font-black bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full uppercase">{r.subject}</span>
              </div>
              <p className="font-black text-slate-900 text-[13.5px] mb-1">{r.title}</p>
              <p className="text-slate-400 text-[11.5px] font-bold flex items-center gap-3 mb-3">
                <span>{r.fileSize}</span>
                <span className="flex items-center gap-1"><DownloadCloud size={12} /> {r.downloadCount}</span>
              </p>
              <span className="text-[11px] font-bold text-primary">PDF · Consulter</span>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
