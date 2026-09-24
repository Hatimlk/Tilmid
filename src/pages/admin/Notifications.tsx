import React, { useEffect, useState } from 'react';
import { Send, Bell, CheckCircle2 } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { AdminCard, AdminPageHeader, AdminEmptyState, AdminErrorState } from '../../components/admin/primitives';
import { dataManager } from '../../utils/dataManager';
import { NotificationSummary, MouwakabaPackage } from '../../types';

const PACKAGE_LABEL: Record<MouwakabaPackage, string> = { essentiel: 'Essentiel', boost: 'Boost', premium: 'Premium' };

type TargetMode = 'all' | 'package' | 'student';

export const AdminNotifications: React.FC = () => {
  const { students } = useAdminData();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetMode, setTargetMode] = useState<TargetMode>('all');
  const [targetPackage, setTargetPackage] = useState<MouwakabaPackage>('essentiel');
  const [targetStudentId, setTargetStudentId] = useState<string>('');
  const [sending, setSending] = useState(false);
  const [sentInfo, setSentInfo] = useState<string | null>(null);
  const [error, setError] = useState('');

  const [history, setHistory] = useState<NotificationSummary[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState(false);

  const loadHistory = async () => {
    setHistoryLoading(true);
    setHistoryError(false);
    try {
      setHistory(await dataManager.getAdminNotifications());
    } catch (err) {
      console.error(err);
      setHistoryError(true);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => { loadHistory(); }, []);

  const activeStudents = students.data.filter((s) => s.status === 'active');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      setError('Merci de renseigner un titre et un message.');
      return;
    }
    if (targetMode === 'student' && !targetStudentId) {
      setError('Merci de sélectionner un étudiant.');
      return;
    }
    setSending(true);
    setError('');
    setSentInfo(null);
    try {
      const target = targetMode === 'all' ? { all: true as const }
        : targetMode === 'package' ? { package: targetPackage }
        : { studentId: targetStudentId };
      const res = await dataManager.sendNotification({ title: title.trim(), message: message.trim(), target });
      setSentInfo(`Envoyé à ${res.recipients} étudiant${res.recipients > 1 ? 's' : ''}.`);
      setTitle('');
      setMessage('');
      await loadHistory();
    } catch (err) {
      console.error(err);
      setError('Une erreur est survenue lors de l\'envoi.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Notifications"
        breadcrumb="Administration / Communication"
        description="Envoi de notifications ciblées aux étudiants, visibles dans leur espace."
      />

      <AdminCard className="p-6 max-w-2xl mb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-[12.5px] font-bold text-rose-600 bg-rose-50 rounded-xl px-3 py-2.5">{error}</p>}
          {sentInfo && <p className="text-[12.5px] font-bold text-emerald-700 bg-emerald-50 rounded-xl px-3 py-2.5 flex items-center gap-1.5"><CheckCircle2 size={14} /> {sentInfo}</p>}

          <div>
            <label className="text-[13px] font-bold text-slate-700 mb-1.5 block">Titre</label>
            <input required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full h-12 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary font-medium text-[14px]" placeholder="Ex. Nouvelle session collective disponible" />
          </div>

          <div>
            <label className="text-[13px] font-bold text-slate-700 mb-1.5 block">Message</label>
            <textarea required value={message} onChange={(e) => setMessage(e.target.value)} rows={3} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-primary font-medium text-[13.5px] resize-none" />
          </div>

          <div>
            <label className="text-[13px] font-bold text-slate-700 mb-1.5 block">Destinataires</label>
            <div className="flex gap-1 bg-slate-50 rounded-lg p-1 mb-3">
              <button type="button" onClick={() => setTargetMode('all')} className={`flex-1 h-9 rounded-md text-[12.5px] font-bold transition-colors ${targetMode === 'all' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>Tous les étudiants actifs</button>
              <button type="button" onClick={() => setTargetMode('package')} className={`flex-1 h-9 rounded-md text-[12.5px] font-bold transition-colors ${targetMode === 'package' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>Par formule</button>
              <button type="button" onClick={() => setTargetMode('student')} className={`flex-1 h-9 rounded-md text-[12.5px] font-bold transition-colors ${targetMode === 'student' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>Un étudiant</button>
            </div>
            {targetMode === 'package' && (
              <select value={targetPackage} onChange={(e) => setTargetPackage(e.target.value as MouwakabaPackage)} className="w-full h-12 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary font-medium text-[14px] bg-white">
                {(['essentiel', 'boost', 'premium'] as MouwakabaPackage[]).map((p) => <option key={p} value={p}>{PACKAGE_LABEL[p]}</option>)}
              </select>
            )}
            {targetMode === 'student' && (
              <select value={targetStudentId} onChange={(e) => setTargetStudentId(e.target.value)} className="w-full h-12 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary font-medium text-[14px] bg-white">
                <option value="">Sélectionner...</option>
                {activeStudents.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            )}
          </div>

          <button type="submit" disabled={sending} className="inline-flex items-center gap-2 h-12 px-5 rounded-xl bg-slate-900 text-white font-bold text-[13.5px] hover:bg-primary transition-colors disabled:opacity-70">
            <Send size={16} /> {sending ? 'Envoi...' : 'Envoyer'}
          </button>
        </form>
      </AdminCard>

      <AdminCard className="p-5">
        <h2 className="font-black text-slate-900 text-[15px] mb-4">Historique des envois</h2>
        {historyError ? (
          <AdminErrorState onRetry={loadHistory} />
        ) : historyLoading ? (
          <div className="space-y-2">{[1, 2, 3].map((i) => <div key={i} className="h-14 rounded-xl bg-slate-50 animate-pulse" />)}</div>
        ) : history.length === 0 ? (
          <AdminEmptyState icon={Bell} title="Aucune notification envoyée" />
        ) : (
          <div className="divide-y divide-slate-50">
            {history.map((h, i) => (
              <div key={i} className="py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-black text-slate-800 text-[13.5px] truncate">{h.title}</p>
                  <span className="text-[11.5px] font-bold text-slate-400 shrink-0">{new Date(h.created_at).toLocaleString('fr-FR')}</span>
                </div>
                <p className="text-[12.5px] font-medium text-slate-500 mt-0.5 truncate">{h.message}</p>
                <p className="text-[11.5px] font-bold text-slate-400 mt-1">{h.recipient_count} destinataire{h.recipient_count > 1 ? 's' : ''} · {h.read_count} lu{h.read_count > 1 ? 's' : ''}</p>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </div>
  );
};
