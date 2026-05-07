import { Router } from 'express';
import dispensingController from './dispensing.controller';
import verifyAuth, { Role } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', verifyAuth(Role.PHARMACIST, Role.ADMIN), dispensingController.getDispensingLogs);
router.post('/', verifyAuth(Role.PHARMACIST, Role.ADMIN), dispensingController.createDispensing);
router.delete('/:id', verifyAuth(Role.PHARMACIST, Role.ADMIN), dispensingController.deleteDispensing);

export const dispensingRoutes = router;
