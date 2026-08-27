import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Edit, CalendarPlus, MoreHorizontal, Ban, Unlock, Archive, Check, Minus,
  Compass, Target, CalendarClock, Presentation, CheckSquare, TrendingUp,
  PlayCircle, Wrench, Activity as ActivityIcon, UserCog,
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { useAdminOutletContext } from '../../components/admin/AdminLayout';
import {
  AdminCard, StudentStatusBadge, PackageBadge, Avatar, AdminEmptyState,
  AdminErrorState, ModuleComingSoon, ConfirmDialog,
} from '../../components/admin/primitives';
import { getEntitlements } from '../../utils/entitlements';
import { dataManager } from '../../utils/dataManager';

type Tab = 'overview' | 'parcours' | 'plan' | 'planning' | 'coaching' | 'checkins' | 'progress' | 'content' | 'tools' | 'activity' | 'account';

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: "Vue d'ensemble" },
  { id: 'parcours', label: 'Parcours' },
  { id: 'plan', label: 'Plan' },
  { id: 'planning', label: 'Planning' },
  { id: 'coaching', label: 'Coaching' },
  { id: 'checkins', label: 'Check-ins' },
  { id: 'progress', label: 'Progression' },
  { id: 'content', label: 'Contenus' },
  { id: 'tools', label: 'Outils' },
  { id: 'activity', label: 'Activité' },
  { id: 'account', label: 'Compte' },
];

const ENTITLEMENT_ROWS = (ent: ReturnType<typeof getEntitlements>) => [
  { label: 'Plateforme', on: ent.platformAccess },
  { label: 'Contenus & outils', on: ent.learningContent && ent.practicalTools },
  { label: 'Accompagnement collectif', on: ent.collectiveSupport },
  { label: ent.personalPlanDays ? `Plan ${ent.personalPlanDays} jours` : 'Plan personnalisé', on: !!ent.personalPlanDays },
  { label: ent.coachingSessions > 0 ? `${ent.coachingSessions} séance${ent.coachingSessions > 1 ? 's' : ''} de coaching` : 'Coaching individuel', on: ent.coachingSessions > 0 },
  { label: ent.checkInFrequencyDays ? `Check-in tous les ${ent.checkInFrequencyDays} jours` : ent.checkInCount ? `${ent.checkInCount} Check-in` : 'Check-in', on: !!(ent.checkInFrequencyDays || ent.checkInCount) },
  { label: 'Feedback personnel', on: ent.personalFeedback },
  { label: 'Rapport final', on: ent.finalReport },
];

