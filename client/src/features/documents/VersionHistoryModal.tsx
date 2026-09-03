import React, { useState } from 'react';
import api from '../../services/api';
import { 
  History, 
  X, 
  Upload, 
  Download, 
  ShieldCheck, 
  FileText, 
  UserCheck, 
  Clock, 
  Loader2, 
  Lock,
  Plus
} from 'lucide-react';

interface VersionHistoryModalProps {
  document: any;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export default function VersionHistoryModal({ document: doc, isOpen, onClose, onRefresh }: VersionHistoryModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [changeLog, setChangeLog] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);

  if (!isOpen || !doc) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUploadNewVersion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file for the new version.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('changeLog', changeLog || `Version ${doc.currentVersionNumber + 1}.0 update`);

      const response = await api.post(`/documents/${doc.id}/versions`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.success) {
        setFile(null);
        setChangeLog('');
        setShowUploadForm(false);
        onRefresh();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload new document version.');
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadVersion = async (verNum: number, fileName: string) => {
    try {
      const response = await api.get(`/documents/${doc.id}/download?version=${verNum}`, {
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
      console.error('Download version error:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-[620px] bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden font-sans">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#155E8A]">
            <History className="w-5 h-5" />
            <div>
              <h3 className="text-base font-bold text-[#172B3A]">Document Version History</h3>
              <p className="text-[11px] text-[#64748B]">{doc.title} ({doc.caseNumber})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Action Bar */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <span className="text-xs font-bold text-[#172B3A]">
              Version Lineage ({doc.versions?.length || 0} Versions)
            </span>
            <button
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="px-3 py-1.5 bg-[#155E8A] hover:bg-[#10496C] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Upload New Version (v{doc.currentVersionNumber + 1}.0)</span>
            </button>
          </div>

          {/* New Version Upload Form */}
          {showUploadForm && (
            <form onSubmit={handleUploadNewVersion} className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
              <h4 className="text-xs font-bold text-[#155E8A]">
                Append Version {doc.currentVersionNumber + 1}.0
              </h4>

              {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}

              <div>
                <input
                  type="file"
                  onChange={handleFileChange}
                  required
                  className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[#155E8A] hover:file:bg-blue-100 cursor-pointer"
                />
              </div>

              <div>
                <input
                  type="text"
                  value={changeLog}
                  onChange={(e) => setChangeLog(e.target.value)}
                  placeholder="Reason for version update / change rationale..."
                  className="w-full h-9 px-3 bg-white text-xs border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#155E8A]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowUploadForm(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-1.5 bg-[#155E8A] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 disabled:opacity-60"
                >
                  {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                  <span>Save Version {doc.currentVersionNumber + 1}.0</span>
                </button>
              </div>
            </form>
          )}

          {/* Versions List */}
          <div className="space-y-3 relative pl-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-[#E2E8F0]">
            {doc.versions?.map((v: any) => (
              <div key={v.id} className="relative pl-6">
                <div className="w-3 h-3 rounded-full bg-[#155E8A] border-2 border-white absolute left-0 top-3"></div>
                <div className="p-4 rounded-xl border border-[#E2E8F0] bg-white shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold bg-blue-50 text-[#155E8A] px-2 py-0.5 rounded border border-blue-200">
                        v{v.versionNumber}.0
                      </span>
                      <span className="text-xs font-bold text-[#172B3A]">{v.fileName}</span>
                    </div>

                    <button
                      onClick={() => handleDownloadVersion(v.versionNumber, v.fileName)}
                      className="px-2.5 py-1 bg-[#F8FAFC] hover:bg-slate-100 text-[#155E8A] text-xs font-semibold rounded border border-[#E2E8F0] flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download</span>
                    </button>
                  </div>

                  <p className="text-xs text-[#64748B] italic">"{v.changeLog}"</p>

                  <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-1 border-t border-slate-100 flex-wrap gap-2">
                    <span className="flex items-center gap-1">
                      <UserCheck className="w-3 h-3 text-slate-400" />
                      Uploaded by: {v.uploadedByFullName}
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {new Date(v.uploadedAt).toLocaleString()}
                    </span>
                  </div>

                  {/* SHA-256 Checksum Pill */}
                  <div className="p-2 bg-[#F8FAFC] rounded border border-[#E2E8F0] text-[10px] font-mono text-[#64748B] flex items-center gap-1.5">
                    <Lock className="w-3 h-3 text-[#155E8A] shrink-0" />
                    <span className="font-semibold text-[#172B3A] shrink-0">SHA-256:</span>
                    <span className="truncate">{v.sha256Hash}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
