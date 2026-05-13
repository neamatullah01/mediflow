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

const getPharmacistDashboardStats = async (pharmacyId: string) => {
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    totalItems,
    lowStock,
    expiringSoon,
    totalDispensedAgg,
    recentLogs,
    inventoryItems,
    topDispensedAgg,
  ] = await Promise.all([
    prisma.inventoryItem.count({ where: { pharmacyId } }),
    prisma.inventoryItem.count({
      where: {
        pharmacyId,
        status: 'LOW_STOCK',
      },
    }),
    prisma.inventoryItem.count({
      where: {
        pharmacyId,
        expiryDate: { lte: thirtyDaysFromNow },
      },
    }),
    prisma.dispensingLog.aggregate({
      _sum: { quantityDispensed: true },
      where: { pharmacyId, dispensedAt: { gte: today } },
    }),
    prisma.dispensingLog.findMany({
      where: { pharmacyId, dispensedAt: { gte: sevenDaysAgo } },
      select: { quantityDispensed: true, dispensedAt: true },
    }),
    prisma.inventoryItem.findMany({
      where: { pharmacyId },
      select: { drug: { select: { category: true } } },
    }),
    prisma.dispensingLog.groupBy({
      by: ['drugId'],
      _sum: { quantityDispensed: true },
      where: { pharmacyId, dispensedAt: { gte: startOfMonth } },
      orderBy: { _sum: { quantityDispensed: 'desc' } },
      take: 5,
    }),
  ]);

  // Process Dispensing Activity
  const activityMap: Record<string, number> = {};
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  for (let i = 0; i < 7; i++) {
    const d = new Date(sevenDaysAgo);
    d.setDate(d.getDate() + i);
    const dayName = days[d.getDay()] as string;
    activityMap[dayName] = 0;
  }
  recentLogs.forEach((log) => {
    const dayName = days[new Date(log.dispensedAt).getDay()] as string;
    if (activityMap[dayName] !== undefined) {
      activityMap[dayName] += log.quantityDispensed;
    }
  });
  const dispensingActivity = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(sevenDaysAgo);
    d.setDate(d.getDate() + i);
    const dayName = days[d.getDay()] as string;
    dispensingActivity.push({ name: dayName, total: activityMap[dayName] || 0 });
  }

  // Process Inventory Mix
  const categoryCounts: Record<string, number> = {};
  inventoryItems.forEach((item) => {
    const cat = item.drug.category;
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });
  const colors = [
    '#0ea5e9',
    '#f43f5e',
    '#10b981',
    '#f59e0b',
    '#8b5cf6',
    '#ec4899',
    '#14b8a6',
    '#f97316',
  ];
  const inventoryMix = Object.entries(categoryCounts).map(([name, value], i) => ({
    name,
    value,
    color: colors[i % colors.length],
  }));

  // Process Top Dispensed
  const drugIds = topDispensedAgg.map((d) => d.drugId);
  const drugs = await prisma.drug.findMany({
    where: { id: { in: drugIds } },
    select: { id: true, name: true },
  });
  const drugMap = Object.fromEntries(drugs.map((d) => [d.id, d.name]));
  const topDispensed = topDispensedAgg.map((d) => ({
    id: d.drugId,
    name: drugMap[d.drugId] || 'Unknown Drug',
    qty: d._sum.quantityDispensed || 0,
  }));

  return {
    stats: {
      totalItems,
      lowStock,
      expiringSoon,
      totalDispensed: totalDispensedAgg._sum.quantityDispensed || 0,
    },
    dispensingActivity,
    inventoryMix,
    topDispensed,
  };
};

const pharmacyService = {
  getAllPharmacies,
  getPharmacyById,
  updatePharmacy,
  updateStatus,
  getPharmacistDashboardStats,
};

export default pharmacyService;
