# Startup Pulse & Networking App - Production Firebase Backend Architecture & Operations Manual

This document provides complete architectural specifications, deployment steps, security verification, and self-review checklists for the Firebase backend.

---

## 1. Project Directory Structure

```text
/
├── firebase.json                      # Firebase configuration (Firestore, Storage, Functions, Emulators)
├── .firebaserc                        # Firebase target project mapping (organic-optics-c41j7)
├── firebase-applet-config.json        # Client Firebase configuration
├── firebase-blueprint.json            # Intermediate representation (IR) schema
├── firestore.rules                    # Hardened ABAC / Zero-Trust security rules
├── storage.rules                      # Storage bucket rules (5MB image restriction, author-scoped)
├── firestore.indexes.json             # Composite queries & order-by indexes
├── tests/
│   └── firestore.rules.test.ts        # Unit test suite verifying allowed/denied cases per role
├── functions/                         # Cloud Functions (2nd Gen, TypeScript)
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/
│   │   ├── admin.ts                   # Firebase Admin SDK singleton
│   │   ├── types.ts                   # Zod schemas & TypeScript definitions
│   │   ├── auth.ts                    # setUserRole (admin-only)
│   │   ├── password.ts                # setUploadPassword & verifyUploadPassword (scrypt, rate-limited)
│   │   ├── news.ts                    # submitNews & reviewNews (audit-logged, real citations)
│   │   ├── chat.ts                    # createOrGetChat, onChatCreated, onMessageCreated (FCM push)
│   │   ├── cleanup.ts                 # cleanupStaleData (scheduled maintenance)
│   │   └── index.ts                   # Functions entry point with concurrency/timeout limits
│   └── scripts/
│       └── initAdmin.ts               # One-time bootstrap script for primary admin
└── src/
    └── services/                      # Production client service layer
        ├── firebase.ts                # SDK init with multi-tab offline caching & ABAC error handler
        ├── authService.ts             # Auth state listener, custom claims refresh, roles
        ├── uploadSecurityService.ts   # Password verification & session management
        ├── newsService.ts             # Cursor pagination (20/pg), real-news validation
        ├── chatService.ts             # 1-on-1 chats, read receipts, unbounded listener guards
        ├── storageService.ts          # Client-side canvas image compression (< 5MB)
        └── notificationService.ts     # Web push registration
```

---

## 2. Server-Enforced Roles (Custom Claims)

Three distinct tiers are enforced at the server level via Firebase Auth custom claims:

| Role | Permissions | Enforcement Layer |
|---|---|---|
| **Admin** | Full control: set upload password, approve/reject/unpublish news, promote/demote users, delete any post, read audit logs. | `request.auth.token.role == 'admin'`, `setUserRole` callable, `reviewNews` callable |
| **Contributor** | Can submit news (only after unlocking with upload password). Can edit and delete only their own pending submissions. | `request.auth.token.role == 'contributor'`, `uploadPermissionUntil > request.time`, `submitNews` |
| **Viewer** | Read approved news, participate in 1-on-1 networking chat, manage own profile. Read-only on news. | Default on new user signup. Rules deny create/update/delete on `/news`. |

### Creating the First Admin
To safely bootstrap the initial administrator:
```bash
# In the functions directory or root with admin credentials:
npx ts-node functions/scripts/initAdmin.ts cybersecurity134@gmail.com
```
This script assigns the `{ role: 'admin' }` custom claim and creates the user document with admin privileges.

---

## 3. Secret Upload Password Mechanism

1. **Storage Security**:
   - The password is **never** stored in plaintext.
   - It is salted with 16 cryptographically secure random bytes and hashed using `scrypt` (64-byte key).
   - Stored in `config/uploadSecurity` which Firestore security rules make **unreadable and unwritable** by all clients (`allow read, write: if false;`).

2. **Rate Limiting & Lockout**:
   - Every verification attempt is tracked in `config/uploadSecurity/attempts/{uid}`.
   - After 5 consecutive failed attempts, the account is locked for 15 minutes.
   - Lockout remaining time is dynamically returned to the client.
   - Failed attempts are recorded in `auditLogs`.

3. **Short-Lived Permission**:
   - Upon successful verification, the Cloud Function sets the custom claim `uploadPermissionUntil: Date.now() + 1800000` (30 minutes).
   - Firestore rules and Storage rules verify `request.auth.token.uploadPermissionUntil > request.time.toMillis()` before permitting any upload or creation.

---

## 4. Real-News Integrity & Data Validation

