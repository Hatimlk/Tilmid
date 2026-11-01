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

  const hasAny = useCallback((candidateIds: string[]) => candidateIds.some((id) => ids.includes(id)), [ids]);

  const toggleCanonical = useCallback((canonicalId: string, legacyIds: string[] = []) => {
    setIds((prev) => {
      const aliases = new Set([canonicalId, ...legacyIds]);
      const active = prev.some((id) => aliases.has(id));
      let next = prev.filter((id) => !aliases.has(id));
      if (!active && (!max || next.length < max)) next = [...next, canonicalId];
      writeList(key, next);
      return next;
    });
  }, [key, max]);

  return { ids, toggle, clear, has, hasAny, toggleCanonical, isFull: max ? ids.length >= max : false };
};

export const useFavorites = () => useIdList(FAVORITES_KEY);
export const useCompareList = () => useIdList(COMPARE_KEY, MAX_COMPARE);
export { MAX_COMPARE };
