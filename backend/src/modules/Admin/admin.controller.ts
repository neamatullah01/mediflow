import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import adminService from './admin.service';

const adminController = {
  getStats: catchAsync(async (_req: Request, res: Response) => {
    const result = await adminService.getStats();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Admin stats retrieved successfully',
      data: result,
    });
  }),

  getActivity: catchAsync(async (_req: Request, res: Response) => {
    const activity = await adminService.getActivity();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Recent activity retrieved successfully',
      data: activity,
    });
  }),
};

export default adminController;
