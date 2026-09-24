import React, { useCallback, useEffect, useRef, useState } from 'react';
import { PlayCircle, Link as LinkIcon, UploadCloud, Loader2, X, CheckCircle2, Trash2, Plus, Pencil } from 'lucide-react';
import { AdminCard, AdminPageHeader, AdminEmptyState, AdminErrorState, ConfirmDialog } from '../../components/admin/primitives';
import { CourseModule } from '../../types';
import { dataManager } from '../../utils/dataManager';
import { resolveFileUrl } from '../../lib/api';

type VideoTab = 'link' | 'upload';

const ModuleDetailsModal: React.FC<{ module: CourseModule | null; onClose: () => void; onSaved: () => void }> = ({ module, onClose, onSaved }) => {
  const [title, setTitle] = useState(module?.title || '');
  const [description, setDescription] = useState(module?.description || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError('Le titre est obligatoire.'); return; }
    setSaving(true);
    setError(null);
    try {
      if (module) {
        await dataManager.updateCourseModuleDetails(module.id, { title: title.trim(), description: description.trim() });
      } else {
        await dataManager.createCourseModule({ title: title.trim(), description: description.trim() });
      }
      onSaved();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Échec de l'enregistrement.");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-[20px] w-full max-w-lg shadow-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-slate-900 text-[16px]">{module ? 'Modifier le module' : 'Nouveau module'}</h3>
          <button onClick={onClose} aria-label="Fermer" className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100"><X size={16} /></button>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-[13px] font-bold text-slate-700 block mb-1.5">Titre</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex. Préparer les examens & gérer la pression"
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary font-medium text-[13.5px]"
            />
          </div>
          <div>
            <label className="text-[13px] font-bold text-slate-700 block mb-1.5">Description (optionnel)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Courte description affichée sous le titre."
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-primary font-medium text-[13.5px] resize-none"
            />
          </div>
          {error && <p className="text-[13px] font-bold text-rose-600">{error}</p>}
          <button type="submit" disabled={saving} className="w-full h-11 rounded-xl bg-slate-900 text-white font-bold text-[13.5px] hover:bg-primary transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
            {saving ? <><Loader2 size={16} className="animate-spin" /> Enregistrement...</> : <><CheckCircle2 size={16} /> Enregistrer</>}
          </button>
        </form>
      </div>
    </div>
  );
};

