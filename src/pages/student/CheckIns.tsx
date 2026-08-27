import React, { useState } from 'react';
import { CheckSquare, CheckCircle2, X } from 'lucide-react';
import { Student } from '../../types';
import { Entitlements } from '../../utils/entitlements';
import { PageHeader, Card, LockedState, EmptyState } from '../../components/student/primitives';
import { useCheckIns } from '../../hooks/useStudentData';

export const CheckIns: React.FC<{ student: Student; entitlements: Entitlements }> = ({ student, entitlements }) => {
  const { items, add } = useCheckIns(student.username);
  const [showForm, setShowForm] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ adherence: 5, daysRespected: 4, obstacle: '', concentration: 3, success: '', needsAdjustment: false });

  const isCheckInFeature = !!(entitlements.checkInCount || entitlements.checkInFrequencyDays);

  if (!isCheckInFeature) {
    return (
      <div>
        <PageHeader title="Mes Check-ins" />
        <LockedState title="Les Check-ins ne sont pas inclus dans votre formule" description="Les Check-ins sont disponibles avec les formules Boost et Premium." />
      </div>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    add({ id: Date.now().toString(), date: new Date().toISOString(), ...form });
    setForm({ adherence: 5, daysRespected: 4, obstacle: '', concentration: 3, success: '', needsAdjustment: false });
    setShowForm(false);
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div>
      <PageHeader
        title="Mes Check-ins"
        subtitle="Prenez quelques minutes pour faire le point sur votre progression et permettre à votre coach d'ajuster votre accompagnement."
        action={!showForm && <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] bg-primary text-white rounded-xl font-bold text-[13px]"><CheckSquare size={15} /> Faire mon Check-in</button>}
      />

      {sent && (
        <Card className="p-5 mb-5 bg-emerald-50 border-emerald-100">
          <p className="font-black text-emerald-700 text-[14px] flex items-center gap-2"><CheckCircle2 size={17} /> Check-in envoyé</p>
          <p className="text-emerald-700/80 text-[13px] font-medium mt-1">Votre progression a bien été enregistrée sur votre espace.</p>
        </Card>
      )}

      {showForm && (
        <Card className="p-6 mb-6 max-w-xl">
          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="text-[13px] font-bold text-slate-700 mb-1 block">Cette semaine, à quel point avez-vous suivi votre plan ? ({form.adherence}/10)</label>
              <input type="range" min={1} max={10} value={form.adherence} onChange={(e) => setForm({ ...form, adherence: Number(e.target.value) })} className="w-full accent-primary" />
            </div>
            <div>
              <label className="text-[13px] font-bold text-slate-700 mb-1 block">Combien de jours avez-vous respecté votre planning ? ({form.daysRespected}/7)</label>
              <input type="range" min={0} max={7} value={form.daysRespected} onChange={(e) => setForm({ ...form, daysRespected: Number(e.target.value) })} className="w-full accent-primary" />
            </div>
            <div>
              <label className="text-[13px] font-bold text-slate-700 mb-1 block">Quel a été votre principal obstacle ?</label>
              <input value={form.obstacle} onChange={(e) => setForm({ ...form, obstacle: e.target.value })} className="w-full h-11 px-3 rounded-xl border border-slate-200 text-[13.5px] font-medium outline-none focus:border-primary" />
            </div>
            <div>
              <label className="text-[13px] font-bold text-slate-700 mb-1 block">Comment évaluez-vous votre concentration ? ({form.concentration}/5)</label>
              <input type="range" min={1} max={5} value={form.concentration} onChange={(e) => setForm({ ...form, concentration: Number(e.target.value) })} className="w-full accent-primary" />
            </div>
            <div>
              <label className="text-[13px] font-bold text-slate-700 mb-1 block">Quelle est votre principale réussite ?</label>
              <textarea value={form.success} onChange={(e) => setForm({ ...form, success: e.target.value })} rows={2} className="w-full p-3 rounded-xl border border-slate-200 text-[13.5px] font-medium outline-none focus:border-primary resize-none" />
            </div>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={form.needsAdjustment} onChange={(e) => setForm({ ...form, needsAdjustment: e.target.checked })} className="w-5 h-5 rounded accent-primary" />
              <span className="text-[13px] font-bold text-slate-700">J'ai besoin d'un ajustement de mon plan</span>
            </label>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 h-12 rounded-xl border border-slate-200 font-bold text-[13px] text-slate-600">Annuler</button>
              <button type="submit" className="flex-[2] h-12 rounded-xl bg-primary text-white font-bold text-[13px]">Envoyer mon Check-in</button>
            </div>
          </form>
        </Card>
      )}

      <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3">Historique</p>
      {items.length === 0 ? (
        <Card className="p-8">
          <EmptyState icon={CheckSquare} title="Vous n'avez aucun Check-in enregistré" description="Faites le point régulièrement sur votre progression pour suivre votre évolution dans le temps." />
        </Card>
      ) : (
        <div className="space-y-2.5">
          {items.map((c, i) => (
            <Card key={c.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-black text-slate-900 text-[13.5px]">Check-in #{items.length - i}</p>
                <p className="text-slate-400 text-[12px] font-bold">{new Date(c.date).toLocaleDateString('fr-FR')}</p>
              </div>
              <span className="text-[12px] font-bold text-slate-500">Adhérence {c.adherence}/10 · {c.daysRespected}/7 jours</span>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
