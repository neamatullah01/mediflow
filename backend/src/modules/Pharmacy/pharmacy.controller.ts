import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

const pharmacyController = {
  getAllPharmacies: catchAsync(async (_req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Pharmacies retrieved successfully',
      data: [],
    });
  }),

  getPharmacyById: catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Pharmacy retrieved successfully',
      data: { id: req.params.id },
    });
  }),

  updatePharmacy: catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Pharmacy updated successfully',
      data: { id: req.params.id, ...req.body },
    });
  }),

  updateStatus: catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Pharmacy status updated',
      data: { id: req.params.id, status: req.body.status },
    });
  }),
};

export default pharmacyController;
