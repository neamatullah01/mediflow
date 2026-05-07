import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

const authController = {
  register: catchAsync(async (_req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Registration handled by Better Auth',
    });
  }),

  getMe: catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'User retrieved successfully',
      data: (req as any).user,
    });
  }),
};

export default authController;
