import { prisma } from '../../lib/prisma';
import AppError from '../../errors/AppError';
import { getSkip, calculateTotalPages } from '../../utils/pagination';
import type { CreateDrugPayload, UpdateDrugPayload } from './drug.validation';

interface DrugQuery {
  page?: number | undefined;
  limit?: number | undefined;
  search?: string | undefined;
  category?: string | undefined;
  dosageForm?: string | undefined;
  manufacturer?: string | undefined;
  sortBy?: string | undefined;
  sortOrder?: 'asc' | 'desc' | undefined;
}

const getAllDrugs = async (query: DrugQuery) => {
  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = getSkip(page, limit);
  const sortOrder = query.sortOrder === 'asc' ? 'asc' : 'desc';

  const where: any = { isActive: true };

  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { genericName: { contains: query.search, mode: 'insensitive' } },
    ];
  }
  if (query.category) where.category = query.category;
  if (query.dosageForm) where.dosageForm = query.dosageForm;
  if (query.manufacturer) {
    where.manufacturer = { contains: query.manufacturer, mode: 'insensitive' };
  }

  let orderBy: any = { createdAt: 'desc' };
  if (query.sortBy === 'name') orderBy = { name: sortOrder };
  else if (query.sortBy === 'createdAt') orderBy = { createdAt: sortOrder };

  const [drugs, total] = await Promise.all([
    prisma.drug.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        _count: { select: { reviews: true } },
      },
    }),
    prisma.drug.count({ where }),
  ]);

  return {
    drugs,
    meta: {
      page,
      limit,
      total,
      totalPages: calculateTotalPages(total, limit),
    },
  };
};

const getDrugById = async (id: string) => {
  const drug = await prisma.drug.findFirst({
    where: { id, isActive: true },
    include: {
      reviews: {
        include: {
          pharmacist: {
            select: { id: true, name: true, image: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
      _count: { select: { reviews: true } },
    },
  });

  if (!drug) {
    throw new AppError('Drug not found', 404);
  }

  // Compute average rating
  const avgRating =
    drug.reviews.length > 0
      ? drug.reviews.reduce((sum, r) => sum + r.rating, 0) / drug.reviews.length
      : 0;

  // Fetch related drugs in same category
  const relatedDrugs = await prisma.drug.findMany({
    where: {
      category: drug.category,
      id: { not: id },
      isActive: true,
    },
    take: 4,
    select: {
      id: true,
      name: true,
      genericName: true,
      category: true,
      dosageForm: true,
      manufacturer: true,
      imageUrl: true,
    },
  });

  return {
    ...drug,
    avgRating: parseFloat(avgRating.toFixed(1)),
    relatedDrugs,
  };
};

const createDrug = async (payload: CreateDrugPayload) => {
  const drug = await prisma.drug.create({
    data: {
      name: payload.name,
      genericName: payload.genericName,
      category: payload.category as any,
      dosageForm: payload.dosageForm as any,
      description: payload.description,
      uses: payload.uses,
      commonDosage: payload.commonDosage ?? null,
      sideEffects: payload.sideEffects ?? [],
      contraindications: payload.contraindications ?? [],
      storage: payload.storage ?? null,
      manufacturer: payload.manufacturer ?? null,
      imageUrl: payload.imageUrl ?? null,
    },
  });

  return drug;
};

const updateDrug = async (id: string, payload: UpdateDrugPayload) => {
  const existing = await prisma.drug.findFirst({ where: { id, isActive: true } });
  if (!existing) {
    throw new AppError('Drug not found', 404);
  }

  const updateData = Object.fromEntries(
    Object.entries(payload).filter(([, v]) => v !== undefined),
  );

  const updated = await prisma.drug.update({
    where: { id },
    data: updateData,
  });

  return updated;
};

const deleteDrug = async (id: string) => {
  const existing = await prisma.drug.findFirst({ where: { id, isActive: true } });
  if (!existing) {
    throw new AppError('Drug not found', 404);
  }

  // Soft delete
  await prisma.drug.update({
    where: { id },
    data: { isActive: false },
  });
};

const drugService = {
  getAllDrugs,
  getDrugById,
  createDrug,
  updateDrug,
  deleteDrug,
};

export default drugService;
