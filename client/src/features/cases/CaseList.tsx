import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  FolderKanban, 
  Plus, 
  Search, 
  Filter, 
  Building2, 
  Clock, 
  UserCheck, 
  ShieldAlert, 
  ChevronRight,
  Loader2,
  AlertCircle,
  X
} from 'lucide-react';

export interface Case {
  id: string;
  caseNumber: string;
  title: string;
  description: string;
  caseType: string;
  status: 'DRAFT' | 'ACTIVE' | 'UNDER_REVIEW' | 'PENDING_COURT' | 'CLOSED' | 'ARCHIVED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  department: string;
  assignedOfficer: {
    id: string;
    fullName: string;
    employeeId: string;
  };
  confidentiality: string;
  createdAt: string;
  updatedAt: string;
}

interface CaseListProps {
  onSelectCase: (caseId: string) => void;
}

export default function CaseList({ onSelectCase }: CaseListProps) {
  const { user } = useAuth();
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // Permission Check for Case Creation
  const canCreateCase = user?.role === 'SUPER_ADMIN' || user?.permissions?.includes('CASE_CREATE');

  // Modal State for New Case Creation
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCaseType, setNewCaseType] = useState('FIR');
  const [newPriority, setNewPriority] = useState('MEDIUM');
  const [newDepartment, setNewDepartment] = useState('Digital Records & Investigation Division');
  const [newConfidentiality, setNewConfidentiality] = useState('CONFIDENTIAL');
  const [creating, setCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchCases = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (priorityFilter !== 'ALL') params.append('priority', priorityFilter);
      if (search) params.append('search', search);

      const response = await api.get(`/cases?${params.toString()}`);
      if (response.data && response.data.success) {
        setCases(response.data.cases);
      }
    } catch (err) {
      console.error('Failed to fetch cases:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, [statusFilter, priorityFilter, search]);

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setCreating(true);
    setErrorMessage(null);
    try {
      const response = await api.post('/cases', {
        title: newTitle,
        description: newDescription,
        caseType: newCaseType,
        priority: newPriority,
        department: newDepartment,
        confidentiality: newConfidentiality,
      });

      if (response.data && response.data.success) {
        setIsModalOpen(false);
        setNewTitle('');
        setNewDescription('');
        fetchCases();
      }
    } catch (err: any) {
      console.error('Create case error:', err);
      setErrorMessage(err.response?.data?.message || 'Access Denied: You do not have permission to initiate cases.');
    } finally {
      setCreating(false);
    }
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'HIGH':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'MEDIUM':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'UNDER_REVIEW':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'PENDING_COURT':
        return 'bg-[#F8FAFC] text-[#155E8A] border-[#E2E8F0]';
      case 'CLOSED':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header & New Case Button (Restricted to Officers with CASE_CREATE) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-[#172B3A] tracking-tight flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-[#155E8A]" />
            Case Management Directory
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Central repository for legal, police FIR, and judicial investigation cases.
          </p>
        </div>

        {canCreateCase && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-[#155E8A] hover:bg-[#10496C] text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#155E8A]/20"
          >
            <Plus className="w-4 h-4" />
            <span>Initiate New Case</span>
          </button>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-2xs flex flex-col md:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by case number, title, department, or keywords..."
            className="w-full h-10 pl-9 pr-4 bg-[#F8FAFC] text-xs text-[#172B3A] border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#155E8A] focus:ring-1 focus:ring-[#155E8A]"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-[#64748B] font-semibold shrink-0">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 bg-[#F8FAFC] text-xs font-medium text-[#172B3A] border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#155E8A]"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="UNDER_REVIEW">UNDER_REVIEW</option>
            <option value="PENDING_COURT">PENDING_COURT</option>
            <option value="CLOSED">CLOSED</option>
            <option value="DRAFT">DRAFT</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-[#64748B] font-semibold shrink-0">Priority:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="h-10 px-3 bg-[#F8FAFC] text-xs font-medium text-[#172B3A] border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#155E8A]"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>
        </div>
      </div>

      {/* Case Directory List */}
      {loading ? (
        <div className="bg-white p-12 rounded-xl border border-[#E2E8F0] text-center text-xs text-[#64748B] flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-[#155E8A]" />
          <span>Loading case records...</span>
        </div>
      ) : cases.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-[#E2E8F0] text-center text-xs text-[#64748B]">
          No matching case records found.
        </div>
      ) : (
        <div className="space-y-3">
          {cases.map((c) => (
            <div
              key={c.id}
              onClick={() => onSelectCase(c.id)}
              className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-2xs hover:border-[#155E8A] transition-all cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono text-xs font-bold text-[#155E8A] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                    {c.caseNumber}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getStatusBadgeClass(c.status)}`}>
                    {c.status}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getPriorityBadgeClass(c.priority)}`}>
                    {c.priority} PRIORITY
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                    {c.caseType}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#172B3A] group-hover:text-[#155E8A] transition-colors truncate">
                  {c.title}
                </h3>
                <p className="text-xs text-[#64748B] line-clamp-1">
                  {c.description}
                </p>

                <div className="flex items-center gap-4 text-[11px] text-[#64748B] pt-1 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    {c.department}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                    Officer: {c.assignedOfficer?.fullName || 'Unassigned'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <span className="text-xs font-semibold text-[#155E8A] group-hover:underline">View Case Hub</span>
                <ChevronRight className="w-4 h-4 text-[#155E8A] group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* NEW CASE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-[520px] bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden font-sans">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#155E8A]">
                <FolderKanban className="w-5 h-5" />
                <h3 className="text-base font-bold text-[#172B3A]">Initiate New Case Record</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateCase} className="p-6 space-y-4">
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#172B3A] mb-1">
                  Case Title *
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. State vs. Financial Fraud Investigation"
                  required
                  className="w-full h-11 px-3.5 bg-white text-xs border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#155E8A] focus:ring-1 focus:ring-[#155E8A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B3A] mb-1">
                  Case Description
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={3}
                  placeholder="Brief operational summary and initial investigation scope..."
                  className="w-full p-3 bg-white text-xs border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#155E8A] focus:ring-1 focus:ring-[#155E8A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#172B3A] mb-1">
                    Case Type
                  </label>
                  <select
                    value={newCaseType}
                    onChange={(e) => setNewCaseType(e.target.value)}
                    className="w-full h-10 px-3 bg-white text-xs border border-[#E2E8F0] rounded-lg focus:outline-none"
                  >
                    <option value="FIR">FIR</option>
                    <option value="Investigation">Investigation</option>
                    <option value="Criminal">Criminal</option>
                    <option value="Civil">Civil</option>
                    <option value="Court">Court</option>
                    <option value="Forensic">Forensic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#172B3A] mb-1">
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full h-10 px-3 bg-white text-xs border border-[#E2E8F0] rounded-lg focus:outline-none"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B3A] mb-1">
                  Department / Division
                </label>
                <input
                  type="text"
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                  className="w-full h-10 px-3 bg-white text-xs border border-[#E2E8F0] rounded-lg focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2.5 bg-[#155E8A] hover:bg-[#10496C] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-2 disabled:opacity-60"
                >
                  {creating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Initiate Case</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
