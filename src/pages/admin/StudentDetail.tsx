import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Edit, CalendarPlus, MoreHorizontal, Ban, Unlock, Archive, Check, Minus,
  Compass, Target, CalendarClock, Presentation, CheckSquare, TrendingUp,
  PlayCircle, Wrench, Activity as ActivityIcon, UserCog, RefreshCw,
  ListChecks, BookOpen, Clock, MessageSquare, FileText, Send,
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { useAdminOutletContext } from '../../components/admin/AdminLayout';
import {
  AdminCard, StudentStatusBadge, PackageBadge, Avatar, AdminEmptyState,
  AdminErrorState, ModuleComingSoon, ConfirmDialog, AppointmentStatusBadge,
} from '../../components/admin/primitives';
import { ProgressBar, JourneyTimeline, JourneyStepDef } from '../../components/student/primitives';
import { getEntitlements } from '../../utils/entitlements';
import { computeProgressDimensions } from '../../utils/progress';
import { dataManager } from '../../utils/dataManager';
import { TimetableTask, Appointment, FeedbackEntry, Student } from '../../types';
import { Goal, Habit, RevisionSession, CheckIn, SelfGuidedPlan } from '../../hooks/useStudentData';

/* -------------------------------------------------------------------------- */
/* Live student-module data — polled while this page is open so the admin    */
/* sees the student's own work (plan, check-ins, tools...) without a reload. */
/* -------------------------------------------------------------------------- */

const POLL_INTERVAL_MS = 20000;

interface StudentModules {
  plan: SelfGuidedPlan | null;
  goals: Goal[];
  revisions: RevisionSession[];
  habits: Habit[];
  checkins: CheckIn[];
  timetable: TimetableTask[];
  coachingSessions: Appointment[];
  feedback: FeedbackEntry[];
}

const EMPTY_MODULES: StudentModules = { plan: null, goals: [], revisions: [], habits: [], checkins: [], timetable: [], coachingSessions: [], feedback: [] };

