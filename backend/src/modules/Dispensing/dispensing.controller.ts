import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import dispensingService from './dispensing.service';
import AppError from '../../errors/AppError';
import { z } from 'zod';

const createDispensingSchema = z.object({
  inventoryItemId: z.string().uuid('Invalid inventory item ID'),
  quantityDispensed: z.number().int().positive('Quantity must be a positive integer'),
  patientName: z.string().optional(),
});

const dispensingController = {
  getDispensingLogs: catchAsync(async (req: Request, res: Response) => {
    const pharmacyId = req.user?.pharmacyId;
    if (!pharmacyId) throw new AppError('Pharmacy not associated with your account', 400);

    const { page, limit, drugName, dateFrom, dateTo } = req.query;

    const result = await dispensingService.getDispensingLogs(pharmacyId, {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      drugName: drugName as string | undefined,
      dateFrom: dateFrom as string | undefined,
      dateTo: dateTo as string | undefined,
    });

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Dispensing logs retrieved successfully',
      meta: result.meta,
      data: result.logs,
    });
  }),

  createDispensing: catchAsync(async (req: Request, res: Response) => {
    const pharmacyId = req.user?.pharmacyId;
    const pharmacistId = req.user?.id;
    if (!pharmacyId) throw new AppError('Pharmacy not associated with your account', 400);
    if (!pharmacistId) throw new AppError('Unauthorized', 401);

    const validated = createDispensingSchema.parse(req.body);

    // Get Socket.io instance if available
    const io = (req as any).io;
    const emitLowStockAlert = io
      ? (pId: string, item: any) => io.to(pId).emit('low-stock-alert', item)
      : undefined;

    const log = await dispensingService.createDispensing(
      pharmacyId,
      pharmacistId,
      validated,
      emitLowStockAlert,
    );

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Dispensing recorded successfully',
      data: log,
    });
  }),

  deleteDispensing: catchAsync(async (req: Request, res: Response) => {
    const pharmacyId = req.user?.pharmacyId;
    if (!pharmacyId) throw new AppError('Pharmacy not associated with your account', 400);

    await dispensingService.deleteDispensing(
      pharmacyId,
      req.params.id as string,
      { id: req.user!.id, role: req.user!.role },
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Dispensing record deleted',
      data: null,
    });
  }),
};

export default dispensingController;
