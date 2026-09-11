import React, { useMemo, useState } from 'react';
import { Search, TrendingUp, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAdminData } from '../../context/AdminDataContext';
import { AdminCard, AdminPageHeader, PackageBadge, AdminEmptyState, AdminErrorState } from '../../components/admin/primitives';
import { ProgressBar } from '../../components/student/primitives';
import { ProgressOverviewRow } from '../../types';

const overallScore = (r: ProgressOverviewRow) => {
  const parts: number[] = [];
  if (r.planActionsTotal > 0) parts.push((r.planActionsDone / r.planActionsTotal) * 100);
  if (r.goalsTotal > 0) parts.push((r.goalsAtteints / r.goalsTotal) * 100);
  if (r.habitConsistencyPct !== null) parts.push(r.habitConsistencyPct);
  parts.push(Math.min(100, (r.revisionsLast7d / 7) * 100));
  return parts.length > 0 ? parts.reduce((a, b) => a + b, 0) / parts.length : 0;
};

export const AdminProgress: React.FC = () => {
  const { progressOverview } = useAdminData();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const list = useMemo(
    () => progressOverview.data
      .filter((r) => r.name.toLowerCase().includes(search.toLowerCase()))
      .map((r) => ({ ...r, score: overallScore(r) }))
      .sort((a, b) => a.score - b.score),
    [progressOverview.data, search]
  );

  return (
    <div>
      <AdminPageHeader
        title="Progression"
        breadcrumb="Administration / Mouwakaba"
        description="Vue d'ensemble de la progression de tous les étudiants actifs (plan, objectifs, habitudes, révisions)."
      />

      <AdminCard className="p-3 mb-5">
        <div className="relative">
          <Search size={16} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un étudiant..." className="w-full h-11 ps-10 pe-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary font-medium text-[13.5px]" />
        </div>
      </AdminCard>

      {progressOverview.error ? (
        <AdminCard><AdminErrorState /></AdminCard>
      ) : progressOverview.loading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-20 rounded-xl bg-slate-50 animate-pulse" />)}</div>
      ) : list.length === 0 ? (
        <AdminCard><AdminEmptyState icon={TrendingUp} title="Aucun étudiant" description="Aucun étudiant actif ne correspond à cette recherche." /></AdminCard>
      ) : (
        <div className="space-y-3">
          {list.map((r) => (
            <div key={r.studentId} onClick={() => navigate(`/admin/students/${r.studentId}`)} className="cursor-pointer">
              <AdminCard className="p-4 hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)] transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-40 shrink-0">
                    <p className="font-black text-slate-900 text-[14px] truncate">{r.name}</p>
                    <div className="mt-1"><PackageBadge pkg={r.package} /></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <ProgressBar value={r.score} label={`${Math.round(r.score)}% de progression globale`} />
                  </div>
                  <div className="hidden md:flex items-center gap-4 text-[11.5px] font-bold text-slate-400 shrink-0">
                    <span>{r.planActionsDone}/{r.planActionsTotal || 0} actions</span>
                    <span>{r.goalsAtteints}/{r.goalsTotal || 0} objectifs</span>
                    <span>{r.revisionsLast7d} révisions (7j)</span>
                  </div>
                  <ArrowRight size={16} className="text-slate-300 shrink-0" />
                </div>
              </AdminCard>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
