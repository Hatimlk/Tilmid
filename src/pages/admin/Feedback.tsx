import React, { useState } from 'react';
import { Search, MessageSquare, Send } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { useAdminOutletContext } from '../../components/admin/AdminLayout';
import { AdminCard, AdminPageHeader, AdminEmptyState, AdminErrorState } from '../../components/admin/primitives';

export const AdminFeedback: React.FC = () => {
  const { feedback, refreshFeedback } = useAdminData();
  const { openFeedbackModal } = useAdminOutletContext();
  const [search, setSearch] = useState('');

  const list = feedback.data.filter((f) => (f.studentName || '').toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <AdminPageHeader
        title="Feedback"
        breadcrumb="Administration / Mouwakaba"
        description="Feedback personnel envoyé aux étudiants (formules Boost & Premium)."
        action={
          <button onClick={() => openFeedbackModal()} className="inline-flex items-center gap-2 h-11 px-4 rounded-xl bg-slate-900 text-white font-bold text-[13.5px] hover:bg-primary transition-colors">
            <Send size={16} /> Envoyer un feedback
          </button>
        }
      />

      <AdminCard className="p-3 mb-5">
        <div className="relative">
          <Search size={16} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un étudiant..." className="w-full h-11 ps-10 pe-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary font-medium text-[13.5px]" />
        </div>
      </AdminCard>

      {feedback.error ? (
        <AdminCard><AdminErrorState onRetry={refreshFeedback} /></AdminCard>
      ) : feedback.loading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-20 rounded-xl bg-slate-50 animate-pulse" />)}</div>
      ) : list.length === 0 ? (
        <AdminCard><AdminEmptyState icon={MessageSquare} title="Aucun feedback envoyé" description="L'historique du feedback envoyé aux étudiants apparaîtra ici." cta={{ label: 'Envoyer un feedback', onClick: () => openFeedbackModal() }} /></AdminCard>
      ) : (
        <div className="space-y-3">
          {list.map((f) => (
            <AdminCard key={f.id} className="p-4">
              <div className="flex items-center justify-between gap-3 mb-1.5">
                <p className="font-black text-slate-900 text-[14px]">{f.studentName}</p>
                <p className="text-[11.5px] font-bold text-slate-400">{new Date(f.createdAt).toLocaleString('fr-FR')}</p>
              </div>
              <p className="text-[13.5px] text-slate-600 leading-relaxed">{f.message}</p>
              {f.authorName && <p className="text-[11.5px] font-bold text-slate-300 mt-2">— {f.authorName}</p>}
            </AdminCard>
          ))}
        </div>
      )}
    </div>
  );
};
