import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/rbacMiddleware';
import { 
  getAllApprovals, 
  submitDocumentForApproval, 
  reviewApprovalRequest 
} from '../services/approvalService';

export function listApprovalsController(req: AuthenticatedRequest, res: Response) {
  try {
    const { status } = req.query;
    const approvals = getAllApprovals(status as string);

    return res.json({
      success: true,
      count: approvals.length,
      approvals,
    });
  } catch (error) {
    console.error('listApprovals error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve approval requests.' });
  }
}

export function submitApprovalController(req: AuthenticatedRequest, res: Response) {
  try {
    const { documentId } = req.body;

    if (!documentId) {
      return res.status(400).json({ success: false, message: 'Document ID is required.' });
    }

    const approval = submitDocumentForApproval(documentId, {
      id: req.user!.id,
      fullName: req.user!.fullName,
      employeeId: req.user!.employeeId,
    });

    return res.status(201).json({
      success: true,
      message: 'Document submitted for formal review.',
      approval,
    });
  } catch (error: any) {
    console.error('submitApproval error:', error);
    return res.status(400).json({ success: false, message: error.message || 'Failed to submit document for review.' });
  }
}

export function reviewApprovalController(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const { status, decision, comments } = req.body;

    const finalDecision = (status || decision || '').toUpperCase();

    if (finalDecision !== 'APPROVED' && finalDecision !== 'REJECTED') {
      return res.status(400).json({ success: false, message: 'Decision must be APPROVED or REJECTED.' });
    }

    const approval = reviewApprovalRequest(id, finalDecision as any, comments, {
      id: req.user!.id,
      fullName: req.user!.fullName,
      employeeId: req.user!.employeeId,
    });

    return res.json({
      success: true,
      message: `Document review complete: ${finalDecision}`,
      approval,
    });
  } catch (error: any) {
    console.error('reviewApproval error:', error);
    return res.status(400).json({ success: false, message: error.message || 'Failed to complete review.' });
  }
}
