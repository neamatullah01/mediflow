import { Router } from 'express';
import drugController from './drug.controller';
import verifyAuth, { Role } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', drugController.getAllDrugs);
router.get('/:id', drugController.getDrugById);
router.post('/', verifyAuth(Role.ADMIN), drugController.createDrug);
router.patch('/:id', verifyAuth(Role.ADMIN), drugController.updateDrug);
router.delete('/:id', verifyAuth(Role.ADMIN), drugController.deleteDrug);

export const drugRoutes = router;
