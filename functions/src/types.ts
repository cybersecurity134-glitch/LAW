import { z } from 'zod';

export type UserRole = 'admin' | 'contributor' | 'viewer';

export const CategoryEnum = z.enum([
  'new_startup',
  'govt_scheme',
  'funding_option',
  'investment',
  'event',
  'problem_fix',
]);

export const NewsStatusEnum = z.enum([
  'pending',
  'approved',
  'rejected',
  'unpublished',
]);

export const SubmitNewsSchema = z.object({
  category: CategoryEnum,
  title: z.string().trim().min(5).max(200),
  summary: z.string().trim().min(10).max(1000),
  body: z.string().trim().min(20).max(20000),
  imageUrls: z.array(z.string().url()).max(10).optional().default([]),
  sourceName: z.string().trim().min(2).max(100),
  sourceUrl: z.string().trim().url().refine(
    (url: string) => url.startsWith('https://'),
    { message: 'sourceUrl must be a secure https:// URL' }
  ),
  // Category-specific fields
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  location: z.string().max(200).optional(),
  investorName: z.string().max(100).optional(),
  startupName: z.string().max(100).optional(),
  amount: z.string().max(50).optional(),
  round: z.string().max(50).optional(),
  issuingBody: z.string().max(150).optional(),
  eligibility: z.string().max(500).optional(),
  deadline: z.string().max(100).optional(),
  problem: z.string().max(1000).optional(),
  solution: z.string().max(1000).optional(),
});

export const ReviewNewsSchema = z.object({
  newsId: z.string().min(1).max(128),
  action: z.enum(['approve', 'reject', 'unpublish']),
  rejectionReason: z.string().max(500).optional(),
});

export const SetUserRoleSchema = z.object({
  targetUid: z.string().min(1).max(128),
  role: z.enum(['admin', 'contributor', 'viewer']),
});

export const SetUploadPasswordSchema = z.object({
  password: z.string().min(8).max(100),
});

export const VerifyUploadPasswordSchema = z.object({
  password: z.string().min(1).max(100),
});

export const CreateChatSchema = z.object({
  recipientUid: z.string().min(1).max(128),
});
