import { useCallback, useEffect, useState } from 'react';

/**
 * Student-facing tools (Habit Tracker, Error Log, Revision Tracker,
 * Objectives, Check-ins, Weekly Review, self-guided Plan) have no backend
 * model yet. Rather than fabricate data to fill the new UI, these store
 * real entries the student creates, namespaced to their username in
 * localStorage — genuinely functional, on-device, no fake numbers.
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

function useStudentRecord<T>(username: string, storeKey: string, initial: T) {
  const key = `tilmid_student_${username}_${storeKey}`;
  const [record, setRecord] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setRecord(read<T>(key, initial));
    setLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const save = useCallback(
    (value: T) => {
      setRecord(value);
      write(key, value);
    },
    [key]
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

export const useHabitTracker = (username: string) => useStudentList<Habit>(username, 'habits');

/* -------------------------------------------------------------------------- */
/* Error log                                                                  */
/* -------------------------------------------------------------------------- */

export type ErrorLogStatus = 'a_revoir' | 'en_cours' | 'maitrise';

export interface ErrorLogEntry {
  id: string;
  subject: string;
  topic: string;
  mistake: string;
  reason: string;
  correctMethod: string;
  reviewDate: string;
  status: ErrorLogStatus;
  createdAt: string;
}

export const useErrorLog = (username: string) => useStudentList<ErrorLogEntry>(username, 'error_log');

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

export const useRevisionTracker = (username: string) => useStudentList<RevisionSession>(username, 'revision_sessions');

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

export const useGoals = (username: string) => useStudentList<Goal>(username, 'goals');

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

export const useSelfGuidedPlan = (username: string) => useStudentRecord<SelfGuidedPlan>(username, 'self_plan', EMPTY_PLAN);

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

export const useCheckIns = (username: string) => useStudentList<CheckIn>(username, 'checkins');

/* -------------------------------------------------------------------------- */
/* Weekly review                                                              */
/* -------------------------------------------------------------------------- */

export interface WeeklyReview {
  id: string;
  weekOf: string;
  accomplishments: string;
  difficulties: string;
  bestHabit: string;
  nextPriority: string;
}

export const useWeeklyReviews = (username: string) => useStudentList<WeeklyReview>(username, 'weekly_reviews');

/* -------------------------------------------------------------------------- */
/* Onboarding checklist                                                       */
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
