/**
 * One-time safe administrative initialization script.
 * Sets the Firebase Auth custom claim { role: 'admin' } for the primary project owner,
 * and initializes the user profile in Firestore.
 *
 * Usage:
 *   npx ts-node functions/scripts/initAdmin.ts <target-user-email-or-uid>
 */

import * as admin from 'firebase-admin';

// Initialize with application default credentials or active project
if (!admin.apps.length) {
  admin.initializeApp();
}

const auth = admin.auth();
const db = admin.firestore();

async function main() {
  const targetIdentifier = process.argv[2] || process.env.ADMIN_EMAIL || 'cybersecurity134@gmail.com';

  console.log(`[InitAdmin] Searching for user target: "${targetIdentifier}"...`);

  let userRecord: admin.auth.UserRecord;
  try {
    if (targetIdentifier.includes('@')) {
      userRecord = await auth.getUserByEmail(targetIdentifier);
    } else {
      userRecord = await auth.getUser(targetIdentifier);
    }
  } catch (err: any) {
    console.error(`[InitAdmin] User "${targetIdentifier}" not found in Firebase Auth:`, err.message);
    console.log('[InitAdmin] If the user does not exist yet, they can sign up through the app first, then run this script.');
    process.exit(1);
  }

  const uid = userRecord.uid;
  console.log(`[InitAdmin] Found user with UID: ${uid}. Assigning custom claims { role: 'admin' }...`);

  const existingClaims = userRecord.customClaims || {};
  await auth.setCustomUserClaims(uid, {
    ...existingClaims,
    role: 'admin',
  });

  const now = new Date().toISOString();

  // Create or update user doc in Firestore
  await db.collection('users').doc(uid).set(
    {
      displayName: userRecord.displayName || 'Head Administrator',
      email: userRecord.email,
      photoURL: userRecord.photoURL || null,
      role: 'admin',
      theme: 'system',
      accentColor: '#7C5CFF',
      updatedAt: now,
      createdAt: now,
      lastSeenAt: now,
    },
    { merge: true }
  );

  // Write audit log entry
  await db.collection('auditLogs').add({
    actorId: 'SYSTEM_SCRIPT',
    action: 'INITIALIZE_PRIMARY_ADMIN',
    targetId: uid,
    timestamp: now,
    details: {
      email: userRecord.email,
      roleAssigned: 'admin',
    },
  });

  console.log(`[InitAdmin] SUCCESS: User "${userRecord.email}" is now confirmed as ADMIN.`);
  console.log('[InitAdmin] The user will receive full administrative access upon their next token refresh or re-login.');
  process.exit(0);
}

main().catch((err) => {
  console.error('[InitAdmin] Fatal error during admin bootstrap:', err);
  process.exit(1);
});
