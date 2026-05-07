import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

const inventoryController = {
  getInventory: catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Inventory retrieved successfully',
      data: [],
    });
  }),

  getInventoryItem: catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Inventory item retrieved successfully',
      data: { id: req.params.id },
    });
  }),

  addItem: catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Inventory item added successfully',
      data: req.body,
    });
  }),

  updateItem: catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Inventory item updated successfully',
      data: { id: req.params.id, ...req.body },
    });
  }),

  deleteItem: catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Inventory item deleted successfully',
      data: { id: req.params.id },
    });
  }),

  getLowStockAlerts: catchAsync(async (_req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Low stock alerts retrieved',
      data: [],
    });
  }),

  getExpiringAlerts: catchAsync(async (_req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Expiring alerts retrieved',
      data: [],
    });
  }),
};

export default inventoryController;
