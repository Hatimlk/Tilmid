import React, { useMemo } from 'react';
import {
  Sparkles, ArrowLeft, Target, CalendarDays, TrendingUp, Wrench, Lightbulb,
  ClipboardList, AlertOctagon, BookOpen, CheckCircle2
} from 'lucide-react';
import { Student } from '../../types';
import { Entitlements } from '../../utils/entitlements';
import { Card, ProgressBar, EmptyState } from '../../components/student/primitives';
import { StudentTab } from '../../components/student/navigation';
import { useSelfGuidedPlan, useGoals, useErrorLog, useRevisionTracker, useCheckIns } from '../../hooks/useStudentData';
import { TimetableTask } from '../../types';

const DAYS_FR = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const DAYS_FR_SHORT = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

const TIPS = [
  { category: 'Concentration', text: "Travaillez d'abord sur la tâche qui aura le plus d'impact aujourd'hui." },
  { category: 'Révision', text: 'La technique du rappel actif est plus efficace que la simple relecture.' },
  { category: 'Organisation', text: 'Planifiez vos révisions la veille pour commencer sans hésitation le lendemain.' },
  { category: 'Habitudes', text: 'Une petite habitude répétée chaque jour compte plus qu\'un gros effort ponctuel.' },
  { category: 'Examens', text: 'Simulez les conditions de l\'examen pour réduire le stress le jour J.' },
];

const todaysTip = () => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return TIPS[dayOfYear % TIPS.length];
};

