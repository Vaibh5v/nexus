import { initialApprovals, ApprovalRecord } from '../seedApprovals';
import { findDocumentById } from './documentService';
import { auditService } from '../audit/AuditService';

let approvalStore: ApprovalRecord[] = [...initialApprovals];

export function getAllApprovals(statusFilter?: string) {
  let result = [...approvalStore];

  if (statusFilter && statusFilter !== 'ALL') {
    result = result.filter((a) => a.status === statusFilter);
  }

  return result;
}

export function findApprovalById(id: string): ApprovalRecord | null {
  return approvalStore.find((a) => a.id === id) || null;
}

export function submitDocumentForApproval(
  documentId: string,
  user: { id: string; fullName: string; employeeId: string }
) {
  const doc = findDocumentById(documentId);
  if (!doc) throw new Error('Document record not found.');

  const version = doc.versions[0];

  const approvalId = `app_${Date.now()}`;
  const newApproval: ApprovalRecord = {
    id: approvalId,
    documentId: doc.id,
    documentTitle: doc.title,
    caseNumber: doc.caseNumber,
    category: doc.category,
    classification: doc.classification,
    submittedBy: {
      id: user.id,
      fullName: user.fullName,
      employeeId: user.employeeId,
    },
    status: 'PENDING',
    sha256Hash: version ? version.sha256Hash : 'N/A',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  doc.status = 'UNDER_REVIEW';
  approvalStore.unshift(newApproval);

  auditService.logEvent({
    action: 'DOCUMENT_SUBMIT_REVIEW',
    userId: user.id,
    entityType: 'DOCUMENT',
    entityId: doc.id,
    result: 'SUCCESS',
    details: `Document "${doc.title}" submitted for formal review.`,
  });

  return newApproval;
}

export function reviewApprovalRequest(
  approvalId: string,
  decision: 'APPROVED' | 'REJECTED',
  comments: string,
  reviewerUser: { id: string; fullName: string; employeeId: string }
) {
  const approval = findApprovalById(approvalId);
  if (!approval) throw new Error('Approval request not found.');

  approval.status = decision;
  approval.comments = comments;
  approval.reviewer = {
    id: reviewerUser.id,
    fullName: reviewerUser.fullName,
    employeeId: reviewerUser.employeeId,
  };
  approval.updatedAt = new Date().toISOString();

  // Update underlying document status
  const doc = findDocumentById(approval.documentId);
  if (doc) {
    doc.status = decision;
  }

  const actionCode = decision === 'APPROVED' ? 'DOCUMENT_APPROVE' : 'DOCUMENT_REJECT';

  auditService.logEvent({
    action: actionCode,
    userId: reviewerUser.id,
    entityType: 'DOCUMENT',
    entityId: approval.documentId,
    result: 'SUCCESS',
    details: `Document "${approval.documentTitle}" ${decision}. Comments: ${comments || 'None'}`,
  });

  return approval;
}
