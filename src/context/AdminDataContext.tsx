import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Student, Appointment, ContactMessage, SuccessStory, ActivityEntry } from '../types';
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
  refreshStudents: () => Promise<void>;
  refreshAppointments: () => Promise<void>;
  refreshMessages: () => Promise<void>;
  refreshStories: () => Promise<void>;
  refreshActivity: () => Promise<void>;
}

const AdminDataContext = createContext<AdminDataContextType | null>(null);

function useResource<T>(initial: T, fetcher: () => Promise<T>) {
  const [state, setState] = useState<Resource<T>>({ data: initial, loading: true, error: false });

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: false }));
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

  return (
    <AdminDataContext.Provider
      value={{
        students, appointments, messages, stories, activity,
        refreshStudents, refreshAppointments, refreshMessages, refreshStories, refreshActivity,
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
