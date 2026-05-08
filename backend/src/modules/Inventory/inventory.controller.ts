import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { addInventoryItemSchema, updateInventoryItemSchema } from './inventory.validation';
import inventoryService from './inventory.service';
import AppError from '../../errors/AppError';

const inventoryController = {
  getInventory: catchAsync(async (req: Request, res: Response) => {
    const pharmacyId = req.user?.pharmacyId;
    if (!pharmacyId) throw new AppError('Pharmacy not associated with your account', 400);

    const { page, limit, search, category, status, sortBy, sortOrder } = req.query;

    const result = await inventoryService.getInventory(pharmacyId, {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search: search as string | undefined,
      category: category as string | undefined,
      status: status as string | undefined,
      sortBy: sortBy as string | undefined,
      sortOrder: sortOrder === 'asc' ? 'asc' : 'desc',
    });

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Inventory retrieved successfully',
      meta: result.meta,
      data: result.items,
    });
  }),

  getInventoryItem: catchAsync(async (req: Request, res: Response) => {
    const pharmacyId = req.user?.pharmacyId;
    if (!pharmacyId) throw new AppError('Pharmacy not associated with your account', 400);

    const item = await inventoryService.getInventoryItem(pharmacyId, req.params.id as string);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Inventory item retrieved successfully',
      data: item,
    });
  }),

  addItem: catchAsync(async (req: Request, res: Response) => {
    const pharmacyId = req.user?.pharmacyId;
    if (!pharmacyId) throw new AppError('Pharmacy not associated with your account', 400);

    const validated = addInventoryItemSchema.parse(req.body);
    const item = await inventoryService.addItem(pharmacyId, validated);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Inventory item added successfully',
      data: item,
    });
  }),

  updateItem: catchAsync(async (req: Request, res: Response) => {
    const pharmacyId = req.user?.pharmacyId;
    if (!pharmacyId) throw new AppError('Pharmacy not associated with your account', 400);

    const validated = updateInventoryItemSchema.parse(req.body);
    const item = await inventoryService.updateItem(pharmacyId, req.params.id as string, validated);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Inventory item updated successfully',
      data: item,
    });
  }),

  deleteItem: catchAsync(async (req: Request, res: Response) => {
    const pharmacyId = req.user?.pharmacyId;
    if (!pharmacyId) throw new AppError('Pharmacy not associated with your account', 400);

    await inventoryService.deleteItem(pharmacyId, req.params.id as string);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Inventory item deleted successfully',
      data: null,
    });
  }),

  getLowStockAlerts: catchAsync(async (req: Request, res: Response) => {
    const pharmacyId = req.user?.pharmacyId;
    if (!pharmacyId) throw new AppError('Pharmacy not associated with your account', 400);

    const items = await inventoryService.getLowStockAlerts(pharmacyId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Low stock alerts retrieved',
      data: items,
    });
  }),

  getExpiringAlerts: catchAsync(async (req: Request, res: Response) => {
    const pharmacyId = req.user?.pharmacyId;
    if (!pharmacyId) throw new AppError('Pharmacy not associated with your account', 400);

    const items = await inventoryService.getExpiringAlerts(pharmacyId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Expiring items retrieved',
      data: items,
    });
  }),
};

export default inventoryController;