export const AdminStudentDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { students } = useAdminData();
  const { openStudentModal, openAppointmentModal } = useAdminOutletContext();
  const [tab, setTab] = useState<Tab>('overview');
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmArchive, setConfirmArchive] = useState(false);

  const student = students.data.find((s) => String(s.id) === id);

  if (students.error) return <AdminCard><AdminErrorState /></AdminCard>;
  if (students.loading) return <AdminCard className="p-10"><div className="h-32 rounded-xl bg-slate-50 animate-pulse" /></AdminCard>;
  if (!student) return <AdminCard><AdminEmptyState title="Étudiant introuvable" description="Ce dossier n'existe pas ou a été supprimé." cta={{ label: 'Retour à la liste', onClick: () => navigate('/admin/students') }} /></AdminCard>;

  const entitlements = getEntitlements(student.package);

  const changeStatus = async (status: typeof student.status) => {
    await dataManager.saveStudent({ ...student, status });
    setMenuOpen(false);
  };

  return (
    <div>
      <AdminCard className="p-5 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Avatar name={student.name} src={student.avatar} size={56} />
          <div className="flex-1 min-w-0">
            <h1 className="text-[20px] font-black text-slate-900 truncate">{student.name}</h1>
            <p className="text-[13px] font-bold text-slate-400 mt-0.5">{student.grade} · {student.package ? student.package.charAt(0).toUpperCase() + student.package.slice(1) : 'Sans formule'}</p>
            <div className="flex items-center gap-2 mt-2">
              <StudentStatusBadge status={student.status} />
              {student.coachName && <span className="text-[12px] font-bold text-slate-400">Coach : {student.coachName}</span>}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => openStudentModal(student)} className="inline-flex items-center gap-1.5 h-10 px-3.5 rounded-xl border border-slate-200 font-bold text-[13px] text-slate-600 hover:bg-slate-50"><Edit size={14} /> Modifier</button>
            <button onClick={() => openAppointmentModal()} className="inline-flex items-center gap-1.5 h-10 px-3.5 rounded-xl bg-primary text-white font-bold text-[13px] hover:bg-[#0875E8]"><CalendarPlus size={14} /> Planifier</button>
            <div className="relative">
              <button onClick={() => setMenuOpen((v) => !v)} className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"><MoreHorizontal size={16} /></button>
              {menuOpen && (
                <div className="absolute end-0 top-full mt-1 w-52 bg-white rounded-xl border border-slate-100 shadow-[0_18px_44px_rgba(15,23,42,0.12)] p-1.5 z-20">
                  {student.status === 'active' ? (
                    <button onClick={() => changeStatus('suspended')} className="w-full flex items-center gap-2.5 px-3 py-2 min-h-[40px] rounded-lg text-[13px] font-bold text-amber-600 hover:bg-amber-50"><Ban size={14} /> Suspendre</button>
                  ) : student.status === 'suspended' ? (
                    <button onClick={() => changeStatus('active')} className="w-full flex items-center gap-2.5 px-3 py-2 min-h-[40px] rounded-lg text-[13px] font-bold text-emerald-600 hover:bg-emerald-50"><Unlock size={14} /> Réactiver</button>
                  ) : null}
                  {student.status !== 'archived' && (
                    <button onClick={() => { setConfirmArchive(true); setMenuOpen(false); }} className="w-full flex items-center gap-2.5 px-3 py-2 min-h-[40px] rounded-lg text-[13px] font-bold text-rose-600 hover:bg-rose-50"><Archive size={14} /> Archiver</button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </AdminCard>

      <div className="flex gap-1 overflow-x-auto mb-5 border-b border-slate-100">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`shrink-0 px-3.5 py-2.5 text-[13px] font-bold border-b-2 transition-colors ${tab === t.id ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <AdminCard className="p-4"><p className="text-[11px] font-bold text-slate-400 uppercase mb-1">Formule</p><PackageBadge pkg={student.package} /></AdminCard>
            <AdminCard className="p-4"><p className="text-[11px] font-bold text-slate-400 uppercase mb-1">Statut</p><StudentStatusBadge status={student.status} /></AdminCard>
            <AdminCard className="p-4"><p className="text-[11px] font-bold text-slate-400 uppercase mb-1">Coach</p><p className="font-black text-slate-800 text-[14px]">{student.coachName || 'Non affecté'}</p></AdminCard>
            <AdminCard className="p-4"><p className="text-[11px] font-bold text-slate-400 uppercase mb-1">Inscription</p><p className="font-black text-slate-800 text-[14px]">{new Date(student.joinDate).toLocaleDateString('fr-FR')}</p></AdminCard>
          </div>

          <AdminCard className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-black text-slate-900 text-[15px]">Formule & Accès</h2>
              <button onClick={() => openStudentModal(student)} className="text-[12.5px] font-bold text-primary hover:underline">Modifier la formule</button>
            </div>
            {!student.package ? (
              <AdminEmptyState title="Aucune formule Mouwakaba active" description="Cet étudiant n'a pas encore de formule assignée." />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                {ENTITLEMENT_ROWS(entitlements).map((row) => (
                  <div key={row.label} className="flex items-center gap-2">
                    {row.on ? <Check size={15} className="text-emerald-500 shrink-0" /> : <Minus size={15} className="text-slate-300 shrink-0" />}
                    <span className={`text-[13px] font-bold ${row.on ? 'text-slate-700' : 'text-slate-400'}`}>{row.label}</span>
                  </div>
                ))}
              </div>
            )}
          </AdminCard>
        </div>
      )}

      {tab === 'parcours' && <ModuleComingSoon icon={Compass} title="Parcours" description="Le suivi du parcours Mouwakaba de cet étudiant sera visible ici une fois le module Coaching connecté." />}
      {tab === 'plan' && <ModuleComingSoon icon={Target} title="Plan d'accompagnement" description="L'éditeur de plan admin (objectifs, actions, habitudes) sera disponible ici." />}
      {tab === 'planning' && <ModuleComingSoon icon={CalendarClock} title="Planning" description="Le planning de révision de l'étudiant sera visible ici." />}
      {tab === 'coaching' && <ModuleComingSoon icon={Presentation} title="Coaching" description="Les séances de coaching de cet étudiant seront gérées ici." />}
      {tab === 'checkins' && <ModuleComingSoon icon={CheckSquare} title="Check-ins" description="L'historique des Check-ins et le feedback associé seront visibles ici." />}
      {tab === 'progress' && <ModuleComingSoon icon={TrendingUp} title="Progression" description="Le détail de progression (plan, habitudes, contenus) sera visible ici." />}
      {tab === 'content' && <ModuleComingSoon icon={PlayCircle} title="Contenus" description="La progression dans les modules et vidéos sera visible ici." />}
      {tab === 'tools' && <ModuleComingSoon icon={Wrench} title="Outils" description="Un aperçu (lecture seule) des outils utilisés par l'étudiant sera disponible ici." />}

      {tab === 'activity' && (
        <AdminCard className="p-5">
          <h2 className="font-black text-slate-900 text-[15px] mb-4">Activité</h2>
          <StudentActivity name={student.name} />
        </AdminCard>
      )}

      {tab === 'account' && (
        <AdminCard className="p-5">
          <h2 className="font-black text-slate-900 text-[15px] mb-4 flex items-center gap-2"><UserCog size={16} className="text-primary" /> Informations du compte</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 max-w-xl">
            <div className="flex justify-between border-b border-slate-50 pb-2"><dt className="text-slate-400 text-[13px] font-semibold">Identifiant</dt><dd className="text-slate-800 text-[13px] font-bold" dir="ltr">{student.username}</dd></div>
            <div className="flex justify-between border-b border-slate-50 pb-2"><dt className="text-slate-400 text-[13px] font-semibold">E-mail</dt><dd className="text-slate-800 text-[13px] font-bold" dir="ltr">{student.email || '—'}</dd></div>
            <div className="flex justify-between border-b border-slate-50 pb-2"><dt className="text-slate-400 text-[13px] font-semibold">Niveau</dt><dd className="text-slate-800 text-[13px] font-bold">{student.grade}</dd></div>
            <div className="flex justify-between border-b border-slate-50 pb-2"><dt className="text-slate-400 text-[13px] font-semibold">Date d'inscription</dt><dd className="text-slate-800 text-[13px] font-bold">{new Date(student.joinDate).toLocaleDateString('fr-FR')}</dd></div>
          </dl>
          <p className="text-[12px] font-medium text-slate-400 mt-4">Le mot de passe n'est jamais affiché. Utilisez « Modifier » pour en définir un nouveau si nécessaire.</p>
        </AdminCard>
      )}

      <ConfirmDialog
        open={confirmArchive}
        title="Archiver cet étudiant ?"
        description={`${student.name} n'apparaîtra plus dans les listes actives. Son dossier reste accessible et peut être réactivé à tout moment.`}
        confirmLabel="Archiver"
        tone="danger"
        onCancel={() => setConfirmArchive(false)}
        onConfirm={async () => { await changeStatus('archived'); setConfirmArchive(false); }}
      />
    </div>
  );
};

const StudentActivity: React.FC<{ name: string }> = ({ name }) => {
  const { activity } = useAdminData();
  const related = activity.data.filter((a) => a.entity_label === name);
  if (activity.loading) return <div className="space-y-2">{[1, 2].map((i) => <div key={i} className="h-12 rounded-xl bg-slate-50 animate-pulse" />)}</div>;
  if (related.length === 0) return <AdminEmptyState icon={ActivityIcon} title="Aucune activité enregistrée" description="Les changements de statut, de formule et de rendez-vous liés à cet étudiant apparaîtront ici." />;
  return (
    <div className="space-y-1.5">
      {related.map((a) => (
        <div key={a.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50">
          <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
          <span className="flex-1 text-[13px] font-bold text-slate-700">{a.action.replace(/_/g, ' ')}</span>
          <span className="text-[11.5px] font-bold text-slate-400">{new Date(a.created_at).toLocaleString('fr-FR')}</span>
        </div>
      ))}
    </div>
  );
};
