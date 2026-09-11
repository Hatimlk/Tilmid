import React, { useRef, useState } from 'react';
import { Library, Trash2, Plus, X, FileText, UploadCloud, Loader2 } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { AdminCard, AdminPageHeader, AdminEmptyState, AdminErrorState, ConfirmDialog } from '../../components/admin/primitives';
import { StudyResource } from '../../types';
import { dataManager } from '../../utils/dataManager';
import { resolveFileUrl } from '../../lib/api';

const TYPE_OPTIONS: { value: StudyResource['type']; label: string }[] = [
  { value: 'summary', label: 'Résumé' },
  { value: 'exam', label: "Sujet d'examen" },
  { value: 'formula', label: 'Fiche de formules' },
];

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
};

export const AdminLibrary: React.FC = () => {
  const { libraryResources, refreshLibraryResources } = useAdminData();
  const [formOpen, setFormOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [type, setType] = useState<StudyResource['type']>('summary');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<StudyResource | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setTitle(''); setSubject(''); setType('summary'); setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { setError('Sélectionnez un fichier PDF.'); return; }
    setUploading(true);
    setError(null);
    try {
      const uploaded = await dataManager.uploadFile(file, 'document');
      await dataManager.saveResource({
        title,
        subject,
        type,
        url: uploaded.url,
        fileSize: formatFileSize(uploaded.size),
      });
      await refreshLibraryResources();
      resetForm();
      setFormOpen(false);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Échec de l'envoi du document.");
    } finally {
      setUploading(false);
    }
  };

  const remove = async (resource: StudyResource) => {
    await dataManager.deleteResource(resource.id);
    await refreshLibraryResources();
    setConfirmDelete(null);
  };

  if (libraryResources.error) {
    return (
      <div>
        <AdminPageHeader title="Bibliothèque" breadcrumb="Administration / Contenu" />
        <AdminCard><AdminErrorState onRetry={refreshLibraryResources} /></AdminCard>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="Bibliothèque"
        breadcrumb="Administration / Contenu"
        description="Documents (PDF, guides, modèles) mis à disposition des étudiants."
        action={
          <button onClick={() => { setFormOpen((v) => !v); if (formOpen) resetForm(); }} className="inline-flex items-center gap-2 h-11 px-4 rounded-xl bg-slate-900 text-white font-bold text-[13.5px] hover:bg-primary transition-colors">
            {formOpen ? <X size={16} /> : <Plus size={16} />} {formOpen ? 'Fermer' : 'Ajouter un document'}
          </button>
        }
      />

      {formOpen && (
        <AdminCard className="p-5 mb-5">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[13px] font-bold text-slate-700 mb-1.5 block">Titre</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full h-11 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary font-medium text-[13.5px]" placeholder="Résumé — Fonctions numériques" />
            </div>
            <div>
              <label className="text-[13px] font-bold text-slate-700 mb-1.5 block">Matière</label>
              <input value={subject} onChange={(e) => setSubject(e.target.value)} required className="w-full h-11 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary font-medium text-[13.5px]" placeholder="Mathématiques" />
            </div>
            <div>
              <label className="text-[13px] font-bold text-slate-700 mb-1.5 block">Catégorie</label>
              <select value={type} onChange={(e) => setType(e.target.value as StudyResource['type'])} className="w-full h-11 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary font-bold text-[13.5px] bg-white">
                {TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[13px] font-bold text-slate-700 mb-1.5 block">Fichier PDF</label>
              <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" onChange={(e) => setFile(e.target.files?.[0] || null)} required className="w-full text-[13px] font-medium file:me-3 file:h-9 file:px-3.5 file:rounded-lg file:border-0 file:bg-slate-100 file:font-bold file:text-slate-700 hover:file:bg-slate-200" />
            </div>
            {error && <p className="md:col-span-2 text-[13px] font-bold text-rose-600">{error}</p>}
            <div className="md:col-span-2">
              <button type="submit" disabled={uploading} className="w-full h-11 rounded-xl bg-slate-900 text-white font-bold text-[13.5px] hover:bg-primary transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
                {uploading ? <><Loader2 size={16} className="animate-spin" /> Envoi en cours...</> : <><UploadCloud size={16} /> Ajouter à la bibliothèque</>}
              </button>
            </div>
          </form>
        </AdminCard>
      )}

      {libraryResources.loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{[1, 2, 3].map((i) => <div key={i} className="h-32 rounded-xl bg-slate-50 animate-pulse" />)}</div>
      ) : libraryResources.data.length === 0 ? (
        <AdminCard><AdminEmptyState icon={Library} title="Aucun document" description="Ajoutez le premier document pour qu'il apparaisse dans la Bibliothèque de l'espace étudiant." /></AdminCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {libraryResources.data.map((r) => (
            <AdminCard key={r.id} className="p-5 relative">
              <button onClick={() => setConfirmDelete(r)} className="absolute top-4 end-4 text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={16} /></button>
              <span className="w-10 h-10 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center mb-3"><FileText size={18} /></span>
              <p className="font-black text-slate-900 text-[13.5px] mb-1 pe-6">{r.title}</p>
              <p className="text-slate-400 text-[12px] font-bold mb-2">{r.subject}</p>
              <div className="flex items-center gap-3 text-[11.5px] font-bold text-slate-400">
                <span>{r.fileSize}</span>
                <a href={resolveFileUrl(r.url)} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Ouvrir</a>
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        title="Supprimer ce document ?"
        description="Il sera retiré de la Bibliothèque de l'espace étudiant."
        confirmLabel="Supprimer"
        tone="danger"
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && remove(confirmDelete)}
      />
    </div>
  );
};
