import React, { useEffect, useState } from 'react';
import { X, CalendarRange, Edit } from 'lucide-react';
import { CollectiveSession } from '../../types';
import { dataManager } from '../../utils/dataManager';

type FormState = Partial<CollectiveSession>;

const EMPTY_FORM: FormState = { title: '', description: '', date: '', time: '18:00', capacity: null, meetingLink: '', status: 'scheduled' };

export const CollectiveSessionFormModal: React.FC<{
  open: boolean;
  session?: CollectiveSession | null;
  onClose: () => void;
  onSaved: () => void;
}> = ({ open, session, onClose, onSaved }) => {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isEdit = !!session?.id;

  useEffect(() => {
    if (open) {
      setForm(session ? { ...session } : { ...EMPTY_FORM, date: new Date().toISOString().split('T')[0] });
      setError('');
    }
  }, [open, session]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.date || !form.time) {
      setError('Merci de renseigner le titre, la date et l\'heure.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await dataManager.saveCollectiveSession({
        id: form.id,
        title: form.title,
        description: form.description || null,
        date: form.date,
        time: form.time,
        capacity: form.capacity ? Number(form.capacity) : null,
        meetingLink: form.meetingLink || null,
        status: form.status || 'scheduled',
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
            {isEdit ? <Edit size={18} className="text-primary" /> : <CalendarRange size={18} className="text-primary" />}
            {isEdit ? 'Modifier la session' : 'Créer une session collective'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-rose-500"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <p className="text-[12.5px] font-bold text-rose-600 bg-rose-50 rounded-xl px-3 py-2.5">{error}</p>}

          <div>
            <label className="text-[13px] font-bold text-slate-700 mb-1.5 block">Titre</label>
            <input required value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full h-12 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary font-medium text-[14px]" placeholder="Atelier gestion du temps" />
          </div>

          <div>
            <label className="text-[13px] font-bold text-slate-700 mb-1.5 block">Description (optionnel)</label>
            <textarea value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-primary font-medium text-[13.5px] resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[13px] font-bold text-slate-700 mb-1.5 block">Date</label>
              <input required type="date" value={form.date || ''} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full h-12 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary font-medium text-[13.5px]" />
            </div>
            <div>
              <label className="text-[13px] font-bold text-slate-700 mb-1.5 block">Heure</label>
              <input required type="time" value={form.time || ''} onChange={(e) => setForm({ ...form, time: e.target.value })} className="w-full h-12 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary font-medium text-[13.5px]" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[13px] font-bold text-slate-700 mb-1.5 block">Capacité (optionnel)</label>
              <input type="number" min={1} value={form.capacity ?? ''} onChange={(e) => setForm({ ...form, capacity: e.target.value ? Number(e.target.value) : null })} className="w-full h-12 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary font-medium text-[13.5px]" placeholder="Illimitée" />
            </div>
            <div>
              <label className="text-[13px] font-bold text-slate-700 mb-1.5 block">Statut</label>
              <select value={form.status || 'scheduled'} onChange={(e) => setForm({ ...form, status: e.target.value as CollectiveSession['status'] })} className="w-full h-12 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary font-medium text-[13.5px] bg-white">
                <option value="scheduled">Programmée</option>
                <option value="completed">Terminée</option>
                <option value="cancelled">Annulée</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[13px] font-bold text-slate-700 mb-1.5 block">Lien de visio (optionnel)</label>
            <input value={form.meetingLink || ''} onChange={(e) => setForm({ ...form, meetingLink: e.target.value })} className="w-full h-12 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary font-medium text-[13.5px]" placeholder="https://meet.google.com/..." dir="ltr" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 h-12 rounded-xl border border-slate-200 font-bold text-[13.5px] text-slate-600 hover:bg-slate-50">Annuler</button>
            <button type="submit" disabled={saving} className="flex-[2] h-12 rounded-xl bg-slate-900 text-white font-bold text-[13.5px] hover:bg-primary transition-colors disabled:opacity-70">
              {saving ? 'Enregistrement...' : isEdit ? 'Enregistrer' : 'Créer la session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
