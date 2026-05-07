import { Router } from 'express';
import inventoryController from './inventory.controller';
import verifyAuth, { Role } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', verifyAuth(Role.PHARMACIST, Role.ADMIN), inventoryController.getInventory);
router.get('/alerts/low-stock', verifyAuth(Role.PHARMACIST, Role.ADMIN), inventoryController.getLowStockAlerts);
router.get('/alerts/expiring', verifyAuth(Role.PHARMACIST, Role.ADMIN), inventoryController.getExpiringAlerts);
router.get('/:id', verifyAuth(Role.PHARMACIST, Role.ADMIN), inventoryController.getInventoryItem);
router.post('/', verifyAuth(Role.PHARMACIST, Role.ADMIN), inventoryController.addItem);
router.patch('/:id', verifyAuth(Role.PHARMACIST, Role.ADMIN), inventoryController.updateItem);
router.delete('/:id', verifyAuth(Role.PHARMACIST, Role.ADMIN), inventoryController.deleteItem);

export const inventoryRoutes = router;
