import { z } from 'zod';

export const createOrderSchema = z.object({
  supplierName: z.string().min(1, 'Supplier name is required'),
  expectedDelivery: z.string().datetime({ message: 'Invalid date (ISO format required)' }).optional(),
  notes: z.string().optional(),
  lineItems: z
    .array(
      z.object({
        drugId: z.string().uuid('Invalid drug ID'),
        quantity: z.number().int().positive('Quantity must be positive'),
        unitPrice: z.number().positive('Unit price must be positive'),
      }),
    )
    .min(1, 'At least one line item is required'),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'SHIPPED', 'RECEIVED', 'CANCELLED']),
});

export type CreateOrderPayload = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusPayload = z.infer<typeof updateOrderStatusSchema>;
