import React, { useState } from 'react';
import { Plus, X, Target, Check } from 'lucide-react';
import { Student } from '../../types';
import { Entitlements } from '../../utils/entitlements';
import { PageHeader, Card, ProgressBar, EmptyState } from '../../components/student/primitives';
import { useSelfGuidedPlan, PlanAction } from '../../hooks/useStudentData';
import { StudentTab } from '../../components/student/navigation';

export const MonPlan: React.FC<{ student: Student; entitlements: Entitlements; onNavigate: (tab: StudentTab) => void }> = ({ student, entitlements, onNavigate }) => {
  const { record, save, loaded } = useSelfGuidedPlan(student.username);
  const [objectiveDraft, setObjectiveDraft] = useState('');
  const [newAction, setNewAction] = useState('');
  const [newHabit, setNewHabit] = useState('');
  const [obstaclesDraft, setObstaclesDraft] = useState('');

  React.useEffect(() => {
    if (loaded) {
      setObjectiveDraft(record.objective);
      setObstaclesDraft(record.obstacles);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  const title = entitlements.label === 'Premium' ? 'Plan 90 jours' : entitlements.label === 'Boost' ? 'Plan 30 jours' : 'Mon plan personnel';

  if (entitlements.label !== 'Essentiel') {
    const hasCoachPlan = false; // no coach-authored plan backend exists yet — honest empty state
    return (
      <div>
        <PageHeader title="Mon Plan" subtitle={title} />
        {hasCoachPlan ? null : (
          <Card className="p-8 max-w-lg">
            <EmptyState
              icon={Target}
              title="Votre plan n'est pas encore configuré"
              description="Votre plan personnalisé sera disponible ici après votre première séance de coaching."
              cta={{ label: 'Voir mes séances', onClick: () => onNavigate('coaching') }}
            />
          </Card>
        )}
      </div>
    );
  }

  const actions = record.actions;
  const done = actions.filter((a) => a.done).length;
  const progress = actions.length > 0 ? (done / actions.length) * 100 : 0;

  const toggleAction = (id: string) => {
    save({ ...record, actions: record.actions.map((a) => (a.id === id ? { ...a, done: !a.done } : a)) });
  };
  const removeAction = (id: string) => {
    save({ ...record, actions: record.actions.filter((a) => a.id !== id) });
  };
  const addAction = () => {
    if (!newAction.trim()) return;
    const action: PlanAction = { id: Date.now().toString(), text: newAction.trim(), done: false };
    save({ ...record, actions: [...record.actions, action] });
    setNewAction('');
  };
  const addHabit = () => {
    if (!newHabit.trim()) return;
    save({ ...record, habits: [...record.habits, newHabit.trim()] });
    setNewHabit('');
  };
  const removeHabit = (h: string) => save({ ...record, habits: record.habits.filter((x) => x !== h) });
  const commitObjective = () => save({ ...record, objective: objectiveDraft, startDate: record.startDate || new Date().toLocaleDateString('fr-FR') });
  const commitObstacles = () => save({ ...record, obstacles: obstaclesDraft });

  return (
    <div>
      <PageHeader title="Mon Plan" subtitle="Mon plan personnel — construit et suivi par vous-même à l'aide des outils Mouwakaba." />

      <Card emphasis className="p-6 md:p-7 mb-5">
        <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3">Objectif principal</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={objectiveDraft}
            onChange={(e) => setObjectiveDraft(e.target.value)}
            onBlur={commitObjective}
            placeholder="Ex. Construire une routine de révision régulière"
            className="flex-1 h-12 px-4 rounded-xl border border-slate-200 font-bold text-[15px] outline-none focus:border-primary"
          />
        </div>
        {actions.length > 0 && (
          <div className="mt-5">
            <ProgressBar value={progress} label={`${done} / ${actions.length} actions terminées`} />
            {record.startDate && <p className="text-[11.5px] font-bold text-slate-400 mt-2">Débuté le {record.startDate}</p>}
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="p-6">
          <p className="font-black text-slate-900 text-[15px] mb-4">Actions de cette semaine</p>
          <div className="space-y-2 mb-4">
            {actions.length === 0 ? (
              <p className="text-slate-400 text-[13px] font-medium">Ajoutez vos premières actions concrètes.</p>
            ) : (
              actions.map((a) => (
                <div key={a.id} className="flex items-center gap-3 group">
                  <button
                    onClick={() => toggleAction(a.id)}
                    aria-pressed={a.done}
                    aria-label={a.done ? 'Marquer comme non terminée' : 'Marquer comme terminée'}
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-colors ${a.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'}`}
                  >
                    {a.done && <Check size={13} strokeWidth={3} />}
                  </button>
                  <span className={`flex-1 text-[13.5px] font-semibold ${a.done ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{a.text}</span>
                  <button onClick={() => removeAction(a.id)} aria-label="Supprimer" className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-opacity"><X size={15} /></button>
                </div>
              ))
            )}
          </div>
          <div className="flex gap-2">
            <input value={newAction} onChange={(e) => setNewAction(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addAction()} placeholder="Ajouter une action..." className="flex-1 h-11 px-3 rounded-xl border border-slate-200 text-[13.5px] font-medium outline-none focus:border-primary" />
            <button onClick={addAction} className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0"><Plus size={18} /></button>
          </div>
        </Card>

        <Card className="p-6">
          <p className="font-black text-slate-900 text-[15px] mb-4">Habitudes à construire</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {record.habits.length === 0 ? (
              <p className="text-slate-400 text-[13px] font-medium">Aucune habitude ajoutée pour l'instant.</p>
            ) : (
              record.habits.map((h) => (
                <span key={h} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-primary text-[12.5px] font-bold">
                  {h}
                  <button onClick={() => removeHabit(h)} aria-label={`Retirer ${h}`}><X size={12} /></button>
                </span>
              ))
            )}
          </div>
          <div className="flex gap-2">
            <input value={newHabit} onChange={(e) => setNewHabit(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addHabit()} placeholder="Ex. Limiter le téléphone" className="flex-1 h-11 px-3 rounded-xl border border-slate-200 text-[13.5px] font-medium outline-none focus:border-primary" />
            <button onClick={addHabit} className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0"><Plus size={18} /></button>
          </div>
        </Card>
      </div>

      <Card className="p-6 mt-5">
        <p className="font-black text-slate-900 text-[15px] mb-3">Obstacles identifiés</p>
        <textarea
          value={obstaclesDraft}
          onChange={(e) => setObstaclesDraft(e.target.value)}
          onBlur={commitObstacles}
          rows={3}
          placeholder="Qu'est-ce qui vous freine actuellement dans l'application de votre plan ?"
          className="w-full p-4 rounded-xl border border-slate-200 text-[13.5px] font-medium outline-none focus:border-primary resize-none"
        />
      </Card>
    </div>
  );
};
