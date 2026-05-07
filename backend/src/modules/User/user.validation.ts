import { z } from 'zod';

export const updateUserValidationSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  phone: z.string().optional(),
  image: z.string().url().optional(),
});

export const banUserValidationSchema = z.object({
  banned: z.boolean(),
  banReason: z.string().optional(),
});

export const uploadAvatarValidationSchema = z.object({
  imageUrl: z.string().url('Invalid image URL').optional(),
});

export type UpdateUserPayload = z.infer<typeof updateUserValidationSchema>;
export type BanUserPayload = z.infer<typeof banUserValidationSchema>;
export type UploadAvatarPayload = z.infer<typeof uploadAvatarValidationSchema>;
