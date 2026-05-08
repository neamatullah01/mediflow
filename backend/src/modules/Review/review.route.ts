import { Router } from 'express';
import reviewController from './review.controller';
import verifyAuth, { Role } from '../../middlewares/auth.middleware';

const router = Router();

// DELETE /api/v1/reviews/:id  — owner or admin can delete their review
router.delete('/:id', verifyAuth(Role.PHARMACIST, Role.ADMIN), reviewController.deleteReview);

export const reviewRoutes = router;
