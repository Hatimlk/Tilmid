import React, { useEffect, useState } from 'react';
import { Download, Users, TrendingUp, CalendarCheck2, GraduationCap, CalendarRange } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { AdminCard, AdminPageHeader, KpiCard, AdminEmptyState } from '../../components/admin/primitives';
import { dataManager } from '../../utils/dataManager';
import { exportToCsv } from '../../utils/csvExport';
import { CoachOverviewRow, MouwakabaPackage } from '../../types';

const PACKAGE_LABEL: Record<MouwakabaPackage, string> = { essentiel: 'Essentiel', boost: 'Boost', premium: 'Premium' };

// Same weighting as admin/Progress.tsx's overallScore — kept local since that
// file doesn't export it, but the underlying data (progressOverview) is reused
// as-is rather than recomputed from raw plan/goals/habits rows.
const overallScore = (r: { planActionsTotal: number; planActionsDone: number; goalsTotal: number; goalsAtteints: number; habitConsistencyPct: number | null; revisionsLast7d: number }) => {
  const parts: number[] = [];
  if (r.planActionsTotal > 0) parts.push((r.planActionsDone / r.planActionsTotal) * 100);
  if (r.goalsTotal > 0) parts.push((r.goalsAtteints / r.goalsTotal) * 100);
  if (r.habitConsistencyPct !== null) parts.push(r.habitConsistencyPct);
  parts.push(Math.min(100, (r.revisionsLast7d / 7) * 100));
  return parts.length > 0 ? parts.reduce((a, b) => a + b, 0) / parts.length : 0;
};

