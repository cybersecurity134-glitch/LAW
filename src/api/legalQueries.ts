import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  LawItem, 
  LawCategory, 
  SearchFilters, 
  LegalUpdateHistory, 
  LegalCircularNotice, 
  HelplineDirectoryItem, 
  SyncAuditLog, 
  SyncStatusResponse 
} from '../types';
import { LAWS_DATABASE, UPDATE_HISTORY } from '../data/laws';
import { CATEGORIES } from '../data/categories';
import { queryClient } from '../lib/queryClient';

// Query Keys for cache invalidation & isolation
export const QUERY_KEYS = {
  laws: (filters?: Partial<SearchFilters>) => ['laws', filters ?? {}] as const,
  lawDetail: (id: string) => ['law', id] as const,
  categories: ['categories'] as const,
  updates: ['updates'] as const,
  circulars: ['circulars'] as const,
  helplines: ['helplines'] as const,
  syncStatus: ['sync-status'] as const,
  auditLogs: ['audit-logs'] as const,
};

// ==========================================
// 1. Fetchers with resilient offline fallback
// ==========================================

export async function fetchCategories(): Promise<LawCategory[]> {
  try {
    const res = await fetch('/api/categories');
    if (!res.ok) throw new Error(`Failed to fetch categories: ${res.statusText}`);
    const data = await res.json();
    return data.categories || CATEGORIES;
  } catch (err) {
    // Graceful offline fallback to bundled categories
    return CATEGORIES;
  }
}

export async function fetchLaws(filters?: Partial<SearchFilters>): Promise<LawItem[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.query) params.set('q', filters.query);
    if (filters?.category_id && filters.category_id !== 'all') params.set('category_id', filters.category_id);
    if (filters?.state && filters.state !== 'all') params.set('state', filters.state);
    if (filters?.bailable && filters.bailable !== 'all') params.set('bailable', filters.bailable);
    if (filters?.cognizable && filters.cognizable !== 'all') params.set('cognizable', filters.cognizable);

    const url = `/api/laws${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch laws: ${res.statusText}`);
    const data = await res.json();
    return data.laws || LAWS_DATABASE;
  } catch (err) {
    // Graceful offline fallback
    return LAWS_DATABASE;
  }
}

export async function fetchLawById(id: string): Promise<LawItem | null> {
  if (!id) return null;
  try {
    const res = await fetch(`/api/laws/${encodeURIComponent(id)}`);
    if (!res.ok) {
      if (res.status === 404) return LAWS_DATABASE.find(l => l.id === id) || null;
      throw new Error(`Failed to fetch law ${id}: ${res.statusText}`);
    }
    const data = await res.json();
    return data.law || LAWS_DATABASE.find(l => l.id === id) || null;
  } catch (err) {
    return LAWS_DATABASE.find(l => l.id === id) || null;
  }
}

export async function fetchUpdates(): Promise<LegalUpdateHistory[]> {
  try {
    const res = await fetch('/api/updates');
    if (!res.ok) throw new Error('Failed to fetch updates');
    const data = await res.json();
    return data.updates || UPDATE_HISTORY;
  } catch {
    return UPDATE_HISTORY;
  }
}

export async function fetchCirculars(): Promise<LegalCircularNotice[]> {
  try {
    const res = await fetch('/api/circulars');
    if (!res.ok) throw new Error('Failed to fetch circulars');
    const data = await res.json();
    return data.circulars || [];
  } catch {
    return [];
  }
}

export async function fetchHelplines(): Promise<HelplineDirectoryItem[]> {
  try {
    const res = await fetch('/api/helplines');
    if (!res.ok) throw new Error('Failed to fetch helplines');
    const data = await res.json();
    return data.helplines || [];
  } catch {
    return [];
  }
}

