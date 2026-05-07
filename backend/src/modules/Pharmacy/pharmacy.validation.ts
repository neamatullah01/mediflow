import { z } from 'zod';

export const updatePharmacyValidationSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  address: z.string().min(1, 'Address is required').optional(),
  phone: z.string().optional(),
  licenseNumber: z.string().optional(),
});

export const updateStatusValidationSchema = z.object({
  status: z.enum(['ACTIVE', 'SUSPENDED']),
});

export type UpdatePharmacyPayload = z.infer<typeof updatePharmacyValidationSchema>;
export type UpdateStatusPayload = z.infer<typeof updateStatusValidationSchema>;
