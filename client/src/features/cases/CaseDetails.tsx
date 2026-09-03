import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  FolderKanban, 
  ArrowLeft, 
  Building2, 
  UserCheck, 
  ShieldAlert, 
  Clock, 
  FileText, 
  Users, 
  CheckSquare, 
  ShieldCheck,
  FileCheck,
  Plus,
  Loader2,
  Lock,
  Download,
  Upload,
  CheckCircle2,
  History,
  Send,
  Eye,
  CheckCircle,
  XCircle,
  UserPlus
} from 'lucide-react';
import DocumentUploadModal from '../documents/DocumentUploadModal';
import VersionHistoryModal from '../documents/VersionHistoryModal';
import DocumentPreviewModal from '../documents/DocumentPreviewModal';

interface CaseDetailsProps {
  caseId: string;
  onBack: () => void;
}

export default function CaseDetails({ caseId, onBack }: CaseDetailsProps) {
  const [caseRecord, setCaseRecord] = useState<any>(null);
  const [caseDocs, setCaseDocs] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'team' | 'timeline' | 'tasks' | 'audit'>('overview');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedDocForHistory, setSelectedDocForHistory] = useState<any | null>(null);
  const [selectedDocForPreview, setSelectedDocForPreview] = useState<any | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<{ [key: string]: any }>({});
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const fetchCaseDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/cases/${caseId}`);
      if (response.data && response.data.success) {
        setCaseRecord(response.data.case);
      }
    } catch (err) {
      console.error('Failed to fetch case details:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCaseDocuments = async () => {
    try {
      const response = await api.get(`/documents?caseId=${caseId}`);
      if (response.data && response.data.success) {
        setCaseDocs(response.data.documents);
      }
    } catch (err) {
      console.error('Fetch case docs error:', err);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const response = await api.get('/audit-logs');
      if (response.data && response.data.success) {
        setAuditLogs(response.data.logs);
      }
    } catch (err) {
      console.error('Fetch audit logs error:', err);
    }
  };

  useEffect(() => {
    fetchCaseDetails();
    fetchCaseDocuments();
    fetchAuditLogs();
  }, [caseId]);

  const handleDownload = async (docId: string, fileName: string) => {
    try {
      const response = await api.get(`/documents/${docId}/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  const handleVerifyIntegrity = async (docId: string) => {
    setVerifyingId(docId);
    try {
      const response = await api.post(`/documents/${docId}/verify-integrity`);
      if (response.data && response.data.success) {
        setVerificationResult((prev) => ({
          ...prev,
          [docId]: response.data.verification,
        }));
      }
    } catch (err) {
      console.error('Integrity check error:', err);
    } finally {
      setVerifyingId(null);
    }
  };

  const handleSubmitForReview = async (docId: string, title: string) => {
    setSubmittingId(docId);
    setActionNotice(null);
    try {
      const response = await api.post('/approvals/submit', { documentId: docId });
      if (response.data && response.data.success) {
        setActionNotice(`Document "${title}" submitted for legal review! Status changed to UNDER_REVIEW.`);
        fetchCaseDocuments();
        fetchAuditLogs();
        setTimeout(() => setActionNotice(null), 5000);
      }
    } catch (err: any) {
      console.error('Submit review error:', err);
      setActionNotice(err.response?.data?.message || 'Failed to submit document for review.');
    } finally {
      setSubmittingId(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-[#E2E8F0] text-center text-xs text-[#64748B] flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-[#155E8A]" />
        <span>Loading case details...</span>
      </div>
    );
  }

  if (!caseRecord) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-[#E2E8F0] text-center text-xs text-[#64748B]">
        <p>Case record not found.</p>
        <button onClick={onBack} className="mt-4 text-[#155E8A] font-semibold underline">
          Return to Case Directory
        </button>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FolderKanban },
    { id: 'documents', label: `Documents Vault (${caseDocs.length})`, icon: FileText },
    { id: 'team', label: 'Team & Stakeholders', icon: Users },
    { id: 'timeline', label: 'Timeline & Activity', icon: Clock },
    { id: 'tasks', label: 'Investigative Tasks', icon: CheckSquare },
    { id: 'audit', label: 'Audit History', icon: ShieldCheck },
  ];

  const caseTeam = [
    {
      name: caseRecord.assignedOfficer?.fullName || 'Inspector D. Sharma',
      role: 'Lead Investigating Officer',
      employeeId: caseRecord.assignedOfficer?.employeeId || 'EMP-1002',
      badge: 'Lead Officer',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      name: 'Legal Officer A. Roy',
      role: 'Prosecuting Counsel & Legal Reviewer',
      employeeId: 'EMP-1003',
      badge: 'Legal Counsel',
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      name: 'Officer R. Verma',
      role: 'Digital Evidence & Forensic Specialist',
      employeeId: 'EMP-1008',
      badge: 'Forensic Lead',
      badgeClass: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
      name: 'Reviewer M. Kulkarni',
      role: 'Judicial Review Board Liaison',
      employeeId: 'EMP-1004',
      badge: 'Judicial Reviewer',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200'
    }
  ];

  return (
    <div className="space-y-6 font-sans">
      
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#155E8A] hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Case Directory</span>
      </button>

      {/* CASE HUB HEADER */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-[#155E8A] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                {caseRecord.caseNumber}
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                {caseRecord.status}
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                {caseRecord.priority} PRIORITY
              </span>
              <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {caseRecord.caseType}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-[#172B3A] tracking-tight pt-1">
              {caseRecord.title}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#172B3A]">
              <Lock className="w-3.5 h-3.5 text-[#155E8A]" />
              {caseRecord.confidentiality}
            </span>
          </div>
        </div>

        {/* Sub-bar Metadata */}
        <div className="flex items-center gap-6 text-xs text-[#64748B] border-t border-[#E2E8F0] pt-4 flex-wrap">
          <span className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-slate-400" />
            {caseRecord.department}
          </span>
          <span>·</span>
          <span className="flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-slate-400" />
            Assigned Officer: <strong className="text-[#172B3A]">{caseRecord.assignedOfficer?.fullName || 'N/A'}</strong>
          </span>
        </div>
      </div>

      {/* 6-TAB NAVIGATION */}
      <div className="flex bg-white p-1.5 rounded-xl border border-[#E2E8F0] shadow-2xs overflow-x-auto">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                isActive
                  ? 'bg-[#155E8A] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#172B3A] hover:bg-[#F8FAFC]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT AREA */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-2xs">
        
        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-[#172B3A] mb-2">Case Summary &amp; Scope</h3>
              <p className="text-xs text-[#64748B] leading-relaxed bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0]">
                {caseRecord.description || 'No detailed case summary description provided.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-[#E2E8F0] space-y-2">
                <h4 className="text-xs font-bold text-[#172B3A] uppercase tracking-wider text-[#155E8A]">
                  Operational Classification
                </h4>
                <div className="space-y-1.5 text-xs text-[#64748B]">
                  <div className="flex justify-between">
                    <span>Case Number:</span>
                    <span className="font-mono font-semibold text-[#155E8A]">{caseRecord.caseNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Classification:</span>
                    <span className="font-semibold text-[#172B3A]">{caseRecord.confidentiality}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-[#E2E8F0] space-y-2">
                <h4 className="text-xs font-bold text-[#172B3A] uppercase tracking-wider text-[#155E8A]">
                  Assigned Command
                </h4>
                <div className="space-y-1.5 text-xs text-[#64748B]">
                  <div className="flex justify-between">
                    <span>Department:</span>
                    <span className="font-semibold text-[#172B3A]">{caseRecord.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lead Officer:</span>
                    <span className="font-semibold text-[#172B3A]">{caseRecord.assignedOfficer?.fullName}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. DOCUMENTS TAB */}
        {activeTab === 'documents' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#172B3A]">Attached Case Files</h3>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="px-3.5 py-1.5 bg-[#155E8A] hover:bg-[#10496C] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Document</span>
              </button>
            </div>

            {actionNotice && (
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs font-semibold text-[#155E8A] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#155E8A] shrink-0" />
                <span>{actionNotice}</span>
              </div>
            )}

            {caseDocs.length === 0 ? (
              <div className="p-8 rounded-xl border border-dashed border-[#E2E8F0] bg-[#F8FAFC] text-center space-y-2">
                <FileText className="w-8 h-8 text-[#155E8A] mx-auto" />
                <p className="text-xs font-semibold text-[#172B3A]">No documents attached to this case yet.</p>
                <p className="text-[11px] text-[#64748B]">Click "Upload Document" to attach evidence or reports.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {caseDocs.map((doc) => {
                  const ver = doc.versions?.[0];
                  const vRes = verificationResult[doc.id];
                  return (
                    <div key={doc.id} className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {doc.category}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                              doc.status === 'APPROVED'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : doc.status === 'UNDER_REVIEW'
                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              {doc.status}
                            </span>
                            <span className="text-[10px] font-mono text-[#155E8A] bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-bold">
                              v{doc.currentVersionNumber}.0
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-[#172B3A]">{doc.title}</h4>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => setSelectedDocForPreview(doc)}
                            className="px-3 py-1.5 bg-[#155E8A] text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 hover:bg-[#10496C]"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview Document</span>
                          </button>

                          {doc.status !== 'APPROVED' && (
                            <button
                              onClick={() => handleSubmitForReview(doc.id, doc.title)}
                              disabled={submittingId === doc.id}
                              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#155E8A] border border-blue-200 text-xs font-semibold rounded-lg flex items-center gap-1"
                            >
                              {submittingId === doc.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Send className="w-3 h-3" />
                              )}
                              <span>{doc.status === 'UNDER_REVIEW' ? 'Re-Submit Review' : 'Submit for Legal Review'}</span>
                            </button>
                          )}

                          <button
                            onClick={() => setSelectedDocForHistory(doc)}
                            className="px-3 py-1.5 bg-white text-xs font-semibold text-[#172B3A] border border-[#E2E8F0] rounded-lg flex items-center gap-1 hover:bg-slate-50"
                          >
                            <History className="w-3.5 h-3.5 text-[#155E8A]" />
                            <span>Version History</span>
                          </button>

                          <button
                            onClick={() => handleVerifyIntegrity(doc.id)}
                            disabled={verifyingId === doc.id}
                            className="px-3 py-1.5 bg-white text-xs font-semibold text-[#172B3A] border border-[#E2E8F0] rounded-lg flex items-center gap-1 hover:bg-slate-50"
                          >
                            {verifyingId === doc.id ? (
                              <Loader2 className="w-3 h-3 animate-spin text-[#155E8A]" />
                            ) : (
                              <ShieldCheck className="w-3 h-3 text-[#155E8A]" />
                            )}
                            <span>Verify Hash</span>
                          </button>

                          <button
                            onClick={() => handleDownload(doc.id, ver?.fileName || 'file.pdf')}
                            className="px-3 py-1.5 bg-white text-[#172B3A] border border-[#E2E8F0] hover:bg-slate-50 text-xs font-semibold rounded-lg flex items-center gap-1"
                          >
                            <Download className="w-3 h-3 text-slate-500" />
                            <span>Download</span>
                          </button>
                        </div>
                      </div>

                      {ver && (
                        <div className="text-[11px] font-mono text-[#64748B] flex items-center gap-2 bg-white p-2 rounded border border-[#E2E8F0]">
                          <span className="font-semibold text-[#172B3A]">SHA-256:</span>
                          <span className="truncate">{ver.sha256Hash}</span>
                        </div>
                      )}

                      {vRes && (
                        <div className="p-2 rounded bg-[#ECFDF5] text-[#16845B] border border-[#16845B]/20 text-xs font-semibold flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>SHA-256 Checksum Verified</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 3. TEAM TAB */}
        {activeTab === 'team' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#172B3A]">Assigned Investigation Team &amp; Legal Counsel</h3>
                <p className="text-xs text-[#64748B]">Personnel authorized to access, manage, and review case files for <strong className="text-[#155E8A]">{caseRecord.caseNumber}</strong>.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {caseTeam.map((member, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-[#155E8A] font-bold text-sm flex items-center justify-center shrink-0">
                      {member.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#172B3A]">{member.name}</h4>
                      <p className="text-[11px] text-[#64748B]">{member.role}</p>
                      <span className="text-[10px] font-mono text-[#155E8A]">{member.employeeId}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded border shrink-0 ${member.badgeClass}`}>
                    {member.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. TIMELINE TAB */}
        {activeTab === 'timeline' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#172B3A]">Chronological Case Timeline</h3>
            <div className="space-y-4 pl-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-[#E2E8F0]">
              {caseRecord.timeline?.map((tl: any) => (
                <div key={tl.id} className="relative pl-6">
                  <div className="w-3 h-3 rounded-full bg-[#155E8A] border-2 border-white absolute left-0 top-1"></div>
                  <div className="bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E2E8F0]">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-xs font-bold text-[#172B3A]">{tl.title}</h4>
                      <span className="text-[10px] text-[#64748B] font-mono">{new Date(tl.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-[#64748B] mb-1">{tl.description}</p>
                    <p className="text-[10px] text-[#155E8A] font-semibold">Actor: {tl.actor}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. TASKS TAB */}
        {activeTab === 'tasks' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#172B3A]">Investigative Tasks</h3>
            <div className="space-y-2">
              {caseRecord.tasks?.map((tsk: any) => (
                <div key={tsk.id} className="p-3.5 rounded-xl border border-[#E2E8F0] flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[#172B3A]">{tsk.title}</h4>
                    <p className="text-[11px] text-[#64748B]">Assigned to: {tsk.assignedTo} · Due: {tsk.dueDate}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-[#155E8A] border border-blue-200">
                    {tsk.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. AUDIT TAB */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#172B3A]">Case Audit Trail &amp; Chain-of-Custody</h3>
            <p className="text-xs text-[#64748B]">
              Immutable audit log stream tracking all actions recorded for case <strong className="text-[#155E8A]">{caseRecord.caseNumber}</strong>.
            </p>

            <div className="space-y-2.5">
              {auditLogs.length === 0 ? (
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-xs text-[#64748B]">
                  No audit logs recorded for this case yet.
                </div>
              ) : (
                auditLogs.map((log) => (
                  <div key={log.id} className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-1.5">
                    <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-[#155E8A] border border-blue-200">
                          {log.action}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          log.result === 'SUCCESS' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {log.result}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-[#64748B]">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>

                    <p className="text-xs font-semibold text-[#172B3A]">{log.details}</p>

                    <div className="flex items-center gap-4 text-[10px] text-[#64748B] font-mono">
                      <span>User ID: {log.userId}</span>
                      <span>·</span>
                      <span>IP: {log.ipAddress}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>

      {/* Upload Modal */}
      <DocumentUploadModal
        defaultCaseId={caseRecord.id}
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={fetchCaseDocuments}
      />

      {/* Version History Modal */}
      {selectedDocForHistory && (
        <VersionHistoryModal
          document={selectedDocForHistory}
          isOpen={!!selectedDocForHistory}
          onClose={() => setSelectedDocForHistory(null)}
          onRefresh={() => {
            fetchCaseDocuments();
            setSelectedDocForHistory(null);
          }}
        />
      )}

      {/* In-Browser Document Preview Modal */}
      {selectedDocForPreview && (
        <DocumentPreviewModal
          document={selectedDocForPreview}
          isOpen={!!selectedDocForPreview}
          onClose={() => setSelectedDocForPreview(null)}
        />
      )}

    </div>
  );
}
