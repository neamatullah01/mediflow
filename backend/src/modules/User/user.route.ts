import { Router } from 'express';
import userController from './user.controller';
import verifyAuth, { Role } from '../../middlewares/auth.middleware';
import { upload } from '../../utils/multer';

const router = Router();

router.get('/', verifyAuth(Role.ADMIN), userController.getAllUsers);
router.get('/:id', verifyAuth(Role.ADMIN), userController.getUserById);
router.patch('/:id', verifyAuth(Role.ADMIN, Role.PHARMACIST), userController.updateUser);
router.patch('/:id/ban', verifyAuth(Role.ADMIN), userController.banUser);
router.delete('/:id', verifyAuth(Role.ADMIN), userController.deleteUser);
router.post('/upload-avatar', verifyAuth(), upload.single('image'), userController.uploadAvatar);

export const userRoutes = router;
