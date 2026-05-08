import { prisma } from '../../lib/prisma';
import AppError from '../../errors/AppError';
import { getSkip, calculateTotalPages } from '../../utils/pagination';

interface CreateReviewPayload {
  rating: number;
  comment: string;
}

const getReviews = async (drugId: string, page = 1, limit = 10) => {
  const skip = getSkip(page, limit);

  const drug = await prisma.drug.findFirst({ where: { id: drugId, isActive: true } });
  if (!drug) throw new AppError('Drug not found', 404);

  const [reviews, total] = await Promise.all([
    prisma.drugReview.findMany({
      where: { drugId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        pharmacist: { select: { id: true, name: true, image: true } },
      },
    }),
    prisma.drugReview.count({ where: { drugId } }),
  ]);

  const avgRating =
    total > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return {
    reviews,
    avgRating: parseFloat(avgRating.toFixed(1)),
    meta: { page, limit, total, totalPages: calculateTotalPages(total, limit) },
  };
};

const createReview = async (
  drugId: string,
  pharmacistId: string,
  payload: CreateReviewPayload,
) => {
  const drug = await prisma.drug.findFirst({ where: { id: drugId, isActive: true } });
  if (!drug) throw new AppError('Drug not found', 404);

  if (payload.rating < 1 || payload.rating > 5) {
    throw new AppError('Rating must be between 1 and 5', 400);
  }

  // PRD §14 rule 11: One review per pharmacist per drug
  const existing = await prisma.drugReview.findUnique({
    where: { drugId_pharmacistId: { drugId, pharmacistId } },
  });
  if (existing) {
    throw new AppError('You have already reviewed this drug. Update your existing review.', 409);
  }

  const review = await prisma.drugReview.create({
    data: {
      drugId,
      pharmacistId,
      rating: payload.rating,
      comment: payload.comment,
    },
    include: {
      pharmacist: { select: { id: true, name: true, image: true } },
      drug: { select: { id: true, name: true } },
    },
  });

  return review;
};

const deleteReview = async (
  id: string,
  currentUser: { id: string; role: string },
) => {
  const review = await prisma.drugReview.findUnique({ where: { id } });
  if (!review) throw new AppError('Review not found', 404);

  if (currentUser.role !== 'ADMIN' && review.pharmacistId !== currentUser.id) {
    throw new AppError('Forbidden. You can only delete your own reviews.', 403);
  }

  await prisma.drugReview.delete({ where: { id } });
};

const reviewService = {
  getReviews,
  createReview,
  deleteReview,
};

export default reviewService;
