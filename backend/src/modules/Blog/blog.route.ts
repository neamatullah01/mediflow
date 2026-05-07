import { Router } from 'express';
import blogController from './blog.controller';
import verifyAuth, { Role } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', blogController.getPosts);
router.get('/:slug', blogController.getPostBySlug);
router.post('/', verifyAuth(Role.ADMIN), blogController.createPost);
router.patch('/:id', verifyAuth(Role.ADMIN), blogController.updatePost);
router.delete('/:id', verifyAuth(Role.ADMIN), blogController.deletePost);
router.patch('/:id/publish', verifyAuth(Role.ADMIN), blogController.togglePublish);

export const blogRoutes = router;
