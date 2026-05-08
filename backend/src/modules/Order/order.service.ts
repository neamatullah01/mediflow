import { prisma } from '../../lib/prisma';
import AppError from '../../errors/AppError';
import { computeStatus } from '../Inventory/inventory.service';
import { getSkip, calculateTotalPages } from '../../utils/pagination';
import type { CreateOrderPayload, UpdateOrderStatusPayload } from './order.validation';

interface OrderQuery {
  page?: number | undefined;
  limit?: number | undefined;
  status?: string | undefined;
  dateFrom?: string | undefined;
  dateTo?: string | undefined;
}

const getOrders = async (pharmacyId: string, query: OrderQuery) => {
  const page = query.page || 1;
  const limit = query.limit || 20;
  const skip = getSkip(page, limit);

  const where: any = { pharmacyId };
  if (query.status) where.status = query.status;
  if (query.dateFrom || query.dateTo) {
    where.createdAt = {};
    if (query.dateFrom) where.createdAt.gte = new Date(query.dateFrom);
    if (query.dateTo) where.createdAt.lte = new Date(query.dateTo);
  }

  const [orders, total] = await Promise.all([
    prisma.supplierOrder.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { lineItems: true } },
      },
    }),
    prisma.supplierOrder.count({ where }),
  ]);

  return {
    orders,
    meta: { page, limit, total, totalPages: calculateTotalPages(total, limit) },
  };
};

const getOrderById = async (pharmacyId: string, id: string) => {
  const order = await prisma.supplierOrder.findFirst({
    where: { id, pharmacyId },
    include: {
      lineItems: {
        include: {
          drug: {
            select: { id: true, name: true, genericName: true, category: true, dosageForm: true },
          },
        },
      },
    },
  });

  if (!order) throw new AppError('Order not found', 404);
  return order;
};

const createOrder = async (pharmacyId: string, payload: CreateOrderPayload) => {
  // Validate all drugIds exist
  for (const item of payload.lineItems) {
    const drug = await prisma.drug.findFirst({ where: { id: item.drugId, isActive: true } });
    if (!drug) throw new AppError(`Drug with ID ${item.drugId} not found`, 404);
  }

  const totalAmount = payload.lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );

  const order = await prisma.supplierOrder.create({
    data: {
      pharmacyId,
      supplierName: payload.supplierName,
      expectedDelivery: payload.expectedDelivery ? new Date(payload.expectedDelivery) : null,
      notes: payload.notes ?? null,
      totalAmount,
      lineItems: {
        create: payload.lineItems.map((item) => ({
          drugId: item.drugId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      },
    },
    include: {
      lineItems: {
        include: { drug: { select: { id: true, name: true, genericName: true } } },
      },
    },
  });

  return order;
};

const updateOrderStatus = async (
  pharmacyId: string,
  id: string,
  payload: UpdateOrderStatusPayload,
) => {
  const order = await prisma.supplierOrder.findFirst({
    where: { id, pharmacyId },
    include: { lineItems: { include: { drug: true } } },
  });

  if (!order) throw new AppError('Order not found', 404);

  // Status flow validation
  const validTransitions: Record<string, string[]> = {
    PENDING: ['SHIPPED', 'CANCELLED'],
    SHIPPED: ['RECEIVED', 'CANCELLED'],
    RECEIVED: [],
    CANCELLED: [],
  };

  if (!validTransitions[order.status]!.includes(payload.status)) {
    throw new AppError(
      `Cannot transition from ${order.status} to ${payload.status}`,
      400,
    );
  }

  // PRD §14 rule 6: On RECEIVED → increment inventory for each line item
  if (payload.status === 'RECEIVED') {
    await prisma.$transaction(async (tx) => {
      for (const lineItem of order.lineItems) {
        // Try to find existing inventory item (without batchNumber constraint)
        const existing = await tx.inventoryItem.findFirst({
          where: { pharmacyId, drugId: lineItem.drugId },
        });

        if (existing) {
          const newQuantity = existing.quantity + lineItem.quantity;
          const newStatus = computeStatus(
            newQuantity,
            existing.reorderLevel,
            existing.expiryDate,
          );
          await tx.inventoryItem.update({
            where: { id: existing.id },
            data: { quantity: newQuantity, status: newStatus as any },
          });
        } else {
          // Create a new inventory item if none exists
          const defaultExpiry = new Date();
          defaultExpiry.setFullYear(defaultExpiry.getFullYear() + 1);
          await tx.inventoryItem.create({
            data: {
              pharmacyId,
              drugId: lineItem.drugId,
              quantity: lineItem.quantity,
              unitPrice: lineItem.unitPrice,
              expiryDate: defaultExpiry,
              reorderLevel: 10,
              supplierName: order.supplierName,
              status: 'IN_STOCK',
            },
          });
        }
      }

      await tx.supplierOrder.update({
        where: { id },
        data: { status: 'RECEIVED', receivedAt: new Date() },
      });
    });
  } else {
    await prisma.supplierOrder.update({
      where: { id },
      data: { status: payload.status as any },
    });
  }

  const updated = await prisma.supplierOrder.findUnique({
    where: { id },
    include: {
      lineItems: { include: { drug: { select: { id: true, name: true } } } },
    },
  });

  return updated;
};

const deleteOrder = async (pharmacyId: string, id: string) => {
  const order = await prisma.supplierOrder.findFirst({ where: { id, pharmacyId } });
  if (!order) throw new AppError('Order not found', 404);

  if (order.status !== 'PENDING') {
    throw new AppError('Only PENDING orders can be cancelled/deleted', 400);
  }

  await prisma.supplierOrder.delete({ where: { id } });
};

const orderService = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
};

export default orderService;
