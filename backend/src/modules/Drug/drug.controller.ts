import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

const drugController = {
  getAllDrugs: catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Drugs retrieved successfully',
      data: [],
    });
  }),

  getDrugById: catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Drug retrieved successfully',
      data: { id: req.params.id },
    });
  }),

  createDrug: catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Drug created successfully',
      data: req.body,
    });
  }),

  updateDrug: catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Drug updated successfully',
      data: { id: req.params.id, ...req.body },
    });
  }),

  deleteDrug: catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Drug deleted successfully',
      data: { id: req.params.id },
    });
  }),
};

export default drugController;
