const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { VALID_PACKAGES, normalizePackage, getEntitlements, hasEntitlement, canUserUse } = require('../entitlements');

describe('Mouwakaba server entitlements', () => {
    it('contains exactly the three existing commercial packages', () => {
        assert.deepEqual([...VALID_PACKAGES].sort(), ['boost', 'essentiel', 'premium']);
        assert.equal(normalizePackage('Premium'), null);
        assert.equal(normalizePackage('premium'), 'premium');
    });

    it('preserves the published coaching quotas', () => {
        assert.equal(getEntitlements('essentiel').coachingSessions, 0);
        assert.equal(getEntitlements('boost').coachingSessions, 1);
        assert.equal(getEntitlements('premium').coachingSessions, 3);
    });

    it('preserves plan and check-in rules', () => {
        assert.equal(getEntitlements('essentiel').personalPlanDays, null);
        assert.equal(getEntitlements('boost').personalPlanDays, 30);
        assert.equal(getEntitlements('boost').checkInCount, 1);
        assert.equal(getEntitlements('premium').personalPlanDays, 90);
        assert.equal(getEntitlements('premium').checkInFrequencyDays, 14);
    });

    it('denies missing or unknown packages without throwing', () => {
        assert.equal(hasEntitlement(null, 'learningContent'), false);
        assert.equal(hasEntitlement('unknown', 'collectiveSupport'), false);
        assert.equal(getEntitlements(undefined).coachingSessions, 0);
    });

    it('allows admins to manage entitled resources without a package', () => {
        assert.equal(canUserUse({ role: 'admin', package: null }, 'learningContent'), true);
        assert.equal(canUserUse({ role: 'student', package: null }, 'learningContent'), false);
    });
});
