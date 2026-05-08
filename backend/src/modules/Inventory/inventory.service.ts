import { prisma } from '../../lib/prisma';
import AppError from '../../errors/AppError';
import { getSkip, calculateTotalPages } from '../../utils/pagination';
import type {
  AddInventoryItemPayload,
  UpdateInventoryItemPayload,
} from './inventory.validation';

// ─────────────────────────────────────────────
// Helper: compute inventory status (PRD §14 rule 4)
// ─────────────────────────────────────────────
const computeStatus = (
  quantity: number,
  reorderLevel: number,
  expiryDate: Date,
): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (expiryDate < today) return 'EXPIRED';
  if (quantity === 0) return 'OUT_OF_STOCK';
  if (quantity <= reorderLevel) return 'LOW_STOCK';
  return 'IN_STOCK';
};

interface InventoryQuery {
  page?: number | undefined;
  limit?: number | undefined;
  search?: string | undefined;
  category?: string | undefined;
  status?: string | undefined;
  sortBy?: string | undefined;
  sortOrder?: 'asc' | 'desc' | undefined;
}

const getInventory = async (pharmacyId: string, query: InventoryQuery) => {
  const page = query.page || 1;
  const limit = query.limit || 20;
  const skip = getSkip(page, limit);
  const sortOrder = query.sortOrder === 'asc' ? 'asc' : 'desc';

  const where: any = { pharmacyId };
  if (query.status) where.status = query.status;
  if (query.search) {
    where.drug = {
      name: { contains: query.search, mode: 'insensitive' },
    };
  }
  if (query.category) {
    where.drug = { ...(where.drug || {}), category: query.category };
  }

  let orderBy: any = { createdAt: 'desc' };
  if (query.sortBy === 'quantity') orderBy = { quantity: sortOrder };
  else if (query.sortBy === 'expiryDate') orderBy = { expiryDate: sortOrder };
  else if (query.sortBy === 'name') orderBy = { drug: { name: sortOrder } };

  const [items, total] = await Promise.all([
    prisma.inventoryItem.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: { drug: true },
    }),
    prisma.inventoryItem.count({ where }),
  ]);

  return {
    items,
    meta: { page, limit, total, totalPages: calculateTotalPages(total, limit) },
  };
};

const getInventoryItem = async (pharmacyId: string, id: string) => {
  const item = await prisma.inventoryItem.findFirst({
    where: { id, pharmacyId },
    include: { drug: true },
  });

  if (!item) throw new AppError('Inventory item not found', 404);
  return item;
};

const addItem = async (pharmacyId: string, payload: AddInventoryItemPayload) => {
  const drug = await prisma.drug.findFirst({ where: { id: payload.drugId, isActive: true } });
  if (!drug) throw new AppError('Drug not found in catalogue', 404);

  const expiryDate = new Date(payload.expiryDate);
  const status = computeStatus(payload.quantity, payload.reorderLevel ?? 10, expiryDate);

  const item = await prisma.inventoryItem.create({
    data: {
      pharmacyId,
      drugId: payload.drugId,
      quantity: payload.quantity,
      unitPrice: payload.unitPrice,
      expiryDate,
      batchNumber: payload.batchNumber ?? null,
      reorderLevel: payload.reorderLevel ?? 10,
      supplierName: payload.supplierName ?? null,
      status: status as any,
    },
    include: { drug: true },
  });

  return item;
};

const updateItem = async (
  pharmacyId: string,
  id: string,
  payload: UpdateInventoryItemPayload,
) => {
  const existing = await prisma.inventoryItem.findFirst({ where: { id, pharmacyId } });
  if (!existing) throw new AppError('Inventory item not found', 404);

  const quantity = payload.quantity !== undefined ? payload.quantity : existing.quantity;
  const reorderLevel =
    payload.reorderLevel !== undefined ? payload.reorderLevel : existing.reorderLevel;
  const expiryDate = payload.expiryDate
    ? new Date(payload.expiryDate)
    : existing.expiryDate;

  const status = computeStatus(quantity, reorderLevel, expiryDate);

  const updateData: any = { ...payload, status };
  if (payload.expiryDate) updateData.expiryDate = new Date(payload.expiryDate);
  if (payload.unitPrice) updateData.unitPrice = payload.unitPrice;

  const updated = await prisma.inventoryItem.update({
    where: { id },
    data: updateData,
    include: { drug: true },
  });

  return updated;
};

const deleteItem = async (pharmacyId: string, id: string) => {
  const existing = await prisma.inventoryItem.findFirst({ where: { id, pharmacyId } });
  if (!existing) throw new AppError('Inventory item not found', 404);
  await prisma.inventoryItem.delete({ where: { id } });
};

const getLowStockAlerts = async (pharmacyId: string) => {
  const items = await prisma.inventoryItem.findMany({
    where: {
      pharmacyId,
      status: { in: ['LOW_STOCK', 'OUT_OF_STOCK'] },
    },
    include: { drug: true },
    orderBy: { quantity: 'asc' },
  });
  return items;
};

const getExpiringAlerts = async (pharmacyId: string) => {
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const items = await prisma.inventoryItem.findMany({
    where: {
      pharmacyId,
      expiryDate: { lte: thirtyDaysFromNow },
      status: { not: 'EXPIRED' },
      quantity: { gt: 0 },
    },
    include: { drug: true },
    orderBy: { expiryDate: 'asc' },
  });
  return items;
};

export { computeStatus };

const inventoryService = {
  getInventory,
  getInventoryItem,
  addItem,
  updateItem,
  deleteItem,
  getLowStockAlerts,
  getExpiringAlerts,
};

export default inventoryService;
