'use strict';

// Server-side source of truth for access rules and quotas belonging to the
// three existing Mouwakaba offers. Public labels and prices remain in the
// offer catalogue; API authorization must use these stable package keys.
const PLAN_ENTITLEMENTS = Object.freeze({
    essentiel: Object.freeze({
        platformAccess: true, learningContent: true, practicalTools: true,
        collectiveSupport: true, personalPlanDays: null, coachingSessions: 0,
        checkInCount: 0, checkInFrequencyDays: null, personalFeedback: false,
        priorityBooking: false, finalReport: false,
    }),
    boost: Object.freeze({
        platformAccess: true, learningContent: true, practicalTools: true,
        collectiveSupport: true, personalPlanDays: 30, coachingSessions: 1,
        checkInCount: 1, checkInFrequencyDays: null, personalFeedback: true,
        priorityBooking: false, finalReport: false,
    }),
    premium: Object.freeze({
        platformAccess: true, learningContent: true, practicalTools: true,
        collectiveSupport: true, personalPlanDays: 90, coachingSessions: 3,
        checkInCount: null, checkInFrequencyDays: 14, personalFeedback: true,
        priorityBooking: true, finalReport: true,
    }),
});

const EMPTY_ENTITLEMENTS = Object.freeze({
    platformAccess: false, learningContent: false, practicalTools: false,
    collectiveSupport: false, personalPlanDays: null, coachingSessions: 0,
    checkInCount: 0, checkInFrequencyDays: null, personalFeedback: false,
    priorityBooking: false, finalReport: false,
});

const VALID_PACKAGES = Object.freeze(Object.keys(PLAN_ENTITLEMENTS));
const normalizePackage = (value) => VALID_PACKAGES.includes(value) ? value : null;
const getEntitlements = (packageName) => PLAN_ENTITLEMENTS[normalizePackage(packageName)] || EMPTY_ENTITLEMENTS;
const hasEntitlement = (packageName, key) => Boolean(getEntitlements(packageName)[key]);
const canUserUse = (user, key) => user?.role === 'admin' || hasEntitlement(user?.package, key);

module.exports = { PLAN_ENTITLEMENTS, VALID_PACKAGES, normalizePackage, getEntitlements, hasEntitlement, canUserUse };
