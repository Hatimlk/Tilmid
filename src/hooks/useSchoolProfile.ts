import { useCallback, useEffect, useState } from 'react';
import { SchoolProfile } from '../constants/schools';

const PROFILE_KEY = 'tilmid_school_profile';

const readProfile = (): SchoolProfile => {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as SchoolProfile) : {};
  } catch {
    return {};
  }
};

const writeProfile = (profile: SchoolProfile) => {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // localStorage unavailable (private browsing, quota) — fail silently, state still works in-memory
  }
};

export const useSchoolProfile = () => {
  const [profile, setProfileState] = useState<SchoolProfile>({});

  useEffect(() => {
    setProfileState(readProfile());
  }, []);

  const setField = useCallback(<K extends keyof SchoolProfile>(key: K, value: SchoolProfile[K] | '') => {
    setProfileState((prev) => {
      const next: SchoolProfile = { ...prev, [key]: value || undefined };
      writeProfile(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setProfileState({});
    writeProfile({});
  }, []);

  const dimensionCount = Object.values(profile).filter(Boolean).length;

  return { profile, setField, clear, dimensionCount };
};
