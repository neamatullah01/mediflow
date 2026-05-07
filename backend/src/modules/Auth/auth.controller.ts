import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import {
  registerPharmacistValidationSchema,
  loginValidationSchema,
} from './auth.validation';
import { registerPharmacistIntoDB, loginUser } from './auth.service';

const authController = {
  registerPharmacist: catchAsync(async (req: Request, res: Response) => {
    const validated = registerPharmacistValidationSchema.parse(req.body);
    const result = await registerPharmacistIntoDB(validated);

    if (result.setCookieHeader) {
      res.setHeader('Set-Cookie', result.setCookieHeader);
    }

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Pharmacist registered successfully',
      data: {
        user: result.user,
        pharmacy: result.pharmacy,
        token: result.token,
      },
    });
  }),

  proxyLogin: catchAsync(async (req: Request, res: Response) => {
    const validated = loginValidationSchema.parse(req.body);
    const result = await loginUser(validated);

    if (result.setCookieHeader) {
      res.setHeader('Set-Cookie', result.setCookieHeader);
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Login successful',
      data: {
        user: result.user,
        session: result.session,
      },
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
