import React, { useEffect, useState } from 'react';
import { Plus, X, ListChecks, BookOpen, Target, Check, Play, Clock3, CheckCircle2, Flame, Info } from 'lucide-react';
import { Student } from '../../types';
import { Entitlements } from '../../utils/entitlements';
import { PageHeader, Card, LockedState, EmptyState, StatusPill, ProgressBar } from '../../components/student/primitives';
import {
  useHabitTracker, useRevisionTracker, useGoals,
  GoalStatus, GoalCategory
} from '../../hooks/useStudentData';
import { dataManager } from '../../utils/dataManager';

const DAYS_SHORT = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const HABIT_EXAMPLES = ['Préparer mon planning', 'Relire mes notes 15 min', 'Téléphone loin pendant l’étude'];
const getWeekStart = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  return date.toISOString().slice(0, 10);
};
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
    add({ id: Date.now().toString(), name: name.trim(), days: [false, false, false, false, false, false, false], weekStart: getWeekStart() });
    setName('');
  };
  const toggleDay = (habitId: string, dayIdx: number) => {
    const habit = items.find((h) => h.id === habitId);
    if (!habit) return;
    const days = [...habit.days];
    days[dayIdx] = !days[dayIdx];
    update(habitId, { days, weekStart: getWeekStart() });
  };
  const todayIndex = (new Date().getDay() + 6) % 7;
  const doneToday = items.filter((habit) => habit.days[todayIndex]).length;
  const totalChecks = items.reduce((sum, habit) => sum + habit.days.filter(Boolean).length, 0);

  return (
    <div>
      <div className="grid sm:grid-cols-[1fr_auto] gap-3 mb-5 p-4 rounded-2xl bg-blue-50 border border-blue-100">
        <div className="flex gap-3"><Info size={19} className="text-primary shrink-0 mt-0.5" /><div><p className="font-black text-slate-800 text-[13.5px]">À quoi servent les habitudes ?</p><p className="text-[12.5px] text-slate-600 font-medium mt-1">Choisissez une petite action répétable, puis cochez-la le jour où vous la réalisez. Le tableau repart chaque lundi et mesure votre constance.</p></div></div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white text-[12px] font-black text-emerald-700"><Flame size={16} /> Aujourd’hui : {doneToday}/{items.length}</div>
      </div>
      <div className="flex gap-2 mb-5">
        <input value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addHabit()} placeholder="Ajouter une habitude (ex. Planning préparé)" className="flex-1 h-11 px-3 rounded-xl border border-slate-200 text-[13.5px] font-medium outline-none focus:border-primary" />
        <button onClick={addHabit} className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0"><Plus size={18} /></button>
      </div>
      {items.length === 0 && <div className="flex flex-wrap gap-2 mb-4"><span className="text-[11.5px] font-bold text-slate-400 py-2">Exemples :</span>{HABIT_EXAMPLES.map((example) => <button key={example} onClick={() => setName(example)} className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-[11.5px] font-bold text-slate-600 hover:border-primary hover:text-primary">{example}</button>)}</div>}

      {items.length === 0 ? (
        <EmptyState icon={ListChecks} title="Aucune habitude suivie" description="Ajoutez une habitude à construire pour commencer à suivre votre régularité." />
      ) : (
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-start border-collapse min-w-[420px]">
            <thead>
              <tr>
                <th className="text-start p-2 text-[11px] font-black uppercase text-slate-400">Habitude</th>
                {DAYS_SHORT.map((d, i) => <th key={i} className={`p-2 text-[10px] font-black w-11 ${i === todayIndex ? 'text-primary bg-blue-50 rounded-t-lg' : 'text-slate-400'}`}>{d}</th>)}
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((h) => (
                <tr key={h.id} className="border-t border-slate-50">
                  <td className="p-2 text-[13px] font-bold text-slate-700">{h.name}</td>
                  {h.days.map((checked, i) => (
                    <td key={i} className={`p-2 text-center ${i === todayIndex ? 'bg-blue-50/60' : ''}`}>
                      <button
                        onClick={() => toggleDay(h.id, i)}
                        disabled={i > todayIndex}
                        aria-pressed={checked}
                        aria-label={`${h.name} — jour ${i + 1}`}
                        className={`w-8 h-8 rounded-lg border flex items-center justify-center mx-auto transition-all ${checked ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm' : i > todayIndex ? 'bg-slate-50 border-slate-100 text-transparent opacity-40 cursor-not-allowed' : i === todayIndex ? 'bg-white border-primary text-transparent hover:bg-primary hover:text-white ring-2 ring-blue-100' : 'bg-white border-slate-200 text-transparent hover:border-emerald-400 hover:text-emerald-500'}`}
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
          <p className="mt-3 text-[11.5px] font-bold text-slate-400">{totalChecks} action{totalChecks !== 1 ? 's' : ''} réalisée{totalChecks !== 1 ? 's' : ''} cette semaine.</p>
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
  const { items, add, update, remove } = useRevisionTracker(username);
  const [showForm, setShowForm] = useState(false);
  const [now, setNow] = useState(Date.now());
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

  useEffect(() => {
    if (!items.some((item) => item.startedAt && !item.completed)) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [items]);

  useEffect(() => {
    items.forEach((item) => {
      if (!item.startedAt || item.completed) return;
      const elapsed = Math.floor((now - new Date(item.startedAt).getTime()) / 1000);
      if (elapsed >= item.durationMin * 60) update(item.id, { completed: true });
    });
  }, [now, items, update]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subject.trim()) return;
    add({ id: Date.now().toString(), ...form, date: new Date().toISOString(), startedAt: null, completed: false, completedAt: null });
    setForm({ subject: '', chapter: '', durationMin: 30, technique: techniques[0], understanding: 3 });
    setShowForm(false);
  };

  const formatTime = (seconds: number) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

  return (
    <div>
      <div className="mb-5 p-4 rounded-2xl bg-slate-900 text-white flex items-start gap-3">
        <Clock3 size={20} className="text-blue-300 shrink-0 mt-0.5" />
        <div><p className="text-[13.5px] font-black">Une vraie session chronométrée</p><p className="text-[12px] font-medium text-slate-300 mt-1">Ajoutez une session, lancez le compteur puis travaillez. Elle sera cochée automatiquement lorsque la durée prévue sera atteinte.</p></div>
      </div>
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
              <button type="submit" className="flex-[2] h-11 rounded-xl bg-slate-900 text-white font-bold text-[13px]">Ajouter la session</button>
            </div>
          </form>
        </Card>
      )}
      {items.length === 0 ? (
        <EmptyState icon={BookOpen} title="Aucune session enregistrée" description="Ajoutez vos sessions de révision pour suivre votre régularité et votre compréhension." />
      ) : (
        <div className="space-y-2.5">
          {items.map((s) => {
            const totalSeconds = Math.max(1, s.durationMin * 60);
            const elapsed = s.startedAt ? Math.max(0, Math.floor((now - new Date(s.startedAt).getTime()) / 1000)) : 0;
            const remaining = s.completed ? 0 : Math.max(0, totalSeconds - elapsed);
            return (
            <Card key={s.id} className={`p-4 flex items-center gap-4 ${s.completed ? 'border-emerald-200 bg-emerald-50/40' : ''}`}>
              <button
                onClick={() => !s.completed && !s.startedAt && update(s.id, { startedAt: new Date().toISOString() })}
                disabled={s.completed || !!s.startedAt}
                aria-label={s.completed ? 'Session terminée' : s.startedAt ? 'Session en cours' : 'Démarrer la session'}
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${s.completed ? 'bg-emerald-500 text-white' : s.startedAt ? 'bg-primary text-white' : 'bg-blue-50 text-primary hover:bg-primary hover:text-white'}`}
              >{s.completed ? <CheckCircle2 size={20} /> : <Play size={18} fill={s.startedAt ? 'currentColor' : 'none'} />}</button>
              <div className="flex-1 min-w-0">
                <p className="font-black text-slate-900 text-[13.5px]">{s.subject}{s.chapter ? ` · ${s.chapter}` : ''}</p>
                <p className="text-slate-400 text-[12px] font-bold">{s.durationMin} min · {s.technique} · Compréhension {s.understanding}/5</p>
              </div>
              <div className="text-end shrink-0"><p className={`font-mono text-[18px] font-black tabular-nums ${s.completed ? 'text-emerald-600' : s.startedAt ? 'text-primary' : 'text-slate-400'}`}>{formatTime(remaining)}</p><p className="text-[10px] font-bold text-slate-400">{s.completed ? 'validée' : s.startedAt ? 'restantes' : 'prête'}</p></div>
              <button onClick={() => remove(s.id)} aria-label="Supprimer" className="shrink-0 text-slate-300 hover:text-red-500"><X size={15} /></button>
            </Card>
            );
          })}
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
