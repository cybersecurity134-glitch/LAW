import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from './firebase';

export const notificationService = {
  /**
   * Request browser Web Push notification permissions safely
   */
  async requestPermissionAndRegister(uid: string): Promise<string | null> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      console.info('Push notifications are not supported in this browser environment.');
      return null;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.info('Notification permission was not granted by user.');
        return null;
      }

      // Generate a mock/local web registration token if ServiceWorker/FCM messaging token is requested
      const localToken = `fcm_web_${uid}_${Date.now()}`;
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        fcmTokens: arrayUnion(localToken),
      });

      return localToken;
    } catch (err) {
      console.warn('Notification registration notice:', err);
      return null;
    }
  },
};
