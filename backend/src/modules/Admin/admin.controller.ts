import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

const adminController = {
  getStats: catchAsync(async (_req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Admin stats retrieved successfully',
      data: {},
    });
  }),

  getActivity: catchAsync(async (_req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Recent activity retrieved successfully',
      data: [],
    });
  }),
};

export default adminController;
