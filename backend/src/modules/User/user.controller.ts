import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

const userController = {
  getAllUsers: catchAsync(async (_req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Users retrieved successfully',
      data: [],
    });
  }),

  getUserById: catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'User retrieved successfully',
      data: { id: req.params.id },
    });
  }),

  updateUser: catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'User updated successfully',
      data: { id: req.params.id, ...req.body },
    });
  }),

  banUser: catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'User ban status updated',
      data: { id: req.params.id },
    });
  }),

  deleteUser: catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'User deleted successfully',
      data: { id: req.params.id },
    });
  }),
};

export default userController;
