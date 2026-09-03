import React, { useState } from 'react';
import api from '../../services/api';
import { 
  UserPlus, 
  X, 
  Building2, 
  ShieldCheck, 
  Lock, 
  Loader2, 
  AlertCircle
} from 'lucide-react';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UserModal({ isOpen, onClose, onSuccess }: UserModalProps) {
  const [employeeId, setEmployeeId] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Digital Records & Investigation Division');
  const [role, setRole] = useState('INVESTIGATOR');
  const [clearanceLevel, setClearanceLevel] = useState('Level 3 - Confidential & Classified');
  const [password, setPassword] = useState('password123');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId || !fullName || !email) {
      setError('Please fill in Employee ID, Full Name, and Email.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await api.post('/users', {
        employeeId: employeeId.trim(),
        fullName: fullName.trim(),
        email: email.trim(),
        department,
        role,
        clearanceLevel,
        password,
      });

      if (response.data && response.data.success) {
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to provision user account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-[540px] bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#155E8A]">
            <UserPlus className="w-5 h-5" />
            <h3 className="text-base font-bold text-[#172B3A]">Provision Official User Account</h3>
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
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#172B3A] mb-1">
                Employee ID *
              </label>
              <input
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="e.g. EMP-1010"
                required
                className="w-full h-10 px-3 bg-white text-xs border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#155E8A]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B3A] mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Officer K. Deshmukh"
                required
                className="w-full h-10 px-3 bg-white text-xs border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#155E8A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172B3A] mb-1">
              Official Email Address *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="officer.name@agency.gov"
              required
              className="w-full h-10 px-3 bg-white text-xs border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#155E8A]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172B3A] mb-1">
              Department / Division
            </label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full h-10 px-3 bg-white text-xs border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#155E8A]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#172B3A] mb-1">
                System Role *
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full h-10 px-3 bg-white text-xs border border-[#E2E8F0] rounded-lg focus:outline-none"
              >
                <option value="INVESTIGATOR">INVESTIGATOR</option>
                <option value="CASE_OFFICER">CASE_OFFICER</option>
                <option value="LEGAL_OFFICER">LEGAL_OFFICER</option>
                <option value="REVIEWER">REVIEWER</option>
                <option value="AUDITOR">AUDITOR</option>
                <option value="ADMIN">ADMIN</option>
                <option value="VIEWER">VIEWER</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B3A] mb-1">
                Clearance Level
              </label>
              <select
                value={clearanceLevel}
                onChange={(e) => setClearanceLevel(e.target.value)}
                className="w-full h-10 px-3 bg-white text-xs border border-[#E2E8F0] rounded-lg focus:outline-none"
              >
                <option value="Level 1 - Internal Only">Level 1 - Internal</option>
                <option value="Level 2 - Confidential">Level 2 - Confidential</option>
                <option value="Level 3 - Confidential & Classified">Level 3 - Classified</option>
                <option value="Level 4 - Top Secret">Level 4 - Top Secret</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172B3A] mb-1">
              Initial Password *
            </label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Initial password"
              required
              className="w-full h-10 px-3 bg-white text-xs border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#155E8A]"
            />
          </div>

          {/* Buttons */}
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
              disabled={submitting}
              className="px-5 py-2.5 bg-[#155E8A] hover:bg-[#10496C] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-2 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Provisioning...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Provision Account</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
