import React, { useEffect, useState } from 'react';
import { Plus, X, Clock, CalendarDays, List, Grid3x3, Check, Pencil, CircleCheckBig } from 'lucide-react';
import { TimetableTask } from '../../types';
import { PageHeader, Card, EmptyState } from '../../components/student/primitives';
import { dataManager } from '../../utils/dataManager';

const DAYS_FR = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const FALLBACK_SUBJECTS = ['Mathématiques', 'Physique-Chimie', 'SVT', 'Français', 'Philosophie', 'Langues', 'Autre'];
const FALLBACK_TECHNIQUES = ['Rappel actif', 'Exercices', 'Flashcards', 'Fiches de synthèse', 'Révision espacée'];

const SUBJECT_COLORS: Record<string, string> = {
  'Mathématiques': 'bg-blue-50 text-blue-700 border-blue-100',
  'Physique-Chimie': 'bg-orange-50 text-orange-700 border-orange-100',
  'SVT': 'bg-emerald-50 text-emerald-700 border-emerald-100',
  'Français': 'bg-purple-50 text-purple-700 border-purple-100',
  'Philosophie': 'bg-rose-50 text-rose-700 border-rose-100',
  'Langues': 'bg-cyan-50 text-cyan-700 border-cyan-100',
  'Autre': 'bg-slate-50 text-slate-700 border-slate-100',
};

