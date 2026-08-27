import React, { useState } from 'react';
import { Star, Trash2, Plus, X } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { AdminCard, AdminPageHeader, AdminEmptyState, AdminErrorState, ConfirmDialog } from '../../components/admin/primitives';
import { SuccessStory } from '../../types';
import { dataManager } from '../../utils/dataManager';

export const AdminStories: React.FC = () => {
  const { stories, refreshStories } = useAdminData();
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<SuccessStory | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const newStory: SuccessStory = {
      id: Date.now(),
      name: data.get('name') as string,
      role: data.get('role') as string,
      content: data.get('content') as string,
      image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.get('name')}`,
    };
    setSaving(true);
    try {
      await dataManager.saveStory(newStory);
      await refreshStories();
      form.reset();
      setFormOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (story: SuccessStory) => {
    await dataManager.deleteStory(story.id);
    await refreshStories();
    setConfirmDelete(null);
  };

  if (stories.error) {
    return (
      <div>
        <AdminPageHeader title="Témoignages" breadcrumb="Administration / Publication" />
        <AdminCard><AdminErrorState onRetry={refreshStories} /></AdminCard>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="Témoignages"
        breadcrumb="Administration / Publication"
        description="Histoires de réussite affichées sur le site public."
        action={
          <button onClick={() => setFormOpen((v) => !v)} className="inline-flex items-center gap-2 h-11 px-4 rounded-xl bg-slate-900 text-white font-bold text-[13.5px] hover:bg-primary transition-colors">
            {formOpen ? <X size={16} /> : <Plus size={16} />} {formOpen ? 'Fermer' : 'Ajouter un témoignage'}
          </button>
        }
      />

      {formOpen && (
        <AdminCard className="p-5 mb-5">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[13px] font-bold text-slate-700 mb-1.5 block">Nom de l'étudiant</label>
              <input name="name" required className="w-full h-11 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary font-medium text-[13.5px]" placeholder="Ahmed..." />
            </div>
            <div>
              <label className="text-[13px] font-bold text-slate-700 mb-1.5 block">Niveau / statut</label>
              <input name="role" required className="w-full h-11 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary font-medium text-[13.5px]" placeholder="Étudiant en ingénierie..." />
            </div>
            <div className="md:col-span-2">
              <label className="text-[13px] font-bold text-slate-700 mb-1.5 block">Témoignage</label>
              <textarea name="content" required rows={3} className="w-full p-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary font-medium text-[13.5px] resize-none" placeholder="Écrire le témoignage ici..." />
            </div>
            <div className="md:col-span-2">
              <button type="submit" disabled={saving} className="w-full h-11 rounded-xl bg-slate-900 text-white font-bold text-[13.5px] hover:bg-primary transition-colors disabled:opacity-70">
                {saving ? 'Publication...' : 'Publier le témoignage'}
              </button>
            </div>
          </form>
        </AdminCard>
      )}

      {stories.loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{[1, 2].map((i) => <div key={i} className="h-40 rounded-xl bg-slate-50 animate-pulse" />)}</div>
      ) : stories.data.length === 0 ? (
        <AdminCard><AdminEmptyState icon={Star} title="Aucun témoignage publié" description="Ajoutez le premier témoignage pour qu'il apparaisse sur le site." /></AdminCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stories.data.map((story) => (
            <AdminCard key={story.id} className="p-5 relative">
              <button onClick={() => setConfirmDelete(story)} className="absolute top-4 end-4 text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={16} /></button>
              <div className="flex items-center gap-3 mb-3">
                <img src={story.image} alt={story.name} className="w-11 h-11 rounded-full bg-slate-100" />
                <div>
                  <p className="font-black text-slate-900 text-[14px]">{story.name}</p>
                  <span className="text-primary text-[11px] font-bold bg-blue-50 px-2 py-0.5 rounded-full">{story.role}</span>
                </div>
              </div>
              <p className="text-slate-600 font-medium text-[13.5px] leading-relaxed">"{story.content}"</p>
            </AdminCard>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        title="Supprimer ce témoignage ?"
        description="Il sera définitivement retiré du site public."
        confirmLabel="Supprimer"
        tone="danger"
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && remove(confirmDelete)}
      />
    </div>
  );
};
