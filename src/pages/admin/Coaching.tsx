import React, { useState } from 'react';
import { CalendarPlus, Presentation, FileText } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { useAdminOutletContext } from '../../components/admin/AdminLayout';
import { AdminCard, AdminPageHeader, AppointmentStatusBadge, AdminEmptyState, AdminErrorState } from '../../components/admin/primitives';
import { dataManager } from '../../utils/dataManager';

type View = 'upcoming' | 'history';

export const AdminCoaching: React.FC = () => {
  const { coachingSessions, refreshCoachingSessions, refreshAppointments } = useAdminData();
  const { openAppointmentModal } = useAdminOutletContext();
  const [view, setView] = useState<View>('upcoming');
  const [notesFor, setNotesFor] = useState<number | null>(null);
  const [notesDraft, setNotesDraft] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const list = coachingSessions.data
    .filter((a) => (view === 'history' ? a.date < today || a.status === 'completed' || a.status === 'cancelled' : a.date >= today && a.status !== 'cancelled'))
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  const saveNotes = async (id: number) => {
    await dataManager.saveAppointment({ id, notes: notesDraft } as any);
    await refreshCoachingSessions();
    await refreshAppointments();
    setNotesFor(null);
  };

  if (coachingSessions.error) {
    return (
      <div>
        <AdminPageHeader title="Coaching" breadcrumb="Administration / Mouwakaba" />
        <AdminCard><AdminErrorState onRetry={refreshCoachingSessions} /></AdminCard>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="Coaching"
        breadcrumb="Administration / Mouwakaba"
        description="Séances de coaching individuel : planification, statut et notes de séance."
        action={
          <button onClick={() => openAppointmentModal({ category: 'coaching' } as any)} className="inline-flex items-center gap-2 h-11 px-4 rounded-xl bg-slate-900 text-white font-bold text-[13.5px] hover:bg-primary transition-colors">
            <CalendarPlus size={16} /> Planifier une séance
          </button>
        }
      />

      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-5 w-fit">
        <button onClick={() => setView('upcoming')} className={`px-3.5 py-2 rounded-lg text-[12.5px] font-bold transition-colors ${view === 'upcoming' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>À venir</button>
        <button onClick={() => setView('history')} className={`px-3.5 py-2 rounded-lg text-[12.5px] font-bold transition-colors ${view === 'history' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Historique</button>
      </div>

      <AdminCard className="overflow-hidden">
        {coachingSessions.loading ? (
          <div className="p-4 space-y-2">{[1, 2, 3].map((i) => <div key={i} className="h-16 rounded-xl bg-slate-50 animate-pulse" />)}</div>
        ) : list.length === 0 ? (
          <AdminEmptyState icon={Presentation} title="Aucune séance de coaching" description="Les séances individuelles planifiées apparaîtront ici." cta={{ label: 'Planifier une séance', onClick: () => openAppointmentModal({ category: 'coaching' } as any) }} />
        ) : (
          <div className="divide-y divide-slate-50">
            {list.map((a) => (
              <div key={a.id} className="p-4 hover:bg-slate-50/60">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center shrink-0">
                    <span className="text-[15px] font-black text-slate-800 leading-none">{a.date?.split('-')[2]}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{new Date(a.date).toLocaleDateString('fr-FR', { month: 'short' })}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-slate-800 text-[13.5px] truncate">{a.title}</p>
                    <p className="text-[12.5px] font-medium text-slate-400">{a.studentName} · {a.time}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <AppointmentStatusBadge status={a.status} />
                    <button onClick={() => { setNotesFor(notesFor === a.id ? null : a.id); setNotesDraft(a.notes || ''); }} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100 text-[12.5px] font-bold">
                      <FileText size={13} /> Notes
                    </button>
                    <button onClick={() => openAppointmentModal(a)} className="h-9 px-3 rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100 text-[12.5px] font-bold">Modifier</button>
                  </div>
                </div>
                {notesFor === a.id && (
                  <div className="mt-3 ps-0 sm:ps-[68px]">
                    <textarea value={notesDraft} onChange={(e) => setNotesDraft(e.target.value)} rows={3} className="w-full max-w-xl px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-primary font-medium text-[13px] resize-none" placeholder="Points abordés, prochaines étapes..." />
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => saveNotes(a.id)} className="h-9 px-3.5 rounded-lg bg-slate-900 text-white text-[12.5px] font-bold hover:bg-primary">Enregistrer</button>
                      <button onClick={() => setNotesFor(null)} className="h-9 px-3.5 rounded-lg border border-slate-200 text-slate-600 text-[12.5px] font-bold hover:bg-slate-50">Annuler</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </div>
  );
};
