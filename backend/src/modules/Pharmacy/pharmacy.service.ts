import { prisma } from '../../lib/prisma';
import AppError from '../../errors/AppError';
import { Role } from '../../middlewares/auth.middleware';
import { getSkip, calculateTotalPages } from '../../utils/pagination';
import type { UpdatePharmacyPayload, UpdateStatusPayload } from './pharmacy.validation';

interface PaginationQuery {
  page?: number | undefined;
  limit?: number | undefined;
  search?: string | undefined;
  status?: string | undefined;
}

const getAllPharmacies = async (query: PaginationQuery) => {
  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = getSkip(page, limit);

  const where: any = {};
  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { licenseNumber: { contains: query.search, mode: 'insensitive' } },
    ];
  }
  if (query.status) where.status = query.status;

  const [pharmacies, total] = await Promise.all([
    prisma.pharmacy.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { users: true, inventoryItems: true } },
      },
    }),
    prisma.pharmacy.count({ where }),
  ]);

  return {
    pharmacies,
    meta: {
      page,
      limit,
      total,
      totalPages: calculateTotalPages(total, limit),
    },
  };
};

const getPharmacyById = async (
  id: string,
  currentUser: { id: string; role: Role; pharmacyId: string | null },
) => {
  const pharmacy = await prisma.pharmacy.findUnique({
    where: { id },
    include: {
      users: { omit: { password: true } },
      inventoryItems: { include: { drug: true } },
      _count: { select: { users: true, inventoryItems: true, supplierOrders: true, dispensingLogs: true } },
    },
  });

  if (!pharmacy) {
    throw new AppError('Pharmacy not found', 404);
  }

  if (
    currentUser.role !== Role.ADMIN &&
    currentUser.pharmacyId !== id
  ) {
    throw new AppError('Forbidden. You do not have access to this pharmacy.', 403);
  }

  return pharmacy;
};

const updatePharmacy = async (
  id: string,
  payload: UpdatePharmacyPayload,
  currentUser: { id: string; role: Role; pharmacyId: string | null },
) => {
  const existing = await prisma.pharmacy.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError('Pharmacy not found', 404);
  }

  if (
    currentUser.role !== Role.ADMIN &&
    currentUser.pharmacyId !== id
  ) {
    throw new AppError('Forbidden. You can only update your own pharmacy.', 403);
  }

  if (payload.licenseNumber && payload.licenseNumber !== existing.licenseNumber) {
    const duplicate = await prisma.pharmacy.findUnique({
      where: { licenseNumber: payload.licenseNumber },
    });
    if (duplicate) {
      throw new AppError('License number already in use', 409);
    }
  }

  const updateData = Object.fromEntries(
    Object.entries(payload).filter(([, v]) => v !== undefined),
  );

  const updated = await prisma.pharmacy.update({
    where: { id },
    data: updateData,
    include: {
      users: { omit: { password: true } },
      _count: { select: { users: true, inventoryItems: true } },
    },
  });

  return updated;
};

const updateStatus = async (id: string, payload: UpdateStatusPayload) => {
  const existing = await prisma.pharmacy.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError('Pharmacy not found', 404);
  }

  const updated = await prisma.pharmacy.update({
    where: { id },
    data: { status: payload.status as any },
    include: {
      users: { omit: { password: true } },
      _count: { select: { users: true, inventoryItems: true } },
    },
  });

  return updated;
};

const pharmacyService = {
  getAllPharmacies,
  getPharmacyById,
  updatePharmacy,
  updateStatus,
};

export default pharmacyService;
