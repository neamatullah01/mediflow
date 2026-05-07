import { Router } from 'express';
import aiController from './ai.controller';
import verifyAuth, { Role } from '../../middlewares/auth.middleware';
import { aiRateLimiter } from '../../middlewares/rateLimiter';

const router = Router();

router.post('/check-interactions', verifyAuth(Role.PHARMACIST, Role.ADMIN), aiRateLimiter, aiController.checkInteractions);
router.post('/demand-forecast', verifyAuth(Role.PHARMACIST, Role.ADMIN), aiRateLimiter, aiController.demandForecast);
router.post('/chat', verifyAuth(Role.PHARMACIST, Role.ADMIN), aiRateLimiter, aiController.chat);
router.get('/chat/sessions', verifyAuth(Role.PHARMACIST, Role.ADMIN), aiController.getChatSessions);
router.get('/chat/sessions/:id', verifyAuth(Role.PHARMACIST, Role.ADMIN), aiController.getChatSession);
router.delete('/chat/sessions/:id', verifyAuth(Role.PHARMACIST, Role.ADMIN), aiController.deleteChatSession);
router.post('/tag-drug', verifyAuth(Role.ADMIN), aiRateLimiter, aiController.tagDrug);
router.post('/analyze-platform', verifyAuth(Role.ADMIN), aiRateLimiter, aiController.analyzePlatform);

export const aiRoutes = router;
