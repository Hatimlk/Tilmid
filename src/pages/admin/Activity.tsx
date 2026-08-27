import React from 'react';
import { Activity as ActivityIcon, UserPlus, RefreshCw, Layers, CalendarPlus, CalendarClock, PlusCircle } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { AdminCard, AdminPageHeader, AdminEmptyState, AdminErrorState } from '../../components/admin/primitives';
import { MouwakabaPackage } from '../../types';

const PACKAGE_LABEL: Record<MouwakabaPackage, string> = { essentiel: 'Essentiel', boost: 'Boost', premium: 'Premium' };

const ACTION_ICON: Record<string, React.ElementType> = {
  student_created: UserPlus,
  status_changed: RefreshCw,
  package_changed: Layers,
  appointment_created: CalendarPlus,
  appointment_status_changed: CalendarClock,
};

const ACTION_LABEL: Record<string, (label: string, meta: any) => string> = {
  student_created: (label) => `${label} a été ajouté(e) comme étudiant`,
  status_changed: (label, meta) => `Statut de ${label} modifié${meta?.to ? ` → ${meta.to}` : ''}`,
  package_changed: (label, meta) => `Formule de ${label} modifiée${meta?.to ? ` → ${PACKAGE_LABEL[meta.to as MouwakabaPackage] || 'aucune'}` : ' → aucune'}`,
  appointment_created: (label, meta) => `Rendez-vous « ${label} » créé pour ${meta?.student || ''}`,
  appointment_status_changed: (label, meta) => `Rendez-vous « ${label} » : ${meta?.to || ''}`,
};

export const AdminActivity: React.FC = () => {
  const { activity, refreshActivity } = useAdminData();

  if (activity.error) {
    return (
      <div>
        <AdminPageHeader title="Activité" breadcrumb="Administration / Analyse" />
        <AdminCard><AdminErrorState onRetry={refreshActivity} /></AdminCard>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="Activité"
        breadcrumb="Administration / Analyse"
        description="Journal des actions récentes sur les étudiants et les rendez-vous."
      />

      <AdminCard className="p-2">
        {activity.loading ? (
          <div className="p-3 space-y-2">{[1, 2, 3, 4].map((i) => <div key={i} className="h-14 rounded-xl bg-slate-50 animate-pulse" />)}</div>
        ) : activity.data.length === 0 ? (
          <AdminEmptyState icon={ActivityIcon} title="Aucune activité enregistrée" description="Les créations d'étudiants, changements de formule et rendez-vous apparaîtront ici au fil de l'eau." />
        ) : (
          <div className="divide-y divide-slate-50">
            {activity.data.map((a) => {
              const Icon = ACTION_ICON[a.action] || PlusCircle;
              const labelFn = ACTION_LABEL[a.action];
              const text = labelFn ? labelFn(a.entity_label, a.meta) : `${a.entity_label} — ${a.action}`;
              return (
                <div key={a.id} className="flex items-center gap-3 p-3.5">
                  <span className="w-9 h-9 rounded-xl bg-blue-50 text-primary flex items-center justify-center shrink-0"><Icon size={15} /></span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13.5px] font-bold text-slate-700">{text}</p>
                    <p className="text-[11.5px] font-medium text-slate-400">par {a.actor_name}</p>
                  </div>
                  <span className="text-[12px] font-bold text-slate-400 shrink-0">{new Date(a.created_at).toLocaleString('fr-FR')}</span>
                </div>
              );
            })}
          </div>
        )}
      </AdminCard>
    </div>
  );
};
