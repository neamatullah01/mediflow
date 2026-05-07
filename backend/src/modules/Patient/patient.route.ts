import { Router } from 'express';
import patientController from './patient.controller';
import verifyAuth, { Role } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', verifyAuth(Role.PHARMACIST, Role.ADMIN), patientController.getPatients);
router.get('/:id', verifyAuth(Role.PHARMACIST, Role.ADMIN), patientController.getPatientById);
router.post('/', verifyAuth(Role.PHARMACIST, Role.ADMIN), patientController.createPatient);
router.patch('/:id', verifyAuth(Role.PHARMACIST, Role.ADMIN), patientController.updatePatient);
router.delete('/:id', verifyAuth(Role.PHARMACIST, Role.ADMIN), patientController.deletePatient);

export const patientRoutes = router;
