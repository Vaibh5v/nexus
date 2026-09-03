import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  FileText, 
  Upload, 
  Search, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle,
  Loader2,
  Lock,
  Copy,
  Check,
  History,
  Send,
  Eye
} from 'lucide-react';
import DocumentUploadModal from './DocumentUploadModal';
import VersionHistoryModal from './VersionHistoryModal';
import DocumentPreviewModal from './DocumentPreviewModal';

export default function DocumentList() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [classificationFilter, setClassificationFilter] = useState('ALL');
  
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedDocForHistory, setSelectedDocForHistory] = useState<any | null>(null);
  const [selectedDocForPreview, setSelectedDocForPreview] = useState<any | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<{ [key: string]: any }>({});
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (categoryFilter !== 'ALL') params.append('category', categoryFilter);
      if (classificationFilter !== 'ALL') params.append('classification', classificationFilter);
      if (search) params.append('search', search);

      const response = await api.get(`/documents?${params.toString()}`);
      if (response.data && response.data.success) {
        setDocuments(response.data.documents);
      }
    } catch (err) {
      console.error('Fetch documents error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [categoryFilter, classificationFilter, search]);

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
        fetchDocuments();
        setTimeout(() => setActionNotice(null), 4000);
      }
    } catch (err: any) {
      console.error('Submit review error:', err);
      setActionNotice(err.response?.data?.message || 'Failed to submit document for review.');
    } finally {
      setSubmittingId(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header & Upload Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-[#172B3A] tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#155E8A]" />
            Secure Document Vault &amp; Cryptographic Registry
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Tamper-evident legal documents verified with SHA-256 cryptographic checksums.
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="px-4 py-2.5 bg-[#155E8A] hover:bg-[#10496C] text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors"
        >
          <Upload className="w-4 h-4" />
          <span>Upload New Document</span>
        </button>
      </div>

      {actionNotice && (
        <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs font-semibold text-[#155E8A] flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-[#155E8A] shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-2xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by document title, case number, or description..."
            className="w-full h-10 pl-9 pr-4 bg-[#F8FAFC] text-xs text-[#172B3A] border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#155E8A]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-[#64748B] font-semibold shrink-0">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-10 px-3 bg-[#F8FAFC] text-xs font-medium text-[#172B3A] border border-[#E2E8F0] rounded-lg focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="FIR">FIR</option>
            <option value="POLICE_REPORT">Police Report</option>
            <option value="WITNESS_STATEMENT">Witness Statement</option>
            <option value="FORENSIC_REPORT">Forensic Report</option>
            <option value="EVIDENCE">Evidence</option>
          </select>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-[#64748B] font-semibold shrink-0">Classification:</span>
          <select
            value={classificationFilter}
            onChange={(e) => setClassificationFilter(e.target.value)}
            className="h-10 px-3 bg-[#F8FAFC] text-xs font-medium text-[#172B3A] border border-[#E2E8F0] rounded-lg focus:outline-none"
          >
            <option value="ALL">All Classifications</option>
            <option value="INTERNAL">INTERNAL</option>
            <option value="CONFIDENTIAL">CONFIDENTIAL</option>
            <option value="HIGHLY_CONFIDENTIAL">HIGHLY CONFIDENTIAL</option>
          </select>
        </div>
      </div>

      {/* Document List */}
      {loading ? (
        <div className="bg-white p-12 rounded-xl border border-[#E2E8F0] text-center text-xs text-[#64748B] flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-[#155E8A]" />
          <span>Loading document registry...</span>
        </div>
      ) : documents.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-[#E2E8F0] text-center text-xs text-[#64748B]">
          No documents found in vault.
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => {
            const currentVer = doc.versions?.[0];
            const vResult = verificationResult[doc.id];

            return (
              <div
                key={doc.id}
                className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-2xs space-y-3"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-[#155E8A] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {doc.caseNumber}
                      </span>
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

                    <h3 className="text-sm font-bold text-[#172B3A]">{doc.title}</h3>
                    <p className="text-xs text-[#64748B]">{doc.description}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
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
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#155E8A] border border-blue-200 text-xs font-semibold rounded-lg flex items-center gap-1.5"
                      >
                        {submittingId === doc.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Send className="w-3.5 h-3.5" />
                        )}
                        <span>{doc.status === 'UNDER_REVIEW' ? 'Re-Submit Review' : 'Submit for Legal Review'}</span>
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedDocForHistory(doc)}
                      className="px-3 py-1.5 bg-[#F8FAFC] hover:bg-slate-100 text-[#172B3A] text-xs font-semibold rounded-lg border border-[#E2E8F0] flex items-center gap-1.5"
                    >
                      <History className="w-3.5 h-3.5 text-[#155E8A]" />
                      <span>Version History</span>
                    </button>

                    <button
                      onClick={() => handleVerifyIntegrity(doc.id)}
                      disabled={verifyingId === doc.id}
                      className="px-3 py-1.5 bg-[#F8FAFC] hover:bg-slate-100 text-[#172B3A] text-xs font-semibold rounded-lg border border-[#E2E8F0] flex items-center gap-1.5"
                    >
                      {verifyingId === doc.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#155E8A]" />
                      ) : (
                        <ShieldCheck className="w-3.5 h-3.5 text-[#155E8A]" />
                      )}
                      <span>Verify Hash</span>
                    </button>

                    <button
                      onClick={() => handleDownload(doc.id, currentVer?.fileName || 'document.pdf')}
                      className="px-3 py-1.5 bg-white text-[#172B3A] border border-[#E2E8F0] hover:bg-slate-50 text-xs font-semibold rounded-lg flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-500" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>

                {/* Cryptographic SHA-256 Bar */}
                {currentVer && (
                  <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <Lock className="w-3.5 h-3.5 text-[#155E8A] shrink-0" />
                      <span className="font-semibold text-[#172B3A] shrink-0">SHA-256:</span>
                      <code className="font-mono text-[11px] text-[#64748B] truncate bg-white px-2 py-0.5 rounded border border-[#E2E8F0]">
                        {currentVer.sha256Hash}
                      </code>
                    </div>

                    <button
                      onClick={() => copyToClipboard(currentVer.sha256Hash)}
                      className="text-[11px] font-semibold text-[#155E8A] hover:underline flex items-center gap-1 shrink-0"
                    >
                      {copiedHash === currentVer.sha256Hash ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Hash</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Real-time Integrity Result Alert */}
                {vResult && (
                  <div
                    className={`p-3 rounded-lg border flex items-center justify-between text-xs font-semibold ${
                      vResult.valid
                        ? 'bg-[#ECFDF5] text-[#16845B] border-[#16845B]/20'
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#16845B]" />
                      <span>Cryptographic SHA-256 Verification: MATCH VALID</span>
                    </div>
                    <span className="font-mono text-[10px] text-slate-500">
                      Verified: {new Date(vResult.checkedAt).toLocaleTimeString()}
                    </span>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

      {/* Upload Modal */}
      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={fetchDocuments}
      />

      {/* Version History Modal */}
      {selectedDocForHistory && (
        <VersionHistoryModal
          document={selectedDocForHistory}
          isOpen={!!selectedDocForHistory}
          onClose={() => setSelectedDocForHistory(null)}
          onRefresh={() => {
            fetchDocuments();
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
