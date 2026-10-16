export interface ProgressDimension {
  label: string;
  value: number | null;
  detail: string | null;
}

export interface ProgressInputs {
  planActions: { done: boolean }[];
  goals: { status: string }[];
  revisions: { date: string; completed?: boolean; completedAt?: string | null; durationMin?: number }[];
  habits: { days: boolean[] }[];
  timetable?: { completed?: boolean; completedAt?: string | null }[];
}

export interface ProgressResult {
  dimensions: ProgressDimension[];
  planActionsDone: number;
  planActionsTotal: number;
  planProgress: number;
  daysThisWeek: number;
  completedRevisions: number;
  completedPlanningTasks: number;
  focusedMinutes: number;
  anyData: boolean;
}

// Shared by the student's own Progression page and the admin's per-student and
// cross-student progress views — keep the math in one place.
export const computeProgressDimensions = ({ planActions, goals, revisions, habits, timetable = [] }: ProgressInputs): ProgressResult => {
  const planActionsDone = planActions.filter((a) => a.done).length;
  const planActionsTotal = planActions.length;
  const planProgress = planActionsTotal > 0 ? (planActionsDone / planActionsTotal) * 100 : 0;

  const goalsAtteints = goals.filter((g) => g.status === 'atteint').length;

  const now = new Date();
  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  const completedRevisionRows = revisions.filter((revision) => revision.completed !== false);
  const activeDays = new Set<string>();
  completedRevisionRows.forEach((revision) => {
    const date = new Date(revision.completedAt || revision.date);
    if (date >= monday && date <= now) activeDays.add(date.toDateString());
  });
  timetable.filter((task) => task.completed && task.completedAt).forEach((task) => {
    const date = new Date(task.completedAt as string);
    if (date >= monday && date <= now) activeDays.add(date.toDateString());
  });
  habits.forEach((habit) => habit.days.forEach((done, index) => {
    if (!done) return;
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    if (date <= now) activeDays.add(date.toDateString());
  }));
  const daysThisWeek = activeDays.size;
  const completedRevisions = completedRevisionRows.length;
  const completedPlanningTasks = timetable.filter((task) => task.completed).length;
  const focusedMinutes = completedRevisionRows.reduce((sum, revision) => sum + Number(revision.durationMin || 0), 0);

  const habitConsistency = habits.length === 0 ? null : Math.round((habits.reduce((sum, h) => sum + h.days.filter(Boolean).length, 0) / (habits.length * 7)) * 100);

  const dimensions: ProgressDimension[] = [
    { label: 'Régularité', value: Math.min(100, (daysThisWeek / 7) * 100), detail: `${daysThisWeek} / 7 jours avec au moins une action réalisée` },
    { label: 'Application du plan', value: planProgress, detail: `${planActionsDone} / ${planActionsTotal || 0} actions` },
    { label: 'Habitudes', value: habitConsistency, detail: habitConsistency !== null ? `${habitConsistency}% de constance` : null },
    { label: 'Objectifs', value: goals.length > 0 ? (goalsAtteints / goals.length) * 100 : null, detail: goals.length > 0 ? `${goalsAtteints} / ${goals.length} atteints` : null },
  ];

  const anyData = revisions.length > 0 || planActionsTotal > 0 || habits.length > 0 || goals.length > 0 || timetable.length > 0;

  return { dimensions, planActionsDone, planActionsTotal, planProgress, daysThisWeek, completedRevisions, completedPlanningTasks, focusedMinutes, anyData };
};
