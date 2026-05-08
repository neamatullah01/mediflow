import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { createOrderSchema, updateOrderStatusSchema } from './order.validation';
import orderService from './order.service';
import AppError from '../../errors/AppError';

const orderController = {
  getOrders: catchAsync(async (req: Request, res: Response) => {
    const pharmacyId = req.user?.pharmacyId;
    if (!pharmacyId) throw new AppError('Pharmacy not associated with your account', 400);

    const { page, limit, status, dateFrom, dateTo } = req.query;

    const result = await orderService.getOrders(pharmacyId, {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      status: status as string | undefined,
      dateFrom: dateFrom as string | undefined,
      dateTo: dateTo as string | undefined,
    });

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Orders retrieved successfully',
      meta: result.meta,
      data: result.orders,
    });
  }),

  getOrderById: catchAsync(async (req: Request, res: Response) => {
    const pharmacyId = req.user?.pharmacyId;
    if (!pharmacyId) throw new AppError('Pharmacy not associated with your account', 400);

    const order = await orderService.getOrderById(pharmacyId, req.params.id as string);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Order retrieved successfully',
      data: order,
    });
  }),

  createOrder: catchAsync(async (req: Request, res: Response) => {
    const pharmacyId = req.user?.pharmacyId;
    if (!pharmacyId) throw new AppError('Pharmacy not associated with your account', 400);

    const validated = createOrderSchema.parse(req.body);
    const order = await orderService.createOrder(pharmacyId, validated);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Order created successfully',
      data: order,
    });
  }),

  updateStatus: catchAsync(async (req: Request, res: Response) => {
    const pharmacyId = req.user?.pharmacyId;
    if (!pharmacyId) throw new AppError('Pharmacy not associated with your account', 400);

    const validated = updateOrderStatusSchema.parse(req.body);
    const order = await orderService.updateOrderStatus(pharmacyId, req.params.id as string, validated);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: `Order status updated to ${validated.status}`,
      data: order,
    });
  }),

  deleteOrder: catchAsync(async (req: Request, res: Response) => {
    const pharmacyId = req.user?.pharmacyId;
    if (!pharmacyId) throw new AppError('Pharmacy not associated with your account', 400);

    await orderService.deleteOrder(pharmacyId, req.params.id as string);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Order cancelled and deleted successfully',
      data: null,
    });
  }),
};

export default orderController;
