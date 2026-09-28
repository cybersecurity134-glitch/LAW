import { adminDb } from '../firebaseAdmin';

export interface AILogEntry {
  id?: string;
  timestamp: string;
  userId: string;
  taskType: 'fast' | 'longText' | 'verification';
  provider: 'gemini' | 'openai' | 'anthropic';
  modelUsed: string;
  durationMs: number;
  tokensEstimate?: number;
  status: 'success' | 'fallback' | 'failed';
  newsId?: string;
}

// In-memory buffer for admin observability
const localAILogs: AILogEntry[] = [];

/**
 * Record model usage audit log strictly accessible by admins
 */
export async function logAIUsage(entry: AILogEntry): Promise<void> {
  localAILogs.unshift(entry);
  if (localAILogs.length > 200) localAILogs.pop();

  try {
    await adminDb.collection('auditLogs').add({
      actorId: entry.userId,
      action: 'AI_PROVIDER_EXECUTION',
      targetId: entry.newsId || 'general_query',
      timestamp: entry.timestamp,
      details: {
        provider: entry.provider,
        modelUsed: entry.modelUsed,
        taskType: entry.taskType,
        durationMs: entry.durationMs,
        status: entry.status,
      },
    });
  } catch (err: any) {
    // Non-blocking log write
    console.warn('[AI Logger] Notice logging to firestore:', err?.message || err);
  }
}

export function getLocalAILogs(limit = 50): AILogEntry[] {
  return localAILogs.slice(0, limit);
}
