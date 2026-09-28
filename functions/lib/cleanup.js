"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanupStaleData = void 0;
const scheduler_1 = require("firebase-functions/v2/scheduler");
const admin_1 = require("./admin");
/**
 * Scheduled cleanup task running daily at 03:00 AM UTC
 * Purges stale password lockouts and rejected news archive.
 */
exports.cleanupStaleData = (0, scheduler_1.onSchedule)({
    schedule: 'every day 03:00',
    timeZone: 'UTC',
    maxInstances: 1,
    timeoutSeconds: 120,
}, async () => {
    console.log('Running daily cleanup maintenance job...');
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const ninetyDaysAgo = new Date(now - 90 * 24 * 60 * 60 * 1000).toISOString();
    // 1. Purge expired password verification attempts
    try {
        const attemptsSnapshot = await admin_1.db
            .collection('config/uploadSecurity/attempts')
            .where('lastFailedAt', '<', oneDayAgo)
            .limit(200)
            .get();
        const batch = admin_1.db.batch();
        attemptsSnapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });
        await batch.commit();
        console.log(`Cleaned up ${attemptsSnapshot.size} expired password attempt record(s).`);
    }
    catch (err) {
        console.error('Error cleaning up password attempts:', err?.message || err);
    }
    // 2. Archive or delete rejected news older than 90 days
    try {
        const oldRejectedSnapshot = await admin_1.db
            .collection('news')
            .where('status', '==', 'rejected')
            .where('createdAt', '<', ninetyDaysAgo)
            .limit(100)
            .get();
        const batch = admin_1.db.batch();
        oldRejectedSnapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });
        await batch.commit();
        console.log(`Pruned ${oldRejectedSnapshot.size} stale rejected news document(s).`);
    }
    catch (err) {
        console.error('Error pruning old rejected news:', err?.message || err);
    }
});
//# sourceMappingURL=cleanup.js.map