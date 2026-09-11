export interface ProgressDimension {
  label: string;
  value: number | null;
  detail: string | null;
}

export interface ProgressInputs {
  planActions: { done: boolean }[];
  goals: { status: string }[];
  revisions: { date: string }[];
  habits: { days: boolean[] }[];
}

export interface ProgressResult {
  dimensions: ProgressDimension[];
  planActionsDone: number;
  planActionsTotal: number;
  planProgress: number;
  daysThisWeek: number;
  anyData: boolean;
}

// Shared by the student's own Progression page and the admin's per-student and
// cross-student progress views — keep the math in one place.
export const computeProgressDimensions = ({ planActions, goals, revisions, habits }: ProgressInputs): ProgressResult => {
  const planActionsDone = planActions.filter((a) => a.done).length;
  const planActionsTotal = planActions.length;
  const planProgress = planActionsTotal > 0 ? (planActionsDone / planActionsTotal) * 100 : 0;

  const goalsAtteints = goals.filter((g) => g.status === 'atteint').length;

  const now = new Date();
  const daysThisWeek = new Set(
    revisions.filter((r) => (now.getTime() - new Date(r.date).getTime()) / 86400000 < 7).map((r) => new Date(r.date).toDateString())
  ).size;

  const habitConsistency = habits.length === 0 ? null : Math.round((habits.reduce((sum, h) => sum + h.days.filter(Boolean).length, 0) / (habits.length * 7)) * 100);

  const dimensions: ProgressDimension[] = [
    { label: 'Régularité', value: Math.min(100, (daysThisWeek / 7) * 100), detail: `${daysThisWeek} / 7 jours cette semaine` },
    { label: 'Application du plan', value: planProgress, detail: `${planActionsDone} / ${planActionsTotal || 0} actions` },
    { label: 'Habitudes', value: habitConsistency, detail: habitConsistency !== null ? `${habitConsistency}% de constance` : null },
    { label: 'Objectifs', value: goals.length > 0 ? (goalsAtteints / goals.length) * 100 : null, detail: goals.length > 0 ? `${goalsAtteints} / ${goals.length} atteints` : null },
  ];

  const anyData = revisions.length > 0 || planActionsTotal > 0 || habits.length > 0 || goals.length > 0;

  return { dimensions, planActionsDone, planActionsTotal, planProgress, daysThisWeek, anyData };
};
