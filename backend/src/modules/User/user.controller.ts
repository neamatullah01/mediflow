import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import userService from './user.service';
import { uploadToCloudinary } from '../../utils/cloudinary';
import { updateUserValidationSchema, banUserValidationSchema } from './user.validation';
import { Role } from '../../middlewares/auth.middleware';

const userController = {
  getAllUsers: catchAsync(async (req: Request, res: Response) => {
    const query: Parameters<typeof userService.getAllUsers>[0] = {};
    if (req.query.page) query.page = Number(req.query.page);
    if (req.query.limit) query.limit = Number(req.query.limit);
    if (req.query.search) query.search = req.query.search as string;
    if (req.query.role) query.role = req.query.role as string;
    if (req.query.banned !== undefined) query.banned = req.query.banned === 'true';
    const result = await userService.getAllUsers(query);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Users retrieved successfully',
      meta: result.meta,
      data: result.users,
    });
  }),

  getUserById: catchAsync(async (req: Request, res: Response) => {
    const result = await userService.getUserById(req.params.id as string);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'User retrieved successfully',
      data: result,
    });
  }),

  updateUser: catchAsync(async (req: Request, res: Response) => {
    const validated = updateUserValidationSchema.parse(req.body);
    const result = await userService.updateUser(req.params.id as string, validated, {
      id: req.user!.id,
      role: req.user!.role as Role,
    });

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'User updated successfully',
      data: result,
    });
  }),

  banUser: catchAsync(async (req: Request, res: Response) => {
    const validated = banUserValidationSchema.parse(req.body);
    const result = await userService.banUser(req.params.id as string, validated);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: `User ${validated.banned ? 'banned' : 'unbanned'} successfully`,
      data: result,
    });
  }),

  deleteUser: catchAsync(async (req: Request, res: Response) => {
    await userService.deleteUser(req.params.id as string);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'User deleted successfully',
      data: null,
    });
  }),

  uploadAvatar: catchAsync(async (req: Request, res: Response) => {
    if (!req.file) {
      throw new Error('No image file provided');
    }

    const uploadResult = await uploadToCloudinary(req.file.buffer, 'mediflow/avatars');
    const result = await userService.uploadAvatar(
      req.user!.id,
      uploadResult.secure_url,
      { id: req.user!.id, role: req.user!.role as Role },
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Avatar uploaded successfully',
      data: result,
    });
  }),
};

export default userController;
