import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  CheckSquare, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText, 
  UserCheck, 
  Loader2, 
  Lock,
  MessageSquare,
  ChevronRight
} from 'lucide-react';
import ApprovalReviewModal from './ApprovalReviewModal';

export default function ApprovalList() {
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedApproval, setSelectedApproval] = useState<any | null>(null);

  const fetchApprovals = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.append('status', statusFilter);

      const response = await api.get(`/approvals?${params.toString()}`);
      if (response.data && response.data.success) {
        setApprovals(response.data.approvals);
      }
    } catch (err) {
      console.error('Fetch approvals error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, [statusFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> APPROVED
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-3 h-3" /> REJECTED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" /> PENDING REVIEW
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-[#172B3A] tracking-tight flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-[#155E8A]" />
            Document Review &amp; Formal Approvals
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Formal legal and administrative document review workflow module.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-white p-1.5 rounded-xl border border-[#E2E8F0] shadow-2xs w-fit">
        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              statusFilter === st
                ? 'bg-[#155E8A] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#172B3A] hover:bg-[#F8FAFC]'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Approvals List */}
      {loading ? (
        <div className="bg-white p-12 rounded-xl border border-[#E2E8F0] text-center text-xs text-[#64748B] flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-[#155E8A]" />
          <span>Loading review requests...</span>
        </div>
      ) : approvals.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-[#E2E8F0] text-center text-xs text-[#64748B]">
          No matching review requests found.
        </div>
      ) : (
        <div className="space-y-3">
          {approvals.map((app) => (
            <div
              key={app.id}
              className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-2xs space-y-3"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-[#155E8A] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {app.caseNumber}
                    </span>
                    {getStatusBadge(app.status)}
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {app.category}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#172B3A]">{app.documentTitle}</h3>

                  <div className="flex items-center gap-4 text-xs text-[#64748B] pt-1 flex-wrap">
                    <span className="flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                      Submitted by: <strong className="text-[#172B3A]">{app.submittedBy?.fullName}</strong> ({app.submittedBy?.employeeId})
                    </span>
                    {app.reviewer && (
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#16845B]" />
                        Reviewer: <strong className="text-[#172B3A]">{app.reviewer?.fullName}</strong>
                      </span>
                    )}
                  </div>
                </div>

                {/* Review Trigger Button */}
                {app.status === 'PENDING' && (
                  <button
                    onClick={() => setSelectedApproval(app)}
                    className="px-4 py-2 bg-[#155E8A] hover:bg-[#10496C] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 shrink-0 self-end md:self-center"
                  >
                    <span>Review Submission</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Reviewer Comments if finalized */}
              {app.comments && (
                <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] text-xs text-[#64748B] flex items-start gap-2">
                  <MessageSquare className="w-4 h-4 text-[#155E8A] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#172B3A]">Reviewer Remarks:</span> "{app.comments}"
                  </div>
                </div>
              )}

              {/* SHA-256 Hash Pill */}
              <div className="p-2 bg-[#F8FAFC] rounded border border-[#E2E8F0] text-[10px] font-mono text-[#64748B] flex items-center gap-1.5 truncate">
                <Lock className="w-3 h-3 text-[#155E8A] shrink-0" />
                <span className="font-semibold text-[#172B3A] shrink-0">SHA-256:</span>
                <span className="truncate">{app.sha256Hash}</span>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {selectedApproval && (
        <ApprovalReviewModal
          approval={selectedApproval}
          isOpen={!!selectedApproval}
          onClose={() => setSelectedApproval(null)}
          onSuccess={fetchApprovals}
        />
      )}

    </div>
  );
}
