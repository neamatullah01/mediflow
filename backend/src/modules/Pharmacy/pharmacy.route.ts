import { Router } from 'express';
import pharmacyController from './pharmacy.controller';
import verifyAuth, { Role } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', verifyAuth(Role.ADMIN), pharmacyController.getAllPharmacies);
router.get('/:id', verifyAuth(Role.ADMIN, Role.PHARMACIST), pharmacyController.getPharmacyById);
router.patch('/:id', verifyAuth(Role.ADMIN, Role.PHARMACIST), pharmacyController.updatePharmacy);
router.patch('/:id/status', verifyAuth(Role.ADMIN), pharmacyController.updateStatus);

export const pharmacyRoutes = router;
