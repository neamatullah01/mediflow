import { Router } from 'express';
import adminController from './admin.controller';
import verifyAuth, { Role } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/stats', verifyAuth(Role.ADMIN), adminController.getStats);
router.get('/activity', verifyAuth(Role.ADMIN), adminController.getActivity);

export const adminRoutes = router;
