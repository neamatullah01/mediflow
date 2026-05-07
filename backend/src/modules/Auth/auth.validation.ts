import { z } from 'zod';

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    pharmacyName: z.string().min(1, 'Pharmacy name is required'),
    licenseNumber: z.string().min(1, 'License number is required'),
    address: z.string().min(1, 'Address is required'),
    phone: z.string().min(1, 'Phone is required'),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const authValidation = {
  registerSchema,
  loginSchema,
};
