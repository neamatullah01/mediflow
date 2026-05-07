import { Router } from 'express';
import reviewController from './review.controller';
import verifyAuth, { Role } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/:id/reviews', reviewController.getReviews);
router.post('/:id/reviews', verifyAuth(Role.PHARMACIST, Role.ADMIN), reviewController.createReview);
router.delete('/:id', verifyAuth(Role.PHARMACIST, Role.ADMIN), reviewController.deleteReview);

export const reviewRoutes = router;
