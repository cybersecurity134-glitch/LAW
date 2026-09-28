import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';
import { authService } from './authService';

export const uploadSecurityService = {
  /**
   * Admin-only: Set or change the secret upload password
   */
  async setUploadPassword(password: string): Promise<{ success: boolean; message: string }> {
    const fn = httpsCallable<{ password: string }, { success: boolean; message: string }>(
      functions,
      'setUploadPassword'
    );
    const res = await fn({ password });
    return res.data;
  },

  /**
   * Contributor / Admin: Verify the upload password
   * Grants 30-minute upload permission
   */
  async verifyUploadPassword(password: string): Promise<{ success: boolean; expiresAt: number; message: string }> {
    const fn = httpsCallable<{ password: string }, { success: boolean; expiresAt: number; message: string }>(
      functions,
      'verifyUploadPassword'
    );
    const res = await fn({ password });

    // Refresh user's auth token so security rules immediately reflect uploadPermissionUntil claim
    await authService.refreshUserClaims();

    return res.data;
  },
};
