import React from 'react';
import { TrendingUp, Info, Timer, CalendarCheck2 } from 'lucide-react';
import { Student, TimetableTask } from '../../types';
import { PageHeader, Card, ProgressBar, EmptyState } from '../../components/student/primitives';
import { useSelfGuidedPlan, useGoals, useRevisionTracker, useHabitTracker } from '../../hooks/useStudentData';
import { computeProgressDimensions } from '../../utils/progress';

export const Progression: React.FC<{ student: Student; timetable: TimetableTask[] }> = ({ student, timetable }) => {
  const plan = useSelfGuidedPlan(student.username);
  const goals = useGoals(student.username);
  const revisions = useRevisionTracker(student.username);
  const habits = useHabitTracker(student.username);

  const { dimensions, planActionsDone, planActionsTotal, planProgress, daysThisWeek, completedRevisions, completedPlanningTasks, focusedMinutes, anyData } = computeProgressDimensions({
    planActions: plan.record.actions,
    goals: goals.items,
    revisions: revisions.items,
    habits: habits.items,
    timetable,
  });

  return (
    <div>
      <PageHeader title="Ma progression" subtitle="Suivi basé sur vos actions réelles : plan, habitudes, objectifs et sessions de révision." />

      <div className="mb-5 rounded-2xl bg-blue-50 border border-blue-100 p-4 flex items-start gap-3">
        <Info size={18} className="text-primary shrink-0 mt-0.5" />
        <div><p className="font-black text-slate-800 text-[13.5px]">Que signifie la régularité ?</p><p className="text-[12.5px] font-medium text-slate-600 mt-1">C’est le nombre de jours de la semaine où vous avez réalisé au moins une action : habitude cochée, session chronométrée terminée ou tâche du planning validée. L’objectif est d’avancer souvent, pas d’être parfait.</p></div>
      </div>

      {!anyData ? (
        <Card className="p-10">
          <EmptyState icon={TrendingUp} title="Aucune donnée de progression pour le moment" description="Utilisez votre plan, vos habitudes et vos objectifs pour voir votre progression apparaître ici." />
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="p-5">
              <p className="text-2xl font-black text-slate-900 tabular-nums">{Math.round(planProgress)}%</p>
              <p className="text-[11.5px] font-bold text-slate-400 mt-1">Progression du plan</p>
            </Card>
            <Card className="p-5">
              <p className="text-2xl font-black text-slate-900 tabular-nums">{planActionsDone} / {planActionsTotal || 0}</p>
              <p className="text-[11.5px] font-bold text-slate-400 mt-1">Actions terminées</p>
            </Card>
            <Card className="p-5">
              <p className="text-2xl font-black text-slate-900 tabular-nums">{daysThisWeek} / 7</p>
              <p className="text-[11.5px] font-bold text-slate-400 mt-1">Régularité cette semaine</p>
            </Card>
            <Card className="p-5">
              <p className="text-2xl font-black text-slate-900 tabular-nums">{completedRevisions}</p>
              <p className="text-[11.5px] font-bold text-slate-400 mt-1">Sessions terminées</p>
            </Card>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <Card className="p-4 flex items-center gap-3"><span className="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center"><Timer size={18} /></span><div><p className="text-lg font-black text-slate-900">{focusedMinutes} min</p><p className="text-[11.5px] font-bold text-slate-400">Temps de révision validé</p></div></Card>
            <Card className="p-4 flex items-center gap-3"><span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><CalendarCheck2 size={18} /></span><div><p className="text-lg font-black text-slate-900">{completedPlanningTasks} / {timetable.length}</p><p className="text-[11.5px] font-bold text-slate-400">Sessions du planning terminées</p></div></Card>
          </div>

          <Card className="p-6 md:p-7">
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
          </Card>
        </>
      )}
    </div>
  );
};
