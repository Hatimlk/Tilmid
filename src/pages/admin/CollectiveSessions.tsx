import React, { useState } from 'react';
import { CalendarRange, Plus, Users, Trash2, Edit, ChevronDown, ChevronUp, Check, X as XIcon } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { useAdminOutletContext } from '../../components/admin/AdminLayout';
import { AdminCard, AdminPageHeader, AdminEmptyState, AdminErrorState, ConfirmDialog } from '../../components/admin/primitives';
import { dataManager } from '../../utils/dataManager';
import { CollectiveSession, CollectiveSessionRegistration } from '../../types';

const STATUS_LABEL: Record<CollectiveSession['status'], { label: string; bg: string; text: string }> = {
  scheduled: { label: 'Programmée', bg: 'bg-blue-50', text: 'text-primary' },
  completed: { label: 'Terminée', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  cancelled: { label: 'Annulée', bg: 'bg-rose-50', text: 'text-rose-700' },
};

const Roster: React.FC<{ sessionId: number }> = ({ sessionId }) => {
  const [rows, setRows] = useState<CollectiveSessionRegistration[] | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      setRows(await dataManager.getCollectiveSessionRegistrations(sessionId));
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => { load(); }, [sessionId]);

  const toggleAttendance = async (studentId: number, attended: boolean) => {
    await dataManager.setCollectiveSessionAttendance(sessionId, studentId, attended);
    await load();
  };

  if (loading) return <div className="p-4"><div className="h-10 rounded-xl bg-slate-50 animate-pulse" /></div>;
  if (!rows || rows.length === 0) return <p className="p-4 text-[13px] font-medium text-slate-400">Aucune inscription pour le moment.</p>;

  return (
    <div className="divide-y divide-slate-50 border-t border-slate-50">
      {rows.map((r) => (
        <div key={r.id} className="flex items-center justify-between gap-3 px-4 py-2.5">
          <div className="min-w-0">
            <p className="font-bold text-slate-800 text-[13px] truncate">{r.studentName}</p>
            <p className="text-[11.5px] font-medium text-slate-400">Inscrit le {new Date(r.registeredAt).toLocaleDateString('fr-FR')}</p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button onClick={() => toggleAttendance(r.studentId, true)} title="Présent" className={`w-8 h-8 rounded-lg flex items-center justify-center ${r.attended === true ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}><Check size={14} /></button>
            <button onClick={() => toggleAttendance(r.studentId, false)} title="Absent" className={`w-8 h-8 rounded-lg flex items-center justify-center ${r.attended === false ? 'bg-rose-500 text-white' : 'bg-rose-50 text-rose-600 hover:bg-rose-100'}`}><XIcon size={14} /></button>
          </div>
        </div>
      ))}
    </div>
  );
};

export const AdminCollectiveSessions: React.FC = () => {
  const { collectiveSessions, refreshCollectiveSessions } = useAdminData();
  const { openCollectiveSessionModal } = useAdminOutletContext();
  const [expanded, setExpanded] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<CollectiveSession | null>(null);

  const remove = async (s: CollectiveSession) => {
    await dataManager.deleteCollectiveSession(s.id);
    await refreshCollectiveSessions();
    setConfirmDelete(null);
  };

  const list = [...collectiveSessions.data].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  return (
    <div>
      <AdminPageHeader
        title="Sessions collectives"
        breadcrumb="Administration / Planning"
        description="Planification des sessions collectives Mouwakaba et suivi des inscriptions/présences."
        action={
          <button onClick={() => openCollectiveSessionModal()} className="inline-flex items-center gap-2 h-11 px-4 rounded-xl bg-slate-900 text-white font-bold text-[13.5px] hover:bg-primary transition-colors">
            <Plus size={16} /> Créer une session
          </button>
        }
      />

      {collectiveSessions.error ? (
        <AdminCard><AdminErrorState onRetry={refreshCollectiveSessions} /></AdminCard>
      ) : collectiveSessions.loading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-20 rounded-xl bg-slate-50 animate-pulse" />)}</div>
      ) : list.length === 0 ? (
        <AdminCard><AdminEmptyState icon={CalendarRange} title="Aucune session collective" description="Créez une session pour que les étudiants puissent s'y inscrire." cta={{ label: 'Créer une session', onClick: () => openCollectiveSessionModal() }} /></AdminCard>
      ) : (
        <div className="space-y-3">
          {list.map((s) => {
            const isOpen = expanded === s.id;
            const st = STATUS_LABEL[s.status];
            return (
              <AdminCard key={s.id} className="overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4">
                  <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center shrink-0">
                    <span className="text-[15px] font-black text-slate-800 leading-none">{s.date?.split('-')[2]}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{new Date(s.date).toLocaleDateString('fr-FR', { month: 'short' })}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-slate-800 text-[13.5px] truncate">{s.title}</p>
                    <p className="text-[12.5px] font-medium text-slate-400">{s.time} · {s.registeredCount}{s.capacity ? ` / ${s.capacity}` : ''} inscrit{s.registeredCount > 1 ? 's' : ''}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-black ${st.bg} ${st.text}`}>{st.label}</span>
                    <button onClick={() => setExpanded(isOpen ? null : s.id)} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100 text-[12.5px] font-bold">
                      <Users size={13} /> Inscrits {isOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>
                    <button onClick={() => openCollectiveSessionModal(s)} title="Modifier" className="w-9 h-9 rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100 flex items-center justify-center"><Edit size={15} /></button>
                    <button onClick={() => setConfirmDelete(s)} title="Supprimer" className="w-9 h-9 rounded-lg bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center"><Trash2 size={15} /></button>
                  </div>
                </div>
                {isOpen && <Roster sessionId={s.id} />}
              </AdminCard>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        title="Supprimer cette session ?"
        description={`« ${confirmDelete?.title} » et toutes ses inscriptions seront définitivement supprimées.`}
        confirmLabel="Supprimer"
        tone="danger"
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && remove(confirmDelete)}
      />
    </div>
  );
};
