import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, BookOpen, Brain } from 'lucide-react';
import { AdminCard, AdminPageHeader, AdminEmptyState, AdminErrorState, ConfirmDialog } from '../../components/admin/primitives';
import { ToolOptionFormModal } from '../../components/admin/ToolOptionFormModal';
import { dataManager } from '../../utils/dataManager';
import { ToolOption } from '../../types';

const SECTIONS: { category: ToolOption['category']; title: string; icon: React.ElementType; description: string }[] = [
  { category: 'subject', title: 'Matières', icon: BookOpen, description: "Liste des matières proposées dans le suivi des révisions et le planning des étudiants." },
  { category: 'technique', title: 'Techniques de révision', icon: Brain, description: "Techniques proposées aux étudiants dans le suivi des révisions et le planning." },
];

const Section: React.FC<{
  category: ToolOption['category'];
  title: string;
  icon: React.ElementType;
  description: string;
  options: ToolOption[];
  onChanged: () => void;
}> = ({ category, title, icon: Icon, description, options, onChanged }) => {
  const [modal, setModal] = useState<{ open: boolean; option: ToolOption | null }>({ open: false, option: null });
  const [confirmDelete, setConfirmDelete] = useState<ToolOption | null>(null);

  const remove = async (o: ToolOption) => {
    await dataManager.deleteToolOption(o.id);
    onChanged();
    setConfirmDelete(null);
  };

  return (
    <AdminCard className="p-5">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-black text-slate-900 text-[15px] flex items-center gap-2"><Icon size={16} className="text-primary" /> {title}</h2>
        <button onClick={() => setModal({ open: true, option: null })} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100 text-[12.5px] font-bold">
          <Plus size={14} /> Ajouter
        </button>
      </div>
      <p className="text-[12.5px] font-medium text-slate-400 mb-4">{description}</p>

      {options.length === 0 ? (
        <AdminEmptyState icon={Icon} title="Aucune option" />
      ) : (
        <div className="flex flex-wrap gap-2">
          {options.map((o) => (
            <span key={o.id} className="group inline-flex items-center gap-2 pl-3 pr-1.5 py-1.5 rounded-full bg-slate-50 text-slate-700 text-[12.5px] font-bold">
              {o.label}
              <button onClick={() => setModal({ open: true, option: o })} title="Modifier" className="w-6 h-6 rounded-full hover:bg-white flex items-center justify-center text-slate-400 hover:text-primary"><Edit size={11} /></button>
              <button onClick={() => setConfirmDelete(o)} title="Supprimer" className="w-6 h-6 rounded-full hover:bg-white flex items-center justify-center text-slate-400 hover:text-rose-600"><Trash2 size={11} /></button>
            </span>
          ))}
        </div>
      )}

      <ToolOptionFormModal
        open={modal.open}
        category={category}
        option={modal.option}
        nextPosition={options.length + 1}
        onClose={() => setModal({ open: false, option: null })}
        onSaved={onChanged}
      />

      <ConfirmDialog
        open={!!confirmDelete}
        title="Supprimer cette option ?"
        description={`« ${confirmDelete?.label} » ne sera plus proposé aux étudiants.`}
        confirmLabel="Supprimer"
        tone="danger"
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && remove(confirmDelete)}
      />
    </AdminCard>
  );
};

export const AdminOutils: React.FC = () => {
  const [options, setOptions] = useState<ToolOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      setOptions(await dataManager.getToolOptions());
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <AdminPageHeader
        title="Outils"
        breadcrumb="Administration / Contenu"
        description="Configuration des listes utilisées dans les outils pédagogiques Mouwakaba (Mes outils, Planning)."
      />

      {error ? (
        <AdminCard><AdminErrorState onRetry={load} /></AdminCard>
      ) : loading ? (
        <div className="space-y-3">{[1, 2].map((i) => <div key={i} className="h-32 rounded-xl bg-slate-50 animate-pulse" />)}</div>
      ) : (
        <div className="space-y-5">
          {SECTIONS.map((s) => (
            <Section
              key={s.category}
              category={s.category}
              title={s.title}
              icon={s.icon}
              description={s.description}
              options={options.filter((o) => o.category === s.category).sort((a, b) => a.position - b.position)}
              onChanged={load}
            />
          ))}
        </div>
      )}
    </div>
  );
};
