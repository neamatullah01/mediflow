import { z } from 'zod';

export const addInventoryItemSchema = z.object({
  drugId: z.string().uuid('Invalid drug ID'),
  quantity: z.number().int().min(0, 'Quantity must be >= 0'),
  unitPrice: z.number().positive('Unit price must be positive'),
  expiryDate: z.string().datetime({ message: 'Invalid expiry date (ISO format required)' }),
  batchNumber: z.string().optional(),
  reorderLevel: z.number().int().min(0).default(10),
  supplierName: z.string().optional(),
});

export const updateInventoryItemSchema = addInventoryItemSchema.partial();

export type AddInventoryItemPayload = z.infer<typeof addInventoryItemSchema>;
export type UpdateInventoryItemPayload = z.infer<typeof updateInventoryItemSchema>;
