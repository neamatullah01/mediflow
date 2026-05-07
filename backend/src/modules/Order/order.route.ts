import { Router } from 'express';
import orderController from './order.controller';
import verifyAuth, { Role } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', verifyAuth(Role.PHARMACIST, Role.ADMIN), orderController.getOrders);
router.get('/:id', verifyAuth(Role.PHARMACIST, Role.ADMIN), orderController.getOrderById);
router.post('/', verifyAuth(Role.PHARMACIST, Role.ADMIN), orderController.createOrder);
router.patch('/:id/status', verifyAuth(Role.PHARMACIST, Role.ADMIN), orderController.updateStatus);
router.delete('/:id', verifyAuth(Role.PHARMACIST, Role.ADMIN), orderController.deleteOrder);

export const orderRoutes = router;
