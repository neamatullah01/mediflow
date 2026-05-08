import { prisma } from '../../lib/prisma';
import AppError from '../../errors/AppError';
import { computeStatus } from '../Inventory/inventory.service';
import { getSkip, calculateTotalPages } from '../../utils/pagination';

interface DispensingQuery {
  page?: number | undefined;
  limit?: number | undefined;
  drugName?: string | undefined;
  dateFrom?: string | undefined;
  dateTo?: string | undefined;
}

interface CreateDispensingPayload {
  inventoryItemId: string;
  quantityDispensed: number;
  patientName?: string | undefined;
}

const getDispensingLogs = async (pharmacyId: string, query: DispensingQuery) => {
  const page = query.page || 1;
  const limit = query.limit || 20;
  const skip = getSkip(page, limit);

  const where: any = { pharmacyId };

  if (query.drugName) {
    where.drug = { name: { contains: query.drugName, mode: 'insensitive' } };
  }

  if (query.dateFrom || query.dateTo) {
    where.dispensedAt = {};
    if (query.dateFrom) where.dispensedAt.gte = new Date(query.dateFrom);
    if (query.dateTo) where.dispensedAt.lte = new Date(query.dateTo);
  }

  const [logs, total] = await Promise.all([
    prisma.dispensingLog.findMany({
      where,
      skip,
      take: limit,
      orderBy: { dispensedAt: 'desc' },
      include: {
        drug: { select: { id: true, name: true, genericName: true, category: true } },
        pharmacist: { select: { id: true, name: true, email: true } },
        inventoryItem: { select: { id: true, batchNumber: true, unitPrice: true } },
      },
    }),
    prisma.dispensingLog.count({ where }),
  ]);

  return {
    logs,
    meta: { page, limit, total, totalPages: calculateTotalPages(total, limit) },
  };
};

const createDispensing = async (
  pharmacyId: string,
  pharmacistId: string,
  payload: CreateDispensingPayload,
  // io: Socket.io Server - passed optionally for real-time alerts
  emitLowStockAlert?: (pharmacyId: string, item: any) => void,
) => {
  const item = await prisma.inventoryItem.findFirst({
    where: { id: payload.inventoryItemId, pharmacyId },
    include: { drug: true },
  });

  if (!item) throw new AppError('Inventory item not found', 404);
  if (item.quantity < payload.quantityDispensed) {
    throw new AppError(
      `Insufficient stock. Available: ${item.quantity}, Requested: ${payload.quantityDispensed}`,
      400,
    );
  }

  const newQuantity = item.quantity - payload.quantityDispensed;
  const newStatus = computeStatus(newQuantity, item.reorderLevel, item.expiryDate);

  const [log] = await prisma.$transaction([
    prisma.dispensingLog.create({
      data: {
        pharmacyId,
        inventoryItemId: payload.inventoryItemId,
        drugId: item.drugId,
        pharmacistId,
        patientName: payload.patientName ?? null,
        quantityDispensed: payload.quantityDispensed,
      },
      include: {
        drug: { select: { id: true, name: true, genericName: true } },
        pharmacist: { select: { id: true, name: true } },
      },
    }),
    prisma.inventoryItem.update({
      where: { id: payload.inventoryItemId },
      data: { quantity: newQuantity, status: newStatus as any },
    }),
  ]);

  // PRD §14 rule 5: emit Socket.io event if stock low after dispensing
  if (
    newQuantity <= item.reorderLevel &&
    emitLowStockAlert
  ) {
    emitLowStockAlert(pharmacyId, {
      inventoryItemId: item.id,
      drugName: item.drug.name,
      currentQuantity: newQuantity,
      reorderLevel: item.reorderLevel,
    });
  }

  return log;
};

const deleteDispensing = async (
  pharmacyId: string,
  id: string,
  currentUser: { id: string; role: string },
) => {
  const log = await prisma.dispensingLog.findFirst({
    where: { id, pharmacyId },
  });

  if (!log) throw new AppError('Dispensing record not found', 404);

  if (currentUser.role !== 'ADMIN' && log.pharmacistId !== currentUser.id) {
    throw new AppError('Forbidden. You can only delete your own records.', 403);
  }

  await prisma.dispensingLog.delete({ where: { id } });
};

const dispensingService = {
  getDispensingLogs,
  createDispensing,
  deleteDispensing,
};

export default dispensingService;
