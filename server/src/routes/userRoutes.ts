import { Router } from 'express';
import { requireAuth, requirePermission } from '../middleware/rbacMiddleware';
import { 
  listUsersController, 
  getUserDetailsController, 
  createUserController, 
  updateUserController 
} from '../controllers/userController';

const router = Router();

router.use(requireAuth);

router.get('/', listUsersController);
router.get('/:id', getUserDetailsController);
router.post('/', requirePermission('USER_CREATE'), createUserController);
router.patch('/:id', requirePermission('USER_UPDATE'), updateUserController);

export default router;
