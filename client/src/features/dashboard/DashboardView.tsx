import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  FolderKanban, 
  FileText, 
  CheckSquare, 
  ShieldCheck, 
  Clock, 
  Activity, 
  Building2, 
  UserCheck, 
  Lock,
  ArrowUpRight
} from 'lucide-react';

interface DashboardViewProps {
  onNavigateToCases: () => void;
  onSelectCase: (caseId: string) => void;
}

export default function DashboardView({ onNavigateToCases, onSelectCase }: DashboardViewProps) {
  const { user } = useAuth();
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/cases')
      .then((res) => {
        if (res.data && res.data.success) {
          setCases(res.data.cases);
        }
      })
      .catch((err) => console.error('Dashboard fetch error:', err))
      .finally(() => setLoading(false));
  }, []);

  const activeCasesCount = cases.filter((c) => c.status === 'ACTIVE').length;
  const underReviewCount = cases.filter((c) => c.status === 'UNDER_REVIEW').length;

  return (
    <div className="space-y-6 font-sans">
      
      {/* Welcome Banner */}
      <div className="bg-white p-8 rounded-2xl border border-[#E2E8F0] shadow-2xs">
        <div className="flex items-start justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#ECFDF5] text-[#16845B] border border-[#16845B]/20 mb-3">
              <ShieldCheck className="w-3.5 h-3.5" /> High Security Enterprise Platform
            </span>
            <h2 className="text-2xl font-bold text-[#172B3A] mb-1">
              Operational Command — {user?.fullName}
            </h2>
            <p className="text-xs text-[#64748B]">
              Role: <strong className="text-[#155E8A]">{user?.role}</strong> · {user?.department} · Clearance: {user?.clearanceLevel}
            </p>
          </div>
          <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] hidden sm:block">
            <Lock className="w-6 h-6 text-[#155E8A]" />
          </div>
        </div>
      </div>

      {/* METRICS METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Cases */}
        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#64748B]">Total Cases</span>
            <div className="p-2 rounded-lg bg-blue-50 text-[#155E8A]">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#172B3A]">{cases.length}</p>
          <p className="text-[11px] text-[#64748B] mt-1">Managed across departments</p>
        </div>

        {/* Active Cases */}
        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#64748B]">Active Investigations</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-[#16845B]">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#172B3A]">{activeCasesCount}</p>
          <p className="text-[11px] text-emerald-700 font-semibold mt-1">Under active processing</p>
        </div>

        {/* Under Review */}
        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#64748B]">Pending Reviews</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-700">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#172B3A]">{underReviewCount}</p>
          <p className="text-[11px] text-purple-700 font-semibold mt-1">Awaiting legal review</p>
        </div>

        {/* Total Documents */}
        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#64748B]">Document Vault</span>
            <div className="p-2 rounded-lg bg-blue-50 text-[#2B7A9B]">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#172B3A]">12</p>
          <p className="text-[11px] text-[#64748B] mt-1">SHA-256 verified files</p>
        </div>

      </div>

      {/* RECENT CASES & ACTIVITY GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Cases Column (2 cols) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
            <h3 className="text-sm font-bold text-[#172B3A] flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-[#155E8A]" />
              Recent Active Cases
            </h3>
            <button
              onClick={onNavigateToCases}
              className="text-xs font-semibold text-[#155E8A] hover:underline flex items-center gap-1"
            >
              <span>View All Cases</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {cases.slice(0, 3).map((c) => (
              <div
                key={c.id}
                onClick={() => onSelectCase(c.id)}
                className="p-4 rounded-xl border border-[#E2E8F0] hover:border-[#155E8A] transition-all cursor-pointer flex items-center justify-between gap-3 group bg-[#F8FAFC]"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#155E8A]">{c.caseNumber}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {c.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-[#172B3A] group-hover:text-[#155E8A] transition-colors truncate">
                    {c.title}
                  </h4>
                </div>
                <span className="text-xs font-semibold text-[#155E8A] shrink-0">Open →</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Stream (1 col) */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-[#172B3A] flex items-center gap-2 border-b border-[#E2E8F0] pb-4">
            <Clock className="w-4 h-4 text-[#155E8A]" />
            Recent Activity Feed
          </h3>

          <div className="space-y-3 text-xs text-[#64748B]">
            <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
              <p className="font-semibold text-[#172B3A]">Investigator D. Sharma</p>
              <p className="text-[11px] text-[#64748B]">Updated case state for CASE-2026-00101</p>
              <span className="text-[10px] text-slate-400 font-mono block mt-1">10 mins ago</span>
            </div>

            <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
              <p className="font-semibold text-[#172B3A]">Legal Officer A. Roy</p>
              <p className="text-[11px] text-[#64748B]">Reviewed charge sheet draft</p>
              <span className="text-[10px] text-slate-400 font-mono block mt-1">1 hour ago</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
