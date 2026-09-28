/**
 * Firestore Security Rules Unit Tests
 * Uses @firebase/rules-unit-testing to verify ABAC / Zero-Trust policies across all roles.
 */

import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import * as fs from 'fs';
import * as path from 'path';

const PROJECT_ID = 'test-organic-optics';
let testEnv: RulesTestEnvironment;

describe('Firestore Security Rules Test Suite', () => {
  beforeAll(async () => {
    const rules = fs.readFileSync(path.resolve(__dirname, '../firestore.rules'), 'utf8');
    testEnv = await initializeTestEnvironment({
      projectId: PROJECT_ID,
      firestore: {
        rules,
        host: '127.0.0.1',
        port: 8080,
      },
    });
  });

  afterAll(async () => {
    await testEnv.cleanup();
  });

  beforeEach(async () => {
    await testEnv.clearFirestore();
  });

  // ---------------------------------------------------------------------------
  // 1. DEFAULT DENY
  // ---------------------------------------------------------------------------
  describe('Default Deny Catch-all', () => {
    it('denies read/write to arbitrary collections', async () => {
      const anonDb = testEnv.unauthenticatedContext().firestore();
      await assertFails(anonDb.collection('random_unmapped').get());
      await assertFails(anonDb.collection('random_unmapped').add({ foo: 'bar' }));
    });
  });

  // ---------------------------------------------------------------------------
  // 2. USERS COLLECTION
  // ---------------------------------------------------------------------------
  describe('Users Collection Rules', () => {
    it('allows a newly authenticated user to create profile with role "viewer"', async () => {
      const viewerDb = testEnv.authenticatedContext('user_123', {
        email: 'user@example.com',
        role: 'viewer',
      }).firestore();

      await assertSucceeds(
        viewerDb.collection('users').doc('user_123').set({
          displayName: 'Test User',
          email: 'user@example.com',
          role: 'viewer',
          createdAt: new Date(),
        })
      );
    });

    it('denies a user trying to self-assign role "admin" on signup', async () => {
      const hackerDb = testEnv.authenticatedContext('hacker_1', {
        email: 'hacker@example.com',
        role: 'viewer',
      }).firestore();

      await assertFails(
        hackerDb.collection('users').doc('hacker_1').set({
          displayName: 'Hacker',
          email: 'hacker@example.com',
          role: 'admin',
          createdAt: new Date(),
        })
      );
    });

    it('denies a user from updating their own role field', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().collection('users').doc('user_123').set({
          displayName: 'Normal User',
          email: 'user@example.com',
          role: 'viewer',
        });
      });

      const userDb = testEnv.authenticatedContext('user_123', { role: 'viewer' }).firestore();
      await assertFails(
        userDb.collection('users').doc('user_123').update({
          role: 'admin',
        })
      );
    });
  });

  // ---------------------------------------------------------------------------
  // 3. NEWS COLLECTION
  // ---------------------------------------------------------------------------
  describe('News Collection Rules', () => {
    const validNewsData = {
      category: 'new_startup',
      title: 'Revolutionary CleanTech Platform Launched',
      summary: 'A novel solar battery storage facility has been established.',
      body: 'Full story text detailing the engineering breakthroughs and startup deployment in Hyderabad.',
      sourceName: 'The Economic Times',
      sourceUrl: 'https://economictimes.indiatimes.com/tech/clean-energy',
      status: 'pending',
      authorId: 'contributor_456',
      authorName: 'Contributor Jane',
      createdAt: new Date(),
    };

    it('allows public/viewers to read approved news', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().collection('news').doc('news_approved_1').set({
          ...validNewsData,
          status: 'approved',
        });
      });

      const viewerDb = testEnv.authenticatedContext('viewer_789', { role: 'viewer' }).firestore();
      await assertSucceeds(viewerDb.collection('news').doc('news_approved_1').get());
    });

    it('denies viewers from reading pending news belonging to another author', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().collection('news').doc('news_pending_1').set(validNewsData);
      });

      const viewerDb = testEnv.authenticatedContext('viewer_789', { role: 'viewer' }).firestore();
      await assertFails(viewerDb.collection('news').doc('news_pending_1').get());
    });

    it('allows a contributor with valid uploadPermissionUntil to submit pending news', async () => {
      const validUntil = Date.now() + 25 * 60 * 1000;
      const contributorDb = testEnv.authenticatedContext('contributor_456', {
        role: 'contributor',
        uploadPermissionUntil: validUntil,
      }).firestore();

      await assertSucceeds(
        contributorDb.collection('news').doc('news_sub_1').set({
          ...validNewsData,
          authorId: 'contributor_456',
          createdAt: new Date(),
        })
      );
    });

    it('denies a contributor without upload password permission from creating news', async () => {
      const lockedDb = testEnv.authenticatedContext('contributor_locked', {
        role: 'contributor',
        // No uploadPermissionUntil or expired
        uploadPermissionUntil: Date.now() - 5000,
      }).firestore();

      await assertFails(
        lockedDb.collection('news').doc('news_sub_2').set({
          ...validNewsData,
          authorId: 'contributor_locked',
          createdAt: new Date(),
        })
      );
    });

    it('allows contributor to edit their own pending news', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().collection('news').doc('news_edit_1').set({
          ...validNewsData,
          authorId: 'author_1',
          createdAt: new Date(),
        });
      });

      const authorDb = testEnv.authenticatedContext('author_1', { role: 'contributor' }).firestore();
      await assertSucceeds(
        authorDb.collection('news').doc('news_edit_1').update({
          title: 'Updated Title for CleanTech Platform',
          updatedAt: new Date(),
        })
      );
    });

    it('denies contributor from editing an already approved news article', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().collection('news').doc('news_approved_locked').set({
          ...validNewsData,
          authorId: 'author_1',
          status: 'approved',
        });
      });

      const authorDb = testEnv.authenticatedContext('author_1', { role: 'contributor' }).firestore();
      await assertFails(
        authorDb.collection('news').doc('news_approved_locked').update({
          title: 'Malicious Change To Approved News',
        })
      );
    });
  });

  // ---------------------------------------------------------------------------
  // 4. CHATS AND MESSAGES
  // ---------------------------------------------------------------------------
  describe('Networking Chat Rules', () => {
    it('allows participants to read and write messages in their chat', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().collection('chats').doc('chat_alice_bob').set({
          participants: ['alice', 'bob'],
          participantsKey: 'alice_bob',
          createdAt: new Date(),
        });
      });

      const aliceDb = testEnv.authenticatedContext('alice', { role: 'viewer' }).firestore();
      await assertSucceeds(aliceDb.collection('chats').doc('chat_alice_bob').get());

      await assertSucceeds(
        aliceDb.collection('chats').doc('chat_alice_bob').collection('messages').doc('msg_1').set({
          senderId: 'alice',
          text: 'Hello Bob! Interested in your seed stage round.',
          createdAt: new Date(),
          readBy: ['alice'],
        })
      );
    });

    it('denies third-party non-participant from reading someone elses chat or messages', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().collection('chats').doc('chat_private').set({
          participants: ['alice', 'bob'],
          participantsKey: 'alice_bob',
          createdAt: new Date(),
        });
      });

      const eveDb = testEnv.authenticatedContext('eve', { role: 'viewer' }).firestore();
      await assertFails(eveDb.collection('chats').doc('chat_private').get());
      await assertFails(
        eveDb.collection('chats').doc('chat_private').collection('messages').get()
      );
    });
  });

  // ---------------------------------------------------------------------------
  // 5. AUDIT LOGS & CONFIG
  // ---------------------------------------------------------------------------
  describe('Audit Logs & Security Config', () => {
    it('allows admin to read audit logs', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().collection('auditLogs').doc('log_1').set({
          actorId: 'admin_1',
          action: 'REVIEW_NEWS_APPROVE',
          timestamp: new Date().toISOString(),
        });
      });

      const adminDb = testEnv.authenticatedContext('admin_1', { role: 'admin' }).firestore();
      await assertSucceeds(adminDb.collection('auditLogs').doc('log_1').get());
    });

    it('denies regular users from reading audit logs', async () => {
      const viewerDb = testEnv.authenticatedContext('user_1', { role: 'viewer' }).firestore();
      await assertFails(viewerDb.collection('auditLogs').doc('log_1').get());
    });

    it('strictly denies ANY client (including admin) from reading or writing config/uploadSecurity', async () => {
      const adminDb = testEnv.authenticatedContext('admin_1', { role: 'admin' }).firestore();
      await assertFails(adminDb.collection('config').doc('uploadSecurity').get());
      await assertFails(
        adminDb.collection('config').doc('uploadSecurity').set({ malicious: true })
      );
    });
  });
});
