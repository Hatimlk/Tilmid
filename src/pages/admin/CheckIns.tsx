import React, { useState } from 'react';
import { Search, CheckSquare, AlertTriangle, MessageSquare } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { useAdminOutletContext } from '../../components/admin/AdminLayout';
import { AdminCard, AdminPageHeader, AdminEmptyState, AdminErrorState } from '../../components/admin/primitives';

export const AdminCheckIns: React.FC = () => {
  const { checkins, refreshCheckins } = useAdminData();
  const { openFeedbackModal } = useAdminOutletContext();
  const [search, setSearch] = useState('');

  const list = checkins.data.filter((c) => c.studentName.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <AdminPageHeader
        title="Check-ins"
        breadcrumb="Administration / Mouwakaba"
        description="Check-ins récents de tous les étudiants (formules Boost & Premium)."
      />

      <AdminCard className="p-3 mb-5">
        <div className="relative">
          <Search size={16} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un étudiant..." className="w-full h-11 ps-10 pe-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary font-medium text-[13.5px]" />
        </div>
      </AdminCard>

      {checkins.error ? (
        <AdminCard><AdminErrorState onRetry={refreshCheckins} /></AdminCard>
      ) : checkins.loading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-xl bg-slate-50 animate-pulse" />)}</div>
      ) : list.length === 0 ? (
        <AdminCard><AdminEmptyState icon={CheckSquare} title="Aucun Check-in" description="Les Check-ins envoyés par les étudiants apparaîtront ici." /></AdminCard>
      ) : (
        <div className="space-y-3">
          {list.map((c) => (
            <AdminCard key={c.id} className="p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <p className="font-black text-slate-900 text-[14px]">{c.studentName}</p>
                  <p className="text-[11.5px] font-bold text-slate-400">{new Date(c.createdAt).toLocaleString('fr-FR')}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {c.needsAdjustment && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-50 text-amber-700"><AlertTriangle size={12} /> À ajuster</span>
                  )}
                  <button onClick={() => openFeedbackModal(c.studentId, c.id)} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100 text-[12.5px] font-bold">
                    <MessageSquare size={13} /> Répondre
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[12.5px] mb-2">
                <div><span className="text-slate-400 font-bold">Adhérence</span><p className="font-black text-slate-800">{c.adherence ?? '—'}/10</p></div>
                <div><span className="text-slate-400 font-bold">Jours respectés</span><p className="font-black text-slate-800">{c.daysRespected ?? '—'}</p></div>
                <div><span className="text-slate-400 font-bold">Concentration</span><p className="font-black text-slate-800">{c.concentration ?? '—'}/5</p></div>
              </div>
              {c.obstacle && <p className="text-[13px] text-slate-600"><span className="font-bold text-slate-400">Obstacle : </span>{c.obstacle}</p>}
              {c.success && <p className="text-[13px] text-slate-600 mt-1"><span className="font-bold text-slate-400">Réussite : </span>{c.success}</p>}
            </AdminCard>
          ))}
        </div>
      )}

    </div>
  );
};
