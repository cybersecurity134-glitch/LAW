"use strict";
/**
 * Startup Pulse - Production Firebase Cloud Functions (2nd Gen, TypeScript)
 * Enforces server-side roles, password-protected submissions, real-news integrity,
 * and push-notified 1-on-1 networking chat.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanupStaleData = exports.onMessageCreated = exports.onChatCreated = exports.createOrGetChat = exports.reviewNews = exports.submitNews = exports.verifyUploadPassword = exports.setUploadPassword = exports.setUserRole = void 0;
var auth_1 = require("./auth");
Object.defineProperty(exports, "setUserRole", { enumerable: true, get: function () { return auth_1.setUserRole; } });
var password_1 = require("./password");
Object.defineProperty(exports, "setUploadPassword", { enumerable: true, get: function () { return password_1.setUploadPassword; } });
Object.defineProperty(exports, "verifyUploadPassword", { enumerable: true, get: function () { return password_1.verifyUploadPassword; } });
var news_1 = require("./news");
Object.defineProperty(exports, "submitNews", { enumerable: true, get: function () { return news_1.submitNews; } });
Object.defineProperty(exports, "reviewNews", { enumerable: true, get: function () { return news_1.reviewNews; } });
var chat_1 = require("./chat");
Object.defineProperty(exports, "createOrGetChat", { enumerable: true, get: function () { return chat_1.createOrGetChat; } });
Object.defineProperty(exports, "onChatCreated", { enumerable: true, get: function () { return chat_1.onChatCreated; } });
Object.defineProperty(exports, "onMessageCreated", { enumerable: true, get: function () { return chat_1.onMessageCreated; } });
var cleanup_1 = require("./cleanup");
Object.defineProperty(exports, "cleanupStaleData", { enumerable: true, get: function () { return cleanup_1.cleanupStaleData; } });
//# sourceMappingURL=index.js.map