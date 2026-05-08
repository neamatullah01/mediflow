import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import reviewService from './review.service';
import AppError from '../../errors/AppError';
import { z } from 'zod';

const createReviewSchema = z.object({
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  comment: z.string().min(1, 'Comment is required'),
});

const reviewController = {
  getReviews: catchAsync(async (req: Request, res: Response) => {
    const { page, limit } = req.query;
    const result = await reviewService.getReviews(
      req.params.id as string,
      page ? Number(page) : 1,
      limit ? Number(limit) : 10,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Reviews retrieved successfully',
      meta: result.meta,
      data: { reviews: result.reviews, avgRating: result.avgRating },
    });
  }),

  createReview: catchAsync(async (req: Request, res: Response) => {
    const pharmacistId = req.user?.id;
    if (!pharmacistId) throw new AppError('Unauthorized', 401);

    const validated = createReviewSchema.parse(req.body);
    const review = await reviewService.createReview(req.params.id as string, pharmacistId, validated);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Review submitted successfully',
      data: review,
    });
  }),

  deleteReview: catchAsync(async (req: Request, res: Response) => {
    await reviewService.deleteReview(req.params.id as string, {
      id: req.user!.id,
      role: req.user!.role,
    });
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Review deleted successfully',
      data: null,
    });
  }),
};

export default reviewController;
