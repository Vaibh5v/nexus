import React from 'react';
import { useAuth } from '../context/AuthContext';
import Login from '../features/auth/Login';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center text-[#172B3A] font-sans">
        <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs">
          <Loader2 className="w-5 h-5 text-[#155E8A] animate-spin" />
          <span className="text-xs font-semibold text-[#172B3A]">Checking secure session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Login />;
  }

  return <>{children}</>;
}
