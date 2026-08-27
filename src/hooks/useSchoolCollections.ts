import { useCallback, useEffect, useState } from 'react';

/**
 * Favorites and comparison selections are stored locally in the browser
 * (no student-account system exists for this directory), so they persist
 * across pages on this device but don't sync across devices.
 */
const FAVORITES_KEY = 'tilmid_school_favorites';
const COMPARE_KEY = 'tilmid_school_compare';
const MAX_COMPARE = 3;

const readList = (key: string): string[] => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
};

const writeList = (key: string, list: string[]) => {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch {
    // localStorage unavailable (private browsing, quota) — fail silently, state still works in-memory
  }
};

const useIdList = (key: string, max?: number) => {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    setIds(readList(key));
  }, [key]);

  const toggle = useCallback(
    (id: string) => {
      setIds((prev) => {
        const next = prev.includes(id)
          ? prev.filter((x) => x !== id)
          : max && prev.length >= max
            ? prev
            : [...prev, id];
        writeList(key, next);
        return next;
      });
    },
    [key, max]
  );

  const clear = useCallback(() => {
    setIds([]);
    writeList(key, []);
  }, [key]);

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  return { ids, toggle, clear, has, isFull: max ? ids.length >= max : false };
};

export const useFavorites = () => useIdList(FAVORITES_KEY);
export const useCompareList = () => useIdList(COMPARE_KEY, MAX_COMPARE);
export { MAX_COMPARE };
