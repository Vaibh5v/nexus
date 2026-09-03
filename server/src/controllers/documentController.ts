import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/rbacMiddleware';
import { 
  getAllDocuments, 
  findDocumentById, 
  createDocumentWithVersion, 
  appendDocumentVersion,
  getDocumentFile, 
  verifyIntegrity 
} from '../services/documentService';

export function listDocumentsController(req: AuthenticatedRequest, res: Response) {
  try {
    const { caseId, category, classification, search } = req.query;

    const documents = getAllDocuments({
      caseId: caseId as string,
      category: category as string,
      classification: classification as string,
      search: search as string,
    });

    return res.json({
      success: true,
      count: documents.length,
      documents,
    });
  } catch (error) {
    console.error('listDocuments error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve documents.' });
  }
}

export function getDocumentDetailsController(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const document = findDocumentById(id);

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document record not found.' });
    }

    return res.json({
      success: true,
      document,
    });
  } catch (error) {
    console.error('getDocumentDetails error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve document details.' });
  }
}

export async function uploadDocumentController(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select a file to upload.' });
    }

    const { caseId, title, description, category, classification } = req.body;

    if (!caseId) {
      return res.status(400).json({ success: false, message: 'Case ID is required.' });
    }

    const document = await createDocumentWithVersion(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      {
        caseId,
        title: title || req.file.originalname,
        description,
        category,
        classification,
      },
      {
        id: req.user!.id,
        fullName: req.user!.fullName,
        employeeId: req.user!.employeeId,
      }
    );

    return res.status(201).json({
      success: true,
      message: 'Document uploaded successfully with SHA-256 integrity hash.',
      document,
    });
  } catch (error) {
    console.error('uploadDocument error:', error);
    return res.status(500).json({ success: false, message: 'Failed to upload document.' });
  }
}

export async function uploadNewVersionController(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const { changeLog } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select a file to upload.' });
    }

    const document = await appendDocumentVersion(
      id,
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      changeLog || 'Version update',
      {
        id: req.user!.id,
        fullName: req.user!.fullName,
        employeeId: req.user!.employeeId,
      }
    );

    return res.status(200).json({
      success: true,
      message: `New version (v${document.currentVersionNumber}.0) created successfully.`,
      document,
    });
  } catch (error) {
    console.error('uploadNewVersion error:', error);
    return res.status(500).json({ success: false, message: 'Failed to append new document version.' });
  }
}

export async function downloadDocumentController(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const versionNumber = req.query.version ? parseInt(req.query.version as string) : undefined;
    const isInline = req.query.inline === 'true';

    const fileData = await getDocumentFile(id, versionNumber, { id: req.user!.id });

    res.setHeader('Content-Type', fileData.mimeType);
    
    if (isInline) {
      res.setHeader('Content-Disposition', `inline; filename="${fileData.fileName}"`);
    } else {
      res.setHeader('Content-Disposition', `attachment; filename="${fileData.fileName}"`);
    }

    res.setHeader('X-Document-SHA256', fileData.sha256Hash);

    return res.send(fileData.buffer);
  } catch (error) {
    console.error('downloadDocument error:', error);
    return res.status(500).json({ success: false, message: 'Failed to download document.' });
  }
}

export async function verifyIntegrityController(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const versionNumber = req.query.version ? parseInt(req.query.version as string) : undefined;

    const result = await verifyIntegrity(id, versionNumber);

    return res.json({
      success: true,
      message: result.valid ? 'Cryptographic SHA-256 Checksum Verified' : 'INTEGRITY MISMATCH DETECTED',
      verification: result,
    });
  } catch (error) {
    console.error('verifyIntegrity error:', error);
    return res.status(500).json({ success: false, message: 'Failed to verify integrity.' });
  }
}
