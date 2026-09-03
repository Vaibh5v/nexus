import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  Users, 
  UserPlus, 
  Search, 
  ShieldCheck, 
  Building2, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  Lock,
  UserX,
  UserCheck
} from 'lucide-react';
import UserModal from './UserModal';

export default function UserList() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (roleFilter !== 'ALL') params.append('role', roleFilter);
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (search) params.append('search', search);

      const response = await api.get(`/users?${params.toString()}`);
      if (response.data && response.data.success) {
        setUsers(response.data.users);
      }
    } catch (err) {
      console.error('Fetch users error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter, search]);

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    setUpdatingId(userId);
    const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      const response = await api.patch(`/users/${userId}`, { status: newStatus });
      if (response.data && response.data.success) {
        fetchUsers();
      }
    } catch (err) {
      console.error('Update user status error:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header & Provision Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-[#172B3A] tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-[#155E8A]" />
            Agency User Directory &amp; RBAC Control
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Personnel accounts, clearance level governance, and role permissions.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-[#155E8A] hover:bg-[#10496C] text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          <span>Provision New Account</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-2xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search personnel by name, employee ID, email, or department..."
            className="w-full h-10 pl-9 pr-4 bg-[#F8FAFC] text-xs text-[#172B3A] border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#155E8A]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-[#64748B] font-semibold shrink-0">Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-10 px-3 bg-[#F8FAFC] text-xs font-medium text-[#172B3A] border border-[#E2E8F0] rounded-lg focus:outline-none"
          >
            <option value="ALL">All Roles</option>
            <option value="INVESTIGATOR">INVESTIGATOR</option>
            <option value="LEGAL_OFFICER">LEGAL_OFFICER</option>
            <option value="REVIEWER">REVIEWER</option>
            <option value="AUDITOR">AUDITOR</option>
            <option value="ADMIN">ADMIN</option>
            <option value="SUPER_ADMIN">SUPER_ADMIN</option>
          </select>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-[#64748B] font-semibold shrink-0">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 bg-[#F8FAFC] text-xs font-medium text-[#172B3A] border border-[#E2E8F0] rounded-lg focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="SUSPENDED">SUSPENDED</option>
          </select>
        </div>
      </div>

      {/* User Directory Cards */}
      {loading ? (
        <div className="bg-white p-12 rounded-xl border border-[#E2E8F0] text-center text-xs text-[#64748B] flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-[#155E8A]" />
          <span>Loading user directory...</span>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-[#E2E8F0] text-center text-xs text-[#64748B]">
          No matching personnel records found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {users.map((u) => (
            <div
              key={u.id}
              className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-2xs space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-[#155E8A] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {u.employeeId}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                      {u.role}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        u.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}
                    >
                      {u.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#172B3A]">{u.fullName}</h3>
                  <p className="text-xs text-[#64748B]">{u.email}</p>
                </div>

                {/* Status Toggle Action */}
                <button
                  onClick={() => handleToggleStatus(u.id, u.status)}
                  disabled={updatingId === u.id}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1 shrink-0 transition-colors ${
                    u.status === 'ACTIVE'
                      ? 'bg-white text-red-700 border-red-200 hover:bg-red-50'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  {updatingId === u.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : u.status === 'ACTIVE' ? (
                    <>
                      <UserX className="w-3.5 h-3.5 text-red-600" />
                      <span>Suspend</span>
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Activate</span>
                    </>
                  )}
                </button>
              </div>

              {/* Department & Clearance info */}
              <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B] flex-wrap gap-2">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {u.department}
                </span>
                <span className="font-semibold text-[#155E8A] bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-[10px]">
                  {u.clearanceLevel}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* User Provisioning Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchUsers}
      />

    </div>
  );
}
