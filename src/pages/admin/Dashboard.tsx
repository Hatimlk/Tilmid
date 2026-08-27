import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Layers, CalendarClock, Clock, AlertCircle, UserPlus,
  Presentation, ArrowRight, Activity as ActivityIcon, PenSquare, PlusCircle,
  RefreshCw, CalendarPlus, UserCheck2,
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import {
  AdminCard, AdminPageHeader, KpiCard, AdminEmptyState, AdminErrorState,
} from '../../components/admin/primitives';
import { MouwakabaPackage } from '../../types';

const PACKAGE_LABEL: Record<MouwakabaPackage, string> = { essentiel: 'Essentiel', boost: 'Boost', premium: 'Premium' };

type DistributionView = 'niveau' | 'formule' | 'statut';

const ACTION_ICON: Record<string, React.ElementType> = {
  student_created: UserPlus,
  status_changed: RefreshCw,
  package_changed: Layers,
  appointment_created: CalendarPlus,
  appointment_status_changed: CalendarClock,
};

const ACTION_LABEL: Record<string, (label: string, meta: any) => string> = {
  student_created: (label) => `${label} a été ajouté(e)`,
  status_changed: (label, meta) => `Statut de ${label} modifié`,
  package_changed: (label, meta) => `Formule de ${label} modifiée${meta?.to ? ` → ${PACKAGE_LABEL[meta.to as MouwakabaPackage] || meta.to}` : ''}`,
  appointment_created: (label, meta) => `Rendez-vous « ${label} » créé pour ${meta?.student || ''}`,
  appointment_status_changed: (label, meta) => `Rendez-vous « ${label} » : ${meta?.to || ''}`,
};

