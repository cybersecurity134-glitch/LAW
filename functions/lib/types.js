"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateChatSchema = exports.VerifyUploadPasswordSchema = exports.SetUploadPasswordSchema = exports.SetUserRoleSchema = exports.ReviewNewsSchema = exports.SubmitNewsSchema = exports.NewsStatusEnum = exports.CategoryEnum = void 0;
const zod_1 = require("zod");
exports.CategoryEnum = zod_1.z.enum([
    'new_startup',
    'govt_scheme',
    'funding_option',
    'investment',
    'event',
    'problem_fix',
]);
exports.NewsStatusEnum = zod_1.z.enum([
    'pending',
    'approved',
    'rejected',
    'unpublished',
]);
exports.SubmitNewsSchema = zod_1.z.object({
    category: exports.CategoryEnum,
    title: zod_1.z.string().trim().min(5).max(200),
    summary: zod_1.z.string().trim().min(10).max(1000),
    body: zod_1.z.string().trim().min(20).max(20000),
    imageUrls: zod_1.z.array(zod_1.z.string().url()).max(10).optional().default([]),
    sourceName: zod_1.z.string().trim().min(2).max(100),
    sourceUrl: zod_1.z.string().trim().url().refine((url) => url.startsWith('https://'), { message: 'sourceUrl must be a secure https:// URL' }),
    // Category-specific fields
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    location: zod_1.z.string().max(200).optional(),
    investorName: zod_1.z.string().max(100).optional(),
    startupName: zod_1.z.string().max(100).optional(),
    amount: zod_1.z.string().max(50).optional(),
    round: zod_1.z.string().max(50).optional(),
    issuingBody: zod_1.z.string().max(150).optional(),
    eligibility: zod_1.z.string().max(500).optional(),
    deadline: zod_1.z.string().max(100).optional(),
    problem: zod_1.z.string().max(1000).optional(),
    solution: zod_1.z.string().max(1000).optional(),
});
exports.ReviewNewsSchema = zod_1.z.object({
    newsId: zod_1.z.string().min(1).max(128),
    action: zod_1.z.enum(['approve', 'reject', 'unpublish']),
    rejectionReason: zod_1.z.string().max(500).optional(),
});
exports.SetUserRoleSchema = zod_1.z.object({
    targetUid: zod_1.z.string().min(1).max(128),
    role: zod_1.z.enum(['admin', 'contributor', 'viewer']),
});
exports.SetUploadPasswordSchema = zod_1.z.object({
    password: zod_1.z.string().min(8).max(100),
});
exports.VerifyUploadPasswordSchema = zod_1.z.object({
    password: zod_1.z.string().min(1).max(100),
});
exports.CreateChatSchema = zod_1.z.object({
    recipientUid: zod_1.z.string().min(1).max(128),
});
//# sourceMappingURL=types.js.map