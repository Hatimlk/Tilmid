import React, { useEffect, useState } from 'react';
import { X, Save, UserPlus, Edit, Copy, CheckCircle2 } from 'lucide-react';
import { Student, StudentStatus, MouwakabaPackage } from '../../types';
import { dataManager } from '../../utils/dataManager';

const GRADES = ['Tronc commun', '1ère Bac', '2ème Bac', 'Enseignement supérieur'];
const STATUS_OPTIONS: { value: StudentStatus; label: string }[] = [
  { value: 'pending_activation', label: "En attente d'activation" },
  { value: 'active', label: 'Actif' },
  { value: 'suspended', label: 'Suspendu' },
  { value: 'completed', label: 'Programme terminé' },
  { value: 'archived', label: 'Archivé' },
];

const emptyForm = (): Partial<Student> & { password?: string } => ({
  name: '', username: '', email: '', grade: GRADES[2], status: 'pending_activation', package: null, coachName: '',
});

export const StudentFormModal: React.FC<{
  open: boolean;
  student: Student | null;
  onClose: () => void;
  onSaved: () => void;
}> = ({ open, student, onClose, onSaved }) => {
  const [form, setForm] = useState<Partial<Student> & { password?: string }>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [created, setCreated] = useState<Student | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(student ? { ...student } : emptyForm());
      setError('');
      setCreated(null);
      setCopied(false);
    }
  }, [open, student]);

  if (!open) return null;

  const isEdit = !!student?.id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name?.trim() || !form.username?.trim()) {
      setError('Le nom et l\'identifiant sont obligatoires.');
      return;
    }
    if (!isEdit && !form.password) {
      setError('Un mot de passe initial est requis pour un nouvel étudiant.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await dataManager.saveStudent(form as Student);
      onSaved();
      if (!isEdit) {
        setCreated({ ...(form as Student) });
      } else {
        onClose();
      }
    } catch (err) {
      console.error(err);
      setError('Une erreur est survenue lors de l\'enregistrement.');
    } finally {
      setSaving(false);
    }
  };

  const copyUsername = () => {
    navigator.clipboard.writeText(created?.username || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="bg-white rounded-[22px] w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        {created ? (
          <div className="p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={26} />
            </div>
            <h3 className="text-[19px] font-black text-slate-900 mb-1">Étudiant créé</h3>
            <p className="text-slate-500 text-[13.5px] font-medium mb-6">
              Compte : <span className="font-black text-amber-600">En attente d'activation</span>
            </p>
            <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between mb-6">
              <div className="text-start">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Identifiant</p>
                <p className="font-mono font-black text-slate-800" dir="ltr">{created.username}</p>
              </div>
              <button onClick={copyUsername} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-[12.5px] font-bold text-slate-600 hover:border-primary hover:text-primary transition-colors">
                {copied ? <CheckCircle2 size={14} className="text-emerald-600" /> : <Copy size={14} />}
                {copied ? 'Copié' : 'Copier'}
              </button>
            </div>
            <button onClick={onClose} className="w-full h-12 rounded-xl bg-slate-900 text-white font-bold text-[14px] hover:bg-slate-800">Terminé</button>
          </div>
        ) : (
          <>
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-[17px] font-black text-slate-900 flex items-center gap-2">
                {isEdit ? <Edit size={18} className="text-primary" /> : <UserPlus size={18} className="text-emerald-600" />}
                {isEdit ? "Modifier l'étudiant" : 'Ajouter un étudiant'}
              </h3>
              <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-rose-500"><X size={18} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && <p className="text-[12.5px] font-bold text-rose-600 bg-rose-50 rounded-xl px-3 py-2.5">{error}</p>}

              <div>
                <label className="text-[13px] font-bold text-slate-700 mb-1.5 block">Nom complet</label>
                <input required value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full h-12 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary font-medium text-[14px]" placeholder="Sara El Amrani" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[13px] font-bold text-slate-700 mb-1.5 block">Identifiant</label>
                  <input required dir="ltr" value={form.username || ''} onChange={(e) => setForm({ ...form, username: e.target.value })} className="w-full h-12 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary font-medium text-[14px]" placeholder="sara.elamrani" />
                </div>
                <div>
                  <label className="text-[13px] font-bold text-slate-700 mb-1.5 block">E-mail</label>
                  <input type="email" dir="ltr" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full h-12 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary font-medium text-[14px]" placeholder="sara@exemple.com" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[13px] font-bold text-slate-700 mb-1.5 block">Niveau</label>
                  <select value={form.grade || GRADES[2]} onChange={(e) => setForm({ ...form, grade: e.target.value })} className="w-full h-12 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary font-medium text-[14px] bg-white">
                    {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[13px] font-bold text-slate-700 mb-1.5 block">Formule Mouwakaba</label>
                  <select value={form.package || ''} onChange={(e) => setForm({ ...form, package: (e.target.value || null) as MouwakabaPackage | null })} className="w-full h-12 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary font-medium text-[14px] bg-white">
                    <option value="">Aucune</option>
                    <option value="essentiel">Essentiel</option>
                    <option value="boost">Boost</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[13px] font-bold text-slate-700 mb-1.5 block">Statut</label>
                  <select value={form.status || 'pending_activation'} onChange={(e) => setForm({ ...form, status: e.target.value as StudentStatus })} className="w-full h-12 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary font-medium text-[14px] bg-white">
                    {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[13px] font-bold text-slate-700 mb-1.5 block">Coach</label>
                  <input value={form.coachName || ''} onChange={(e) => setForm({ ...form, coachName: e.target.value })} className="w-full h-12 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary font-medium text-[14px]" placeholder="Non affecté" />
                </div>
              </div>

              <div>
                <label className="text-[13px] font-bold text-slate-700 mb-1.5 block">
                  Mot de passe {isEdit && <span className="text-slate-400 font-medium">(laisser vide pour ne pas le modifier)</span>}
                </label>
                <input type="text" dir="ltr" value={form.password || ''} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full h-12 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary font-medium text-[14px]" placeholder={isEdit ? '••••••••' : 'Mot de passe initial'} autoComplete="new-password" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose} className="flex-1 h-12 rounded-xl border border-slate-200 font-bold text-[13.5px] text-slate-600 hover:bg-slate-50">Annuler</button>
                <button type="submit" disabled={saving} className="flex-[2] h-12 rounded-xl bg-slate-900 text-white font-bold text-[13.5px] hover:bg-primary transition-colors flex items-center justify-center gap-2 disabled:opacity-70">
                  <Save size={16} /> {saving ? 'Enregistrement...' : isEdit ? 'Enregistrer les modifications' : "Créer l'étudiant"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
