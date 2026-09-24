import React, { useEffect, useState } from 'react';
import { Target, X } from 'lucide-react';
import { PlanOverviewRow } from '../../types';
import { dataManager } from '../../utils/dataManager';

export const PlanFormModal: React.FC<{ open: boolean; plan: PlanOverviewRow | null; onClose: () => void; onSaved: () => void }> = ({ open, plan, onClose, onSaved }) => {
  const [objective, setObjective] = useState('');
  const [startDate, setStartDate] = useState('');
  const [obstacles, setObstacles] = useState('');
  const [actions, setActions] = useState('');
  const [habits, setHabits] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open || !plan) return;
    setObjective(plan.objective); setStartDate(plan.startDate?.slice(0, 10) || new Date().toISOString().slice(0, 10));
    setObstacles(plan.obstacles); setActions(plan.actions.map((a) => a.text).join('\n')); setHabits(plan.habits.join('\n')); setError('');
  }, [open, plan]);
  if (!open || !plan) return null;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const actionLines = actions.split('\n').map((v) => v.trim()).filter(Boolean);
    if (!objective.trim() || actionLines.length === 0) { setError('Ajoutez un objectif et au moins une étape pratique.'); return; }
    setSaving(true); setError('');
    try {
      await dataManager.saveAdminPlan(plan.studentId, {
        objective: objective.trim(), startDate, obstacles: obstacles.trim(),
        actions: actionLines.map((text, i) => ({ id: plan.actions[i]?.id || `${Date.now()}-${i}`, text, done: plan.actions[i]?.text === text ? plan.actions[i].done : false })),
        habits: habits.split('\n').map((v) => v.trim()).filter(Boolean),
      });
      await onSaved(); onClose();
    } catch { setError("Impossible d'enregistrer ce plan. Vérifiez que l'étudiant possède Boost ou Premium."); }
    finally { setSaving(false); }
  };

  return <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true">
    <div className="bg-white rounded-[22px] w-full max-w-xl shadow-2xl max-h-[calc(100vh-2rem)] overflow-y-auto">
      <div className="p-6 border-b border-slate-100 flex justify-between"><h3 className="font-black text-slate-900 flex items-center gap-2"><Target size={18} className="text-primary" /> Plan de {plan.name}</h3><button onClick={onClose}><X size={18} /></button></div>
      <form onSubmit={submit} className="p-6 space-y-4">
        {error && <p className="text-[12.5px] font-bold text-rose-600 bg-rose-50 rounded-xl p-3">{error}</p>}
        <label className="block text-[13px] font-bold text-slate-700">Objectif principal<input value={objective} onChange={(e) => setObjective(e.target.value)} className="mt-1.5 w-full h-12 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary" /></label>
        <label className="block text-[13px] font-bold text-slate-700">Date de début<input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="mt-1.5 w-full h-12 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary" /></label>
        <label className="block text-[13px] font-bold text-slate-700">Étapes pratiques — une par ligne<textarea rows={5} value={actions} onChange={(e) => setActions(e.target.value)} className="mt-1.5 w-full p-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary resize-none" /></label>
        <label className="block text-[13px] font-bold text-slate-700">Habitudes recommandées — une par ligne<textarea rows={3} value={habits} onChange={(e) => setHabits(e.target.value)} className="mt-1.5 w-full p-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary resize-none" /></label>
        <label className="block text-[13px] font-bold text-slate-700">Obstacles identifiés<textarea rows={3} value={obstacles} onChange={(e) => setObstacles(e.target.value)} className="mt-1.5 w-full p-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary resize-none" /></label>
        <div className="flex gap-3"><button type="button" onClick={onClose} className="flex-1 h-12 rounded-xl border border-slate-200 font-bold">Annuler</button><button disabled={saving} className="flex-[2] h-12 rounded-xl bg-slate-900 text-white font-bold disabled:opacity-60">{saving ? 'Enregistrement…' : 'Enregistrer le plan'}</button></div>
      </form>
    </div>
  </div>;
};