export async function fetchSyncStatus(): Promise<SyncStatusResponse | null> {
  try {
    const res = await fetch('/api/sync/status');
    if (!res.ok) throw new Error('Failed to fetch sync status');
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchAuditLogs(): Promise<SyncAuditLog[]> {
  try {
    const res = await fetch('/api/sync/logs');
    if (!res.ok) throw new Error('Failed to fetch audit logs');
    const data = await res.json();
    return data.audit_logs || [];
  } catch {
    return [];
  }
}

// Admin API operations
export async function pushAdminUpdate(payload: Partial<LegalUpdateHistory>, passcode: string) {
  const res = await fetch('/api/admin/updates', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-key': passcode
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to push update');
  }
  return await res.json();
}

export async function pushAdminCircular(payload: Partial<LegalCircularNotice>, passcode: string) {
  const res = await fetch('/api/admin/circulars', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-key': passcode
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to push circular');
  }
  return await res.json();
}

export async function updateHelplineStatus(id: string, status: 'active' | 'degraded' | 'maintenance', notes: string | undefined, passcode: string) {
  const res = await fetch(`/api/admin/helplines/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-key': passcode
    },
    body: JSON.stringify({ status, notes })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to update helpline');
  }
  return await res.json();
}

export async function deleteAdminUpdate(id: string, passcode: string) {
  const res = await fetch(`/api/admin/updates/${id}`, {
    method: 'DELETE',
    headers: {
      'x-admin-key': passcode
    }
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to delete update');
  }
  return await res.json();
}

export async function triggerManualSync(passcode?: string) {
  const res = await fetch('/api/sync/run', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ triggered_by: passcode ? 'admin_override' : 'manual_refresh' })
  });
  if (!res.ok) throw new Error('Failed to run sync job');
  return await res.json();
}

// ==========================================
// 2. Custom React Query Hooks
// ==========================================

/**
 * Hook to retrieve categories with dynamic section counts.
 * Cached for 15 minutes to eliminate redundant API calls across navigation.
 */
export function useCategoriesQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.categories,
    queryFn: fetchCategories,
    initialData: CATEGORIES,
    staleTime: 15 * 60 * 1000,
  });
}

/**
 * Hook to retrieve and cache laws list/search results.
 */
export function useLawsQuery(filters?: Partial<SearchFilters>) {
  return useQuery({
    queryKey: QUERY_KEYS.laws(filters),
    queryFn: () => fetchLaws(filters),
    initialData: LAWS_DATABASE,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to retrieve and cache a specific law by ID.
 */
export function useLawDetailQuery(id: string | null | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.lawDetail(id || ''),
    queryFn: () => fetchLawById(id!),
    enabled: Boolean(id),
    staleTime: 30 * 60 * 1000, // Individual laws are virtually immutable
    initialData: () => (id ? LAWS_DATABASE.find(l => l.id === id) : null),
  });
}

/**
 * Hook to retrieve update history.
 */
export function useUpdatesQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.updates,
    queryFn: fetchUpdates,
    initialData: UPDATE_HISTORY,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to retrieve live circulars & public notices.
 */
export function useCircularsQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.circulars,
    queryFn: fetchCirculars,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to retrieve verified statutory helplines.
 */
export function useHelplinesQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.helplines,
    queryFn: fetchHelplines,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to retrieve sync status & audit logs.
 */
export function useSyncStatusQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.syncStatus,
    queryFn: fetchSyncStatus,
    staleTime: 2 * 60 * 1000,
  });
}

export function useAuditLogsQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.auditLogs,
    queryFn: fetchAuditLogs,
    staleTime: 2 * 60 * 1000,
  });
}

// ==========================================
// 3. Prefetching Helpers for Instant Navigation
// ==========================================

/**
 * Prefetch an individual law into React Query cache before user clicks.
 * Can be called on card mouseEnter, touchStart, or search suggestion focus.
 */
export function prefetchLawDetail(id: string) {
  if (!id) return;
  queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.lawDetail(id),
    queryFn: () => fetchLawById(id),
    staleTime: 30 * 60 * 1000,
  });
}

/**
 * Prefetch categories and section counts into cache.
 */
export function prefetchCategories() {
  queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.categories,
    queryFn: fetchCategories,
    staleTime: 15 * 60 * 1000,
  });
}

/**
 * Invalidate all legal data queries (e.g. after manual sync/refresh)
 */
export function invalidateAllLegalQueries() {
  return queryClient.invalidateQueries({
    predicate: (query) => {
      const firstKey = query.queryKey[0];
      return firstKey === 'laws' || firstKey === 'law' || firstKey === 'categories' || firstKey === 'updates';
    },
  });
}
