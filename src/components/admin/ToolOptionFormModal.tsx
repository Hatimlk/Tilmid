import React, { useEffect, useState } from 'react';
import { X, Wrench, Edit } from 'lucide-react';
import { ToolOption } from '../../types';
import { dataManager } from '../../utils/dataManager';

export const ToolOptionFormModal: React.FC<{
  open: boolean;
  category: ToolOption['category'];
  option?: ToolOption | null;
  nextPosition: number;
  onClose: () => void;
  onSaved: () => void;
}> = ({ open, category, option, nextPosition, onClose, onSaved }) => {
  const [label, setLabel] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isEdit = !!option?.id;

  useEffect(() => {
    if (open) {
      setLabel(option?.label || '');
      setError('');
    }
  }, [open, option]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) {
      setError('Merci de renseigner un libellé.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await dataManager.saveToolOption({
        id: option?.id,
        category,
        label: label.trim(),
        position: option?.position ?? nextPosition,
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
      <div className="bg-white rounded-[22px] w-full max-w-sm shadow-2xl">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-[17px] font-black text-slate-900 flex items-center gap-2">
            {isEdit ? <Edit size={18} className="text-primary" /> : <Wrench size={18} className="text-primary" />}
            {isEdit ? 'Modifier' : 'Ajouter'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-rose-500"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <p className="text-[12.5px] font-bold text-rose-600 bg-rose-50 rounded-xl px-3 py-2.5">{error}</p>}
          <div>
            <label className="text-[13px] font-bold text-slate-700 mb-1.5 block">Libellé</label>
            <input required autoFocus value={label} onChange={(e) => setLabel(e.target.value)} className="w-full h-12 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary font-medium text-[14px]" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 h-12 rounded-xl border border-slate-200 font-bold text-[13.5px] text-slate-600 hover:bg-slate-50">Annuler</button>
            <button type="submit" disabled={saving} className="flex-[2] h-12 rounded-xl bg-slate-900 text-white font-bold text-[13.5px] hover:bg-primary transition-colors disabled:opacity-70">
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