function useStudentModules(studentId: string | undefined) {
  const [data, setData] = useState<StudentModules>(EMPTY_MODULES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = useCallback(async () => {
    if (!studentId) return;
    try {
      const [plan, goals, revisions, habits, checkins, timetable, coachingSessions, feedback] = await Promise.all([
        dataManager.getPlan(studentId),
        dataManager.getGoals(studentId),
        dataManager.getRevisions(studentId),
        dataManager.getHabits(studentId),
        dataManager.getCheckIns(studentId),
        dataManager.getTimetable(studentId),
        dataManager.getCoachingSessions(studentId),
        dataManager.getFeedback(studentId),
      ]);
      setData({
        plan: plan ? { objective: plan.objective || '', startDate: plan.start_date || '', obstacles: plan.obstacles || '', actions: plan.actions || [], habits: plan.habits || [] } : null,
        goals: goals.map((r: any) => ({ id: String(r.id), title: r.title, category: r.category, targetDate: r.target_date || '', progress: r.progress, status: r.status, nextAction: r.next_action || '' })),
        revisions: revisions.map((r: any) => ({ id: String(r.id), subject: r.subject, chapter: r.chapter || '', durationMin: r.duration_min, technique: r.technique || '', understanding: r.understanding, date: r.session_date })),
        habits: habits.map((r: any) => ({ id: String(r.id), name: r.name, days: r.days })),
        checkins: checkins.map((r: any) => ({ id: String(r.id), date: r.created_at, adherence: r.adherence, daysRespected: r.days_respected, obstacle: r.obstacle || '', concentration: r.concentration, success: r.success || '', needsAdjustment: !!r.needs_adjustment })),
        timetable: timetable.map((r: any) => ({ id: String(r.id), subject: r.subject, day: r.day, startTime: r.start_time, endTime: r.end_time })),
        coachingSessions,
        feedback,
      });
      setError(false);
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    setLoading(true);
    load();
    const interval = setInterval(load, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [load]);

  return { data, loading, error, lastUpdated, refresh: load };
}

const LiveIndicator: React.FC<{ lastUpdated: Date | null; onRefresh: () => void }> = ({ lastUpdated, onRefresh }) => (
  <div className="flex items-center gap-3 mb-4">
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-700">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Synchronisé
    </span>
    {lastUpdated && <span className="text-[11.5px] font-bold text-slate-400">Mis à jour à {lastUpdated.toLocaleTimeString('fr-FR')}</span>}
    <button onClick={onRefresh} className="ms-auto inline-flex items-center gap-1.5 text-[12px] font-bold text-primary hover:underline"><RefreshCw size={12} /> Actualiser</button>
  </div>
);

type Tab = 'overview' | 'parcours' | 'plan' | 'planning' | 'coaching' | 'checkins' | 'feedback' | 'progress' | 'content' | 'tools' | 'activity' | 'account';

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: "Vue d'ensemble" },
  { id: 'parcours', label: 'Parcours' },
  { id: 'plan', label: 'Plan' },
  { id: 'planning', label: 'Planning' },
  { id: 'coaching', label: 'Coaching' },
  { id: 'checkins', label: 'Check-ins' },
  { id: 'feedback', label: 'Feedback' },
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

  // Called unconditionally, before any early return below, so the hook count
  // never changes between renders (a direct load/refresh of this route starts
  // with students.loading=true, which previously skipped this hook on the
  // first render and violated the Rules of Hooks once data arrived).
  const modules = useStudentModules(id);

  const student = students.data.find((s) => String(s.id) === id);

  if (students.error) return <AdminCard><AdminErrorState /></AdminCard>;
  if (students.loading) return <AdminCard className="p-10"><div className="h-32 rounded-xl bg-slate-50 animate-pulse" /></AdminCard>;
  if (!student) return <AdminCard><AdminEmptyState title="Étudiant introuvable" description="Ce dossier n'existe pas ou a été supprimé." cta={{ label: 'Retour à la liste', onClick: () => navigate('/admin/students') }} /></AdminCard>;

  const entitlements = getEntitlements(student.package);
  const isLiveTab = tab === 'parcours' || tab === 'plan' || tab === 'planning' || tab === 'coaching' || tab === 'checkins' || tab === 'feedback' || tab === 'progress' || tab === 'tools';

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

      {isLiveTab && <LiveIndicator lastUpdated={modules.lastUpdated} onRefresh={modules.refresh} />}

      {tab === 'parcours' && (
        modules.error ? <AdminCard><AdminErrorState onRetry={modules.refresh} /></AdminCard> :
        modules.loading ? <AdminCard className="p-8"><div className="h-40 rounded-xl bg-slate-50 animate-pulse" /></AdminCard> :
        <AdminParcoursTab entitlements={entitlements} plan={modules.data.plan} checkins={modules.data.checkins} />
      )}
      {tab === 'plan' && (
        modules.error ? <AdminCard><AdminErrorState onRetry={modules.refresh} /></AdminCard> :
        modules.loading ? <AdminCard className="p-8"><div className="h-40 rounded-xl bg-slate-50 animate-pulse" /></AdminCard> :
        <AdminPlanTab plan={modules.data.plan} />
      )}
      {tab === 'planning' && (
        modules.error ? <AdminCard><AdminErrorState onRetry={modules.refresh} /></AdminCard> :
        modules.loading ? <AdminCard className="p-8"><div className="h-40 rounded-xl bg-slate-50 animate-pulse" /></AdminCard> :
        <AdminPlanningTab timetable={modules.data.timetable} />
      )}
      {tab === 'coaching' && (
        modules.error ? <AdminCard><AdminErrorState onRetry={modules.refresh} /></AdminCard> :
        modules.loading ? <AdminCard className="p-8"><div className="h-40 rounded-xl bg-slate-50 animate-pulse" /></AdminCard> :
        <AdminCoachingTab student={student} sessions={modules.data.coachingSessions} onLogged={modules.refresh} />
      )}
      {tab === 'checkins' && (
        modules.error ? <AdminCard><AdminErrorState onRetry={modules.refresh} /></AdminCard> :
        modules.loading ? <AdminCard className="p-8"><div className="h-40 rounded-xl bg-slate-50 animate-pulse" /></AdminCard> :
        <AdminCheckinsTab checkins={modules.data.checkins} />
      )}
      {tab === 'feedback' && (
        modules.error ? <AdminCard><AdminErrorState onRetry={modules.refresh} /></AdminCard> :
        modules.loading ? <AdminCard className="p-8"><div className="h-40 rounded-xl bg-slate-50 animate-pulse" /></AdminCard> :
        <AdminFeedbackTab studentId={student.id} entries={modules.data.feedback} onSent={modules.refresh} />
      )}
      {tab === 'progress' && (
        modules.error ? <AdminCard><AdminErrorState onRetry={modules.refresh} /></AdminCard> :
        modules.loading ? <AdminCard className="p-8"><div className="h-40 rounded-xl bg-slate-50 animate-pulse" /></AdminCard> :
        <AdminProgressTab modules={modules.data} />
      )}
      {tab === 'content' && <ModuleComingSoon icon={PlayCircle} title="Contenus" description="La progression dans les modules et vidéos sera visible ici." />}
      {tab === 'tools' && (
        modules.error ? <AdminCard><AdminErrorState onRetry={modules.refresh} /></AdminCard> :
        modules.loading ? <AdminCard className="p-8"><div className="h-40 rounded-xl bg-slate-50 animate-pulse" /></AdminCard> :
        <AdminToolsTab modules={modules.data} />
      )}

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

/* -------------------------------------------------------------------------- */
/* Parcours — mirrors the journey-step logic shown to the student itself      */
/* -------------------------------------------------------------------------- */

const AdminParcoursTab: React.FC<{ entitlements: ReturnType<typeof getEntitlements>; plan: SelfGuidedPlan | null; checkins: CheckIn[] }> = ({ entitlements, plan, checkins }) => {
  if (!entitlements.hasCoachingPack) {
    return <AdminCard><AdminEmptyState icon={Compass} title="Aucun parcours Mouwakaba actif" description="Le parcours s'affichera ici une fois une formule Mouwakaba activée sur le compte de l'étudiant." /></AdminCard>;
  }

  const hasPlan = !!plan && plan.actions.length > 0;
  const planDone = plan ? plan.actions.filter((a) => a.done).length : 0;
  const planTotal = plan ? plan.actions.length : 0;
  const planApplied = planTotal > 0 && planDone === planTotal;

  let steps: JourneyStepDef[] = [];
  if (entitlements.label === 'Essentiel') {
    steps = [
      { label: 'Diagnostic personnel', state: hasPlan ? 'done' : 'active' },
      { label: 'Module Organisation', state: hasPlan ? 'active' : 'upcoming' },
      { label: 'Programme hebdomadaire', state: 'upcoming' },
      { label: 'Techniques de révision', state: 'upcoming' },
      { label: 'Gestion de la procrastination', state: 'upcoming' },
      { label: 'Préparation aux examens', state: 'upcoming' },
      { label: 'Bilan personnel', state: 'upcoming' },
    ];
  } else if (entitlements.label === 'Boost') {
    steps = [
      { label: 'Diagnostic', state: 'done' },
      { label: 'Coaching individuel', state: 'active' },
      { label: 'Plan 30 jours', state: hasPlan ? (planApplied ? 'done' : 'active') : 'upcoming' },
      { label: 'Check-in J+14', state: checkins.length > 0 ? 'done' : 'upcoming' },
      { label: 'Feedback', state: 'upcoming' },
      { label: 'Bilan personnel', state: 'upcoming' },
    ];
  } else {
    steps = [
      { label: 'Diagnostic initial', state: 'done' },
      { label: 'Séance 01 — Construction du système', state: 'active' },
      { label: "Phase d'application", state: hasPlan ? 'active' : 'upcoming' },
      { label: 'Check-in', state: checkins.length > 0 ? 'done' : 'upcoming' },
      { label: 'Séance 02 — Ajustements', state: 'upcoming' },
      { label: 'Check-in', state: 'upcoming' },
      { label: 'Phase de consolidation', state: 'upcoming' },
      { label: 'Check-in', state: 'upcoming' },
      { label: 'Séance 03 — Bilan & autonomie', state: 'upcoming' },
      { label: 'Rapport final', state: 'upcoming' },
    ];
  }

  return (
    <AdminCard className="p-6 md:p-8 max-w-2xl">
      <JourneyTimeline steps={steps} />
    </AdminCard>
  );
};

/* -------------------------------------------------------------------------- */
/* Plan — read-only view of the student's self-guided plan                    */
/* -------------------------------------------------------------------------- */

const AdminPlanTab: React.FC<{ plan: SelfGuidedPlan | null }> = ({ plan }) => {
  if (!plan || (!plan.objective && plan.actions.length === 0)) {
    return <AdminCard><AdminEmptyState icon={Target} title="Aucun plan configuré" description="Le plan personnel de l'étudiant apparaîtra ici dès qu'il l'aura configuré depuis son espace." /></AdminCard>;
  }
  const done = plan.actions.filter((a) => a.done).length;
  const progress = plan.actions.length > 0 ? (done / plan.actions.length) * 100 : 0;
  return (
    <div className="space-y-5">
      <AdminCard className="p-6">
        <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Objectif principal</p>
        <p className="font-black text-slate-900 text-[16px] mb-4">{plan.objective || 'Non défini'}</p>
        {plan.actions.length > 0 && (
          <>
            <ProgressBar value={progress} label={`${done} / ${plan.actions.length} actions terminées`} />
            {plan.startDate && <p className="text-[11.5px] font-bold text-slate-400 mt-2">Débuté le {plan.startDate}</p>}
          </>
        )}
      </AdminCard>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <AdminCard className="p-6">
          <p className="font-black text-slate-900 text-[15px] mb-4">Actions</p>
          {plan.actions.length === 0 ? (
            <p className="text-slate-400 text-[13px] font-medium">Aucune action définie.</p>
          ) : (
            <div className="space-y-2.5">
              {plan.actions.map((a) => (
                <div key={a.id} className="flex items-center gap-3">
                  <span className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 ${a.done ? 'bg-emerald-500 text-white' : 'bg-slate-100'}`}>{a.done && <Check size={12} strokeWidth={3} />}</span>
                  <span className={`text-[13px] font-semibold ${a.done ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{a.text}</span>
                </div>
              ))}
            </div>
          )}
        </AdminCard>
        <AdminCard className="p-6">
          <p className="font-black text-slate-900 text-[15px] mb-4">Habitudes à construire</p>
          {plan.habits.length === 0 ? (
            <p className="text-slate-400 text-[13px] font-medium">Aucune habitude ajoutée.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {plan.habits.map((h) => <span key={h} className="px-3 py-1.5 rounded-full bg-blue-50 text-primary text-[12.5px] font-bold">{h}</span>)}
            </div>
          )}
        </AdminCard>
      </div>
      {plan.obstacles && (
        <AdminCard className="p-6">
          <p className="font-black text-slate-900 text-[15px] mb-2">Obstacles identifiés</p>
          <p className="text-slate-600 text-[13.5px] font-medium leading-relaxed">{plan.obstacles}</p>
        </AdminCard>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Planning — read-only view of the student's revision timetable              */
/* -------------------------------------------------------------------------- */

const AdminPlanningTab: React.FC<{ timetable: TimetableTask[] }> = ({ timetable }) => {
  if (timetable.length === 0) {
    return <AdminCard><AdminEmptyState icon={CalendarClock} title="Aucune session programmée" description="Le planning de révision de l'étudiant apparaîtra ici dès qu'il aura ajouté des sessions." /></AdminCard>;
  }
  const DAYS_FR = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  const sorted = [...timetable].sort((a, b) => DAYS_FR.indexOf(a.day) - DAYS_FR.indexOf(b.day) || a.startTime.localeCompare(b.startTime));
  return (
    <div className="space-y-2.5">
      {sorted.map((s) => (
        <AdminCard key={s.id} className="p-4 flex items-center gap-4">
          <span className="px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600 text-[11px] font-black shrink-0">{s.day}</span>
          <div className="flex-1 min-w-0">
            <p className="font-black text-slate-900 text-[14px]">{s.subject}</p>
            <p className="text-slate-400 text-[12px] font-bold flex items-center gap-1"><Clock size={11} /> {s.startTime} – {s.endTime}</p>
          </div>
        </AdminCard>
      ))}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Check-ins — read-only history                                              */
/* -------------------------------------------------------------------------- */

const AdminCheckinsTab: React.FC<{ checkins: CheckIn[] }> = ({ checkins }) => {
  if (checkins.length === 0) {
    return <AdminCard><AdminEmptyState icon={CheckSquare} title="Aucun Check-in enregistré" description="L'historique des Check-ins de l'étudiant apparaîtra ici." /></AdminCard>;
  }
  return (
    <div className="space-y-3">
      {checkins.map((c, i) => (
        <AdminCard key={c.id} className={`p-5 ${c.needsAdjustment ? 'border-amber-200' : ''}`}>
          <div className="flex items-center justify-between mb-3">
            <p className="font-black text-slate-900 text-[14px]">Check-in #{checkins.length - i}</p>
            <span className="text-[11.5px] font-bold text-slate-400">{new Date(c.date).toLocaleString('fr-FR')}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
            <div><p className="text-[11px] font-bold text-slate-400 uppercase">Adhérence</p><p className="font-black text-slate-800 text-[15px]">{c.adherence}/10</p></div>
            <div><p className="text-[11px] font-bold text-slate-400 uppercase">Jours respectés</p><p className="font-black text-slate-800 text-[15px]">{c.daysRespected}/7</p></div>
            <div><p className="text-[11px] font-bold text-slate-400 uppercase">Concentration</p><p className="font-black text-slate-800 text-[15px]">{c.concentration}/5</p></div>
            {c.needsAdjustment && <div><span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-50 text-amber-700">Ajustement demandé</span></div>}
          </div>
          {c.obstacle && <p className="text-[13px] text-slate-600 mb-1"><span className="font-bold text-slate-400">Obstacle : </span>{c.obstacle}</p>}
          {c.success && <p className="text-[13px] text-slate-600"><span className="font-bold text-slate-400">Réussite : </span>{c.success}</p>}
        </AdminCard>
      ))}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Coaching — this student's coaching-category sessions + a way to plan one   */
/* -------------------------------------------------------------------------- */

const AdminCoachingTab: React.FC<{ student: Student; sessions: Appointment[]; onLogged: () => void }> = ({ student, sessions, onLogged }) => {
  const { openAppointmentModal } = useAdminOutletContext();
  const [notesFor, setNotesFor] = useState<number | null>(null);
  const [notesDraft, setNotesDraft] = useState('');

  const plan = () => openAppointmentModal({ studentId: Number(student.id), studentName: student.name, category: 'coaching' } as any);

  const saveNotes = async (id: number) => {
    await dataManager.saveAppointment({ id, notes: notesDraft } as any);
    onLogged();
    setNotesFor(null);
  };

  if (sessions.length === 0) {
    return <AdminCard><AdminEmptyState icon={Presentation} title="Aucune séance de coaching" description="Les séances individuelles de cet étudiant seront gérées ici." cta={{ label: 'Planifier une séance', onClick: plan }} /></AdminCard>;
  }

  const sorted = [...sessions].sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button onClick={plan} className="inline-flex items-center gap-1.5 h-10 px-3.5 rounded-xl bg-slate-900 text-white font-bold text-[13px] hover:bg-primary"><CalendarPlus size={14} /> Planifier une séance</button>
      </div>
      {sorted.map((a) => (
        <AdminCard key={a.id} className="p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-black text-slate-900 text-[14px] truncate">{a.title}</p>
              <p className="text-[12.5px] font-medium text-slate-400">{new Date(a.date).toLocaleDateString('fr-FR')} · {a.time}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <AppointmentStatusBadge status={a.status} />
              <button onClick={() => { setNotesFor(notesFor === a.id ? null : a.id); setNotesDraft(a.notes || ''); }} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100 text-[12.5px] font-bold">
                <FileText size={13} /> Notes
              </button>
            </div>
          </div>
          {notesFor === a.id ? (
            <div className="mt-3">
              <textarea value={notesDraft} onChange={(e) => setNotesDraft(e.target.value)} rows={3} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-primary font-medium text-[13px] resize-none" placeholder="Points abordés, prochaines étapes..." />
              <div className="flex gap-2 mt-2">
                <button onClick={() => saveNotes(a.id)} className="h-9 px-3.5 rounded-lg bg-slate-900 text-white text-[12.5px] font-bold hover:bg-primary">Enregistrer</button>
                <button onClick={() => setNotesFor(null)} className="h-9 px-3.5 rounded-lg border border-slate-200 text-slate-600 text-[12.5px] font-bold hover:bg-slate-50">Annuler</button>
              </div>
            </div>
          ) : a.notes ? (
            <p className="text-[13px] text-slate-600 mt-2.5 whitespace-pre-line">{a.notes}</p>
          ) : null}
        </AdminCard>
      ))}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Feedback — this student's feedback history + a quick compose box          */
/* -------------------------------------------------------------------------- */

const AdminFeedbackTab: React.FC<{ studentId: string; entries: FeedbackEntry[]; onSent: () => void }> = ({ studentId, entries, onSent }) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const send = async () => {
    if (!message.trim()) return;
    setSending(true);
    try {
      await dataManager.saveFeedback({ studentId, message: message.trim() });
      setMessage('');
      onSent();
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-4">
      <AdminCard className="p-4">
        <label className="text-[13px] font-bold text-slate-700 mb-1.5 block">Envoyer un feedback</label>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-primary font-medium text-[13.5px] resize-none" placeholder="Beau travail cette semaine..." />
        <div className="flex justify-end mt-2">
          <button onClick={send} disabled={sending || !message.trim()} className="inline-flex items-center gap-1.5 h-10 px-3.5 rounded-xl bg-slate-900 text-white font-bold text-[13px] hover:bg-primary disabled:opacity-60">
            <Send size={14} /> {sending ? 'Envoi...' : 'Envoyer'}
          </button>
        </div>
      </AdminCard>

      {entries.length === 0 ? (
        <AdminCard><AdminEmptyState icon={MessageSquare} title="Aucun feedback envoyé" description="Le feedback envoyé à cet étudiant apparaîtra ici." /></AdminCard>
      ) : (
        <div className="space-y-3">
          {entries.map((f) => (
            <AdminCard key={f.id} className="p-4">
              <p className="text-[11.5px] font-bold text-slate-400 mb-1.5">{new Date(f.createdAt).toLocaleString('fr-FR')}</p>
              <p className="text-[13.5px] text-slate-600 leading-relaxed">{f.message}</p>
            </AdminCard>
          ))}
        </div>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Progression — mirrors the dimension calc shown to the student itself       */
/* -------------------------------------------------------------------------- */

const AdminProgressTab: React.FC<{ modules: StudentModules }> = ({ modules }) => {
  const { plan, goals, revisions, habits } = modules;
  const { dimensions, planActionsDone, planActionsTotal, planProgress, daysThisWeek, anyData } = computeProgressDimensions({
    planActions: plan?.actions || [],
    goals,
    revisions,
    habits,
  });

  if (!anyData) {
    return <AdminCard><AdminEmptyState icon={TrendingUp} title="Aucune donnée de progression" description="La progression apparaîtra ici dès que l'étudiant utilisera son plan, ses habitudes ou ses objectifs." /></AdminCard>;
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminCard className="p-5"><p className="text-2xl font-black text-slate-900 tabular-nums">{Math.round(planProgress)}%</p><p className="text-[11.5px] font-bold text-slate-400 mt-1">Progression du plan</p></AdminCard>
        <AdminCard className="p-5"><p className="text-2xl font-black text-slate-900 tabular-nums">{planActionsDone} / {planActionsTotal || 0}</p><p className="text-[11.5px] font-bold text-slate-400 mt-1">Actions terminées</p></AdminCard>
        <AdminCard className="p-5"><p className="text-2xl font-black text-slate-900 tabular-nums">{daysThisWeek} / 7</p><p className="text-[11.5px] font-bold text-slate-400 mt-1">Régularité cette semaine</p></AdminCard>
        <AdminCard className="p-5"><p className="text-2xl font-black text-slate-900 tabular-nums">{revisions.length}</p><p className="text-[11.5px] font-bold text-slate-400 mt-1">Sessions enregistrées</p></AdminCard>
      </div>
      <AdminCard className="p-6 md:p-7">
        <p className="font-black text-slate-900 text-[15px] mb-5">Vue d'ensemble par dimension</p>
        <div className="space-y-5">
          {dimensions.map((d) => (
            <div key={d.label}>
              {d.value === null ? (
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-slate-400">{d.label}</span>
                  <span className="text-[12px] text-slate-300 font-medium">Pas encore de données</span>
                </div>
              ) : (
                <>
                  <ProgressBar value={d.value} label={d.label} />
                  {d.detail && <p className="text-[11.5px] text-slate-400 font-semibold mt-1">{d.detail}</p>}
                </>
              )}
            </div>
          ))}
        </div>
      </AdminCard>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Tools — read-only preview of Habits / Error Log / Objectifs / Révisions    */
/* -------------------------------------------------------------------------- */

const GOAL_STATUS_LABEL: Record<string, string> = { a_demarrer: 'À démarrer', en_cours: 'En cours', a_revoir: 'À revoir', atteint: 'Atteint' };
const GOAL_CATEGORY_LABEL: Record<string, string> = { academique: 'Académique', organisation: 'Organisation', methode: 'Méthode de travail', habitudes: 'Habitudes', examens: 'Préparation aux examens', personnel: 'Personnel' };
const DAYS_SHORT = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

const fmtDate = (iso: string) => {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d.toLocaleDateString('fr-FR');
};

const AdminToolsTab: React.FC<{ modules: StudentModules }> = ({ modules }) => {
  const { habits, goals, revisions } = modules;
  const anyData = habits.length > 0 || goals.length > 0 || revisions.length > 0;
  if (!anyData) {
    return <AdminCard><AdminEmptyState icon={Wrench} title="Aucun outil utilisé" description="Un aperçu en lecture seule des outils pratiques de l'étudiant (habitudes, erreurs, objectifs, révisions) apparaîtra ici." /></AdminCard>;
  }
  return (
    <div className="space-y-5">
      <AdminCard className="p-5">
        <h3 className="font-black text-slate-900 text-[14px] mb-3 flex items-center gap-2"><ListChecks size={16} className="text-primary" /> Habitudes</h3>
        {habits.length === 0 ? <p className="text-slate-400 text-[13px] font-medium">Aucune habitude suivie.</p> : (
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-start border-collapse min-w-[380px]">
              <thead><tr><th className="text-start p-2 text-[11px] font-black uppercase text-slate-400">Habitude</th>{DAYS_SHORT.map((d, i) => <th key={i} className="p-2 text-[11px] font-black text-slate-400 w-9">{d}</th>)}</tr></thead>
              <tbody>
                {habits.map((h) => (
                  <tr key={h.id} className="border-t border-slate-50">
                    <td className="p-2 text-[13px] font-bold text-slate-700">{h.name}</td>
                    {h.days.map((checked, i) => (
                      <td key={i} className="p-2 text-center">
                        <span className={`inline-flex w-6 h-6 rounded-lg items-center justify-center ${checked ? 'bg-emerald-500 text-white' : 'bg-slate-50'}`}>{checked && <Check size={12} strokeWidth={3} />}</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>

      <AdminCard className="p-5">
        <h3 className="font-black text-slate-900 text-[14px] mb-3 flex items-center gap-2"><Target size={16} className="text-primary" /> Objectifs</h3>
        {goals.length === 0 ? <p className="text-slate-400 text-[13px] font-medium">Aucun objectif défini.</p> : (
          <div className="space-y-2.5">
            {goals.map((g) => {
              const targetDate = fmtDate(g.targetDate);
              return (
                <div key={g.id} className="p-3.5 rounded-xl bg-slate-50">
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <div className="min-w-0">
                      <p className="font-black text-slate-800 text-[13px]">{g.title}</p>
                      <p className="text-slate-400 text-[11.5px] font-bold">{GOAL_CATEGORY_LABEL[g.category] || g.category}{targetDate ? ` · Échéance ${targetDate}` : ''}</p>
                    </div>
                    <span className="shrink-0 px-2 py-0.5 rounded-full text-[10.5px] font-black bg-white text-slate-500">{GOAL_STATUS_LABEL[g.status] || g.status}</span>
                  </div>
                  <ProgressBar value={g.progress} />
                  {g.nextAction && <p className="text-slate-500 text-[12px] font-medium mt-1.5"><span className="font-bold text-slate-400">Prochaine action — </span>{g.nextAction}</p>}
                </div>
              );
            })}
          </div>
        )}
      </AdminCard>

      <AdminCard className="p-5">
        <h3 className="font-black text-slate-900 text-[14px] mb-3 flex items-center gap-2"><BookOpen size={16} className="text-primary" /> Suivi des révisions</h3>
        {revisions.length === 0 ? <p className="text-slate-400 text-[13px] font-medium">Aucune session enregistrée.</p> : (
          <div className="space-y-2">
            {revisions.map((r) => {
              const date = fmtDate(r.date);
              return (
                <div key={r.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-700 text-[13px]">{r.subject}{r.chapter ? ` · ${r.chapter}` : ''}</p>
                    {date && <p className="text-slate-400 text-[11.5px] font-bold mt-0.5">{date}</p>}
                  </div>
                  <span className="text-[11.5px] font-bold text-slate-400 shrink-0 text-end">{r.durationMin} min · {r.technique}<br />Compréhension {r.understanding}/5</span>
                </div>
              );
            })}
          </div>
        )}
      </AdminCard>
    </div>
  );
};