- **No AI Generation**: All news items must be authored by verified users with explicit real citations.
- **Mandatory Source Enforcement**:
  - `sourceName`: 2–100 characters publisher/entity.
  - `sourceUrl`: Strictly validated to be a secure URL beginning with `https://`.
- **Editorial Review Lifecycle**:
  - Submissions enter in `status: "pending"`.
  - Only administrators can move status to `approved`, `rejected` (with mandatory reason), or `unpublished` via the `reviewNews` Cloud Function.
  - Viewers can only query and read documents where `status == "approved"`.
  - Contributors can only edit or delete their own submissions while `status == "pending"`. Once approved, the document is locked from author modification.

---

## 5. Direct 1-on-1 Networking Chat

- **Duplicate Prevention**: Chat document IDs or queries use `participantsKey` (`minUid_maxUid`). Cloud Function `createOrGetChat` uses a Firestore transaction to guarantee that the same two founders never get duplicate conversation threads.
- **Strict Privacy**: Security rules permit reads and writes only if `request.auth.uid in resource.data.participants`. Non-participants are completely denied.
- **Immutable Messages**: Messages in `/chats/{chatId}/messages/{messageId}` can never be updated or deleted by clients.
- **Read Receipts & Unread Counts**: Parent chat tracks `unreadCounts.{uid}` without reading whole message subcollections. Reading updates `readBy` array atomically via batched writes.
- **Push Notifications**: Trigger functions `onChatCreated` and `onMessageCreated` send FCM multicast messages and automatically purge invalid or unregistered tokens from the user profile.

---

## 6. Exact Step-by-Step Deployment Instructions

### Step 1: Firebase Console Setup
1. Visit the [Firebase Console](https://console.firebase.google.com/project/organic-optics-c41j7).
2. **Authentication**:
   - Go to **Build** &rarr; **Authentication** &rarr; **Sign-in method**.
   - Enable **Email/Password**.
   - Enable **Google** provider.
3. **Cloud Firestore**:
   - Go to **Build** &rarr; **Firestore Database**.
   - Ensure the database instance is active in native mode.
4. **Cloud Storage**:
   - Go to **Build** &rarr; **Storage** &rarr; click **Get Started** if not already enabled.
5. **Firebase Cloud Messaging**:
   - Go to **Project Settings** &rarr; **Cloud Messaging** &rarr; generate Web Push certificates (VAPID key) if web push is desired.

### Step 2: Deploy Security Rules and Indexes
From your terminal:
```bash
# 1. Login to Firebase CLI
firebase login

# 2. Deploy Firestore Rules and Indexes
firebase deploy --only firestore:rules,firestore:indexes

# 3. Deploy Storage Rules
firebase deploy --only storage
```

### Step 3: Deploy Cloud Functions
```bash
# 1. Enter functions folder and build TypeScript
cd functions
npm install
npm run build

# 2. Deploy 2nd Gen Functions
firebase deploy --only functions
```

### Step 4: Bootstrap First Admin
```bash
npx ts-node scripts/initAdmin.ts cybersecurity134@gmail.com
```

### Step 5: Test with Firebase Emulator Suite (Local Testing)
```bash
firebase emulators:start
# In another terminal:
npm test
```

---

## 7. Final Self-Review Checklist

- [x] **Security Default Deny**: `match /{document=**} { allow read, write: if false; }` at top of rules.
- [x] **Zero Client Privilege Escalation**: Users can never modify their own `role` field; roles are strictly custom claims set by admin-only Cloud Function.
- [x] **Zero Secrets in Client Code**: Secret upload password hash is stored only in `config/uploadSecurity` with client read/write strictly denied (`if false;`).
- [x] **Timing-Safe Comparison**: `crypto.timingSafeEqual` used to prevent side-channel timing attacks during password verification.
- [x] **Rate Limiting & Lockout**: 5 failed attempts locks upload session for 15 minutes.
- [x] **Real-News Citations**: Required `sourceName` and secure `https://` `sourceUrl` on all news items.
- [x] **Unbounded Query Guard**: Feed queries and chat messages strictly bounded to page size 20 with cursor-based pagination.
- [x] **Offline Multi-Tab Caching**: Enabled via `persistentLocalCache` and `persistentMultipleTabManager`.
- [x] **Client-Side Compression**: Images compressed to JPEG/WebP via Canvas before hitting Storage limits.
- [x] **Composite Indexes Configured**: Every compound query (`status` + `createdAt`, `status` + `category` + `createdAt`, `authorId` + `status`, `participants` + `lastMessageAt`) mapped in `firestore.indexes.json`.