export const Planning: React.FC<{
  timetable: TimetableTask[];
  onAdd: (task: TimetableTask) => void;
  onUpdate: (id: string, patch: Partial<TimetableTask>) => void;
  onRemove: (id: string) => void;
}> = ({ timetable, onAdd, onUpdate, onRemove }) => {
  const [view, setView] = useState<'semaine' | 'liste'>('semaine');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<string[]>(FALLBACK_SUBJECTS);
  const [techniques, setTechniques] = useState<string[]>(FALLBACK_TECHNIQUES);
  const [form, setForm] = useState({ subject: FALLBACK_SUBJECTS[0], topic: '', day: DAYS_FR[0], startTime: '18:00', endTime: '19:00', technique: FALLBACK_TECHNIQUES[0] });

  useEffect(() => {
    dataManager.getToolOptions()
      .then((opts) => {
        const byCategory = (cat: 'subject' | 'technique') =>
          opts.filter((o) => o.category === cat).sort((a, b) => a.position - b.position).map((o) => o.label);
        const nextSubjects = byCategory('subject');
        const nextTechniques = byCategory('technique');
        if (nextSubjects.length > 0) { setSubjects(nextSubjects); setForm((f) => ({ ...f, subject: nextSubjects[0] })); }
        if (nextTechniques.length > 0) { setTechniques(nextTechniques); setForm((f) => ({ ...f, technique: nextTechniques[0] })); }
      })
      .catch(() => { /* keep fallback */ });
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const values = { subject: form.subject, topic: form.topic, technique: form.technique, day: form.day, startTime: form.startTime, endTime: form.endTime };
    if (editingId) onUpdate(editingId, values);
    else onAdd({ id: Date.now().toString(), ...values, completed: false, completedAt: null });
    setEditingId(null);
    setShowModal(false);
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({ subject: subjects[0] || FALLBACK_SUBJECTS[0], topic: '', day: DAYS_FR[0], startTime: '18:00', endTime: '19:00', technique: techniques[0] || FALLBACK_TECHNIQUES[0] });
    setShowModal(true);
  };

  const openEdit = (task: TimetableTask) => {
    setEditingId(task.id);
    setForm({ subject: task.subject, topic: task.topic || '', day: task.day, startTime: task.startTime, endTime: task.endTime, technique: task.technique || techniques[0] || FALLBACK_TECHNIQUES[0] });
    setShowModal(true);
  };

  const toggleCompleted = (task: TimetableTask) => onUpdate(task.id, { completed: !task.completed, completedAt: task.completed ? null : new Date().toISOString() });

  const sortedList = [...timetable].sort((a, b) => DAYS_FR.indexOf(a.day) - DAYS_FR.indexOf(b.day) || a.startTime.localeCompare(b.startTime));

  return (
    <div>
      <PageHeader
        title="Mon planning"
        subtitle="Organisez vos sessions de révision et gardez un rythme équilibré."
        action={
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex bg-slate-100 rounded-xl p-1">
              <button onClick={() => setView('semaine')} className={`px-3 py-2 min-h-[36px] rounded-lg text-[12.5px] font-bold flex items-center gap-1.5 ${view === 'semaine' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}><Grid3x3 size={14} /> Semaine</button>
              <button onClick={() => setView('liste')} className={`px-3 py-2 min-h-[36px] rounded-lg text-[12.5px] font-bold flex items-center gap-1.5 ${view === 'liste' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}><List size={14} /> Liste</button>
            </div>
            <button onClick={openCreate} className="inline-flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] bg-primary text-white rounded-xl font-bold text-[13px] hover:bg-[#0875E8] transition-all">
              <Plus size={15} /> Ajouter une session
            </button>
          </div>
        }
      />

      <div className="mb-5 flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl bg-white border border-slate-100 p-4 shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0"><CircleCheckBig size={19} /></div>
        <div className="flex-1"><p className="font-black text-slate-800 text-[13.5px]">Votre semaine, comme une liste d’actions</p><p className="text-[12px] text-slate-500 font-medium">Cochez une session quand elle est réellement faite. Vous pouvez la rouvrir ou la modifier à tout moment.</p></div>
        <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[11.5px] font-black">{timetable.filter((task) => task.completed).length}/{timetable.length} terminées</span>
      </div>

      {view === 'semaine' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          {DAYS_FR.map((day) => {
            const sessions = timetable.filter((t) => t.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
            return (
              <Card key={day} className="p-4 min-h-[160px] flex flex-col">
                <p className="text-[12.5px] font-black text-slate-700 mb-3 pb-2 border-b border-slate-50">{day}</p>
                <div className="space-y-2 flex-1">
                  {sessions.length === 0 ? (
                    <p className="text-[11.5px] text-slate-300 font-semibold py-4 text-center">Aucune session prévue</p>
                  ) : (
                    sessions.map((s) => (
                      <div key={s.id} className={`p-2.5 rounded-xl border relative group transition-all ${s.completed ? 'bg-emerald-50 text-emerald-700 border-emerald-200 opacity-75' : SUBJECT_COLORS[s.subject] || SUBJECT_COLORS['Autre']}`}>
                        <button onClick={() => onRemove(s.id)} aria-label="Supprimer" className="absolute -top-1.5 -end-1.5 w-5 h-5 bg-white shadow rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500">
                          <X size={11} />
                        </button>
                        <div className="flex items-start gap-2"><button onClick={() => toggleCompleted(s)} aria-label={s.completed ? 'Rouvrir la session' : 'Marquer comme terminée'} className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${s.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white/80 border-current text-transparent hover:text-current'}`}><Check size={12} strokeWidth={3} /></button><button onClick={() => openEdit(s)} className={`font-black text-[12px] text-start ${s.completed ? 'line-through' : ''}`}>{s.subject}{s.topic ? <span className="block text-[10px] font-bold opacity-70">{s.topic}</span> : null}</button></div>
                        <p className="text-[10.5px] font-bold flex items-center gap-1 mt-0.5 opacity-80"><Clock size={10} />{s.startTime} – {s.endTime}</p>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      ) : sortedList.length === 0 ? (
        <Card className="p-8">
          <EmptyState icon={CalendarDays} title="Aucune session programmée" description="Ajoutez votre première session de révision pour commencer à organiser votre semaine." cta={{ label: 'Ajouter une session', onClick: () => setShowModal(true) }} />
        </Card>
      ) : (
        <div className="space-y-2.5">
          {sortedList.map((s) => (
            <Card key={s.id} className={`p-4 flex items-center gap-4 ${s.completed ? 'border-emerald-200 bg-emerald-50/40' : ''}`}>
              <button onClick={() => toggleCompleted(s)} aria-label={s.completed ? 'Rouvrir la session' : 'Marquer comme terminée'} className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${s.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 text-transparent hover:border-emerald-400 hover:text-emerald-500'}`}><Check size={15} strokeWidth={3} /></button>
              <span className={`px-2.5 py-1 rounded-lg border text-[11px] font-black shrink-0 ${SUBJECT_COLORS[s.subject] || SUBJECT_COLORS['Autre']}`}>{s.day}</span>
              <div className="flex-1 min-w-0">
                <p className={`font-black text-[14px] ${s.completed ? 'text-emerald-800 line-through' : 'text-slate-900'}`}>{s.subject}</p>
                {s.topic && <p className="text-slate-500 text-[11.5px] font-semibold">{s.topic}{s.technique ? ` · ${s.technique}` : ''}</p>}
                <p className="text-slate-400 text-[12px] font-bold">{s.startTime} – {s.endTime}</p>
              </div>
              <button onClick={() => openEdit(s)} aria-label="Modifier la session" className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-300 hover:text-primary hover:bg-blue-50 transition-colors shrink-0"><Pencil size={15} /></button>
              <button onClick={() => onRemove(s.id)} aria-label="Supprimer la session" className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0">
                <X size={16} />
              </button>
            </Card>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => { setShowModal(false); setEditingId(null); }} />
          <div className="relative bg-white rounded-t-[1.75rem] sm:rounded-[1.75rem] w-full sm:max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-lg">Ajouter une session de révision</h3>
              <button onClick={() => { setShowModal(false); setEditingId(null); }} aria-label="Fermer" className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center"><X size={17} /></button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div>
                <label className="text-[13px] font-bold text-slate-600 mb-1.5 block">Matière</label>
                <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full h-12 px-3 rounded-xl border border-slate-200 font-bold text-[14px] bg-white outline-none focus:border-primary">
                  {subjects.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[13px] font-bold text-slate-600 mb-1.5 block">Sujet (optionnel)</label>
                <input value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} placeholder="Ex. Limites & continuité" className="w-full h-12 px-3 rounded-xl border border-slate-200 font-medium text-[14px] outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-[13px] font-bold text-slate-600 mb-1.5 block">Jour</label>
                <select value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })} className="w-full h-12 px-3 rounded-xl border border-slate-200 font-bold text-[14px] bg-white outline-none focus:border-primary">
                  {DAYS_FR.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[13px] font-bold text-slate-600 mb-1.5 block">Début</label>
                  <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} className="w-full h-12 px-3 rounded-xl border border-slate-200 font-bold text-[14px] outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="text-[13px] font-bold text-slate-600 mb-1.5 block">Fin</label>
                  <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} className="w-full h-12 px-3 rounded-xl border border-slate-200 font-bold text-[14px] outline-none focus:border-primary" />
                </div>
              </div>
              <div>
                <label className="text-[13px] font-bold text-slate-600 mb-1.5 block">Technique</label>
                <select value={form.technique} onChange={(e) => setForm({ ...form, technique: e.target.value })} className="w-full h-12 px-3 rounded-xl border border-slate-200 font-bold text-[14px] bg-white outline-none focus:border-primary">
                  {techniques.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full h-[52px] bg-primary text-white rounded-2xl font-black hover:bg-[#0875E8] transition-all">{editingId ? 'Enregistrer les modifications' : 'Ajouter au planning'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
