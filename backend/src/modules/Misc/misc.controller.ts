import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

const miscController = {
  submitContact: catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Contact message submitted successfully',
      data: req.body,
    });
  }),

  subscribeNewsletter: catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Subscribed to newsletter successfully',
      data: req.body,
    });
  }),
};

export default miscController;