const VideoModal: React.FC<{ module: CourseModule; onClose: () => void; onSaved: () => void }> = ({ module, onClose, onSaved }) => {
  const [tab, setTab] = useState<VideoTab>(module.videoSource === 'upload' ? 'upload' : 'link');
  const [linkValue, setLinkValue] = useState(module.videoSource === 'link' ? module.videoUrl || '' : '');
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const save = async (videoUrl: string | null, videoSource: 'link' | 'upload' | null) => {
    setSaving(true);
    setError(null);
    try {
      await dataManager.saveCourseModuleVideo(module.id, { videoUrl, videoSource });
      onSaved();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Échec de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  const submitLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkValue.trim()) { setError('Collez un lien vidéo.'); return; }
    save(linkValue.trim(), 'link');
  };

  const submitUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { setError('Sélectionnez un fichier vidéo.'); return; }
    setSaving(true);
    setError(null);
    try {
      const uploaded = await dataManager.uploadFile(file, 'video');
      await save(uploaded.url, 'upload');
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Échec de l'envoi du fichier.");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-[20px] w-full max-w-lg shadow-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-slate-900 text-[16px]">Vidéo — {module.title}</h3>
          <button onClick={onClose} aria-label="Fermer" className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100"><X size={16} /></button>
        </div>

        <div className="flex bg-slate-100 rounded-xl p-1 mb-5">
          <button onClick={() => setTab('link')} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[12.5px] font-bold transition-colors ${tab === 'link' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}><LinkIcon size={14} /> Lien externe</button>
          <button onClick={() => setTab('upload')} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[12.5px] font-bold transition-colors ${tab === 'upload' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}><UploadCloud size={14} /> Uploader un fichier</button>
        </div>

        {tab === 'link' ? (
          <form onSubmit={submitLink} className="space-y-3">
            <label className="text-[13px] font-bold text-slate-700 block">Lien YouTube, Vimeo ou autre</label>
            <input
              value={linkValue}
              onChange={(e) => setLinkValue(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary font-medium text-[13.5px]"
              dir="ltr"
            />
            {error && <p className="text-[13px] font-bold text-rose-600">{error}</p>}
            <button type="submit" disabled={saving} className="w-full h-11 rounded-xl bg-slate-900 text-white font-bold text-[13.5px] hover:bg-primary transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
              {saving ? <><Loader2 size={16} className="animate-spin" /> Enregistrement...</> : <><CheckCircle2 size={16} /> Enregistrer le lien</>}
            </button>
          </form>
        ) : (
          <form onSubmit={submitUpload} className="space-y-3">
            <label className="text-[13px] font-bold text-slate-700 block">Fichier vidéo (MP4, WEBM, MOV)</label>
            <input ref={fileInputRef} type="file" accept=".mp4,.webm,.mov,video/mp4,video/webm,video/quicktime" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full text-[13px] font-medium file:me-3 file:h-9 file:px-3.5 file:rounded-lg file:border-0 file:bg-slate-100 file:font-bold file:text-slate-700 hover:file:bg-slate-200" />
            <p className="text-[11.5px] font-medium text-slate-400">L'envoi peut prendre plusieurs minutes selon la taille du fichier et la connexion. Ne fermez pas cette fenêtre pendant l'envoi.</p>
            {error && <p className="text-[13px] font-bold text-rose-600">{error}</p>}
            <button type="submit" disabled={saving} className="w-full h-11 rounded-xl bg-slate-900 text-white font-bold text-[13.5px] hover:bg-primary transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
              {saving ? <><Loader2 size={16} className="animate-spin" /> Envoi en cours...</> : <><UploadCloud size={16} /> Envoyer la vidéo</>}
            </button>
          </form>
        )}

        {module.videoUrl && (
          <button
            onClick={() => save(null, null)}
            disabled={saving}
            className="w-full mt-3 h-11 rounded-xl border border-rose-200 text-rose-600 font-bold text-[13.5px] hover:bg-rose-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
          >
            <Trash2 size={15} /> Retirer la vidéo actuelle
          </button>
        )}
      </div>
    </div>
  );
};

export const AdminContent: React.FC = () => {
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [editingVideo, setEditingVideo] = useState<CourseModule | null>(null);
  const [editingDetails, setEditingDetails] = useState<CourseModule | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<CourseModule | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const raw = await dataManager.getCourseModules();
      setModules(raw.map((r: any) => ({
        id: r.id, slug: r.slug, title: r.title, description: r.description,
        position: r.position, videoUrl: r.video_url, videoSource: r.video_source,
      })));
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const confirmDelete = async () => {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await dataManager.deleteCourseModule(deleting.id);
      setDeleting(null);
      await load();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteBusy(false);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Modules & vidéos"
        breadcrumb="Administration / Contenu"
        description="Créez les modules affichés dans « Mes contenus » et attachez-leur une vidéo (lien externe ou fichier)."
        action={
          <button onClick={() => setCreating(true)} className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-slate-900 text-white font-bold text-[13px] hover:bg-slate-800 transition-colors">
            <Plus size={15} /> Ajouter un module
          </button>
        }
      />

      {error ? (
        <AdminCard><AdminErrorState onRetry={load} /></AdminCard>
      ) : loading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-xl bg-slate-50 animate-pulse" />)}</div>
      ) : modules.length === 0 ? (
        <AdminCard><AdminEmptyState icon={PlayCircle} title="Aucun module" description="Ajoutez votre premier module pour commencer." cta={{ label: 'Ajouter un module', onClick: () => setCreating(true) }} /></AdminCard>
      ) : (
        <div className="space-y-3">
          {modules.map((m) => (
            <AdminCard key={m.id} className="p-5 flex items-center gap-4">
              <span className="w-11 h-11 rounded-2xl bg-blue-50 text-primary flex items-center justify-center shrink-0 font-black text-[13px]">0{m.position}</span>
              <div className="flex-1 min-w-0">
                <p className="font-black text-slate-900 text-[14.5px]">{m.title}</p>
                <p className="text-slate-400 text-[12.5px] font-medium">{m.description}</p>
              </div>
              {m.videoUrl ? (
                <a href={m.videoSource === 'upload' ? resolveFileUrl(m.videoUrl) : m.videoUrl} target="_blank" rel="noopener noreferrer" className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
                  <CheckCircle2 size={12} /> {m.videoSource === 'upload' ? 'Fichier envoyé' : 'Lien externe'}
                </a>
              ) : (
                <span className="shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-black bg-slate-100 text-slate-400">Aucune vidéo</span>
              )}
              <button onClick={() => setEditingDetails(m)} aria-label="Modifier le titre" className="shrink-0 w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50">
                <Pencil size={15} />
              </button>
              <button onClick={() => setEditingVideo(m)} className="shrink-0 h-10 px-3.5 rounded-xl border border-slate-200 font-bold text-[13px] text-slate-600 hover:bg-slate-50">
                {m.videoUrl ? 'Vidéo' : 'Ajouter vidéo'}
              </button>
              <button onClick={() => setDeleting(m)} aria-label="Supprimer le module" className="shrink-0 w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-rose-500 hover:bg-rose-50">
                <Trash2 size={15} />
              </button>
            </AdminCard>
          ))}
        </div>
      )}

      {editingVideo && <VideoModal module={editingVideo} onClose={() => setEditingVideo(null)} onSaved={load} />}
      {(creating || editingDetails) && (
        <ModuleDetailsModal
          module={editingDetails}
          onClose={() => { setCreating(false); setEditingDetails(null); }}
          onSaved={load}
        />
      )}
      <ConfirmDialog
        open={!!deleting}
        title="Supprimer ce module ?"
        description={`« ${deleting?.title} » sera définitivement supprimé et n'apparaîtra plus dans « Mes contenus ».`}
        confirmLabel={deleteBusy ? 'Suppression...' : 'Supprimer'}
        tone="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
};
