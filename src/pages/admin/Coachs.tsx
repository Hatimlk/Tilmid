import React, { useState } from 'react';
import { GraduationCap, Plus, Edit, Trash2, Mail, Phone, Users } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { AdminCard, AdminPageHeader, AdminEmptyState, AdminErrorState, ConfirmDialog } from '../../components/admin/primitives';
import { CoachFormModal } from '../../components/admin/CoachFormModal';
import { dataManager } from '../../utils/dataManager';
import { Coach } from '../../types';

const STATUS_LABEL: Record<Coach['status'], { label: string; bg: string; text: string }> = {
  active: { label: 'Actif', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  inactive: { label: 'Inactif', bg: 'bg-slate-100', text: 'text-slate-500' },
};

export const AdminCoachs: React.FC = () => {
  const { coaches, refreshCoaches } = useAdminData();
  const [modal, setModal] = useState<{ open: boolean; coach: Coach | null }>({ open: false, coach: null });
  const [confirmDelete, setConfirmDelete] = useState<Coach | null>(null);

  const remove = async (c: Coach) => {
    await dataManager.deleteCoach(c.id);
    await refreshCoaches();
    setConfirmDelete(null);
  };

  const list = [...coaches.data].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div>
      <AdminPageHeader
        title="Coachs"
        breadcrumb="Administration / Administration"
        description="Gestion de l'équipe de coachs Mouwakaba et de leurs étudiants assignés."
        action={
          <button onClick={() => setModal({ open: true, coach: null })} className="inline-flex items-center gap-2 h-11 px-4 rounded-xl bg-slate-900 text-white font-bold text-[13.5px] hover:bg-primary transition-colors">
            <Plus size={16} /> Ajouter un coach
          </button>
        }
      />

      {coaches.error ? (
        <AdminCard><AdminErrorState onRetry={refreshCoaches} /></AdminCard>
      ) : coaches.loading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-20 rounded-xl bg-slate-50 animate-pulse" />)}</div>
      ) : list.length === 0 ? (
        <AdminCard><AdminEmptyState icon={GraduationCap} title="Aucun coach pour le moment" description="Ajoutez un coach pour pouvoir l'assigner à des étudiants." cta={{ label: 'Ajouter un coach', onClick: () => setModal({ open: true, coach: null }) }} /></AdminCard>
      ) : (
        <div className="space-y-3">
          {list.map((c) => {
            const st = STATUS_LABEL[c.status];
            return (
              <AdminCard key={c.id} className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-primary flex items-center justify-center text-white font-black text-[13px] shrink-0">
                    {c.name.trim().slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-slate-800 text-[13.5px] truncate">{c.name}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5 text-[12px] font-medium text-slate-400">
                      {c.specialty && <span>{c.specialty}</span>}
                      {c.email && <span className="inline-flex items-center gap-1"><Mail size={11} /> {c.email}</span>}
                      {c.phone && <span className="inline-flex items-center gap-1" dir="ltr"><Phone size={11} /> {c.phone}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-blue-50 text-primary"><Users size={12} /> {c.studentCount} étudiant{c.studentCount > 1 ? 's' : ''}</span>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-black ${st.bg} ${st.text}`}>{st.label}</span>
                    <button onClick={() => setModal({ open: true, coach: c })} title="Modifier" className="w-9 h-9 rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100 flex items-center justify-center"><Edit size={15} /></button>
                    <button onClick={() => setConfirmDelete(c)} title="Supprimer" className="w-9 h-9 rounded-lg bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center"><Trash2 size={15} /></button>
                  </div>
                </div>
              </AdminCard>
            );
          })}
        </div>
      )}

      <CoachFormModal
        open={modal.open}
        coach={modal.coach}
        onClose={() => setModal({ open: false, coach: null })}
        onSaved={refreshCoaches}
      />

      <ConfirmDialog
        open={!!confirmDelete}
        title="Supprimer ce coach ?"
        description={`« ${confirmDelete?.name} » sera retiré. Les étudiants qui lui sont assignés deviendront non assignés.`}
        confirmLabel="Supprimer"
        tone="danger"
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && remove(confirmDelete)}
      />
    </div>
  );
};
