import React, { useEffect, useState } from 'react';
import { X, GraduationCap, Edit } from 'lucide-react';
import { Coach } from '../../types';
import { dataManager } from '../../utils/dataManager';

type FormState = Partial<Coach>;

const EMPTY_FORM: FormState = { name: '', email: '', phone: '', specialty: '', status: 'active' };

export const CoachFormModal: React.FC<{
  open: boolean;
  coach?: Coach | null;
  onClose: () => void;
  onSaved: () => void;
}> = ({ open, coach, onClose, onSaved }) => {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isEdit = !!coach?.id;

  useEffect(() => {
    if (open) {
      setForm(coach ? { ...coach } : EMPTY_FORM);
      setError('');
    }
  }, [open, coach]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.name.trim()) {
      setError('Merci de renseigner le nom du coach.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await dataManager.saveCoach({
        id: form.id,
        name: form.name,
        email: form.email || null,
        phone: form.phone || null,
        specialty: form.specialty || null,
        status: form.status || 'active',
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
            {isEdit ? <Edit size={18} className="text-primary" /> : <GraduationCap size={18} className="text-primary" />}
            {isEdit ? 'Modifier le coach' : 'Ajouter un coach'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-rose-500"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <p className="text-[12.5px] font-bold text-rose-600 bg-rose-50 rounded-xl px-3 py-2.5">{error}</p>}

          <div>
            <label className="text-[13px] font-bold text-slate-700 mb-1.5 block">Nom</label>
            <input required value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full h-12 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary font-medium text-[14px]" placeholder="Nom complet" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[13px] font-bold text-slate-700 mb-1.5 block">Email (optionnel)</label>
              <input type="email" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full h-12 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary font-medium text-[13.5px]" dir="ltr" />
            </div>
            <div>
              <label className="text-[13px] font-bold text-slate-700 mb-1.5 block">Téléphone (optionnel)</label>
              <input value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full h-12 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary font-medium text-[13.5px]" dir="ltr" />
            </div>
          </div>

          <div>
            <label className="text-[13px] font-bold text-slate-700 mb-1.5 block">Spécialité (optionnel)</label>
            <input value={form.specialty || ''} onChange={(e) => setForm({ ...form, specialty: e.target.value })} className="w-full h-12 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary font-medium text-[13.5px]" placeholder="Ex. Méthodologie, Gestion du stress..." />
          </div>

          <div>
            <label className="text-[13px] font-bold text-slate-700 mb-1.5 block">Statut</label>
            <select value={form.status || 'active'} onChange={(e) => setForm({ ...form, status: e.target.value as Coach['status'] })} className="w-full h-12 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary font-medium text-[13.5px] bg-white">
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 h-12 rounded-xl border border-slate-200 font-bold text-[13.5px] text-slate-600 hover:bg-slate-50">Annuler</button>
            <button type="submit" disabled={saving} className="flex-[2] h-12 rounded-xl bg-slate-900 text-white font-bold text-[13.5px] hover:bg-primary transition-colors disabled:opacity-70">
              {saving ? 'Enregistrement...' : isEdit ? 'Enregistrer' : 'Ajouter le coach'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
