import { Router } from 'express';
import miscController from './misc.controller';

const router = Router();

router.post('/contact', miscController.submitContact);
router.post('/newsletter/subscribe', miscController.subscribeNewsletter);

export const miscRoutes = router;
