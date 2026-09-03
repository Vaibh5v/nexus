import { Router } from 'express';
import { requireAuth, requirePermission } from '../middleware/rbacMiddleware';
import { 
  listCasesController, 
  getCaseDetailsController, 
  createCaseController, 
  updateCaseController 
} from '../controllers/caseController';

const router = Router();

router.use(requireAuth);

router.get('/', requirePermission('CASE_VIEW'), listCasesController);
router.get('/:id', requirePermission('CASE_VIEW'), getCaseDetailsController);
router.post('/', requirePermission('CASE_CREATE'), createCaseController);
router.patch('/:id', requirePermission('CASE_UPDATE'), updateCaseController);

export default router;
