/**
 * Startup Pulse - Production Firebase Cloud Functions (2nd Gen, TypeScript)
 * Enforces server-side roles, password-protected submissions, real-news integrity,
 * push-notified 1-on-1 networking chat, and 3-provider AI verification.
 */

export { setUserRole } from './auth';
export { setUploadPassword, verifyUploadPassword } from './password';
export { submitNews, reviewNews } from './news';
export { createOrGetChat, onChatCreated, onMessageCreated } from './chat';
export { cleanupStaleData } from './cleanup';
export { verifyNewsWithAIProviders } from './aiVerification';
