
import { useCallback, useEffect, useState } from 'react';
import { dataManager } from '../utils/dataManager';
import { TimetableTask } from '../types';

/**
 * Student-facing tools (Habit Tracker, Error Log, Revision Tracker,
 * Objectives, Check-ins, self-guided Plan, Planning) are backed by the MySQL
 * API (see server/index.js) so a student's real work is visible to the admin
 * in near real time (AdminStudentDetail polls these same endpoints), instead
 * of being trapped in one browser's localStorage.
 *
 * Weekly review and onboarding checklist have no page consuming them yet and
 * stay on localStorage until a UI actually needs them.
 */

const read = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const write = <T,>(key: string, value: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage unavailable — state still works in-memory for this session
  }
};

/* -------------------------------------------------------------------------- */
/* Generic API-backed list/record helpers                                    */
/* -------------------------------------------------------------------------- */

function useApiList<T extends { id: string }>(
  username: string,
  load: () => Promise<any[]>,
  mapFromApi: (raw: any) => T,
  create: (body: any) => Promise<{ id: number | string }>,
  mapToApiForCreate: (item: T) => any,
  mapToApiForUpdate: (item: T) => any,
  removeApi: (id: string) => Promise<void>
) {
  const [items, setItems] = useState<T[]>([]);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    if (!username) return;
    try {
      const raw = await load();
      setItems(raw.map(mapFromApi));
    } catch (err) {
      console.error(err);
    } finally {
      setLoaded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  useEffect(() => {
    setItems([]);
    setLoaded(false);
    refresh();
  }, [refresh]);

  const add = useCallback(
    (item: T) => {
      setItems((prev) => [item, ...prev]);
      return create(mapToApiForCreate(item))
        .then((res) => {
          if (res?.id != null) {
            const realId = String(res.id);
            setItems((prev) => prev.map((it) => (it.id === item.id ? { ...it, id: realId } : it)));
          }
        })
        .catch((err) => {
          console.error(err);
          setItems((prev) => prev.filter((it) => it.id !== item.id));
          throw err;
        });
    },
    [mapToApiForCreate]
  );

  const update = useCallback(
    (id: string, patch: Partial<T>) => {
      const current = items.find((item) => item.id === id);
      if (!current) return;
      const merged = { ...current, ...patch };
      setItems((prev) => prev.map((item) => (item.id === id ? merged : item)));
      create(mapToApiForUpdate(merged)).catch((err) => {
        console.error(err);
        refresh();
      });
    },
    [items, create, mapToApiForUpdate, refresh]
  );

  const remove = useCallback(
    (id: string) => {
      setItems((prev) => prev.filter((it) => it.id !== id));
      removeApi(id).catch((err) => {
        console.error(err);
        refresh();
      });
    },
    [removeApi, refresh]
  );

  return { items, add, update, remove, loaded, refresh };
}

function useApiRecord<T>(
  username: string,
  load: () => Promise<any>,
  mapFromApi: (raw: any) => T,
  initial: T,
  saveApi: (body: any) => Promise<void>,
  mapToApi: (item: T) => any
) {
  const [record, setRecord] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!username) return;
    let cancelled = false;
    setLoaded(false);
    (async () => {
      try {
        const raw = await load();
        if (!cancelled) setRecord(raw ? mapFromApi(raw) : initial);
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  const save = useCallback(
    (value: T) => {
      setRecord(value);
      saveApi(mapToApi(value)).catch((err) => console.error(err));
    },
    [saveApi, mapToApi]
  );

  return { record, save, loaded, setRecord };
}

/* -------------------------------------------------------------------------- */
/* Habit tracker                                                              */
/* -------------------------------------------------------------------------- */

export interface Habit {
  id: string;
  name: string;
  days: boolean[]; // 7 entries, Mon -> Sun
  weekStart: string;
}

const currentWeekStart = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  return date.toISOString().slice(0, 10);
};

export const useHabitTracker = (username: string) =>
  useApiList<Habit>(
    username,
    () => dataManager.getHabits(),
    (r) => ({
      id: String(r.id), name: r.name,
      days: r.week_start !== currentWeekStart() ? [false, false, false, false, false, false, false] : r.days,
      weekStart: currentWeekStart(),
    }),
    (body) => dataManager.saveHabit(body),
    (item) => ({ name: item.name, days: item.days, weekStart: item.weekStart }),
    (item) => ({ id: item.id, name: item.name, days: item.days, weekStart: item.weekStart }),
    (id) => dataManager.deleteHabit(id)
  );

/* -------------------------------------------------------------------------- */
/* Revision tracker                                                           */
/* -------------------------------------------------------------------------- */

export interface RevisionSession {
  id: string;
  subject: string;
  chapter: string;
  durationMin: number;
  technique: string;
  understanding: number; // 1-5
  date: string;
  startedAt: string | null;
  completed: boolean;
  completedAt: string | null;
}

export const useRevisionTracker = (username: string) =>
  useApiList<RevisionSession>(
    username,
    () => dataManager.getRevisions(),
    (r) => ({
      id: String(r.id),
      subject: r.subject,
      chapter: r.chapter || '',
      durationMin: r.duration_min,
      technique: r.technique || '',
      understanding: r.understanding,
      date: r.session_date,
      startedAt: r.started_at ? String(r.started_at).replace(' ', 'T') : null,
      completed: !!Number(r.completed),
      completedAt: r.completed_at ? String(r.completed_at).replace(' ', 'T') : null,
    }),
    (body) => dataManager.saveRevision(body),
    (item) => ({ subject: item.subject, chapter: item.chapter, durationMin: item.durationMin, technique: item.technique, understanding: item.understanding, startedAt: item.startedAt, completed: item.completed }),
    (item) => ({ id: item.id, subject: item.subject, chapter: item.chapter, durationMin: item.durationMin, technique: item.technique, understanding: item.understanding, startedAt: item.startedAt, completed: item.completed }),
    (id) => dataManager.deleteRevision(id)
  );

/* -------------------------------------------------------------------------- */
/* Objectives                                                                 */
/* -------------------------------------------------------------------------- */

export type GoalCategory = 'academique' | 'organisation' | 'methode' | 'habitudes' | 'examens' | 'personnel';
export type GoalStatus = 'a_demarrer' | 'en_cours' | 'a_revoir' | 'atteint';

export interface Goal {
  id: string;
  title: string;
  category: GoalCategory;
  targetDate: string;
  progress: number; // 0-100
  status: GoalStatus;
  nextAction: string;
}

const mapGoalFromApi = (r: any): Goal => ({
  id: String(r.id),
  title: r.title,
  category: r.category,
  targetDate: r.target_date || '',
  progress: r.progress,
  status: r.status,
  nextAction: r.next_action || '',
});
const mapGoalToApi = (item: Goal) => ({
  title: item.title,
  category: item.category,
  targetDate: item.targetDate,
  progress: item.progress,
  status: item.status,
  nextAction: item.nextAction,
});

export const useGoals = (username: string) =>
  useApiList<Goal>(
    username,
    () => dataManager.getGoals(),
    mapGoalFromApi,
    (body) => dataManager.saveGoal(body),
    mapGoalToApi,
    (item) => ({ id: item.id, ...mapGoalToApi(item) }),
    (id) => dataManager.deleteGoal(id)
  );

/* -------------------------------------------------------------------------- */
/* Self-guided plan (Essentiel)                                               */
/* -------------------------------------------------------------------------- */

export interface PlanAction {
  id: string;
  text: string;
  done: boolean;
}

export interface SelfGuidedPlan {
  objective: string;
  startDate: string;
  actions: PlanAction[];
  habits: string[];
  obstacles: string;
  studentNote: string;
}

const EMPTY_PLAN: SelfGuidedPlan = { objective: '', startDate: '', actions: [], habits: [], obstacles: '', studentNote: '' };

export const useSelfGuidedPlan = (username: string) => {
  const state = useApiRecord<SelfGuidedPlan>(
    username,
    () => dataManager.getPlan(),
    (r) => ({
      objective: r.objective || '',
      startDate: r.start_date || '',
      obstacles: r.obstacles || '',
      studentNote: r.student_note || '',
      actions: r.actions || [],
      habits: r.habits || [],
    }),
    EMPTY_PLAN,
    (body) => dataManager.savePlan(body),
    (item) => ({ objective: item.objective, startDate: item.startDate, obstacles: item.obstacles, actions: item.actions, habits: item.habits })
  );
  const saveProgress = useCallback((actions: PlanAction[], studentNote: string) => {
    const previous = state.record;
    state.setRecord({ ...state.record, actions, studentNote });
    dataManager.savePlanProgress(actions.map(({ id, done }) => ({ id, done })), studentNote).catch((err) => {
      console.error(err);
      state.setRecord(previous);
    });
  }, [state.record, state.setRecord]);
  return { ...state, saveProgress };
};

/* -------------------------------------------------------------------------- */
/* Check-ins (Boost/Premium self-log)                                        */
/* -------------------------------------------------------------------------- */

export interface CheckIn {
  id: string;
  date: string;
  adherence: number; // 1-10
  daysRespected: number; // 0-7
  obstacle: string;
  concentration: number; // 1-5
  success: string;
  needsAdjustment: boolean;
}

export const useCheckIns = (username: string) =>
  useApiList<CheckIn>(
    username,
    () => dataManager.getCheckIns(),
    (r) => ({
      id: String(r.id),
      date: r.created_at,
      adherence: r.adherence,
      daysRespected: r.days_respected,
      obstacle: r.obstacle || '',
      concentration: r.concentration,
      success: r.success || '',
      needsAdjustment: !!r.needs_adjustment,
    }),
    (body) => dataManager.saveCheckIn(body),
    (item) => ({ adherence: item.adherence, daysRespected: item.daysRespected, obstacle: item.obstacle, concentration: item.concentration, success: item.success, needsAdjustment: item.needsAdjustment }),
    (item) => ({ adherence: item.adherence, daysRespected: item.daysRespected, obstacle: item.obstacle, concentration: item.concentration, success: item.success, needsAdjustment: item.needsAdjustment }),
    () => Promise.resolve() // check-ins are append-only; no delete endpoint
  );

/* -------------------------------------------------------------------------- */
/* Planning (timetable)                                                       */
/* -------------------------------------------------------------------------- */

export const useTimetable = (username: string) =>
  useApiList<TimetableTask>(
    username,
    () => dataManager.getTimetable(),
    (r) => ({
      id: String(r.id), subject: r.subject, topic: r.topic || '', technique: r.technique || '',
      day: r.day, startTime: r.start_time, endTime: r.end_time,
      completed: !!Number(r.completed), completedAt: r.completed_at ? String(r.completed_at).replace(' ', 'T') : null,
    }),
    (body) => dataManager.saveTimetableTask(body),
    (item) => ({ subject: item.subject, topic: item.topic, technique: item.technique, day: item.day, startTime: item.startTime, endTime: item.endTime, completed: !!item.completed }),
    (item) => ({ id: item.id, subject: item.subject, topic: item.topic, technique: item.technique, day: item.day, startTime: item.startTime, endTime: item.endTime, completed: !!item.completed }),
    (id) => dataManager.deleteTimetableTask(id)
  );

/* -------------------------------------------------------------------------- */
/* Weekly review — no consuming page yet; stays on localStorage               */
/* -------------------------------------------------------------------------- */

export interface WeeklyReview {
  id: string;
  weekOf: string;
  accomplishments: string;
  difficulties: string;
  bestHabit: string;
  nextPriority: string;
}

function useStudentList<T extends { id: string }>(username: string, storeKey: string) {
  const key = `tilmid_student_${username}_${storeKey}`;
  const [items, setItems] = useState<T[]>([]);

  useEffect(() => {
    setItems(read<T[]>(key, []));
  }, [key]);

  const add = useCallback(
    (item: T) => {
      setItems((prev) => {
        const next = [item, ...prev];
        write(key, next);
        return next;
      });
    },
    [key]
  );

  const update = useCallback(
    (id: string, patch: Partial<T>) => {
      setItems((prev) => {
        const next = prev.map((it) => (it.id === id ? { ...it, ...patch } : it));
        write(key, next);
        return next;
      });
    },
    [key]
  );

  const remove = useCallback(
    (id: string) => {
      setItems((prev) => {
        const next = prev.filter((it) => it.id !== id);
        write(key, next);
        return next;
      });
    },
    [key]
  );

  return { items, add, update, remove };
}

export const useWeeklyReviews = (username: string) => useStudentList<WeeklyReview>(username, 'weekly_reviews');

/* -------------------------------------------------------------------------- */
/* Onboarding checklist — no consuming page yet; stays on localStorage        */
/* -------------------------------------------------------------------------- */

export const useOnboardingProgress = (username: string) => {
  const key = `tilmid_student_${username}_onboarding`;
  const [done, setDone] = useState<string[]>([]);

  useEffect(() => {
    setDone(read<string[]>(key, []));
  }, [key]);

  const markDone = useCallback(
    (stepId: string) => {
      setDone((prev) => {
        if (prev.includes(stepId)) return prev;
        const next = [...prev, stepId];
        write(key, next);
        return next;
      });
    },
    [key]
  );

  return { done, markDone };
};
