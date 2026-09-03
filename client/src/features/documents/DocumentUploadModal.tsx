import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  FileText, 
  Upload, 
  X, 
  Loader2, 
  ShieldCheck, 
  FolderKanban,
  FileCheck,
  AlertCircle
} from 'lucide-react';

interface DocumentUploadModalProps {
  defaultCaseId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DocumentUploadModal({ defaultCaseId, isOpen, onClose, onSuccess }: DocumentUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [caseId, setCaseId] = useState(defaultCaseId || '');
  const [category, setCategory] = useState('FIR');
  const [classification, setClassification] = useState('CONFIDENTIAL');
  const [cases, setCases] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (defaultCaseId) setCaseId(defaultCaseId);
  }, [defaultCaseId]);

  useEffect(() => {
    if (isOpen) {
      api.get('/cases')
        .then((res) => {
          if (res.data && res.data.success) {
            setCases(res.data.cases);
            if (!caseId && res.data.cases.length > 0) {
              setCaseId(res.data.cases[0].id);
            }
          }
        })
        .catch((err) => console.error('Fetch cases error:', err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, ""));
      }
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }
    if (!caseId) {
      setError('Please select a target case.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('caseId', caseId);
      formData.append('title', title || file.name);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('classification', classification);

      const response = await api.post('/documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.success) {
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload document.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-[540px] bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden font-sans">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#155E8A]">
            <Upload className="w-5 h-5" />
            <h3 className="text-base font-bold text-[#172B3A]">Upload Document &amp; Compute SHA-256</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* File Picker */}
          <div>
            <label className="block text-xs font-semibold text-[#172B3A] mb-1.5">
              Select Document File *
            </label>
            <div className="border-2 border-dashed border-[#E2E8F0] hover:border-[#155E8A] bg-[#F8FAFC] rounded-xl p-5 text-center cursor-pointer transition-colors">
              <input
                type="file"
                id="modal-file-input"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="modal-file-input" className="cursor-pointer block">
                <FileText className="w-8 h-8 text-[#155E8A] mx-auto mb-2" />
                {file ? (
                  <div>
                    <p className="text-xs font-bold text-[#172B3A]">{file.name}</p>
                    <p className="text-[11px] text-[#64748B]">{(file.size / 1024).toFixed(1)} KB · {file.type || 'Binary'}</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs font-semibold text-[#172B3A]">Click to browse file</p>
                    <p className="text-[11px] text-[#64748B]">PDF, PNG, JPG, DOCX up to 25 MB</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Case Selection */}
          {!defaultCaseId && (
            <div>
              <label className="block text-xs font-semibold text-[#172B3A] mb-1">
                Target Case Record *
              </label>
              <select
                value={caseId}
                onChange={(e) => setCaseId(e.target.value)}
                className="w-full h-10 px-3 bg-white text-xs border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#155E8A]"
              >
                {cases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.caseNumber} — {c.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-[#172B3A] mb-1">
              Document Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sworn Witness Deposition Transcript"
              required
              className="w-full h-10 px-3 bg-white text-xs border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#155E8A]"
            />
          </div>

          {/* Category & Classification */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#172B3A] mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 px-3 bg-white text-xs border border-[#E2E8F0] rounded-lg focus:outline-none"
              >
                <option value="FIR">FIR</option>
                <option value="POLICE_REPORT">Police Report</option>
                <option value="WITNESS_STATEMENT">Witness Statement</option>
                <option value="INVESTIGATION_RECORD">Investigation Record</option>
                <option value="CHARGE_SHEET">Charge Sheet</option>
                <option value="COURT_FILING">Court Filing</option>
                <option value="EVIDENCE">Evidence</option>
                <option value="FORENSIC_REPORT">Forensic Report</option>
                <option value="LEGAL_NOTICE">Legal Notice</option>
                <option value="JUDGMENT">Judgment</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B3A] mb-1">
                Classification
              </label>
              <select
                value={classification}
                onChange={(e) => setClassification(e.target.value)}
                className="w-full h-10 px-3 bg-white text-xs border border-[#E2E8F0] rounded-lg focus:outline-none"
              >
                <option value="INTERNAL">INTERNAL</option>
                <option value="CONFIDENTIAL">CONFIDENTIAL</option>
                <option value="HIGHLY_CONFIDENTIAL">HIGHLY CONFIDENTIAL</option>
                <option value="RESTRICTED">RESTRICTED</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[#172B3A] mb-1">
              Description / Metadata Notes
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Operational context or chain of custody notes..."
              className="w-full p-2.5 bg-white text-xs border border-[#E2E8F0] rounded-lg focus:outline-none"
            />
          </div>

          {/* Submit Buttons */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-5 py-2.5 bg-[#155E8A] hover:bg-[#10496C] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-2 disabled:opacity-60"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Calculating SHA-256...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Upload &amp; Generate Hash</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
