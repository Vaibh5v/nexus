import React, { useState } from 'react';
import api from '../../services/api';
import { 
  CheckSquare, 
  X, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  ShieldCheck, 
  UserCheck, 
  Loader2,
  Lock,
  MessageSquare,
  Eye
} from 'lucide-react';
import DocumentPreviewModal from '../documents/DocumentPreviewModal';

interface ApprovalReviewModalProps {
  approval: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ApprovalReviewModal({ approval, isOpen, onClose, onSuccess }: ApprovalReviewModalProps) {
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  if (!isOpen || !approval) return null;

  const handleDecision = async (decision: 'APPROVED' | 'REJECTED') => {
    setSubmitting(true);
    setError(null);

    try {
      const response = await api.post(`/approvals/${approval.id}/review`, {
        status: decision,
        comments,
      });

      if (response.data && response.data.success) {
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to complete document review.');
    } finally {
      setSubmitting(false);
    }
  };

  const previewDocObj = {
    id: approval.documentId,
    title: approval.documentTitle,
    caseNumber: approval.caseNumber,
    category: approval.category,
    currentVersionNumber: 1,
    versions: [{ sha256Hash: approval.sha256Hash, fileName: `${approval.documentTitle}.pdf` }]
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-[540px] bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden font-sans">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#155E8A]">
            <CheckSquare className="w-5 h-5" />
            <h3 className="text-base font-bold text-[#172B3A]">Document Review &amp; Formal Approval</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 font-semibold">
              {error}
            </div>
          )}

          {/* Document Summary Card */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-[#155E8A] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {approval.caseNumber}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                {approval.status}
              </span>
            </div>

            <div className="flex items-start justify-between gap-2">
              <h4 className="text-sm font-bold text-[#172B3A]">{approval.documentTitle}</h4>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(true)}
                className="px-2.5 py-1 bg-[#155E8A] text-white text-xs font-semibold rounded flex items-center gap-1 shrink-0"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview Document</span>
              </button>
            </div>

            <div className="text-xs text-[#64748B] space-y-1">
              <p>Category: <strong className="text-[#172B3A]">{approval.category}</strong> · Classification: <strong className="text-[#172B3A]">{approval.classification}</strong></p>
              <p className="flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                Submitted by: <span className="font-semibold text-[#172B3A]">{approval.submittedBy?.fullName}</span> ({approval.submittedBy?.employeeId})
              </p>
            </div>

            <div className="p-2 bg-white rounded border border-[#E2E8F0] text-[10px] font-mono text-[#64748B] flex items-center gap-1.5 truncate">
              <Lock className="w-3 h-3 text-[#155E8A] shrink-0" />
              <span className="font-semibold text-[#172B3A] shrink-0">SHA-256:</span>
              <span className="truncate">{approval.sha256Hash}</span>
            </div>
          </div>

          {/* Review Comments */}
          <div>
            <label className="block text-xs font-semibold text-[#172B3A] mb-1 flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-[#155E8A]" />
              <span>Reviewer Feedback / Approval Remarks</span>
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={3}
              placeholder="Enter official review comments or reasons for approval/rejection..."
              className="w-full p-3 bg-white text-xs border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#155E8A]"
            />
          </div>

          {/* Decision Action Buttons */}
          <div className="pt-3 flex items-center justify-between border-t border-slate-100 gap-3">
            <button
              type="button"
              disabled={submitting}
              onClick={() => handleDecision('REJECTED')}
              className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-lg border border-red-200 flex items-center gap-1.5 transition-colors disabled:opacity-60"
            >
              <XCircle className="w-4 h-4 text-red-600" />
              <span>Reject Submission</span>
            </button>

            <button
              type="button"
              disabled={submitting}
              onClick={() => handleDecision('APPROVED')}
              className="px-5 py-2.5 bg-[#16845B] hover:bg-[#126B4A] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              <span>Approve Document</span>
            </button>
          </div>

        </div>

      </div>

      {/* Preview Modal inside Approval Review */}
      {isPreviewOpen && (
        <DocumentPreviewModal
          document={previewDocObj}
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}
    </div>
  );
}
