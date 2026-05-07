import { Router } from 'express';
import authController from './auth.controller';
import verifyAuth from '../../middlewares/auth.middleware';

const router = Router();

router.get('/me', verifyAuth(), authController.getMe);

export const authRoutes = router;
