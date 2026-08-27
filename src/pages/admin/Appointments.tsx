import React, { useState } from 'react';
import {
  CalendarPlus, Check, X as XIcon, CheckCircle2, Trash2, Edit, CalendarClock,
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { useAdminOutletContext } from '../../components/admin/AdminLayout';
import {
  AdminCard, AdminPageHeader, AppointmentStatusBadge, AdminEmptyState, AdminErrorState, ConfirmDialog,
} from '../../components/admin/primitives';
import { Appointment } from '../../types';
import { dataManager } from '../../utils/dataManager';

type View = 'upcoming' | 'pending' | 'today' | 'history';

const VIEWS: { id: View; label: string }[] = [
  { id: 'upcoming', label: 'À venir' },
  { id: 'pending', label: 'À confirmer' },
  { id: 'today', label: "Aujourd'hui" },
  { id: 'history', label: 'Historique' },
];

export const AdminAppointments: React.FC = () => {
  const { appointments, refreshAppointments } = useAdminData();
  const { openAppointmentModal } = useAdminOutletContext();
  const [view, setView] = useState<View>('upcoming');
  const [confirmDelete, setConfirmDelete] = useState<Appointment | null>(null);

  const today = new Date().toISOString().split('T')[0];

  const setStatus = async (a: Appointment, status: Appointment['status']) => {
    await dataManager.updateAppointmentStatus(a.id, status);
    await refreshAppointments();
  };

  const remove = async (a: Appointment) => {
    await dataManager.deleteAppointment(a.id);
    await refreshAppointments();
    setConfirmDelete(null);
  };

  const list = appointments.data.filter((a) => {
    if (view === 'pending') return a.status === 'pending';
    if (view === 'today') return a.date === today && a.status !== 'cancelled';
    if (view === 'history') return a.date < today || a.status === 'completed' || a.status === 'cancelled';
    return a.date >= today && a.status !== 'cancelled';
  }).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  if (appointments.error) {
    return (
      <div>
        <AdminPageHeader title="Rendez-vous" breadcrumb="Administration / Planning" />
        <AdminCard><AdminErrorState onRetry={refreshAppointments} /></AdminCard>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="Rendez-vous"
        breadcrumb="Administration / Planning"
        description="Suivi et organisation des rendez-vous Tilmid."
        action={
          <button onClick={() => openAppointmentModal(null)} className="inline-flex items-center gap-2 h-11 px-4 rounded-xl bg-slate-900 text-white font-bold text-[13.5px] hover:bg-primary transition-colors">
            <CalendarPlus size={16} /> Créer un rendez-vous
          </button>
        }
      />

      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-5 w-fit">
        {VIEWS.map((v) => (
          <button key={v.id} onClick={() => setView(v.id)} className={`px-3.5 py-2 rounded-lg text-[12.5px] font-bold transition-colors ${view === v.id ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {v.label}
          </button>
        ))}
      </div>

      <AdminCard className="overflow-hidden">
        {appointments.loading ? (
          <div className="p-4 space-y-2">{[1, 2, 3].map((i) => <div key={i} className="h-16 rounded-xl bg-slate-50 animate-pulse" />)}</div>
        ) : list.length === 0 ? (
          <AdminEmptyState icon={CalendarClock} title="Aucun rendez-vous" description="Les rendez-vous correspondant à cette vue apparaîtront ici." cta={{ label: 'Créer un rendez-vous', onClick: () => openAppointmentModal(null) }} />
        ) : (
          <div className="divide-y divide-slate-50">
            {list.map((a) => (
              <div key={a.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 hover:bg-slate-50/60">
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
                  {a.status === 'pending' && (
                    <>
                      <button onClick={() => setStatus(a, 'confirmed')} title="Confirmer" className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center"><Check size={15} /></button>
                      <button onClick={() => setStatus(a, 'cancelled')} title="Annuler" className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center"><XIcon size={15} /></button>
                    </>
                  )}
                  {a.status === 'confirmed' && (
                    <button onClick={() => setStatus(a, 'completed')} title="Marquer terminé" className="w-9 h-9 rounded-lg bg-blue-50 text-primary hover:bg-blue-100 flex items-center justify-center"><CheckCircle2 size={15} /></button>
                  )}
                  <button onClick={() => openAppointmentModal(a)} title="Reprogrammer" className="w-9 h-9 rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100 flex items-center justify-center"><Edit size={15} /></button>
                  <button onClick={() => setConfirmDelete(a)} title="Supprimer" className="w-9 h-9 rounded-lg bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center"><Trash2 size={15} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminCard>

      <ConfirmDialog
        open={!!confirmDelete}
        title="Supprimer ce rendez-vous ?"
        description={`« ${confirmDelete?.title} » sera définitivement retiré du planning.`}
        confirmLabel="Supprimer"
        tone="danger"
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && remove(confirmDelete)}
      />
    </div>
  );
};
