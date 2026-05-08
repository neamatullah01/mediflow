import { Router } from 'express';
import drugController from './drug.controller';
import reviewController from '../Review/review.controller';
import verifyAuth, { Role } from '../../middlewares/auth.middleware';

const router = Router();

// Drug catalogue CRUD
router.get('/', drugController.getAllDrugs);
router.get('/:id', drugController.getDrugById);
router.post('/', verifyAuth(Role.ADMIN), drugController.createDrug);
router.patch('/:id', verifyAuth(Role.ADMIN), drugController.updateDrug);
router.delete('/:id', verifyAuth(Role.ADMIN), drugController.deleteDrug);

// Drug reviews — GET /drugs/:id/reviews (public), POST /drugs/:id/reviews (pharmacist)
router.get('/:id/reviews', reviewController.getReviews);
router.post('/:id/reviews', verifyAuth(Role.PHARMACIST, Role.ADMIN), reviewController.createReview);

export const drugRoutes = router;
