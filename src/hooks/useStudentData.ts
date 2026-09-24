
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
      let merged: T | undefined;
      setItems((prev) =>
        prev.map((it) => {
          if (it.id !== id) return it;
          merged = { ...it, ...patch };
          return merged;
        })
      );
      if (merged) {
        create(mapToApiForUpdate(merged)).catch((err) => {
          console.error(err);
          refresh();
        });
      }
    },
    [mapToApiForUpdate, refresh]
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

  return { record, save, loaded };
}

/* -------------------------------------------------------------------------- */
/* Habit tracker                                                              */
/* -------------------------------------------------------------------------- */

export interface Habit {
  id: string;
  name: string;
  days: boolean[]; // 7 entries, Mon -> Sun
}

export const useHabitTracker = (username: string) =>
  useApiList<Habit>(
    username,
    () => dataManager.getHabits(),
    (r) => ({ id: String(r.id), name: r.name, days: r.days }),
    (body) => dataManager.saveHabit(body),
    (item) => ({ name: item.name, days: item.days }),
    (item) => ({ id: item.id, name: item.name, days: item.days }),
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
    }),
    (body) => dataManager.saveRevision(body),
    (item) => ({ subject: item.subject, chapter: item.chapter, durationMin: item.durationMin, technique: item.technique, understanding: item.understanding }),
    (item) => ({ subject: item.subject, chapter: item.chapter, durationMin: item.durationMin, technique: item.technique, understanding: item.understanding }),
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
}

const EMPTY_PLAN: SelfGuidedPlan = { objective: '', startDate: '', actions: [], habits: [], obstacles: '' };

export const useSelfGuidedPlan = (username: string) =>
  useApiRecord<SelfGuidedPlan>(
    username,
    () => dataManager.getPlan(),
    (r) => ({
      objective: r.objective || '',
      startDate: r.start_date || '',
      obstacles: r.obstacles || '',
      actions: r.actions || [],
      habits: r.habits || [],
    }),
    EMPTY_PLAN,
    (body) => dataManager.savePlan(body),
    (item) => ({ objective: item.objective, startDate: item.startDate, obstacles: item.obstacles, actions: item.actions, habits: item.habits })
  );

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
    (r) => ({ id: String(r.id), subject: r.subject, day: r.day, startTime: r.start_time, endTime: r.end_time }),
    (body) => dataManager.saveTimetableTask(body),
    (item) => ({ subject: item.subject, day: item.day, startTime: item.startTime, endTime: item.endTime }),
    (item) => ({ subject: item.subject, day: item.day, startTime: item.startTime, endTime: item.endTime }),
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
