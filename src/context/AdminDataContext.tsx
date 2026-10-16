import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  Student, Appointment, ContactMessage, SuccessStory, ActivityEntry, StudyResource,
  PlanOverviewRow, CheckInOverviewRow, ProgressOverviewRow, FeedbackEntry, CollectiveSession, Coach,
} from '../types';
import { dataManager } from '../utils/dataManager';

interface Resource<T> {
  data: T;
  loading: boolean;
  error: boolean;
}

interface AdminDataContextType {
  students: Resource<Student[]>;
  appointments: Resource<Appointment[]>;
  messages: Resource<ContactMessage[]>;
  stories: Resource<SuccessStory[]>;
  activity: Resource<ActivityEntry[]>;
  libraryResources: Resource<StudyResource[]>;
  plans: Resource<PlanOverviewRow[]>;
  checkins: Resource<CheckInOverviewRow[]>;
  progressOverview: Resource<ProgressOverviewRow[]>;
  feedback: Resource<FeedbackEntry[]>;
  collectiveSessions: Resource<CollectiveSession[]>;
  coachingSessions: Resource<Appointment[]>;
  coaches: Resource<Coach[]>;
  refreshCoaches: () => Promise<void>;
  refreshStudents: () => Promise<void>;
  refreshAppointments: () => Promise<void>;
  refreshMessages: () => Promise<void>;
  refreshStories: () => Promise<void>;
  refreshActivity: () => Promise<void>;
  refreshLibraryResources: () => Promise<void>;
  refreshPlans: () => Promise<void>;
  refreshCheckins: () => Promise<void>;
  refreshProgressOverview: () => Promise<void>;
  refreshFeedback: () => Promise<void>;
  refreshCollectiveSessions: () => Promise<void>;
  refreshCoachingSessions: () => Promise<void>;
}

const AdminDataContext = createContext<AdminDataContextType | null>(null);
const STUDENT_DATA_SYNC_MS = 30000;

function useResource<T>(initial: T, fetcher: () => Promise<T>) {
  const [state, setState] = useState<Resource<T>>({ data: initial, loading: true, error: false });

  const load = useCallback(async () => {
    // Keep existing data visible during background synchronization. Only the
    // first request should replace the page with its loading skeleton.
    setState((s) => ({ ...s, loading: s.data === initial, error: false }));
    try {
      const data = await fetcher();
      setState({ data, loading: false, error: false });
    } catch (err) {
      console.error(err);
      setState((s) => ({ ...s, loading: false, error: true }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { load(); }, [load]);

  return [state, load] as const;
}

export const AdminDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, refreshStudents] = useResource<Student[]>([], dataManager.getStudents);
  const [appointments, refreshAppointments] = useResource<Appointment[]>([], dataManager.getAppointments);
  const [messages, refreshMessages] = useResource<ContactMessage[]>([], dataManager.getMessages);
  const [stories, refreshStories] = useResource<SuccessStory[]>([], dataManager.getStories);
  const [activity, refreshActivity] = useResource<ActivityEntry[]>([], dataManager.getActivity);
  const [libraryResources, refreshLibraryResources] = useResource<StudyResource[]>([], dataManager.getResources);
  const [plans, refreshPlans] = useResource<PlanOverviewRow[]>([], dataManager.getAdminPlans);
  const [checkins, refreshCheckins] = useResource<CheckInOverviewRow[]>([], dataManager.getAdminCheckins);
  const [progressOverview, refreshProgressOverview] = useResource<ProgressOverviewRow[]>([], dataManager.getAdminProgressOverview);
  const [feedback, refreshFeedback] = useResource<FeedbackEntry[]>([], dataManager.getAdminFeedback);
  const [collectiveSessions, refreshCollectiveSessions] = useResource<CollectiveSession[]>([], dataManager.getCollectiveSessions);
  const [coachingSessions, refreshCoachingSessions] = useResource<Appointment[]>([], () => dataManager.getCoachingSessions());
  const [coaches, refreshCoaches] = useResource<Coach[]>([], dataManager.getCoaches);

  useEffect(() => {
    const syncStudentData = () => {
      if (document.visibilityState === 'hidden') return;
      void Promise.allSettled([
        refreshPlans(),
        refreshCheckins(),
        refreshProgressOverview(),
        refreshFeedback(),
        refreshCoachingSessions(),
        refreshCollectiveSessions(),
      ]);
    };
    const interval = window.setInterval(syncStudentData, STUDENT_DATA_SYNC_MS);
    window.addEventListener('focus', syncStudentData);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener('focus', syncStudentData);
    };
  }, [refreshPlans, refreshCheckins, refreshProgressOverview, refreshFeedback, refreshCoachingSessions, refreshCollectiveSessions]);

  return (
    <AdminDataContext.Provider
      value={{
        students, appointments, messages, stories, activity, libraryResources,
        plans, checkins, progressOverview, feedback, collectiveSessions, coachingSessions, coaches,
        refreshStudents, refreshAppointments, refreshMessages, refreshStories, refreshActivity, refreshLibraryResources,
        refreshPlans, refreshCheckins, refreshProgressOverview, refreshFeedback, refreshCollectiveSessions, refreshCoachingSessions, refreshCoaches,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
};

export const useAdminData = () => {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error('useAdminData must be used within AdminDataProvider');
  return ctx;
};
