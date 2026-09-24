import React, { useEffect, useState } from 'react';
import { KeyRound, Plus, Edit, Trash2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AdminCard, AdminPageHeader, AdminEmptyState, AdminErrorState, ConfirmDialog } from '../../components/admin/primitives';
import { UserFormModal } from '../../components/admin/UserFormModal';
import { dataManager } from '../../utils/dataManager';
import { AdminUser } from '../../types';

const ROLE_LABEL: Record<AdminUser['role'], { label: string; bg: string; text: string }> = {
  admin: { label: 'Administrateur', bg: 'bg-blue-50', text: 'text-primary' },
  user: { label: 'Utilisateur', bg: 'bg-slate-100', text: 'text-slate-500' },
};

export const AdminUsers: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [modal, setModal] = useState<{ open: boolean; user: AdminUser | null }>({ open: false, user: null });
  const [confirmDelete, setConfirmDelete] = useState<AdminUser | null>(null);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      setUsers(await dataManager.getUsers());
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const adminCount = users.filter((u) => u.role === 'admin').length;

  const remove = async (u: AdminUser) => {
    await dataManager.deleteUser(u.id);
    await load();
    setConfirmDelete(null);
  };

  return (
    <div>
      <AdminPageHeader
        title="Utilisateurs & rôles"
        breadcrumb="Administration / Administration"
        description="Gestion des comptes d'équipe (administrateurs) et de leurs permissions."
        action={
          <button onClick={() => setModal({ open: true, user: null })} className="inline-flex items-center gap-2 h-11 px-4 rounded-xl bg-slate-900 text-white font-bold text-[13.5px] hover:bg-primary transition-colors">
            <Plus size={16} /> Ajouter un compte
          </button>
        }
      />

      {error ? (
        <AdminCard><AdminErrorState onRetry={load} /></AdminCard>
      ) : loading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-16 rounded-xl bg-slate-50 animate-pulse" />)}</div>
      ) : users.length === 0 ? (
        <AdminCard><AdminEmptyState icon={KeyRound} title="Aucun compte" /></AdminCard>
      ) : (
        <div className="space-y-2">
          {users.map((u) => {
            const roleTone = ROLE_LABEL[u.role];
            const isLastAdmin = u.role === 'admin' && adminCount <= 1;
            const isSelf = String(currentUser?.id) === String(u.id);
            return (
              <AdminCard key={u.id} className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-primary flex items-center justify-center text-white font-black text-[12px] shrink-0">
                    {u.username.trim().slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-slate-800 text-[13.5px] truncate">{u.username} {isSelf && <span className="text-slate-400 font-medium">(vous)</span>}</p>
                    <p className="text-[12px] font-medium text-slate-400 truncate" dir="ltr">{u.email}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black ${roleTone.bg} ${roleTone.text}`}>
                      {u.role === 'admin' && <ShieldCheck size={11} />} {roleTone.label}
                    </span>
                    <button onClick={() => setModal({ open: true, user: u })} title="Modifier" className="w-9 h-9 rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100 flex items-center justify-center"><Edit size={15} /></button>
                    <button
                      onClick={() => !isLastAdmin && setConfirmDelete(u)}
                      disabled={isLastAdmin}
                      title={isLastAdmin ? 'Impossible de supprimer le dernier administrateur' : 'Supprimer'}
                      className="w-9 h-9 rounded-lg bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center disabled:opacity-40 disabled:hover:bg-slate-50 disabled:hover:text-slate-400"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </AdminCard>
            );
          })}
        </div>
      )}

      <UserFormModal
        open={modal.open}
        user={modal.user}
        isLastAdmin={!!modal.user && modal.user.role === 'admin' && adminCount <= 1}
        onClose={() => setModal({ open: false, user: null })}
        onSaved={load}
      />

      <ConfirmDialog
        open={!!confirmDelete}
        title="Supprimer ce compte ?"
        description={`« ${confirmDelete?.username} » perdra l'accès à l'administration.`}
        confirmLabel="Supprimer"
        tone="danger"
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && remove(confirmDelete)}
      />
    </div>
  );
};