export const AdminReports: React.FC = () => {
  const { students, progressOverview, checkins, collectiveSessions } = useAdminData();
  const [coachesOverview, setCoachesOverview] = useState<CoachOverviewRow[] | null>(null);

  useEffect(() => {
    dataManager.getCoachesOverview().then(setCoachesOverview).catch(() => setCoachesOverview([]));
  }, []);

  const activeStudents = students.data.filter((s) => s.status === 'active');
  const packageCounts = (['essentiel', 'boost', 'premium'] as MouwakabaPackage[]).map((pkg) => ({
    pkg, label: PACKAGE_LABEL[pkg], count: activeStudents.filter((s) => s.package === pkg).length,
  }));

  const avgProgress = progressOverview.data.length > 0
    ? Math.round(progressOverview.data.reduce((sum, r) => sum + overallScore(r), 0) / progressOverview.data.length)
    : 0;

  const recentCheckins = checkins.data.slice(0, 50);
  const avgAdherence = recentCheckins.length > 0
    ? Math.round(recentCheckins.reduce((sum, c) => sum + (c.adherence || 0), 0) / recentCheckins.length)
    : null;
  const needingAdjustment = recentCheckins.filter((c) => c.needsAdjustment).length;

  const anyLoading = students.loading || progressOverview.loading || checkins.loading || collectiveSessions.loading || coachesOverview === null;

  return (
    <div>
      <AdminPageHeader
        title="Rapports"
        breadcrumb="Administration / Analyse"
        description="Vue d'ensemble agrégée : engagement, coaching et progression des étudiants."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard icon={Users} label="Étudiants actifs" value={anyLoading ? '—' : activeStudents.length} tone="blue" />
        <KpiCard icon={TrendingUp} label="Progression moyenne" value={anyLoading ? '—' : `${avgProgress}%`} tone="emerald" />
        <KpiCard icon={CalendarCheck2} label="Adhérence moyenne (check-ins)" value={anyLoading || avgAdherence === null ? '—' : `${avgAdherence}/10`} tone="purple" />
        <KpiCard icon={GraduationCap} label="Coachs actifs" value={anyLoading ? '—' : (coachesOverview || []).filter((c) => c.status === 'active').length} tone="amber" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        {/* Package distribution */}
        <AdminCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-slate-900 text-[15px]">Répartition par formule</h2>
            <button
              onClick={() => exportToCsv('repartition-formules', packageCounts.map((p) => ({ Formule: p.label, "Étudiants actifs": p.count })))}
              className="inline-flex items-center gap-1.5 text-[12px] font-bold text-slate-500 hover:text-primary"
            >
              <Download size={13} /> CSV
            </button>
          </div>
          {activeStudents.length === 0 ? (
            <AdminEmptyState icon={Users} title="Aucun étudiant actif" />
          ) : (
            <div className="space-y-3">
              {packageCounts.map((p) => {
                const max = Math.max(1, ...packageCounts.map((x) => x.count));
                return (
                  <div key={p.pkg}>
                    <div className="flex justify-between text-[12.5px] font-bold text-slate-600 mb-1"><span>{p.label}</span><span>{p.count}</span></div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden"><div className="h-full rounded-full bg-primary" style={{ width: `${(p.count / max) * 100}%` }} /></div>
                  </div>
                );
              })}
            </div>
          )}
        </AdminCard>

        {/* Coach workload */}
        <AdminCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-slate-900 text-[15px]">Charge par coach</h2>
            <button
              onClick={() => exportToCsv('charge-coachs', (coachesOverview || []).map((c) => ({ Coach: c.name, Étudiants: c.studentCount, "Séances (30j)": c.sessionsLast30d })))}
              className="inline-flex items-center gap-1.5 text-[12px] font-bold text-slate-500 hover:text-primary"
            >
              <Download size={13} /> CSV
            </button>
          </div>
          {!coachesOverview || coachesOverview.length === 0 ? (
            <AdminEmptyState icon={GraduationCap} title="Aucun coach" />
          ) : (
            <div className="divide-y divide-slate-50">
              {coachesOverview.map((c) => (
                <div key={c.coachId} className="flex items-center justify-between py-2.5">
                  <span className="font-bold text-slate-700 text-[13px] truncate">{c.name}</span>
                  <span className="text-[12px] font-bold text-slate-400 shrink-0">{c.studentCount} étudiant{c.studentCount > 1 ? 's' : ''} · {c.sessionsLast30d} séance{c.sessionsLast30d > 1 ? 's' : ''}/30j</span>
                </div>
              ))}
            </div>
          )}
        </AdminCard>
      </div>

      {/* Collective session fill rate */}
      <AdminCard className="p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-black text-slate-900 text-[15px] flex items-center gap-2"><CalendarRange size={16} className="text-primary" /> Taux de remplissage — sessions collectives</h2>
          <button
            onClick={() => exportToCsv('sessions-collectives', collectiveSessions.data.map((s) => ({ Session: s.title, Date: s.date, Inscrits: s.registeredCount, Capacité: s.capacity ?? 'Illimitée' })))}
            className="inline-flex items-center gap-1.5 text-[12px] font-bold text-slate-500 hover:text-primary"
          >
            <Download size={13} /> CSV
          </button>
        </div>
        {collectiveSessions.data.length === 0 ? (
          <AdminEmptyState icon={CalendarRange} title="Aucune session collective" />
        ) : (
          <div className="divide-y divide-slate-50">
            {collectiveSessions.data.map((s) => {
              const pct = s.capacity ? Math.min(100, Math.round((s.registeredCount / s.capacity) * 100)) : null;
              return (
                <div key={s.id} className="flex items-center justify-between py-2.5 gap-3">
                  <span className="font-bold text-slate-700 text-[13px] truncate flex-1">{s.title} <span className="text-slate-400 font-medium">— {new Date(s.date).toLocaleDateString('fr-FR')}</span></span>
                  <span className="text-[12px] font-bold text-slate-400 shrink-0">{s.registeredCount}{s.capacity ? ` / ${s.capacity}` : ''} {pct !== null && `(${pct}%)`}</span>
                </div>
              );
            })}
          </div>
        )}
      </AdminCard>

      {/* Check-ins snapshot */}
      <AdminCard className="p-5">
        <h2 className="font-black text-slate-900 text-[15px] mb-4">Check-ins récents</h2>
        {recentCheckins.length === 0 ? (
          <AdminEmptyState icon={CalendarCheck2} title="Aucun check-in récent" />
        ) : (
          <p className="text-[13.5px] font-medium text-slate-600">
            Sur les {recentCheckins.length} derniers check-ins : adhérence moyenne de <span className="font-black text-slate-900">{avgAdherence}/10</span>,
            {' '}<span className="font-black text-amber-600">{needingAdjustment}</span> signalé{needingAdjustment > 1 ? 's' : ''} comme nécessitant un ajustement.
          </p>
        )}
      </AdminCard>
    </div>
  );
};
