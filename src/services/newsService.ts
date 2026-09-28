import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  QueryDocumentSnapshot,
  DocumentData
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions, handleFirestoreError, OperationType } from './firebase';

export type NewsCategory = 
  | 'new_startup' 
  | 'govt_scheme' 
  | 'funding_option' 
  | 'investment' 
  | 'event' 
  | 'problem_fix';

export type NewsStatus = 'pending' | 'approved' | 'rejected' | 'unpublished';

export interface NewsItemDoc {
  id: string;
  category: NewsCategory;
  title: string;
  summary: string;
  body: string;
  imageUrls: string[];
  authorId: string;
  authorName: string;
  sourceName: string;
  sourceUrl: string;
  status: NewsStatus;
  verifiedBy?: string | null;
  verifiedAt?: string | null;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt?: string;
  publishedAt?: string;
  // Category-specific
  startDate?: string;
  endDate?: string;
  location?: string;
  investorName?: string;
  startupName?: string;
  amount?: string;
  round?: string;
  issuingBody?: string;
  eligibility?: string;
  deadline?: string;
  problem?: string;
  solution?: string;
  aiVerification?: {
    status: 'ai_verified' | 'manual_review_required';
    consensusDate: string;
    agreementRatio: number;
    summary: string;
    providerResults?: Record<string, any>;
  };
}

export interface PaginatedNewsResult {
  items: NewsItemDoc[];
  lastVisible: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}

export const newsService = {
  /**
   * Fetch approved news feed with cursor pagination (page size = 20)
   */
  async getApprovedNews(
    category?: NewsCategory | 'all',
    lastVisibleDoc?: QueryDocumentSnapshot<DocumentData> | null,
    pageSize = 20
  ): Promise<PaginatedNewsResult> {
    const colRef = collection(db, 'news');
    let q;

    try {
      if (category && category !== 'all') {
        if (lastVisibleDoc) {
          q = query(
            colRef,
            where('status', '==', 'approved'),
            where('category', '==', category),
            orderBy('createdAt', 'desc'),
            startAfter(lastVisibleDoc),
            limit(pageSize)
          );
        } else {
          q = query(
            colRef,
            where('status', '==', 'approved'),
            where('category', '==', category),
            orderBy('createdAt', 'desc'),
            limit(pageSize)
          );
        }
      } else {
        if (lastVisibleDoc) {
          q = query(
            colRef,
            where('status', '==', 'approved'),
            orderBy('createdAt', 'desc'),
            startAfter(lastVisibleDoc),
            limit(pageSize)
          );
        } else {
          q = query(
            colRef,
            where('status', '==', 'approved'),
            orderBy('createdAt', 'desc'),
            limit(pageSize)
          );
        }
      }

      const snap = await getDocs(q);
      const items: NewsItemDoc[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<NewsItemDoc, 'id'>),
      }));

      const newLastVisible = snap.docs.length > 0 ? snap.docs[snap.docs.length - 1] : null;

      return {
        items,
        lastVisible: newLastVisible,
        hasMore: snap.docs.length === pageSize,
      };
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'news');
    }
  },

  /**
   * Contributor: Fetch submissions authored by the current user
   */
  async getMySubmissions(authorId: string): Promise<NewsItemDoc[]> {
    try {
      const q = query(
        collection(db, 'news'),
        where('authorId', '==', authorId),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<NewsItemDoc, 'id'>),
      }));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, `news?authorId=${authorId}`);
    }
  },

  /**
   * Admin: Fetch all pending news submissions awaiting review
   */
  async getPendingSubmissions(): Promise<NewsItemDoc[]> {
    try {
      const q = query(
        collection(db, 'news'),
        where('status', '==', 'pending'),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<NewsItemDoc, 'id'>),
      }));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'news?status=pending');
    }
  },

  /**
   * Submit new article through Cloud Function (enforces server validation & status: pending)
   */
  async submitNews(data: Omit<NewsItemDoc, 'id' | 'authorId' | 'authorName' | 'status' | 'createdAt'>): Promise<{ newsId: string }> {
    const fn = httpsCallable<any, { success: boolean; newsId: string }>(functions, 'submitNews');
    const res = await fn(data);
    return { newsId: res.data.newsId };
  },

  /**
   * Admin review (approve, reject with reason, unpublish)
   */
  async reviewNews(
    newsId: string,
    action: 'approve' | 'reject' | 'unpublish',
    rejectionReason?: string
  ): Promise<void> {
    const fn = httpsCallable<any, { success: boolean }>(functions, 'reviewNews');
    await fn({ newsId, action, rejectionReason });
  },

  /**
   * Contributor: Update their own pending news
   */
  async updatePendingNews(
    newsId: string,
    updates: Partial<NewsItemDoc>
  ): Promise<void> {
    try {
      const docRef = doc(db, 'news', newsId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `news/${newsId}`);
    }
  },

  /**
   * Contributor or Admin: Delete a pending news submission
   */
  async deleteNews(newsId: string): Promise<void> {
    try {
      const docRef = doc(db, 'news', newsId);
      await deleteDoc(docRef);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `news/${newsId}`);
    }
  },

  /**
   * Get single news item by ID
   */
  async getNewsById(newsId: string): Promise<NewsItemDoc | null> {
    try {
      const docRef = doc(db, 'news', newsId);
      const snap = await getDoc(docRef);
      if (!snap.exists()) return null;
      return { id: snap.id, ...(snap.data() as Omit<NewsItemDoc, 'id'>) };
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, `news/${newsId}`);
    }
  },

  /**
   * Trigger Parallel 3-Provider AI Verification (Gemini, OpenAI, Claude)
   */
  async verifyNewsWithAI(newsItem: NewsItemDoc, userId?: string): Promise<{
    consensus: 'ai_verified' | 'manual_review_required';
    agreementRatio: number;
    results: Record<string, any>;
    adminSummary: string;
  }> {
    const res = await fetch('/api/ai/verify-news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newsItem, userId }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Verification failed' }));
      throw new Error(err.error || 'Failed to complete 3-provider AI verification');
    }
    return res.json();
  }
};
