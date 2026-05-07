import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

const dispensingController = {
  getDispensingLogs: catchAsync(async (_req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Dispensing logs retrieved successfully',
      data: [],
    });
  }),

  createDispensing: catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Dispensing recorded successfully',
      data: req.body,
    });
  }),

  deleteDispensing: catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Dispensing record deleted',
      data: { id: req.params.id },
    });
  }),
};

export default dispensingController;
