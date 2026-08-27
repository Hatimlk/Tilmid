/**
 * BAC average calculation — single source of truth.
 *
 * Weights are configurable (not hardcoded in the UI) because the official
 * split can change; update DEFAULT_BAC_WEIGHTS if it ever does.
 */

export interface BacWeights {
  continuous: number;
  regional: number;
  national: number;
}

export const DEFAULT_BAC_WEIGHTS: BacWeights = {
  continuous: 0.25,
  regional: 0.25,
  national: 0.50,
};

export const GRADE_MIN = 0;
export const GRADE_MAX = 20;

/** Accepts "14", "14.5", "14,5" — rejects anything else. */
export const normalizeGradeInput = (raw: string): number | null => {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const normalized = trimmed.replace(',', '.');
  if (!/^\d{1,2}(\.\d+)?$/.test(normalized)) return null;
  const value = Number(normalized);
  return Number.isNaN(value) ? null : value;
};

export const isValidGrade = (value: number | null): value is number =>
  value !== null && value >= GRADE_MIN && value <= GRADE_MAX;

/** Final BAC average from three known components. */
export const calculateFinalAverage = (
  continuous: number,
  regional: number,
  national: number,
  weights: BacWeights = DEFAULT_BAC_WEIGHTS
): number => continuous * weights.continuous + regional * weights.regional + national * weights.national;

/**
 * National score required to reach `target`, given continuous + regional.
 * Can return < 0 (target already secured) or > 20 (target out of reach) —
 * callers must handle those explicitly rather than clamping silently.
 */
export const calculateRequiredNationalScore = (
  continuous: number,
  regional: number,
  target: number,
  weights: BacWeights = DEFAULT_BAC_WEIGHTS
): number => (target - continuous * weights.continuous - regional * weights.regional) / weights.national;

/** Best possible average if the student scored a perfect 20 at the national exam. */
export const calculateMaximumPossibleAverage = (
  continuous: number,
  regional: number,
  weights: BacWeights = DEFAULT_BAC_WEIGHTS
): number => calculateFinalAverage(continuous, regional, GRADE_MAX, weights);

const toFrenchDecimal = (value: number): string => value.toFixed(2).replace('.', ',');

/** Descriptive display (slider result, max-possible average, etc.) — nearest 2 decimals. */
export const formatGrade = (value: number): string => toFrenchDecimal(value);

/**
 * Prescriptive display for "the score you need" — rounds UP to 2 decimals so
 * the displayed number always truly suffices. Rounding to nearest could show
 * a score that's a hair short of the real target (e.g. 13.333... -> "13,33"
 * would understate what's actually needed); ceiling avoids that.
 */
export const formatRequiredGrade = (value: number): string => {
  const roundedUp = Math.ceil(value * 100) / 100;
  return toFrenchDecimal(roundedUp);
};

export type ObjectiveStatus = 'already-secured' | 'accessible' | 'ambitious' | 'impossible' | 'already-met';

/**
 * Qualitative status bands. These are UX interpretation thresholds we define
 * for the product (not an official grading rule) — kept as named constants
 * so they're easy to tune in one place.
 */
export const STATUS_THRESHOLDS = {
  securedBelow: 8, // required national <= this => "you're already well positioned"
  accessibleBelow: 14, // required national <= this => "accessible"
  // above accessibleBelow and <= 20 => "ambitious"
};

export const getObjectiveStatus = (requiredNational: number): ObjectiveStatus => {
  if (requiredNational < 0) return 'already-met';
  if (requiredNational > GRADE_MAX) return 'impossible';
  if (requiredNational <= STATUS_THRESHOLDS.securedBelow) return 'already-secured';
  if (requiredNational <= STATUS_THRESHOLDS.accessibleBelow) return 'accessible';
  return 'ambitious';
};
