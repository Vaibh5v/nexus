import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  ShieldCheck, 
  Search, 
  Clock, 
  UserCheck, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Loader2,
  Terminal,
  RefreshCw
} from 'lucide-react';

export default function AuditLogList() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/audit-logs');
      if (response.data && response.data.success) {
        setLogs(response.data.logs);
      }
    } catch (err) {
      console.error('Fetch audit logs error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      log.action.toLowerCase().includes(q) ||
      log.userId.toLowerCase().includes(q) ||
      log.entityType.toLowerCase().includes(q) ||
      log.entityId.toLowerCase().includes(q) ||
      (log.details && log.details.toLowerCase().includes(q))
    );
  });

  const getResultBadge = (result: string) => {
    switch (result) {
      case 'SUCCESS':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> SUCCESS
          </span>
        );
      case 'DENIED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3 h-3" /> DENIED
          </span>
        );
      case 'FAILURE':
      case 'BLOCKED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-3 h-3" /> {result}
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
            {result}
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
            <ShieldCheck className="w-5 h-5 text-[#155E8A]" />
            Immutable Security Audit Log Stream
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Append-only compliance audit trail recording all user activity and security events.
          </p>
        </div>

        <button
          onClick={fetchAuditLogs}
          className="px-3.5 py-2 bg-white hover:bg-[#F8FAFC] text-[#172B3A] text-xs font-semibold rounded-xl border border-[#E2E8F0] flex items-center justify-center gap-2 transition-colors shadow-2xs"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#155E8A]" />
          <span>Refresh Stream</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-2xs">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter audit logs by action code, user ID, entity ID, or details..."
            className="w-full h-10 pl-9 pr-4 bg-[#F8FAFC] text-xs text-[#172B3A] border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#155E8A]"
          />
        </div>
      </div>

      {/* Audit Log Stream */}
      {loading ? (
        <div className="bg-white p-12 rounded-xl border border-[#E2E8F0] text-center text-xs text-[#64748B] flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-[#155E8A]" />
          <span>Loading audit log stream...</span>
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-[#E2E8F0] text-center text-xs text-[#64748B]">
          No matching security audit log records found.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Event ID / Action</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Entity</th>
                  <th className="py-3 px-4">Result</th>
                  <th className="py-3 px-4">Details / Context</th>
                  <th className="py-3 px-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] font-sans">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono text-[11px] font-bold text-[#155E8A] block">
                        {log.eventId || log.id}
                      </span>
                      <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200 inline-block mt-0.5">
                        {log.action}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-medium text-[#172B3A]">
                      <div className="flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{log.userId}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-[#64748B]">
                      {log.entityType}:<strong className="text-[#172B3A]">{log.entityId}</strong>
                    </td>

                    <td className="py-3 px-4">
                      {getResultBadge(log.result)}
                    </td>

                    <td className="py-3 px-4 text-[#64748B] max-w-xs truncate">
                      {log.details || '—'}
                    </td>

                    <td className="py-3 px-4 text-right font-mono text-[11px] text-[#64748B]">
                      {new Date(log.createdAt).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
