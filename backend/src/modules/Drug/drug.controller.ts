import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { createDrugValidationSchema, updateDrugValidationSchema } from './drug.validation';
import drugService from './drug.service';

const drugController = {
  getAllDrugs: catchAsync(async (req: Request, res: Response) => {
    const { page, limit, search, category, dosageForm, manufacturer, sortBy, sortOrder } = req.query;

    const result = await drugService.getAllDrugs({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search: search as string | undefined,
      category: category as string | undefined,
      dosageForm: dosageForm as string | undefined,
      manufacturer: manufacturer as string | undefined,
      sortBy: sortBy as string | undefined,
      sortOrder: sortOrder === 'asc' ? 'asc' : 'desc',
    });

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Drugs retrieved successfully',
      meta: result.meta,
      data: result.drugs,
    });
  }),

  getDrugById: catchAsync(async (req: Request, res: Response) => {
    const drug = await drugService.getDrugById(req.params.id as string);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Drug retrieved successfully',
      data: drug,
    });
  }),

  createDrug: catchAsync(async (req: Request, res: Response) => {
    const validated = createDrugValidationSchema.parse(req.body);
    const drug = await drugService.createDrug(validated);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Drug created successfully',
      data: drug,
    });
  }),

  updateDrug: catchAsync(async (req: Request, res: Response) => {
    const validated = updateDrugValidationSchema.parse(req.body);
    const drug = await drugService.updateDrug(req.params.id as string, validated);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Drug updated successfully',
      data: drug,
    });
  }),

  deleteDrug: catchAsync(async (req: Request, res: Response) => {
    await drugService.deleteDrug(req.params.id as string);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Drug deleted (deactivated) successfully',
      data: null,
    });
  }),
};

export default drugController;