const timeAgo = (iso: string) => {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "à l'instant";
  if (mins < 60) return `il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  return `il y a ${days} j`;
};

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { students, appointments, messages, activity } = useAdminData();
  const [distributionView, setDistributionView] = useState<DistributionView>('formule');

  const anyLoading = students.loading || appointments.loading;
  const anyError = students.error || appointments.error;

  const activeStudents = students.data.filter((s) => s.status === 'active');
  const activeCoaching = students.data.filter((s) => s.package && s.status === 'active');
  const today = new Date().toISOString().split('T')[0];
  const upcomingAppointments = appointments.data.filter((a) => a.status !== 'cancelled' && a.date >= today);
  const pendingAppointments = appointments.data.filter((a) => a.status === 'pending');
  const pendingActivation = students.data.filter((s) => s.status === 'pending_activation');
  const unreadMessages = messages.data.filter((m) => m.status === 'new');

  const attentionCount = pendingAppointments.length + pendingActivation.length + unreadMessages.length;

  const distributionData = (() => {
    if (distributionView === 'niveau') {
      const groups: Record<string, number> = {};
      students.data.forEach((s) => { groups[s.grade] = (groups[s.grade] || 0) + 1; });
      return Object.entries(groups).map(([label, count]) => ({ label, count }));
    }
    if (distributionView === 'formule') {
      const groups: Record<string, number> = { Essentiel: 0, Boost: 0, Premium: 0, Aucune: 0 };
      students.data.forEach((s) => { groups[s.package ? PACKAGE_LABEL[s.package] : 'Aucune']++; });
      return Object.entries(groups).map(([label, count]) => ({ label, count }));
    }
    const groups: Record<string, number> = {};
    students.data.forEach((s) => {
      const label = ({ active: 'Actif', pending_activation: "En attente", suspended: 'Suspendu', completed: 'Terminé', archived: 'Archivé' } as any)[s.status] || s.status;
      groups[label] = (groups[label] || 0) + 1;
    });
    return Object.entries(groups).map(([label, count]) => ({ label, count }));
  })();
  const maxCount = Math.max(1, ...distributionData.map((d) => d.count));

  const programCounts = (['essentiel', 'boost', 'premium'] as MouwakabaPackage[]).map((pkg) => ({
    pkg, label: PACKAGE_LABEL[pkg], count: students.data.filter((s) => s.package === pkg).length,
  }));

  if (anyError) {
    return (
      <div>
        <AdminPageHeader title="Tableau de bord" breadcrumb="Administration / Vue générale" />
        <AdminCard><AdminErrorState onRetry={() => window.location.reload()} /></AdminCard>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="Tableau de bord"
        breadcrumb="Administration / Vue générale"
        description="Vue d'ensemble opérationnelle de la plateforme Tilmid."
      />

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <KpiCard icon={Users} label="Étudiants actifs" value={anyLoading ? '—' : activeStudents.length} tone="blue" linkLabel="Voir les étudiants" onLinkClick={() => navigate('/admin/students')} />
        <KpiCard icon={Layers} label="Accompagnements actifs" value={anyLoading ? '—' : activeCoaching.length} tone="purple" linkLabel="Voir les formules" onLinkClick={() => navigate('/admin/packages')} />
        <KpiCard icon={CalendarClock} label="Rendez-vous à venir" value={anyLoading ? '—' : upcomingAppointments.length} tone="emerald" linkLabel="Voir le planning" onLinkClick={() => navigate('/admin/appointments')} />
        <KpiCard icon={Clock} label="Rendez-vous à confirmer" value={anyLoading ? '—' : pendingAppointments.length} tone="amber" linkLabel="Traiter" onLinkClick={() => navigate('/admin/appointments')} />
        <KpiCard icon={AlertCircle} label="Actions nécessitant attention" value={anyLoading ? '—' : attentionCount} tone={attentionCount > 0 ? 'rose' : 'slate'} />
      </div>

      {/* À traiter aujourd'hui */}
      <AdminCard className="p-5 mb-6">
        <h2 className="font-black text-slate-900 text-[16px] mb-4">À traiter aujourd'hui</h2>
        {anyLoading ? (
          <div className="space-y-2">{[1, 2].map((i) => <div key={i} className="h-14 rounded-xl bg-slate-50 animate-pulse" />)}</div>
        ) : attentionCount === 0 ? (
          <AdminEmptyState icon={UserCheck2} title="Rien à traiter pour le moment" description="Les rendez-vous en attente, activations et messages non lus apparaîtront ici." />
        ) : (
          <div className="space-y-2">
            {pendingActivation.length > 0 && (
              <button onClick={() => navigate('/admin/students')} className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50/40 transition-colors text-start">
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                <span className="flex-1 text-[13.5px] font-bold text-slate-700">{pendingActivation.length} étudiant{pendingActivation.length > 1 ? 's' : ''} en attente d'activation</span>
                <ArrowRight size={15} className="text-slate-400 shrink-0" />
              </button>
            )}
            {pendingAppointments.length > 0 && (
              <button onClick={() => navigate('/admin/appointments')} className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50/40 transition-colors text-start">
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                <span className="flex-1 text-[13.5px] font-bold text-slate-700">{pendingAppointments.length} rendez-vous en attente de confirmation</span>
                <ArrowRight size={15} className="text-slate-400 shrink-0" />
              </button>
            )}
            {unreadMessages.length > 0 && (
              <button onClick={() => navigate('/admin/messages')} className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 transition-colors text-start">
                <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                <span className="flex-1 text-[13.5px] font-bold text-slate-700">{unreadMessages.length} nouveau{unreadMessages.length > 1 ? 'x' : ''} message{unreadMessages.length > 1 ? 's' : ''} non lu{unreadMessages.length > 1 ? 's' : ''}</span>
                <ArrowRight size={15} className="text-slate-400 shrink-0" />
              </button>
            )}
          </div>
        )}
      </AdminCard>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        {/* Distribution */}
        <AdminCard className="p-5">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="font-black text-slate-900 text-[15px]">Répartition des étudiants</h2>
            <div className="flex gap-1 bg-slate-50 rounded-lg p-1">
              {(['niveau', 'formule', 'statut'] as DistributionView[]).map((v) => (
                <button key={v} onClick={() => setDistributionView(v)} className={`px-2.5 py-1.5 rounded-md text-[11.5px] font-bold capitalize transition-colors ${distributionView === v ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                  {v === 'niveau' ? 'Niveau' : v === 'formule' ? 'Formule' : 'Statut'}
                </button>
              ))}
            </div>
          </div>
          {students.data.length === 0 ? (
            <AdminEmptyState icon={Users} title="Aucun étudiant pour le moment" />
          ) : (
            <div className="space-y-3">
              {distributionData.map((d) => (
                <div key={d.label}>
                  <div className="flex justify-between text-[12.5px] font-bold text-slate-600 mb-1">
                    <span>{d.label}</span><span>{d.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${(d.count / maxCount) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminCard>

        {/* Coaching workload — not built this phase */}
        <AdminCard className="p-5 flex flex-col">
          <h2 className="font-black text-slate-900 text-[15px] mb-4">Charge coaching</h2>
          <div className="flex-1 flex items-center justify-center py-6">
            <AdminEmptyState icon={Presentation} title="Module Coaching à venir" description="La charge par coach s'affichera ici une fois le module Coaching connecté." />
          </div>
        </AdminCard>
      </div>

      {/* Programmes actifs */}
      <AdminCard className="p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-black text-slate-900 text-[15px]">Programmes Mouwakaba actifs</h2>
          <button onClick={() => navigate('/admin/packages')} className="text-[12.5px] font-bold text-primary hover:underline">Voir les formules →</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {programCounts.map((p) => (
            <div key={p.pkg} className="rounded-xl border border-slate-100 p-4">
              <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wide mb-1">{p.label}</p>
              <p className="text-[22px] font-black text-slate-900">{p.count} <span className="text-[13px] font-bold text-slate-400">étudiant{p.count > 1 ? 's' : ''}</span></p>
            </div>
          ))}
        </div>
      </AdminCard>

      {/* Recent activity */}
      <AdminCard className="p-5">
        <h2 className="font-black text-slate-900 text-[15px] mb-4 flex items-center gap-2"><ActivityIcon size={16} className="text-primary" /> Activité récente</h2>
        {activity.loading ? (
          <div className="space-y-2">{[1, 2, 3].map((i) => <div key={i} className="h-12 rounded-xl bg-slate-50 animate-pulse" />)}</div>
        ) : activity.data.length === 0 ? (
          <AdminEmptyState icon={PenSquare} title="Aucune activité récente" description="Les créations d'étudiants, changements de formule et rendez-vous apparaîtront ici." />
        ) : (
          <div className="space-y-1.5">
            {activity.data.slice(0, 8).map((a) => {
              const Icon = ACTION_ICON[a.action] || PlusCircle;
              const labelFn = ACTION_LABEL[a.action];
              const text = labelFn ? labelFn(a.entity_label, a.meta) : `${a.entity_label} — ${a.action}`;
              return (
                <div key={a.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50">
                  <span className="w-8 h-8 rounded-lg bg-blue-50 text-primary flex items-center justify-center shrink-0"><Icon size={14} /></span>
                  <span className="flex-1 min-w-0 text-[13px] font-bold text-slate-700 truncate">{text}</span>
                  <span className="text-[11.5px] font-bold text-slate-400 shrink-0">{timeAgo(a.created_at)}</span>
                </div>
              );
            })}
          </div>
        )}
      </AdminCard>
    </div>
  );
};
