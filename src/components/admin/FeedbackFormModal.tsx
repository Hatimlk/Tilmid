import React, { useEffect, useState } from 'react';
import { X, MessageSquare } from 'lucide-react';
import { Student } from '../../types';
import { dataManager } from '../../utils/dataManager';

export const FeedbackFormModal: React.FC<{
  open: boolean;
  students: Student[];
  studentId?: number | string | null;
  onClose: () => void;
  onSaved: () => void;
}> = ({ open, students, studentId, onClose, onSaved }) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setSelectedStudentId(studentId ? String(studentId) : '');
      setMessage('');
      setError('');
    }
  }, [open, studentId]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !message.trim()) {
      setError("Merci de choisir un étudiant et d'écrire un message.");
      return;
    }
    setSaving(true);
    setError('');
    try {
      await dataManager.saveFeedback({ studentId: selectedStudentId, message: message.trim() });
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue lors de l'envoi.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="bg-white rounded-[22px] w-full max-w-md shadow-2xl">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-[17px] font-black text-slate-900 flex items-center gap-2">
            <MessageSquare size={18} className="text-primary" /> Envoyer un feedback
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-rose-500"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <p className="text-[12.5px] font-bold text-rose-600 bg-rose-50 rounded-xl px-3 py-2.5">{error}</p>}

          <div>
            <label className="text-[13px] font-bold text-slate-700 mb-1.5 block">Étudiant</label>
            <select required value={selectedStudentId} onChange={(e) => setSelectedStudentId(e.target.value)} className="w-full h-12 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary font-medium text-[14px] bg-white">
              <option value="">Choisir un étudiant...</option>
              {students.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.grade})</option>)}
            </select>
          </div>

          <div>
            <label className="text-[13px] font-bold text-slate-700 mb-1.5 block">Message</label>
            <textarea required value={message} onChange={(e) => setMessage(e.target.value)} rows={5} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-primary font-medium text-[13.5px] resize-none" placeholder="Beau travail cette semaine, continue comme ça sur..." />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 h-12 rounded-xl border border-slate-200 font-bold text-[13.5px] text-slate-600 hover:bg-slate-50">Annuler</button>
            <button type="submit" disabled={saving} className="flex-[2] h-12 rounded-xl bg-slate-900 text-white font-bold text-[13.5px] hover:bg-primary transition-colors disabled:opacity-70">
              {saving ? 'Envoi...' : 'Envoyer le feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
