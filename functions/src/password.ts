import { onCall, HttpsError } from 'firebase-functions/v2/https';
import * as crypto from 'crypto';
import { db, auth } from './admin';
import { SetUploadPasswordSchema, VerifyUploadPasswordSchema } from './types';

const SECURITY_DOC_PATH = 'config/uploadSecurity';
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const PERMISSION_DURATION_MS = 30 * 60 * 1000; // 30 minutes

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

function timingSafeMatch(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a, 'hex');
    const bufB = Buffer.from(b, 'hex');
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

/**
 * Admin-only: Set or update the secret upload password.
 * Password is salted and hashed (scrypt). Never stored in plaintext.
 */
export const setUploadPassword = onCall(
  {
    maxInstances: 5,
    timeoutSeconds: 30,
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Authentication required.');
    }

    const callerRole = request.auth.token.role;
    const isCallerAdmin = callerRole === 'admin' || request.auth.token.email === 'cybersecurity134@gmail.com';

    if (!isCallerAdmin) {
      throw new HttpsError('permission-denied', 'Only administrators can set the upload password.');
    }

    const parseResult = SetUploadPasswordSchema.safeParse(request.data);
    if (!parseResult.success) {
      throw new HttpsError('invalid-argument', parseResult.error.message);
    }

    const { password } = parseResult.data;
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = hashPassword(password, salt);

    try {
      await db.doc(SECURITY_DOC_PATH).set(
        {
          hash,
          salt,
          updatedAt: new Date().toISOString(),
          updatedBy: request.auth.uid,
        },
        { merge: true }
      );

      // Audit log (never log password or hash)
      await db.collection('auditLogs').add({
        actorId: request.auth.uid,
        action: 'SET_UPLOAD_PASSWORD',
        targetId: 'config/uploadSecurity',
        timestamp: new Date().toISOString(),
        details: { success: true },
      });

      return {
        success: true,
        message: 'Upload password set successfully.',
      };
    } catch (err: any) {
      console.error('Error setting upload password:', err?.message || err);
      throw new HttpsError('internal', 'Failed to store upload password securely.');
    }
  }
);

/**
 * Contributor / Admin: Verify the upload password.
 * Rate-limited to 5 failed attempts per 15 minutes.
 * On success, grants a 30-minute upload permission claim.
 */
export const verifyUploadPassword = onCall(
  {
    maxInstances: 10,
    timeoutSeconds: 30,
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User must be authenticated.');
    }

    const uid = request.auth.uid;
    const callerRole = request.auth.token.role;

    if (callerRole !== 'admin' && callerRole !== 'contributor') {
      throw new HttpsError(
        'permission-denied',
        'Only registered contributors and admins can verify the upload password.'
      );
    }

    const parseResult = VerifyUploadPasswordSchema.safeParse(request.data);
    if (!parseResult.success) {
      throw new HttpsError('invalid-argument', 'Invalid password format.');
    }

    const { password } = parseResult.data;
    const attemptRef = db.doc(`config/uploadSecurity/attempts/${uid}`);
    const now = Date.now();

    // 1. Check rate-limit lockout
    const attemptSnap = await attemptRef.get();
    if (attemptSnap.exists) {
      const attemptData = attemptSnap.data() || {};
      const failedCount = attemptData.failedCount || 0;
      const lastFailedAt = attemptData.lastFailedAt || 0;

      if (failedCount >= MAX_FAILED_ATTEMPTS && now - lastFailedAt < LOCKOUT_DURATION_MS) {
        const remainingMinutes = Math.ceil((LOCKOUT_DURATION_MS - (now - lastFailedAt)) / 60000);
        throw new HttpsError(
          'resource-exhausted',
          `Too many failed attempts. Account locked for ${remainingMinutes} more minute(s).`
        );
      }
    }

    // 2. Fetch password hash & salt
    const securityDoc = await db.doc(SECURITY_DOC_PATH).get();
    if (!securityDoc.exists) {
      throw new HttpsError(
        'failed-precondition',
        'Upload password has not been configured by an administrator yet.'
      );
    }

    const { hash, salt } = securityDoc.data() || {};
    if (!hash || !salt) {
      throw new HttpsError('internal', 'Corrupt security configuration.');
    }

    // 3. Verify hash using timing-safe comparison
    const computedHash = hashPassword(password, salt);
    const isMatch = timingSafeMatch(computedHash, hash);

    if (!isMatch) {
      // Record failed attempt
      const prevCount = attemptSnap.exists ? (attemptSnap.data()?.failedCount || 0) : 0;
      const newCount = prevCount + 1;

      await attemptRef.set({
        failedCount: newCount,
        lastFailedAt: now,
        uid,
      });

      // Audit log failed attempt
      await db.collection('auditLogs').add({
        actorId: uid,
        action: 'VERIFY_UPLOAD_PASSWORD_FAILED',
        targetId: 'config/uploadSecurity',
        timestamp: new Date().toISOString(),
        details: { failedCount: newCount },
      });

      const attemptsRemaining = Math.max(0, MAX_FAILED_ATTEMPTS - newCount);
      throw new HttpsError(
        'permission-denied',
        `Incorrect upload password. ${attemptsRemaining} attempt(s) remaining before lockout.`
      );
    }

    // 4. Verification successful: Reset failed attempts
    await attemptRef.delete().catch(() => {});

    // 5. Grant short-lived upload permission custom claim (30 minutes)
    const expiresAt = now + PERMISSION_DURATION_MS;
    const currentClaims = (await auth.getUser(uid)).customClaims || {};

    await auth.setCustomUserClaims(uid, {
      ...currentClaims,
      uploadPermissionUntil: expiresAt,
    });

    // Audit log success
    await db.collection('auditLogs').add({
      actorId: uid,
      action: 'VERIFY_UPLOAD_PASSWORD_SUCCESS',
      targetId: 'config/uploadSecurity',
      timestamp: new Date().toISOString(),
      details: { expiresAt: new Date(expiresAt).toISOString() },
    });

    return {
      success: true,
      expiresAt,
      message: 'Upload access granted for 30 minutes.',
    };
  }
);
