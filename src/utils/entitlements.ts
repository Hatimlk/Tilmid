import { MouwakabaPackage } from '../types';

/**
 * Package entitlements — single source of truth for what each Mouwakaba
 * pack unlocks in the Student Area. Never scatter this logic across
 * components; import getEntitlements() and branch on the returned flags.
 */
export interface Entitlements {
  hasCoachingPack: boolean;
  platformAccess: boolean;
  learningContent: boolean;
  practicalTools: boolean;
  collectiveSupport: boolean;

  personalPlanDays: number | null;
  coachingSessions: number;
  checkInFrequencyDays: number | null;
  checkInCount: number | null;

  personalFeedback: boolean;
  priorityBooking: boolean;
  finalReport: boolean;

  label: string;
}

const NO_PACKAGE: Entitlements = {
  hasCoachingPack: false,
  platformAccess: false,
  learningContent: false,
  practicalTools: false,
  collectiveSupport: false,
  personalPlanDays: null,
  coachingSessions: 0,
  checkInFrequencyDays: null,
  checkInCount: null,
  personalFeedback: false,
  priorityBooking: false,
  finalReport: false,
  label: 'Aucune formule',
};

const ENTITLEMENTS: Record<MouwakabaPackage, Entitlements> = {
  essentiel: {
    hasCoachingPack: true,
    platformAccess: true,
    learningContent: true,
    practicalTools: true,
    collectiveSupport: true,
    personalPlanDays: null,
    coachingSessions: 0,
    checkInFrequencyDays: null,
    checkInCount: null,
    personalFeedback: false,
    priorityBooking: false,
    finalReport: false,
    label: 'Essentiel',
  },
  boost: {
    hasCoachingPack: true,
    platformAccess: true,
    learningContent: true,
    practicalTools: true,
    collectiveSupport: true,
    personalPlanDays: 30,
    coachingSessions: 1,
    checkInFrequencyDays: null,
    checkInCount: 1,
    personalFeedback: true,
    priorityBooking: false,
    finalReport: false,
    label: 'Boost',
  },
  premium: {
    hasCoachingPack: true,
    platformAccess: true,
    learningContent: true,
    practicalTools: true,
    collectiveSupport: true,
    personalPlanDays: 90,
    coachingSessions: 3,
    checkInFrequencyDays: 14,
    checkInCount: null,
    personalFeedback: true,
    priorityBooking: true,
    finalReport: true,
    label: 'Premium',
  },
};

export const getEntitlements = (pkg: MouwakabaPackage | null | undefined): Entitlements =>
  pkg && ENTITLEMENTS[pkg] ? ENTITLEMENTS[pkg] : NO_PACKAGE;

export const PACKAGE_TONE: Record<MouwakabaPackage, { bg: string; text: string; ring: string }> = {
  essentiel: { bg: 'bg-blue-50', text: 'text-primary', ring: 'ring-blue-100' },
  boost: { bg: 'bg-primary', text: 'text-white', ring: 'ring-primary/20' },
  premium: { bg: 'bg-[#101D48]', text: 'text-white', ring: 'ring-purple-400/20' },
};
