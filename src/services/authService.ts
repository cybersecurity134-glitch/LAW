import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut as fbSignOut, 
  onAuthStateChanged,
  updateProfile as fbUpdateProfile,
  User as FirebaseUser,
  getIdTokenResult
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { auth, db, functions, googleAuthProvider, handleFirestoreError, OperationType } from './firebase';

export type UserRole = 'admin' | 'contributor' | 'viewer';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string;
  photoURL: string | null;
  role: UserRole;
  accentColor?: string;
  theme?: 'day' | 'night' | 'system';
  uploadPermissionUntil?: number;
  fcmTokens?: string[];
  createdAt?: string;
  lastSeenAt?: string;
}

export const authService = {
  /**
   * Listen to Firebase Auth state, refresh claims, and sync Firestore user document.
   */
  subscribeToAuthState(callback: (user: AppUser | null, rawUser: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, async (rawUser) => {
      if (!rawUser) {
        callback(null, null);
        return;
      }

      try {
        // Force refresh ID token result to pick up any new custom claims (role, uploadPermissionUntil)
        const tokenResult = await getIdTokenResult(rawUser, true);
        const roleClaim = (tokenResult.claims.role as UserRole) || 
          (rawUser.email === 'cybersecurity134@gmail.com' ? 'admin' : 'viewer');
        const uploadPermissionUntil = tokenResult.claims.uploadPermissionUntil as number | undefined;

        const userDocRef = doc(db, 'users', rawUser.uid);
        let userDocSnap;
        try {
          userDocSnap = await getDoc(userDocRef);
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, `users/${rawUser.uid}`);
        }

        const now = new Date().toISOString();

        let userData: AppUser;
        if (userDocSnap?.exists()) {
          const data = userDocSnap.data();
          userData = {
            uid: rawUser.uid,
            email: rawUser.email,
            displayName: data.displayName || rawUser.displayName || 'Founder Member',
            photoURL: data.photoURL || rawUser.photoURL || null,
            role: (data.role as UserRole) || roleClaim,
            accentColor: data.accentColor || '#7C5CFF',
            theme: data.theme || 'system',
            uploadPermissionUntil,
            createdAt: data.createdAt,
            lastSeenAt: now,
          };

          // Update lastSeenAt silently
          updateDoc(userDocRef, { lastSeenAt: serverTimestamp() }).catch(() => {});
        } else {
          // Initialize fresh user profile
          userData = {
            uid: rawUser.uid,
            email: rawUser.email,
            displayName: rawUser.displayName || rawUser.email?.split('@')[0] || 'New Member',
            photoURL: rawUser.photoURL || null,
            role: roleClaim,
            accentColor: '#7C5CFF',
            theme: 'system',
            uploadPermissionUntil,
            createdAt: now,
            lastSeenAt: now,
          };

          try {
            await setDoc(userDocRef, {
              ...userData,
              createdAt: serverTimestamp(),
              lastSeenAt: serverTimestamp(),
            });
          } catch (err) {
            handleFirestoreError(err, OperationType.CREATE, `users/${rawUser.uid}`);
          }
        }

        callback(userData, rawUser);
      } catch (error) {
        console.error('Error in auth state change sync:', error);
        callback(null, rawUser);
      }
    });
  },

  /**
   * Email & Password Sign In
   */
  async signInWithEmail(email: string, pass: string): Promise<AppUser> {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
    const tokenResult = await getIdTokenResult(cred.user, true);
    const role = (tokenResult.claims.role as UserRole) || 
      (cred.user.email === 'cybersecurity134@gmail.com' ? 'admin' : 'viewer');

    return {
      uid: cred.user.uid,
      email: cred.user.email,
      displayName: cred.user.displayName || email.split('@')[0],
      photoURL: cred.user.photoURL,
      role,
    };
  },

  /**
   * Email & Password Sign Up (Defaults to "viewer" role strictly)
   */
  async signUpWithEmail(email: string, pass: string, displayName: string): Promise<AppUser> {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    if (displayName) {
      await fbUpdateProfile(cred.user, { displayName });
    }

    const now = new Date().toISOString();
    const userDocRef = doc(db, 'users', cred.user.uid);

    const initialProfile = {
      displayName: displayName || email.split('@')[0],
      email: cred.user.email,
      photoURL: null,
      role: cred.user.email === 'cybersecurity134@gmail.com' ? 'admin' : 'viewer',
      accentColor: '#7C5CFF',
      theme: 'system',
      createdAt: serverTimestamp(),
      lastSeenAt: serverTimestamp(),
    };

    try {
      await setDoc(userDocRef, initialProfile);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `users/${cred.user.uid}`);
    }

    return {
      uid: cred.user.uid,
      email: cred.user.email,
      displayName: initialProfile.displayName,
      photoURL: null,
      role: initialProfile.role as UserRole,
      createdAt: now,
    };
  },

  /**
   * Google Sign In Popup
   */
  async signInWithGoogle(): Promise<AppUser> {
    const cred = await signInWithPopup(auth, googleAuthProvider);
    const tokenResult = await getIdTokenResult(cred.user, true);
    const role = (tokenResult.claims.role as UserRole) || 
      (cred.user.email === 'cybersecurity134@gmail.com' ? 'admin' : 'viewer');

    const userDocRef = doc(db, 'users', cred.user.uid);
    const snap = await getDoc(userDocRef);

    if (!snap.exists()) {
      await setDoc(userDocRef, {
        displayName: cred.user.displayName || 'Google Member',
        email: cred.user.email,
        photoURL: cred.user.photoURL,
        role,
        accentColor: '#7C5CFF',
        theme: 'system',
        createdAt: serverTimestamp(),
        lastSeenAt: serverTimestamp(),
      });
    }

    return {
      uid: cred.user.uid,
      email: cred.user.email,
      displayName: cred.user.displayName || 'Member',
      photoURL: cred.user.photoURL,
      role,
    };
  },

  /**
   * Sign Out
   */
  async signOut(): Promise<void> {
    await fbSignOut(auth);
  },

  /**
   * Promote or demote user (Admin only via Cloud Function)
   */
  async setUserRole(targetUid: string, role: UserRole): Promise<{ success: boolean; message: string }> {
    const fn = httpsCallable<{ targetUid: string; role: UserRole }, { success: boolean; message: string }>(
      functions,
      'setUserRole'
    );
    const res = await fn({ targetUid, role });
    return res.data;
  },

  /**
   * Refresh current token to get updated claims
   */
  async refreshUserClaims(): Promise<void> {
    if (auth.currentUser) {
      await auth.currentUser.getIdToken(true);
    }
  }
};
