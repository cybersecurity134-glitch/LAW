"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUploadPassword = exports.setUploadPassword = void 0;
const https_1 = require("firebase-functions/v2/https");
const crypto = __importStar(require("crypto"));
const admin_1 = require("./admin");
const types_1 = require("./types");
const SECURITY_DOC_PATH = 'config/uploadSecurity';
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const PERMISSION_DURATION_MS = 30 * 60 * 1000; // 30 minutes
function hashPassword(password, salt) {
    return crypto.scryptSync(password, salt, 64).toString('hex');
}
function timingSafeMatch(a, b) {
    try {
        const bufA = Buffer.from(a, 'hex');
        const bufB = Buffer.from(b, 'hex');
        if (bufA.length !== bufB.length)
            return false;
        return crypto.timingSafeEqual(bufA, bufB);
    }
    catch {
        return false;
    }
}
/**
 * Admin-only: Set or update the secret upload password.
 * Password is salted and hashed (scrypt). Never stored in plaintext.
 */
exports.setUploadPassword = (0, https_1.onCall)({
    maxInstances: 5,
    timeoutSeconds: 30,
}, async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'Authentication required.');
    }
    const callerRole = request.auth.token.role;
    const isCallerAdmin = callerRole === 'admin' || request.auth.token.email === 'cybersecurity134@gmail.com';
    if (!isCallerAdmin) {
        throw new https_1.HttpsError('permission-denied', 'Only administrators can set the upload password.');
    }
    const parseResult = types_1.SetUploadPasswordSchema.safeParse(request.data);
    if (!parseResult.success) {
        throw new https_1.HttpsError('invalid-argument', parseResult.error.message);
    }
    const { password } = parseResult.data;
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = hashPassword(password, salt);
    try {
        await admin_1.db.doc(SECURITY_DOC_PATH).set({
            hash,
            salt,
            updatedAt: new Date().toISOString(),
            updatedBy: request.auth.uid,
        }, { merge: true });
        // Audit log (never log password or hash)
        await admin_1.db.collection('auditLogs').add({
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
    }
    catch (err) {
        console.error('Error setting upload password:', err?.message || err);
        throw new https_1.HttpsError('internal', 'Failed to store upload password securely.');
    }
});
/**
 * Contributor / Admin: Verify the upload password.
 * Rate-limited to 5 failed attempts per 15 minutes.
 * On success, grants a 30-minute upload permission claim.
 */
exports.verifyUploadPassword = (0, https_1.onCall)({
    maxInstances: 10,
    timeoutSeconds: 30,
}, async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'User must be authenticated.');
    }
    const uid = request.auth.uid;
    const callerRole = request.auth.token.role;
    if (callerRole !== 'admin' && callerRole !== 'contributor') {
        throw new https_1.HttpsError('permission-denied', 'Only registered contributors and admins can verify the upload password.');
    }
    const parseResult = types_1.VerifyUploadPasswordSchema.safeParse(request.data);
    if (!parseResult.success) {
        throw new https_1.HttpsError('invalid-argument', 'Invalid password format.');
    }
    const { password } = parseResult.data;
    const attemptRef = admin_1.db.doc(`config/uploadSecurity/attempts/${uid}`);
    const now = Date.now();
    // 1. Check rate-limit lockout
    const attemptSnap = await attemptRef.get();
    if (attemptSnap.exists) {
        const attemptData = attemptSnap.data() || {};
        const failedCount = attemptData.failedCount || 0;
        const lastFailedAt = attemptData.lastFailedAt || 0;
        if (failedCount >= MAX_FAILED_ATTEMPTS && now - lastFailedAt < LOCKOUT_DURATION_MS) {
            const remainingMinutes = Math.ceil((LOCKOUT_DURATION_MS - (now - lastFailedAt)) / 60000);
            throw new https_1.HttpsError('resource-exhausted', `Too many failed attempts. Account locked for ${remainingMinutes} more minute(s).`);
        }
    }
    // 2. Fetch password hash & salt
    const securityDoc = await admin_1.db.doc(SECURITY_DOC_PATH).get();
    if (!securityDoc.exists) {
        throw new https_1.HttpsError('failed-precondition', 'Upload password has not been configured by an administrator yet.');
    }
    const { hash, salt } = securityDoc.data() || {};
    if (!hash || !salt) {
        throw new https_1.HttpsError('internal', 'Corrupt security configuration.');
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
        await admin_1.db.collection('auditLogs').add({
            actorId: uid,
            action: 'VERIFY_UPLOAD_PASSWORD_FAILED',
            targetId: 'config/uploadSecurity',
            timestamp: new Date().toISOString(),
            details: { failedCount: newCount },
        });
        const attemptsRemaining = Math.max(0, MAX_FAILED_ATTEMPTS - newCount);
        throw new https_1.HttpsError('permission-denied', `Incorrect upload password. ${attemptsRemaining} attempt(s) remaining before lockout.`);
    }
    // 4. Verification successful: Reset failed attempts
    await attemptRef.delete().catch(() => { });
    // 5. Grant short-lived upload permission custom claim (30 minutes)
    const expiresAt = now + PERMISSION_DURATION_MS;
    const currentClaims = (await admin_1.auth.getUser(uid)).customClaims || {};
    await admin_1.auth.setCustomUserClaims(uid, {
        ...currentClaims,
        uploadPermissionUntil: expiresAt,
    });
    // Audit log success
    await admin_1.db.collection('auditLogs').add({
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
});
//# sourceMappingURL=password.js.map