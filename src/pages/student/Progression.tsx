import React, { useMemo } from 'react';
import { TrendingUp } from 'lucide-react';
import { Student, TimetableTask } from '../../types';
import { PageHeader, Card, ProgressBar, EmptyState } from '../../components/student/primitives';
import { useSelfGuidedPlan, useGoals, useRevisionTracker, useHabitTracker } from '../../hooks/useStudentData';

export const Progression: React.FC<{ student: Student; timetable: TimetableTask[] }> = ({ student, timetable }) => {
  const plan = useSelfGuidedPlan(student.username);
  const goals = useGoals(student.username);
  const revisions = useRevisionTracker(student.username);
  const habits = useHabitTracker(student.username);

  const planActionsDone = plan.record.actions.filter((a) => a.done).length;
  const planActionsTotal = plan.record.actions.length;
  const planProgress = planActionsTotal > 0 ? (planActionsDone / planActionsTotal) * 100 : 0;

  const goalsAtteints = goals.items.filter((g) => g.status === 'atteint').length;

  const now = new Date();
  const daysThisWeek = new Set(
    revisions.items
      .filter((r) => (now.getTime() - new Date(r.date).getTime()) / 86400000 < 7)
      .map((r) => new Date(r.date).toDateString())
  ).size;

  const habitConsistency = useMemo(() => {
    if (habits.items.length === 0) return null;
    const totalCells = habits.items.length * 7;
    const checked = habits.items.reduce((sum, h) => sum + h.days.filter(Boolean).length, 0);
    return Math.round((checked / totalCells) * 100);
  }, [habits.items]);

  const dimensions = [
    { label: 'Régularité', value: Math.min(100, (daysThisWeek / 7) * 100), detail: `${daysThisWeek} / 7 jours cette semaine` },
    { label: 'Application du plan', value: planProgress, detail: `${planActionsDone} / ${planActionsTotal || 0} actions` },
    { label: 'Habitudes', value: habitConsistency, detail: habitConsistency !== null ? `${habitConsistency}% de constance` : null },
    { label: 'Objectifs', value: goals.items.length > 0 ? (goalsAtteints / goals.items.length) * 100 : null, detail: goals.items.length > 0 ? `${goalsAtteints} / ${goals.items.length} atteints` : null },
  ];

  const anyData = revisions.items.length > 0 || planActionsTotal > 0 || habits.items.length > 0 || goals.items.length > 0;

  return (
    <div>
      <PageHeader title="Ma progression" subtitle="Suivi basé sur vos actions réelles : plan, habitudes, objectifs et sessions de révision." />

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
              <p className="text-2xl font-black text-slate-900 tabular-nums">{revisions.items.length}</p>
              <p className="text-[11.5px] font-bold text-slate-400 mt-1">Sessions enregistrées</p>
            </Card>
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
