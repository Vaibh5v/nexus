import { Router } from 'express';
import { loginController, getCurrentUser, logoutController } from '../controllers/authController';

const router = Router();

router.post('/login', loginController);
router.get('/me', getCurrentUser);
router.post('/logout', logoutController);

export default router;
