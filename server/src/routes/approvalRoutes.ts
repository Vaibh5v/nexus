import { Router } from 'express';
import { requireAuth, requirePermission } from '../middleware/rbacMiddleware';
import { 
  listApprovalsController, 
  submitApprovalController, 
  reviewApprovalController 
} from '../controllers/approvalController';

const router = Router();

router.use(requireAuth);

router.get('/', listApprovalsController);
router.post('/submit', submitApprovalController);
router.post('/:id/review', requirePermission('DOCUMENT_APPROVE'), reviewApprovalController);

export default router;
