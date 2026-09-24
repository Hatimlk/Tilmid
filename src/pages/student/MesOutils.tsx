import React, { useEffect, useState } from 'react';
import { Plus, X, ListChecks, BookOpen, Target, Check } from 'lucide-react';
import { Student } from '../../types';
import { Entitlements } from '../../utils/entitlements';
import { PageHeader, Card, LockedState, EmptyState, StatusPill, ProgressBar } from '../../components/student/primitives';
import {
  useHabitTracker, useRevisionTracker, useGoals,
  GoalStatus, GoalCategory
} from '../../hooks/useStudentData';
import { dataManager } from '../../utils/dataManager';

const DAYS_SHORT = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
type ToolId = 'habitudes' | 'revisions' | 'objectifs';

const TOOLS: { id: ToolId; label: string; icon: React.ElementType }[] = [
  { id: 'habitudes', label: 'Mes habitudes', icon: ListChecks },
  { id: 'revisions', label: 'Suivi des révisions', icon: BookOpen },
  { id: 'objectifs', label: 'Objectifs', icon: Target },
];

/* -------------------------------------------------------------------------- */
/* Habit tracker                                                             */
/* -------------------------------------------------------------------------- */

const HabitTrackerPanel: React.FC<{ username: string }> = ({ username }) => {
  const { items, add, update, remove } = useHabitTracker(username);
  const [name, setName] = useState('');

  const addHabit = () => {
    if (!name.trim()) return;
    add({ id: Date.now().toString(), name: name.trim(), days: [false, false, false, false, false, false, false] });
    setName('');
  };
  const toggleDay = (habitId: string, dayIdx: number) => {
    const habit = items.find((h) => h.id === habitId);
    if (!habit) return;
    const days = [...habit.days];
    days[dayIdx] = !days[dayIdx];
    update(habitId, { days } as any);
  };

  return (
    <div>
      <div className="flex gap-2 mb-5">
        <input value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addHabit()} placeholder="Ajouter une habitude (ex. Planning préparé)" className="flex-1 h-11 px-3 rounded-xl border border-slate-200 text-[13.5px] font-medium outline-none focus:border-primary" />
        <button onClick={addHabit} className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0"><Plus size={18} /></button>
      </div>

      {items.length === 0 ? (
        <EmptyState icon={ListChecks} title="Aucune habitude suivie" description="Ajoutez une habitude à construire pour commencer à suivre votre régularité." />
      ) : (
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-start border-collapse min-w-[420px]">
            <thead>
              <tr>
                <th className="text-start p-2 text-[11px] font-black uppercase text-slate-400">Habitude</th>
                {DAYS_SHORT.map((d, i) => <th key={i} className="p-2 text-[11px] font-black text-slate-400 w-9">{d}</th>)}
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((h) => (
                <tr key={h.id} className="border-t border-slate-50">
                  <td className="p-2 text-[13px] font-bold text-slate-700">{h.name}</td>
                  {h.days.map((checked, i) => (
                    <td key={i} className="p-2 text-center">
                      <button
                        onClick={() => toggleDay(h.id, i)}
                        aria-pressed={checked}
                        aria-label={`${h.name} — jour ${i + 1}`}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center mx-auto transition-colors ${checked ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-transparent hover:bg-slate-100'}`}
                      >
                        <Check size={13} strokeWidth={3} />
                      </button>
                    </td>
                  ))}
                  <td className="p-2 text-center">
                    <button onClick={() => remove(h.id)} aria-label={`Supprimer ${h.name}`} className="text-slate-300 hover:text-red-500"><X size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Revision tracker                                                          */
/* -------------------------------------------------------------------------- */

const FALLBACK_TECHNIQUES = ['Rappel actif', 'Questions', 'Flashcards', 'Exercices', 'Feynman', 'Révision espacée'];

const RevisionTrackerPanel: React.FC<{ username: string }> = ({ username }) => {
  const { items, add, remove } = useRevisionTracker(username);
  const [showForm, setShowForm] = useState(false);
  const [techniques, setTechniques] = useState<string[]>(FALLBACK_TECHNIQUES);
  const [form, setForm] = useState({ subject: '', chapter: '', durationMin: 30, technique: FALLBACK_TECHNIQUES[0], understanding: 3 });

  useEffect(() => {
    dataManager.getToolOptions()
      .then((opts) => {
        const list = opts.filter((o) => o.category === 'technique').sort((a, b) => a.position - b.position).map((o) => o.label);
        if (list.length > 0) setTechniques(list);
      })
      .catch(() => { /* keep fallback */ });
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subject.trim()) return;
    add({ id: Date.now().toString(), ...form, date: new Date().toISOString() });
    setForm({ subject: '', chapter: '', durationMin: 30, technique: techniques[0], understanding: 3 });
    setShowForm(false);
  };

  return (
    <div>
      {!showForm && (
        <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] bg-primary text-white rounded-xl font-bold text-[13px] mb-5"><Plus size={15} /> Ajouter une session</button>
      )}
      {showForm && (
        <Card className="p-5 mb-5">
          <form onSubmit={submit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Matière" className="h-11 px-3 rounded-xl border border-slate-200 text-[13.5px] font-medium outline-none focus:border-primary" />
              <input value={form.chapter} onChange={(e) => setForm({ ...form, chapter: e.target.value })} placeholder="Chapitre" className="h-11 px-3 rounded-xl border border-slate-200 text-[13.5px] font-medium outline-none focus:border-primary" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[12px] font-bold text-slate-500 mb-1 block">Durée (min)</label>
                <input type="number" min={5} max={300} value={form.durationMin} onChange={(e) => setForm({ ...form, durationMin: Number(e.target.value) })} className="w-full h-11 px-3 rounded-xl border border-slate-200 text-[13.5px] font-medium outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-[12px] font-bold text-slate-500 mb-1 block">Technique</label>
                <select value={form.technique} onChange={(e) => setForm({ ...form, technique: e.target.value })} className="w-full h-11 px-3 rounded-xl border border-slate-200 text-[13.5px] font-bold bg-white outline-none focus:border-primary">
                  {techniques.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-[12px] font-bold text-slate-500 mb-1 block">Niveau de compréhension : {form.understanding}/5</label>
              <input type="range" min={1} max={5} value={form.understanding} onChange={(e) => setForm({ ...form, understanding: Number(e.target.value) })} className="w-full accent-primary" />
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 h-11 rounded-xl border border-slate-200 font-bold text-[13px] text-slate-600">Annuler</button>
              <button type="submit" className="flex-[2] h-11 rounded-xl bg-slate-900 text-white font-bold text-[13px]">Enregistrer</button>
            </div>
          </form>
        </Card>
      )}
      {items.length === 0 ? (
        <EmptyState icon={BookOpen} title="Aucune session enregistrée" description="Ajoutez vos sessions de révision pour suivre votre régularité et votre compréhension." />
      ) : (
        <div className="space-y-2.5">
          {items.map((s) => (
            <Card key={s.id} className="p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-black text-slate-900 text-[13.5px]">{s.subject}{s.chapter ? ` · ${s.chapter}` : ''}</p>
                <p className="text-slate-400 text-[12px] font-bold">{s.durationMin} min · {s.technique} · Compréhension {s.understanding}/5</p>
              </div>
              <button onClick={() => remove(s.id)} aria-label="Supprimer" className="shrink-0 text-slate-300 hover:text-red-500"><X size={15} /></button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Objectives                                                                */
/* -------------------------------------------------------------------------- */

const CATEGORY_LABEL: Record<GoalCategory, string> = { academique: 'Académique', organisation: 'Organisation', methode: 'Méthode de travail', habitudes: 'Habitudes', examens: "Préparation aux examens", personnel: 'Personnel' };
const GOAL_STATUS_LABEL: Record<GoalStatus, string> = { a_demarrer: 'À démarrer', en_cours: 'En cours', a_revoir: 'À revoir', atteint: 'Atteint' };

const ObjectifsPanel: React.FC<{ username: string }> = ({ username }) => {
  const { items, add, update, remove } = useGoals(username);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'academique' as GoalCategory, targetDate: '', nextAction: '' });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    add({ id: Date.now().toString(), ...form, progress: 0, status: 'a_demarrer' });
    setForm({ title: '', category: 'academique', targetDate: '', nextAction: '' });
    setShowForm(false);
  };

  return (
    <div>
      {!showForm && (
        <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] bg-primary text-white rounded-xl font-bold text-[13px] mb-5"><Plus size={15} /> Ajouter un objectif</button>
      )}
      {showForm && (
        <Card className="p-5 mb-5">
          <form onSubmit={submit} className="space-y-3">
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Objectif" className="w-full h-11 px-3 rounded-xl border border-slate-200 text-[13.5px] font-medium outline-none focus:border-primary" />
            <div className="grid grid-cols-2 gap-3">
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as GoalCategory })} className="h-11 px-3 rounded-xl border border-slate-200 text-[13.5px] font-bold bg-white outline-none focus:border-primary">
                {Object.entries(CATEGORY_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <input type="date" value={form.targetDate} onChange={(e) => setForm({ ...form, targetDate: e.target.value })} className="h-11 px-3 rounded-xl border border-slate-200 text-[13.5px] font-medium outline-none focus:border-primary" />
            </div>
            <input value={form.nextAction} onChange={(e) => setForm({ ...form, nextAction: e.target.value })} placeholder="Prochaine action" className="w-full h-11 px-3 rounded-xl border border-slate-200 text-[13.5px] font-medium outline-none focus:border-primary" />
            <div className="flex gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 h-11 rounded-xl border border-slate-200 font-bold text-[13px] text-slate-600">Annuler</button>
              <button type="submit" className="flex-[2] h-11 rounded-xl bg-slate-900 text-white font-bold text-[13px]">Enregistrer</button>
            </div>
          </form>
        </Card>
      )}
      {items.length === 0 ? (
        <EmptyState icon={Target} title="Aucun objectif défini" description="Ajoutez un objectif pour commencer à suivre votre progression." />
      ) : (
        <div className="space-y-2.5">
          {items.map((g) => (
            <Card key={g.id} className="p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0">
                  <p className="font-black text-slate-900 text-[13.5px]">{g.title}</p>
                  <p className="text-slate-400 text-[11.5px] font-bold">{CATEGORY_LABEL[g.category]}{g.targetDate ? ` · Échéance ${new Date(g.targetDate).toLocaleDateString('fr-FR')}` : ''}</p>
                </div>
                <button onClick={() => remove(g.id)} aria-label="Supprimer" className="shrink-0 text-slate-300 hover:text-red-500"><X size={15} /></button>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {(['a_demarrer', 'en_cours', 'a_revoir', 'atteint'] as GoalStatus[]).map((s) => (
                  <button key={s} onClick={() => update(g.id, { status: s })} className={`px-2.5 py-1 rounded-full text-[11px] font-black ${g.status === s ? 'bg-primary text-white' : 'bg-slate-50 text-slate-400'}`}>
                    {GOAL_STATUS_LABEL[s]}
                  </button>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Hub                                                                       */
/* -------------------------------------------------------------------------- */

export const MesOutils: React.FC<{ student: Student; entitlements: Entitlements }> = ({ student, entitlements }) => {
  const [active, setActive] = useState<ToolId>('habitudes');

  if (!entitlements.practicalTools) {
    return (
      <div>
        <PageHeader title="Mes outils" />
        <LockedState title="Outils non disponibles" description="Les outils pratiques sont inclus avec les formules Essentiel, Boost et Premium." />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Mes outils" subtitle="Vos outils pratiques Mouwakaba, à utiliser au quotidien." />
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-1">
        {TOOLS.map((t) => (
          <button key={t.id} onClick={() => setActive(t.id)} className={`flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl text-[13px] font-bold whitespace-nowrap transition-colors ${active === t.id ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-500'}`}>
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>
      {active === 'habitudes' && <HabitTrackerPanel username={student.username} />}
      {active === 'revisions' && <RevisionTrackerPanel username={student.username} />}
      {active === 'objectifs' && <ObjectifsPanel username={student.username} />}
    </div>
  );
};
