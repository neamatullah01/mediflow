import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

const patientController = {
  getPatients: catchAsync(async (_req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Patients retrieved successfully',
      data: [],
    });
  }),

  getPatientById: catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Patient retrieved successfully',
      data: { id: req.params.id },
    });
  }),

  createPatient: catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Patient added successfully',
      data: req.body,
    });
  }),

  updatePatient: catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Patient updated successfully',
      data: { id: req.params.id, ...req.body },
    });
  }),

  deletePatient: catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Patient deleted successfully',
      data: { id: req.params.id },
    });
  }),
};

export default patientController;
