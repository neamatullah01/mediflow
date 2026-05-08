import { z } from 'zod';

export const createDrugValidationSchema = z.object({
  name: z.string().min(1, 'Drug name is required'),
  genericName: z.string().min(1, 'Generic name is required'),
  category: z.enum([
    'ANTIBIOTIC', 'ANALGESIC', 'ANTIDIABETIC', 'CARDIOVASCULAR',
    'VITAMIN', 'RESPIRATORY', 'ANTIFUNGAL', 'ANTIVIRAL',
    'ANTIHISTAMINE', 'GASTROINTESTINAL', 'PSYCHIATRIC', 'OTHER',
  ]),
  dosageForm: z.enum(['TABLET', 'CAPSULE', 'SYRUP', 'INJECTION', 'CREAM', 'INHALER', 'DROPS']),
  description: z.string().min(1, 'Description is required'),
  uses: z.array(z.string()).min(1, 'At least one use is required'),
  commonDosage: z.string().optional(),
  sideEffects: z.array(z.string()).default([]),
  contraindications: z.array(z.string()).default([]),
  storage: z.string().optional(),
  manufacturer: z.string().optional(),
  imageUrl: z.string().url('Invalid image URL').optional(),
});

export const updateDrugValidationSchema = createDrugValidationSchema.partial();

export type CreateDrugPayload = z.infer<typeof createDrugValidationSchema>;
export type UpdateDrugPayload = z.infer<typeof updateDrugValidationSchema>;
