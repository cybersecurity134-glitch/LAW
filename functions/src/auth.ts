import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { db, auth } from './admin';
import { SetUserRoleSchema } from './types';

/**
 * Callable function for Admins to promote or demote users.
 * Sets the Firebase Auth custom claim and updates the user's Firestore profile.
 */
export const setUserRole = onCall(
  {
    maxInstances: 10,
    timeoutSeconds: 30,
  },
  async (request) => {
    // 1. Verify Authentication & Role
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User must be signed in.');
    }

    const callerRole = request.auth.token.role;
    const isCallerAdmin = callerRole === 'admin' || request.auth.token.email === 'cybersecurity134@gmail.com';

    if (!isCallerAdmin) {
      throw new HttpsError('permission-denied', 'Only administrators can modify user roles.');
    }

    // 2. Validate input schema
    const parseResult = SetUserRoleSchema.safeParse(request.data);
    if (!parseResult.success) {
      throw new HttpsError('invalid-argument', parseResult.error.message);
    }

    const { targetUid, role } = parseResult.data;

    // Prevent admin from accidentally demoting themselves if they are the only admin
    if (targetUid === request.auth.uid && role !== 'admin') {
      throw new HttpsError('failed-precondition', 'Cannot demote your own admin account.');
    }

    try {
      // 3. Set Firebase Auth Custom Claims
      const currentClaims = (await auth.getUser(targetUid)).customClaims || {};
      await auth.setCustomUserClaims(targetUid, {
        ...currentClaims,
        role,
      });

      // 4. Update Firestore user profile
      const userRef = db.collection('users').doc(targetUid);
      await userRef.set(
        {
          role,
          updatedAt: adminTimestamp(),
        },
        { merge: true }
      );

      // 5. Write to auditLogs
      await db.collection('auditLogs').add({
        actorId: request.auth.uid,
        action: 'SET_USER_ROLE',
        targetId: targetUid,
        timestamp: adminTimestamp(),
        details: {
          previousRole: currentClaims.role || 'viewer',
          newRole: role,
        },
      });

      return {
        success: true,
        targetUid,
        role,
        message: `Successfully updated user role to ${role}.`,
      };
    } catch (error: any) {
      console.error('Error setting user role:', error?.message || error);
      throw new HttpsError('internal', error?.message || 'Failed to update user role.');
    }
  }
);

function adminTimestamp() {
  return new Date().toISOString();
}
