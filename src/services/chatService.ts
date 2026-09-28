import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter, 
  getDocs, 
  doc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  serverTimestamp,
  QueryDocumentSnapshot,
  DocumentData,
  writeBatch
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions, handleFirestoreError, OperationType } from './firebase';

export interface ChatDoc {
  id: string;
  participants: string[];
  participantsKey: string;
  lastMessage: string;
  lastMessageAt: string;
  lastSenderId?: string | null;
  createdAt: string;
  unreadCounts?: Record<string, number>;
}

export interface ChatMessageDoc {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
  readBy: string[];
}

export const chatService = {
  /**
   * Start or retrieve existing 1-on-1 chat using participantsKey
   * Enforced via Cloud Function transaction.
   */
  async createOrGetChat(recipientUid: string): Promise<{ chatId: string; isNew: boolean }> {
    const fn = httpsCallable<{ recipientUid: string }, { chatId: string; isNew: boolean }>(
      functions,
      'createOrGetChat'
    );
    const res = await fn({ recipientUid });
    return res.data;
  },

  /**
   * Realtime subscription to user's chats
   * Returns unsubscribe cleanup function.
   */
  subscribeToMyChats(uid: string, callback: (chats: ChatDoc[]) => void) {
    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', uid),
      orderBy('lastMessageAt', 'desc'),
      limit(50)
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const chats: ChatDoc[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<ChatDoc, 'id'>),
        }));
        callback(chats);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'chats');
      }
    );
  },

  /**
   * Realtime subscription to messages inside a chat room (ordered by createdAt asc)
   * Limit 50 recent messages to prevent unbounded listener cost.
   */
  subscribeToMessages(chatId: string, callback: (messages: ChatMessageDoc[]) => void) {
    const q = query(
      collection(db, `chats/${chatId}/messages`),
      orderBy('createdAt', 'asc'),
      limit(60)
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const messages: ChatMessageDoc[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            senderId: data.senderId,
            text: data.text,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt || new Date().toISOString(),
            readBy: data.readBy || [],
          };
        });
        callback(messages);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, `chats/${chatId}/messages`);
      }
    );
  },

  /**
   * Send a new message to a chat
   * Message is immutable after creation.
   */
  async sendMessage(chatId: string, senderId: string, text: string): Promise<string> {
    const trimmed = text.trim();
    if (!trimmed) throw new Error('Message text cannot be empty.');

    const messagesCol = collection(db, `chats/${chatId}/messages`);
    const newMsgRef = doc(messagesCol);

    try {
      await setDoc(newMsgRef, {
        senderId,
        text: trimmed,
        createdAt: serverTimestamp(),
        readBy: [senderId],
      });
      return newMsgRef.id;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `chats/${chatId}/messages/${newMsgRef.id}`);
    }
  },

  /**
   * Mark messages as read by current user and clear unread count for this user
   */
  async markAsRead(chatId: string, currentUid: string, unreadMessages: ChatMessageDoc[]): Promise<void> {
    if (unreadMessages.length === 0) return;

    try {
      const batch = writeBatch(db);

      // Update readBy on unread message documents
      unreadMessages.forEach((msg) => {
        if (!msg.readBy.includes(currentUid)) {
          const msgRef = doc(db, `chats/${chatId}/messages`, msg.id);
          batch.update(msgRef, {
            readBy: Array.from(new Set([...msg.readBy, currentUid])),
          });
        }
      });

      // Clear current user's unread counter on the parent chat
      const chatRef = doc(db, 'chats', chatId);
      batch.update(chatRef, {
        [`unreadCounts.${currentUid}`]: 0,
      });

      await batch.commit();
    } catch (err) {
      console.warn('Silent read receipt sync error:', err);
    }
  },

  /**
   * Cursor-based pagination for older message history
   */
  async loadOlderMessages(
    chatId: string,
    lastVisible: QueryDocumentSnapshot<DocumentData>,
    pageSize = 20
  ): Promise<{ messages: ChatMessageDoc[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> {
    try {
      const q = query(
        collection(db, `chats/${chatId}/messages`),
        orderBy('createdAt', 'desc'),
        startAfter(lastVisible),
        limit(pageSize)
      );

      const snap = await getDocs(q);
      const messages: ChatMessageDoc[] = snap.docs.reverse().map((d) => ({
        id: d.id,
        ...(d.data() as Omit<ChatMessageDoc, 'id'>),
      }));

      const newLast = snap.docs.length > 0 ? snap.docs[snap.docs.length - 1] : null;
      return { messages, lastDoc: newLast };
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, `chats/${chatId}/messages`);
    }
  }
};
