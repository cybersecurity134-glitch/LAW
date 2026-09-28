import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { db } from './admin';
import { SubmitNewsSchema, ReviewNewsSchema } from './types';

/**
 * Callable: submitNews
 * Contributors submit news items. Must have role contributor or admin,
 * and must have verified the upload password (active uploadPermissionUntil).
 * Sets status to "pending". Never AI generated.
 */
export const submitNews = onCall(
  {
    maxInstances: 15,
    timeoutSeconds: 30,
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User must be signed in to submit news.');
    }

    const uid = request.auth.uid;
    const role = request.auth.token.role;
    const isCallerAdmin = role === 'admin' || request.auth.token.email === 'cybersecurity134@gmail.com';
    const isCallerContributor = role === 'contributor' || isCallerAdmin;

    if (!isCallerContributor) {
      throw new HttpsError(
        'permission-denied',
        'Only approved contributors or admins can submit news articles.'
      );
    }

    // Verify upload password permission (unless admin)
    if (!isCallerAdmin) {
      const uploadUntil = request.auth.token.uploadPermissionUntil;
      if (!uploadUntil || typeof uploadUntil !== 'number' || uploadUntil < Date.now()) {
        throw new HttpsError(
          'permission-denied',
          'Upload session expired or locked. Please unlock using the contributor upload password.'
        );
      }
    }

    // Validate input data
    const parseResult = SubmitNewsSchema.safeParse(request.data);
    if (!parseResult.success) {
      throw new HttpsError('invalid-argument', parseResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', '));
    }

    const newsData = parseResult.data;

    // Fetch author profile
    const userSnap = await db.collection('users').doc(uid).get();
    const authorName = userSnap.data()?.displayName || request.auth.token.name || 'Startup Contributor';

    const now = new Date().toISOString();

    const newDocRef = db.collection('news').doc();
    const newsItem = {
      ...newsData,
      authorId: uid,
      authorName,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
      verifiedBy: null,
      verifiedAt: null,
      rejectionReason: null,
    };

    try {
      await newDocRef.set(newsItem);

      // Audit log
      await db.collection('auditLogs').add({
        actorId: uid,
        action: 'SUBMIT_NEWS',
        targetId: newDocRef.id,
        timestamp: now,
        details: {
          title: newsData.title,
          category: newsData.category,
          sourceName: newsData.sourceName,
          sourceUrl: newsData.sourceUrl,
        },
      });

      return {
        success: true,
        newsId: newDocRef.id,
        status: 'pending',
        message: 'News submitted for editorial review.',
      };
    } catch (err: any) {
      console.error('Error submitting news:', err?.message || err);
      throw new HttpsError('internal', 'Failed to submit news article.');
    }
  }
);

/**
 * Callable: reviewNews
 * Admin-only: Approve, reject with a reason, or unpublish news items.
 * Records verifiedBy and verifiedAt.
 */
export const reviewNews = onCall(
  {
    maxInstances: 10,
    timeoutSeconds: 30,
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User must be signed in.');
    }

    const role = request.auth.token.role;
    const isCallerAdmin = role === 'admin' || request.auth.token.email === 'cybersecurity134@gmail.com';

    if (!isCallerAdmin) {
      throw new HttpsError('permission-denied', 'Only administrators can review news submissions.');
    }

    const parseResult = ReviewNewsSchema.safeParse(request.data);
    if (!parseResult.success) {
      throw new HttpsError('invalid-argument', parseResult.error.message);
    }

    const { newsId, action, rejectionReason } = parseResult.data;
    const newsRef = db.collection('news').doc(newsId);
    const snap = await newsRef.get();

    if (!snap.exists) {
      throw new HttpsError('not-found', 'News article not found.');
    }

    const now = new Date().toISOString();
    let updatedStatus: 'approved' | 'rejected' | 'unpublished';
    const updatePayload: Record<string, any> = {
      updatedAt: now,
      verifiedBy: request.auth.uid,
      verifiedAt: now,
    };

    if (action === 'approve') {
      updatedStatus = 'approved';
      updatePayload.status = 'approved';
      updatePayload.publishedAt = now;
      updatePayload.rejectionReason = null;
    } else if (action === 'reject') {
      if (!rejectionReason || rejectionReason.trim().length === 0) {
        throw new HttpsError('invalid-argument', 'A reason is required when rejecting submissions.');
      }
      updatedStatus = 'rejected';
      updatePayload.status = 'rejected';
      updatePayload.rejectionReason = rejectionReason.trim();
    } else {
      updatedStatus = 'unpublished';
      updatePayload.status = 'unpublished';
    }

    try {
      await newsRef.update(updatePayload);

      // Audit log
      await db.collection('auditLogs').add({
        actorId: request.auth.uid,
        action: `REVIEW_NEWS_${action.toUpperCase()}`,
        targetId: newsId,
        timestamp: now,
        details: {
          previousStatus: snap.data()?.status,
          newStatus: updatedStatus,
          reason: rejectionReason || null,
        },
      });

      return {
        success: true,
        newsId,
        status: updatedStatus,
        message: `News article successfully marked as ${updatedStatus}.`,
      };
    } catch (err: any) {
      console.error('Error reviewing news:', err?.message || err);
      throw new HttpsError('internal', 'Failed to update news status.');
    }
  }
);
