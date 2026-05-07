import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import pharmacyService from './pharmacy.service';
import {
  updatePharmacyValidationSchema,
  updateStatusValidationSchema,
} from './pharmacy.validation';
import { Role } from '../../middlewares/auth.middleware';

const pharmacyController = {
  getAllPharmacies: catchAsync(async (req: Request, res: Response) => {
    const query: Parameters<typeof pharmacyService.getAllPharmacies>[0] = {};
    if (req.query.page) query.page = Number(req.query.page);
    if (req.query.limit) query.limit = Number(req.query.limit);
    if (req.query.search) query.search = req.query.search as string;
    if (req.query.status) query.status = req.query.status as string;

    const result = await pharmacyService.getAllPharmacies(query);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Pharmacies retrieved successfully',
      meta: result.meta,
      data: result.pharmacies,
    });
  }),

  getPharmacyById: catchAsync(async (req: Request, res: Response) => {
    const result = await pharmacyService.getPharmacyById(req.params.id as string, {
      id: req.user!.id,
      role: req.user!.role as Role,
      pharmacyId: req.user!.pharmacyId,
    });

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Pharmacy retrieved successfully',
      data: result,
    });
  }),

  updatePharmacy: catchAsync(async (req: Request, res: Response) => {
    const validated = updatePharmacyValidationSchema.parse(req.body);
    const result = await pharmacyService.updatePharmacy(req.params.id as string, validated, {
      id: req.user!.id,
      role: req.user!.role as Role,
      pharmacyId: req.user!.pharmacyId,
    });

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Pharmacy updated successfully',
      data: result,
    });
  }),

  updateStatus: catchAsync(async (req: Request, res: Response) => {
    const validated = updateStatusValidationSchema.parse(req.body);
    const result = await pharmacyService.updateStatus(req.params.id as string, validated);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Pharmacy status updated',
      data: result,
    });
  }),
};

export default pharmacyController;
