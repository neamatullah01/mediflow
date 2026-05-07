import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

const reviewController = {
  getReviews: catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Reviews retrieved successfully',
      data: { drugId: req.params.id },
    });
  }),

  createReview: catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Review submitted successfully',
      data: { drugId: req.params.id, ...req.body },
    });
  }),

  deleteReview: catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Review deleted successfully',
      data: { id: req.params.id },
    });
  }),
};

export default reviewController;
