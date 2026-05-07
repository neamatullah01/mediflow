import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

const orderController = {
  getOrders: catchAsync(async (_req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Orders retrieved successfully',
      data: [],
    });
  }),

  getOrderById: catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Order retrieved successfully',
      data: { id: req.params.id },
    });
  }),

  createOrder: catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Order created successfully',
      data: req.body,
    });
  }),

  updateStatus: catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Order status updated',
      data: { id: req.params.id, status: req.body.status },
    });
  }),

  deleteOrder: catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Order cancelled successfully',
      data: { id: req.params.id },
    });
  }),
};

export default orderController;
