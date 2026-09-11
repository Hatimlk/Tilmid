import React, { useEffect, useState } from 'react';
import { X, CalendarPlus, Edit } from 'lucide-react';
import { Appointment, Student } from '../../types';
import { dataManager } from '../../utils/dataManager';

export const AppointmentFormModal: React.FC<{
  open: boolean;
  students: Student[];
  appointment?: Appointment | null;
  onClose: () => void;
  onSaved: () => void;
}> = ({ open, students, appointment, onClose, onSaved }) => {
  const [form, setForm] = useState<Partial<Appointment>>({ status: 'confirmed', type: 'live', date: '', time: '10:00', studentName: '', title: '', category: null, studentId: null, notes: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isEdit = !!appointment?.id;

  useEffect(() => {
    if (open) {
      setForm(appointment ? { ...appointment } : { status: 'confirmed', type: 'live', date: new Date().toISOString().split('T')[0], time: '10:00', studentName: '', title: '', category: null, studentId: null, notes: '' });
      setError('');
    }
  }, [open, appointment]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.studentName || !form.title || !form.date || !form.time) {
      setError('Merci de renseigner l\'étudiant, le titre, la date et l\'heure.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await dataManager.saveAppointment(form as Appointment);
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
            {isEdit ? <Edit size={18} className="text-primary" /> : <CalendarPlus size={18} className="text-primary" />}
            {isEdit ? 'Modifier le rendez-vous' : 'Planifier un rendez-vous'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-rose-500"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <p className="text-[12.5px] font-bold text-rose-600 bg-rose-50 rounded-xl px-3 py-2.5">{error}</p>}

          <div>
            <label className="text-[13px] font-bold text-slate-700 mb-1.5 block">Titre du rendez-vous</label>
            <input required value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full h-12 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary font-medium text-[14px]" placeholder="Consultation d'orientation" />
          </div>

          <div>
            <label className="text-[13px] font-bold text-slate-700 mb-1.5 block">Étudiant</label>
            <select
              required
              value={form.studentName || ''}
              onChange={(e) => {
                const s = students.find((st) => st.name === e.target.value);
                setForm({ ...form, studentName: e.target.value, studentId: s ? Number(s.id) : null });
              }}
              className="w-full h-12 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary font-medium text-[14px] bg-white"
            >
              <option value="">Choisir un étudiant...</option>
              {students.map((s) => <option key={s.id} value={s.name}>{s.name} ({s.grade})</option>)}
            </select>
          </div>

          <div>
            <label className="text-[13px] font-bold text-slate-700 mb-1.5 block">Type</label>
            <div className="flex bg-slate-100 rounded-xl p-1">
              <button type="button" onClick={() => setForm({ ...form, category: null })} className={`flex-1 h-9 rounded-lg text-[12.5px] font-bold transition-colors ${!form.category ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>Rendez-vous</button>
              <button type="button" onClick={() => setForm({ ...form, category: 'coaching' })} className={`flex-1 h-9 rounded-lg text-[12.5px] font-bold transition-colors ${form.category === 'coaching' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>Séance de coaching</button>
            </div>
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

          {form.category === 'coaching' && (
            <div>
              <label className="text-[13px] font-bold text-slate-700 mb-1.5 block">Notes (privées, visibles par l'équipe uniquement)</label>
              <textarea value={form.notes || ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-primary font-medium text-[13.5px] resize-none" placeholder="Points abordés, prochaines étapes..." />
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 h-12 rounded-xl border border-slate-200 font-bold text-[13.5px] text-slate-600 hover:bg-slate-50">Annuler</button>
            <button type="submit" disabled={saving} className="flex-[2] h-12 rounded-xl bg-slate-900 text-white font-bold text-[13.5px] hover:bg-primary transition-colors disabled:opacity-70">
              {saving ? 'Enregistrement...' : isEdit ? 'Enregistrer' : 'Confirmer le rendez-vous'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
