import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { AdminCard, AdminPageHeader } from '../../components/admin/primitives';
import { getEntitlements, PACKAGE_TONE } from '../../utils/entitlements';
import { MouwakabaPackage } from '../../types';

const PACKAGES: { pkg: MouwakabaPackage; price: string }[] = [
  { pkg: 'essentiel', price: '299 DH' },
  { pkg: 'boost', price: '599 DH' },
  { pkg: 'premium', price: '999 DH' },
];

export const AdminPackages: React.FC = () => {
  const navigate = useNavigate();
  const { students } = useAdminData();

  return (
    <div>
      <AdminPageHeader
        title="Formules & accès"
        breadcrumb="Administration / Étudiants"
        description="Référence des trois formules Mouwakaba et des accès qu'elles activent. La tarification affichée correspond à l'offre publique actuelle."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {PACKAGES.map(({ pkg, price }) => {
          const ent = getEntitlements(pkg);
          const tone = PACKAGE_TONE[pkg];
          const count = students.data.filter((s) => s.package === pkg).length;
          const rows = [
            { label: 'Plateforme', on: ent.platformAccess },
            { label: 'Contenus & outils', on: ent.learningContent && ent.practicalTools },
            { label: 'Accompagnement collectif', on: ent.collectiveSupport },
            { label: ent.personalPlanDays ? `Plan ${ent.personalPlanDays} jours` : 'Plan personnalisé', on: !!ent.personalPlanDays },
            { label: ent.coachingSessions > 0 ? `${ent.coachingSessions} séance${ent.coachingSessions > 1 ? 's' : ''} de coaching` : 'Coaching individuel', on: ent.coachingSessions > 0 },
            { label: ent.checkInFrequencyDays ? `Check-in tous les ${ent.checkInFrequencyDays} jours` : ent.checkInCount ? `${ent.checkInCount} Check-in` : 'Check-in', on: !!(ent.checkInFrequencyDays || ent.checkInCount) },
            { label: 'Feedback personnel', on: ent.personalFeedback },
            { label: 'Priorité de réservation', on: ent.priorityBooking },
            { label: 'Rapport final', on: ent.finalReport },
          ];

          return (
            <AdminCard key={pkg} className="p-6 flex flex-col">
              <span className={`inline-flex items-center self-start px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wide mb-4 ${tone.bg} ${tone.text}`}>{ent.label}</span>
              <p className="text-[26px] font-black text-slate-900 mb-1">{price}</p>
              <p className="text-[12.5px] font-bold text-slate-400 mb-5">par étudiant</p>

              <div className="space-y-2.5 flex-1 mb-5">
                {rows.map((row) => (
                  <div key={row.label} className={`flex items-center gap-2 text-[13px] font-bold ${row.on ? 'text-slate-700' : 'text-slate-300'}`}>
                    <Check size={14} className={row.on ? 'text-emerald-500' : 'text-slate-200'} />
                    {row.label}
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate('/admin/students', { state: { packageFilter: pkg } })}
                className="w-full h-11 rounded-xl border border-slate-200 font-bold text-[13px] text-slate-600 hover:border-primary hover:text-primary transition-colors"
              >
                {count} étudiant{count > 1 ? 's' : ''} · Voir la liste
              </button>
            </AdminCard>
          );
        })}
      </div>
    </div>
  );
};