export const DashboardHome: React.FC<{
  student: Student;
  entitlements: Entitlements;
  timetable: TimetableTask[];
  onNavigate: (tab: StudentTab) => void;
}> = ({ student, entitlements, timetable, onNavigate }) => {
  const plan = useSelfGuidedPlan(student.username);
  const goals = useGoals(student.username);
  const errorLog = useErrorLog(student.username);
  const revisions = useRevisionTracker(student.username);
  const checkIns = useCheckIns(student.username);

  const firstName = student.name?.split(' ')[0] || student.name;
  const todayIndex = (new Date().getDay() + 6) % 7; // Monday = 0
  const todayName = DAYS_FR[todayIndex];
  const todaysSessions = timetable.filter((t) => t.day === todayName);

  const planActionsDone = plan.record.actions.filter((a) => a.done).length;
  const planActionsTotal = plan.record.actions.length;
  const planProgress = planActionsTotal > 0 ? Math.round((planActionsDone / planActionsTotal) * 100) : 0;

  // Next best action — computed from real local signals only, cascaded by relevance.
  const nextAction = useMemo(() => {
    if (todaysSessions.length > 0) {
      const s = todaysSessions[0];
      return { title: `Réviser : ${s.subject}`, meta: `${s.startTime} – ${s.endTime}`, cta: 'Voir mon planning', tab: 'planning' as StudentTab, icon: CalendarDays };
    }
    if (entitlements.hasCoachingPack && (entitlements.checkInCount || entitlements.checkInFrequencyDays) && checkIns.items.length === 0) {
      return { title: 'Faire votre premier Check-in', meta: 'Environ 5 minutes', cta: 'Commencer', tab: 'checkins' as StudentTab, icon: CheckCircle2 };
    }
    if (entitlements.hasCoachingPack && planActionsTotal === 0 && plan.loaded) {
      return { title: 'Configurer votre plan', meta: 'Définissez votre objectif principal', cta: 'Configurer', tab: 'plan' as StudentTab, icon: Target };
    }
    if (errorLog.items.filter((e) => e.status !== 'maitrise').length > 0) {
      return { title: 'Revoir vos erreurs à réviser', meta: `${errorLog.items.filter((e) => e.status !== 'maitrise').length} entrée(s)`, cta: 'Ouvrir mon Error Log', tab: 'outils' as StudentTab, icon: AlertOctagon };
    }
    return { title: 'Découvrir vos contenus', meta: 'Reprenez votre programme', cta: 'Continuer', tab: 'contenus' as StudentTab, icon: BookOpen };
  }, [todaysSessions, entitlements, checkIns.items.length, planActionsTotal, plan.loaded, errorLog.items]);

  // Weekly activity — real revision-tracker sessions grouped by day of week (last 7 days).
  const weeklyMinutesByDay = useMemo(() => {
    const now = new Date();
    const buckets = [0, 0, 0, 0, 0, 0, 0];
    revisions.items.forEach((r) => {
      const d = new Date(r.date);
      const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
      if (diffDays >= 0 && diffDays < 7) {
        const idx = (d.getDay() + 6) % 7;
        buckets[idx] += r.durationMin;
      }
    });
    return buckets;
  }, [revisions.items]);
  const maxMinutes = Math.max(...weeklyMinutesByDay, 1);
  const hasWeeklyActivity = weeklyMinutesByDay.some((m) => m > 0);

  const tip = todaysTip();

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#0B1A3D] via-[#10285E] to-[#1449C9] p-6 md:p-8 text-white">
        <div className="absolute -top-16 -end-16 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10.5px] font-black uppercase tracking-widest bg-white/10 ring-1 ring-white/15 mb-4">
            <Sparkles size={12} />
            {entitlements.hasCoachingPack ? `Votre parcours Mouwakaba · ${entitlements.label}` : 'Espace Étudiant'}
          </span>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-2">Bonjour {firstName} 👋</h1>
          <p className="text-blue-100/80 text-[14px] font-medium max-w-lg mb-6">
            {nextAction.title} — voici votre priorité du moment et les prochaines étapes pour avancer cette semaine.
          </p>

          {entitlements.hasCoachingPack && planActionsTotal > 0 ? (
            <div className="max-w-sm">
              <p className="text-[12px] font-bold text-blue-200 mb-2">{plan.record.objective || 'Objectif actuel'}</p>
              <ProgressBar value={planProgress} />
              <div className="flex items-center justify-between mt-3">
                <span className="text-[11px] font-bold text-blue-200">{planActionsDone} / {planActionsTotal} actions</span>
                <button onClick={() => onNavigate('plan')} className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-white hover:gap-2.5 transition-all">
                  Voir mon plan <ArrowLeft size={13} className="transform ltr:rotate-180" />
                </button>
              </div>
            </div>
          ) : entitlements.hasCoachingPack ? (
            <button onClick={() => onNavigate('plan')} className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] bg-white text-slate-900 rounded-xl font-bold text-[13.5px] hover:bg-slate-50 transition-all">
              Commencer mon diagnostic <ArrowLeft size={14} className="transform ltr:rotate-180" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Priority + weekly + upcoming grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card emphasis className="lg:col-span-2 p-6">
          <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4">À faire aujourd'hui</p>
          <div className="flex items-center gap-4">
            <span className="w-12 h-12 rounded-2xl bg-blue-50 text-primary flex items-center justify-center shrink-0">
              <nextAction.icon size={22} />
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-black text-slate-900 text-[16px] truncate">{nextAction.title}</p>
              <p className="text-slate-400 text-[13px] font-semibold">{nextAction.meta}</p>
            </div>
            <button onClick={() => onNavigate(nextAction.tab)} className="shrink-0 px-5 py-2.5 min-h-[44px] bg-primary text-white rounded-xl font-bold text-[13px] hover:bg-[#0875E8] transition-all">
              {nextAction.cta}
            </button>
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4">Prochaine échéance</p>
          {todaysSessions.length > 0 ? (
            <div>
              <p className="font-black text-slate-900 text-[15px]">{todaysSessions[0].subject}</p>
              <p className="text-slate-400 text-[13px] font-semibold mb-4">Aujourd'hui · {todaysSessions[0].startTime}</p>
              <button onClick={() => onNavigate('planning')} className="text-[13px] font-bold text-primary hover:underline">Voir les détails</button>
            </div>
          ) : (
            <p className="text-slate-400 text-[13px] font-medium">Aucune échéance programmée pour aujourd'hui.</p>
          )}
        </Card>
      </div>

      {/* Weekly + progression grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-5">
            <p className="font-black text-slate-900 text-[15px]">Activité de la semaine</p>
            <span className="text-[11px] font-bold text-slate-400">Minutes de révision · 7 derniers jours</span>
          </div>
          {hasWeeklyActivity ? (
            <div className="flex justify-between items-end h-28 gap-2">
              {weeklyMinutesByDay.map((m, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-slate-50 rounded-t-lg relative h-24 flex items-end">
                    <div className="w-full bg-primary rounded-t-lg transition-all" style={{ height: `${(m / maxMinutes) * 100}%`, minHeight: m > 0 ? '4px' : 0 }}></div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">{DAYS_FR_SHORT[i]}</span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={TrendingUp} title="Aucune session enregistrée" description="Ajoutez vos sessions de révision dans le Suivi des révisions pour voir votre activité ici." cta={{ label: 'Ajouter une session', onClick: () => onNavigate('outils') }} />
          )}
        </Card>

        <Card className="p-6">
          <p className="font-black text-slate-900 text-[15px] mb-5">Progression</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-2xl p-4">
              <p className="text-2xl font-black text-slate-900 tabular-nums">{goals.items.filter((g) => g.status === 'atteint').length}/{goals.items.length || 0}</p>
              <p className="text-[11.5px] font-bold text-slate-400 mt-1">Objectifs atteints</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4">
              <p className="text-2xl font-black text-slate-900 tabular-nums">{errorLog.items.filter((e) => e.status === 'maitrise').length}</p>
              <p className="text-[11.5px] font-bold text-slate-400 mt-1">Erreurs maîtrisées</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4">
              <p className="text-2xl font-black text-slate-900 tabular-nums">{revisions.items.length}</p>
              <p className="text-[11.5px] font-bold text-slate-400 mt-1">Sessions de révision</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4">
              <p className="text-2xl font-black text-slate-900 tabular-nums">{planActionsDone}/{planActionsTotal || 0}</p>
              <p className="text-[11.5px] font-bold text-slate-400 mt-1">Actions du plan</p>
            </div>
          </div>
          <button onClick={() => onNavigate('progression')} className="mt-4 text-[13px] font-bold text-primary hover:underline">Voir ma progression détaillée</button>
        </Card>
      </div>

      {/* Tools + advice */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="p-6">
          <p className="font-black text-slate-900 text-[15px] mb-4">Actions rapides</p>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { label: 'Ajouter une session', tab: 'planning' as StudentTab, icon: CalendarDays },
              { label: 'Mettre à jour mon plan', tab: 'plan' as StudentTab, icon: Target },
              { label: 'Ajouter une erreur', tab: 'outils' as StudentTab, icon: AlertOctagon },
              { label: 'Voir mes contenus', tab: 'contenus' as StudentTab, icon: BookOpen },
            ].map((a) => (
              <button key={a.label} onClick={() => onNavigate(a.tab)} className="flex items-center gap-2.5 p-3.5 min-h-[44px] bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors text-start">
                <a.icon size={16} className="text-primary shrink-0" />
                <span className="text-[12.5px] font-bold text-slate-700">{a.label}</span>
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-blue-50/40 border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb size={16} className="text-primary" />
            <p className="font-black text-slate-900 text-[13.5px]">Conseil du jour</p>
          </div>
          <p className="text-slate-600 text-[13.5px] font-medium leading-relaxed mb-2">{tip.text}</p>
          <span className="text-[11px] font-bold text-primary uppercase tracking-wide">{tip.category}</span>
        </Card>
      </div>
    </div>
  );
};
