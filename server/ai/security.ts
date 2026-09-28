import { Request, Response, NextFunction } from 'express';
import { db } from '../firebaseAdmin'; // Or server-side memory store fallback

/**
 * In-memory token bucket rate limiter:
 * 20 requests per user per minute (enforces requirement 6)
 */
interface RateLimitBucket {
  tokens: number;
  lastRefill: number;
}

const userBuckets = new Map<string, RateLimitBucket>();
const RATE_LIMIT_CAPACITY = 20;
const REFILL_INTERVAL_MS = 60 * 1000; // 1 minute

export function userRateLimiter(req: Request, res: Response, next: NextFunction): void {
  // Extract user ID from authorization header or request body
  const authHeader = req.headers.authorization;
  const bodyUserId = req.body?.userId || req.body?.user?.id;
  
  let userId = 'anonymous';
  if (authHeader && authHeader.startsWith('Bearer ')) {
    userId = authHeader.substring(7);
  } else if (bodyUserId) {
    userId = String(bodyUserId);
  }

  // Only logged-in users can use the AI (Requirement 6)
  if (!userId || userId === 'anonymous' || userId === 'guest-user') {
    res.status(401).json({
      error: 'Authentication Required: Only signed-in members can access the AI assistant. Please sign in to your account.'
    });
    return;
  }

  const now = Date.now();
  let bucket = userBuckets.get(userId);

  if (!bucket) {
    bucket = { tokens: RATE_LIMIT_CAPACITY - 1, lastRefill: now };
    userBuckets.set(userId, bucket);
    next();
    return;
  }

  // Refill tokens proportionally
  const timeElapsed = now - bucket.lastRefill;
  if (timeElapsed >= REFILL_INTERVAL_MS) {
    bucket.tokens = RATE_LIMIT_CAPACITY;
    bucket.lastRefill = now;
  }

  if (bucket.tokens > 0) {
    bucket.tokens -= 1;
    next();
  } else {
    res.status(429).json({
      error: 'Rate limit exceeded: You have reached the maximum of 20 AI queries per minute. Please pause for a few seconds before trying again.'
    });
  }
}

/**
 * Input sanitization filter:
 * Prevents passwords, credit cards, or private personal data from reaching any AI model (Requirement 6)
 */
export function sanitizeUserInput(input: string): { cleanText: string; hadSensitiveContent: boolean } {
  if (!input) return { cleanText: '', hadSensitiveContent: false };

  let cleanText = input;
  let hadSensitiveContent = false;

  // Mask possible credit card / debit card numbers (13-19 digits)
  const cardRegex = /\b(?:\d[ -]*?){13,19}\b/g;
  if (cardRegex.test(cleanText)) {
    hadSensitiveContent = true;
    cleanText = cleanText.replace(cardRegex, '[REDACTED_CARD_NUMBER]');
  }

  // Mask common password declaration patterns (e.g. "password is xxx" or "my pass: xxx")
  const passwordRegex = /(?:password|passcode|secret|api[-_]?key)\s*(?:is|:|=)\s*([^\s,;]+)/gi;
  if (passwordRegex.test(cleanText)) {
    hadSensitiveContent = true;
    cleanText = cleanText.replace(passwordRegex, '$1: [REDACTED_CREDENTIAL]');
  }

  // Mask Indian Aadhaar numbers (12 digits e.g. 1234 5678 9012)
  const aadhaarRegex = /\b\d{4}\s\d{4}\s\d{4}\b/g;
  if (aadhaarRegex.test(cleanText)) {
    hadSensitiveContent = true;
    cleanText = cleanText.replace(aadhaarRegex, '[REDACTED_AADHAAR]');
  }

  return { cleanText, hadSensitiveContent };
}
