import { Router } from 'express';
import multer from 'multer';
import { requireAuth, requirePermission } from '../middleware/rbacMiddleware';
import { 
  listDocumentsController, 
  getDocumentDetailsController, 
  uploadDocumentController, 
  uploadNewVersionController,
  downloadDocumentController, 
  verifyIntegrityController 
} from '../controllers/documentController';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB
});

const router = Router();

router.use(requireAuth);

router.get('/', requirePermission('DOCUMENT_VIEW'), listDocumentsController);
router.get('/:id', requirePermission('DOCUMENT_VIEW'), getDocumentDetailsController);
router.post('/', requirePermission('DOCUMENT_UPLOAD'), upload.single('file'), uploadDocumentController);
router.post('/:id/versions', requirePermission('DOCUMENT_UPLOAD'), upload.single('file'), uploadNewVersionController);
router.get('/:id/download', requirePermission('DOCUMENT_DOWNLOAD'), downloadDocumentController);
router.post('/:id/verify-integrity', requirePermission('DOCUMENT_VIEW'), verifyIntegrityController);

export default router;
