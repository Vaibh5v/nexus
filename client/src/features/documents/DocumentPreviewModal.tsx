import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  Eye, 
  X, 
  Download, 
  ShieldCheck, 
  Lock, 
  Loader2, 
  FileText, 
  Maximize2, 
  Minimize2,
  Printer,
  Copy,
  Check,
  Building2,
  UserCheck
} from 'lucide-react';

interface DocumentPreviewModalProps {
  document: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function DocumentPreviewModal({ document, isOpen, onClose }: DocumentPreviewModalProps) {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  const currentVer = document?.versions?.[0];

  useEffect(() => {
    if (!isOpen || !document) return;

    setLoading(true);
    setError(null);
    setFileUrl(null);

    api.get(`/documents/${document.id}/download?inline=true`, {
      responseType: 'blob',
    })
      .then((response) => {
        const type = (response.headers['content-type'] as string) || 'application/pdf';
        setMimeType(type);
        const blob = new Blob([response.data], { type });
        const url = URL.createObjectURL(blob);
        setFileUrl(url);
      })
      .catch((err) => {
        console.error('Preview stream error:', err);
        setError('Failed to load document stream for preview.');
      })
      .finally(() => setLoading(false));

    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
    };
  }, [document?.id, isOpen]);

  if (!isOpen || !document) return null;

  const handleDownload = () => {
    const link = window.document.createElement('a');
    link.href = fileUrl || '';
    link.download = currentVer?.fileName || 'document.pdf';
    window.document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const copyHash = () => {
    if (currentVer?.sha256Hash) {
      navigator.clipboard.writeText(currentVer.sha256Hash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 font-sans">
      <div
        className={`w-full bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col transition-all ${
          isFullscreen ? 'h-full max-w-none rounded-none' : 'max-w-4xl max-h-[90vh] h-[850px]'
        }`}
      >
        
        {/* Header Bar */}
        <div className="p-4 bg-[#172B3A] text-white flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#155E8A] text-white flex items-center justify-center shrink-0">
              <Eye className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-[10px] font-bold bg-blue-900/60 text-blue-200 px-2 py-0.5 rounded border border-blue-400/30">
                  {document.caseNumber}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-500/30">
                  {document.category}
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-900/60 text-amber-300 border border-amber-500/30">
                  v{document.currentVersionNumber}.0
                </span>
              </div>
              <h3 className="text-sm font-bold text-white truncate pt-0.5">{document.title}</h3>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/50"
              title={isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={handleDownload}
              className="px-3 py-1.5 bg-[#155E8A] hover:bg-[#10496C] text-white text-xs font-bold rounded-lg flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Save Disk Copy</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-700/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SHA-256 & Classification Metadata Sub-bar */}
        <div className="px-4 py-2 bg-[#F8FAFC] border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs shrink-0">
          <div className="flex items-center gap-2 text-[#64748B] min-w-0">
            <Lock className="w-3.5 h-3.5 text-[#155E8A] shrink-0" />
            <span className="font-semibold text-[#172B3A] shrink-0">SHA-256:</span>
            <code className="font-mono text-[10px] text-[#155E8A] bg-white px-2 py-0.5 rounded border border-[#E2E8F0] truncate">
              {currentVer?.sha256Hash || 'Computing...'}
            </code>
          </div>

          <button
            onClick={copyHash}
            className="text-[11px] font-semibold text-[#155E8A] hover:underline flex items-center gap-1 shrink-0 self-end sm:self-auto"
          >
            {copiedHash ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Checksum</span>
              </>
            )}
          </button>
        </div>

        {/* PREVIEW CONTAINER */}
        <div className="flex-1 bg-slate-100 relative overflow-hidden flex items-center justify-center p-2">
          
          {loading ? (
            <div className="text-center space-y-3">
              <Loader2 className="w-8 h-8 text-[#155E8A] animate-spin mx-auto" />
              <p className="text-xs text-slate-600 font-semibold">Streaming document into secure previewer...</p>
            </div>
          ) : error ? (
            <div className="p-6 bg-white rounded-xl shadow-xs border border-red-200 text-center space-y-2 max-w-md">
              <FileText className="w-8 h-8 text-red-500 mx-auto" />
              <p className="text-xs font-bold text-red-700">{error}</p>
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-[#155E8A] text-white text-xs font-bold rounded-lg shadow-xs"
              >
                Download Direct Copy
              </button>
            </div>
          ) : mimeType.includes('image') ? (
            <div className="h-full w-full flex items-center justify-center overflow-auto p-4">
              <img
                src={fileUrl || ''}
                alt={document.title}
                className="max-h-full max-w-full object-contain rounded-lg shadow-md border border-slate-300"
              />
            </div>
          ) : (
            <iframe
              src={fileUrl || ''}
              title={document.title}
              className="w-full h-full rounded-lg shadow-xs border border-slate-200 bg-white"
            />
          )}

          {/* Security Overlay Watermark */}
          <div className="absolute bottom-4 right-4 pointer-events-none opacity-25 select-none bg-slate-900 text-white px-3 py-1 rounded text-[10px] font-mono tracking-widest uppercase">
            CONFIDENTIAL LAW ENFORCEMENT PREVIEW
          </div>

        </div>

      </div>
    </div>
  );
}
