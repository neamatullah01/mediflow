import { z } from 'zod';

export const registerPharmacistValidationSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  pharmacyName: z.string().min(1, 'Pharmacy name is required'),
  licenseNumber: z.string().min(1, 'License number is required'),
  address: z.string().min(1, 'Address is required'),
  phone: z.string().min(1, 'Phone is required'),
});

export const loginValidationSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type RegisterPharmacistPayload = z.infer<typeof registerPharmacistValidationSchema>;
export type LoginPayload = z.infer<typeof loginValidationSchema>;
