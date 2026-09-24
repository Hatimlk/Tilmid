import React, { useState } from 'react';
import { Search, Target, Edit } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { AdminCard, AdminPageHeader, AdminEmptyState, AdminErrorState } from '../../components/admin/primitives';
import { ProgressBar } from '../../components/student/primitives';
import { PlanOverviewRow } from '../../types';
import { PlanFormModal } from '../../components/admin/PlanFormModal';

export const AdminPlans: React.FC = () => {
  const { plans, refreshPlans, students } = useAdminData();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<PlanOverviewRow | null>(null);

  const list = plans.data.filter((p) => {
    const student = students.data.find((s) => Number(s.id) === p.studentId);
    return (student?.package === 'boost' || student?.package === 'premium') && (p.name.toLowerCase().includes(search.toLowerCase()) || p.username.toLowerCase().includes(search.toLowerCase()));
  });

  return (
    <div>
      <AdminPageHeader
        title="Plans d'accompagnement"
        breadcrumb="Administration / Mouwakaba"
        description="Aperçu du plan personnel (objectif, actions) de chaque étudiant actif."
      />

      <AdminCard className="p-3 mb-5">
        <div className="relative">
          <Search size={16} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un étudiant..." className="w-full h-11 ps-10 pe-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary font-medium text-[13.5px]" />
        </div>
      </AdminCard>

      {plans.error ? (
        <AdminCard><AdminErrorState /></AdminCard>
      ) : plans.loading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-20 rounded-xl bg-slate-50 animate-pulse" />)}</div>
      ) : list.length === 0 ? (
        <AdminCard><AdminEmptyState icon={Target} title="Aucun étudiant" description="Aucun étudiant actif ne correspond à cette recherche." /></AdminCard>
      ) : (
        <div className="space-y-3">
          {list.map((p) => {
            const total = p.actions.length;
            const done = p.actions.filter((a) => a.done).length;
            const hasPlan = total > 0 || !!p.objective;
            return (
              <div key={p.studentId}>
                <AdminCard className="p-4 hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)] transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-slate-900 text-[14px] truncate">{p.name}</p>
                      {hasPlan ? (
                        <p className="text-[12.5px] font-medium text-slate-400 truncate mt-0.5">{p.objective || 'Objectif non défini'}</p>
                      ) : (
                        <p className="text-[12.5px] font-bold text-slate-300 mt-0.5">Pas encore commencé</p>
                      )}
                    </div>
                    {hasPlan && total > 0 && (
                      <div className="w-40 shrink-0 hidden sm:block">
                        <ProgressBar value={(done / total) * 100} label={`${done} / ${total} actions`} />
                      </div>
                    )}
                    <button onClick={() => setSelected(p)} className="h-9 px-3 rounded-lg bg-blue-50 text-primary font-bold text-[12.5px] flex items-center gap-1.5"><Edit size={14} /> {hasPlan ? 'Modifier' : 'Créer le plan'}</button>
                  </div>
                </AdminCard>
              </div>
            );
          })}
        </div>
      )}
      <PlanFormModal open={!!selected} plan={selected} onClose={() => setSelected(null)} onSaved={refreshPlans} />
    </div>
  );
};
