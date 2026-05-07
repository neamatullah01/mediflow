import { Router } from 'express';
import authController from './auth.controller';
import verifyAuth from '../../middlewares/auth.middleware';
import { auth } from '../../lib/auth';

const router = Router();

router.post('/register', authController.registerPharmacist);
router.post('/login', authController.proxyLogin);
router.get('/me', verifyAuth(), authController.getMe);
router.all('/*', auth.handler as any);

export const authRoutes = router;
