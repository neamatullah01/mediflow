import { z } from 'zod';

export const createBlogPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  excerpt: z.string().min(1, 'Excerpt is required'),
  content: z.string().min(1, 'Content is required'),
  coverImage: z.string().url('Invalid cover image URL').optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  readTime: z.number().int().positive().default(5),
  isPublished: z.boolean().default(false),
});

export const updateBlogPostSchema = createBlogPostSchema.partial();

export type CreateBlogPostPayload = z.infer<typeof createBlogPostSchema>;
export type UpdateBlogPostPayload = z.infer<typeof updateBlogPostSchema>;
