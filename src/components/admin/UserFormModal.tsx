import React, { useEffect, useState } from 'react';
import { X, UserPlus, Edit } from 'lucide-react';
import { AdminUser } from '../../types';
import { dataManager } from '../../utils/dataManager';

type FormState = Partial<AdminUser> & { password?: string };

const EMPTY_FORM: FormState = { username: '', email: '', role: 'user', password: '' };

export const UserFormModal: React.FC<{
  open: boolean;
  user?: AdminUser | null;
  isLastAdmin: boolean;
  onClose: () => void;
  onSaved: () => void;
}> = ({ open, user, isLastAdmin, onClose, onSaved }) => {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isEdit = !!user?.id;

  useEffect(() => {
    if (open) {
      setForm(user ? { ...user, password: '' } : EMPTY_FORM);
      setError('');
    }
  }, [open, user]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username?.trim() || !form.email?.trim()) {
      setError("Le nom d'utilisateur et l'e-mail sont obligatoires.");
      return;
    }
    if (!isEdit && !form.password) {
      setError('Un mot de passe initial est requis pour un nouveau compte.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await dataManager.saveUser({
        id: form.id,
        username: form.username,
        email: form.email,
        password: form.password || undefined,
        role: form.role || 'user',
      });
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      setError('Une erreur est survenue lors de l\'enregistrement.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="bg-white rounded-[22px] w-full max-w-md shadow-2xl">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-[17px] font-black text-slate-900 flex items-center gap-2">
            {isEdit ? <Edit size={18} className="text-primary" /> : <UserPlus size={18} className="text-emerald-600" />}
            {isEdit ? 'Modifier le compte' : 'Ajouter un compte'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-rose-500"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <p className="text-[12.5px] font-bold text-rose-600 bg-rose-50 rounded-xl px-3 py-2.5">{error}</p>}

          <div>
            <label className="text-[13px] font-bold text-slate-700 mb-1.5 block">Nom d'utilisateur</label>
            <input required value={form.username || ''} onChange={(e) => setForm({ ...form, username: e.target.value })} className="w-full h-12 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary font-medium text-[14px]" />
          </div>

          <div>
            <label className="text-[13px] font-bold text-slate-700 mb-1.5 block">E-mail</label>
            <input required type="email" dir="ltr" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full h-12 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary font-medium text-[14px]" />
          </div>

          <div>
            <label className="text-[13px] font-bold text-slate-700 mb-1.5 block">Rôle</label>
            <select
              value={form.role || 'user'}
              onChange={(e) => setForm({ ...form, role: e.target.value as AdminUser['role'] })}
              disabled={isEdit && isLastAdmin && form.role === 'admin'}
              className="w-full h-12 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary font-medium text-[14px] bg-white disabled:opacity-60"
            >
              <option value="user">Utilisateur</option>
              <option value="admin">Administrateur</option>
            </select>
            {isEdit && isLastAdmin && form.role === 'admin' && (
              <p className="text-[11.5px] font-bold text-amber-600 mt-1.5">Dernier administrateur — impossible de rétrograder ce compte.</p>
            )}
          </div>

          <div>
            <label className="text-[13px] font-bold text-slate-700 mb-1.5 block">
              Mot de passe {isEdit && <span className="text-slate-400 font-medium">(laisser vide pour ne pas le modifier)</span>}
            </label>
            <input type="text" dir="ltr" value={form.password || ''} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full h-12 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary font-medium text-[14px]" placeholder={isEdit ? '••••••••' : 'Mot de passe initial'} autoComplete="new-password" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 h-12 rounded-xl border border-slate-200 font-bold text-[13.5px] text-slate-600 hover:bg-slate-50">Annuler</button>
            <button type="submit" disabled={saving} className="flex-[2] h-12 rounded-xl bg-slate-900 text-white font-bold text-[13.5px] hover:bg-primary transition-colors disabled:opacity-70">
              {saving ? 'Enregistrement...' : isEdit ? 'Enregistrer' : 'Créer le compte'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
