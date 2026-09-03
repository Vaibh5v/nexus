import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Shield, 
  LogOut, 
  FolderKanban, 
  FileText, 
  CheckSquare, 
  ShieldCheck, 
  LayoutDashboard, 
  Users, 
  Settings, 
  Search, 
  Building2,
  Menu,
  X,
  ChevronRight,
  Loader2
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeNav: string;
  onNavigate: (nav: string, payload?: any) => void;
}

export default function DashboardLayout({ children, activeNav, onNavigate }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Global Search State
  const [globalSearch, setGlobalSearch] = useState('');
  const [searchResults, setSearchResults] = useState<{ cases: any[]; documents: any[]; users: any[] } | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (!globalSearch.trim()) {
      setSearchResults(null);
      setSearchOpen(false);
      return;
    }

    const timer = setTimeout(() => {
      setSearching(true);
      api.get(`/search?q=${encodeURIComponent(globalSearch.trim())}`)
        .then((res) => {
          if (res.data && res.data.success) {
            setSearchResults(res.data.results);
            setSearchOpen(true);
          }
        })
        .catch((err) => console.error('Global search error:', err))
        .finally(() => setSearching(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [globalSearch]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, perm: 'CASE_VIEW' },
    { id: 'cases', label: 'Cases Directory', icon: FolderKanban, perm: 'CASE_VIEW' },
    { id: 'documents', label: 'Documents Vault', icon: FileText, perm: 'DOCUMENT_VIEW' },
    { id: 'approvals', label: 'Pending Approvals', icon: CheckSquare, perm: 'DOCUMENT_APPROVE' },
    { id: 'audit', label: 'Security Audit Logs', icon: ShieldCheck, perm: 'AUDIT_VIEW' },
    { id: 'users', label: 'User Directory', icon: Users, perm: 'USER_CREATE' },
    { id: 'settings', label: 'System Settings', icon: Settings, perm: 'SYSTEM_CONFIGURE' },
  ];

  const filteredNavItems = navItems.filter(
    (item) => !item.perm || user?.role === 'SUPER_ADMIN' || user?.permissions.includes(item.perm)
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#172B3A] flex flex-col font-sans">
      
      {/* TOP ENTERPRISE HEADER */}
      <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-40 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          
          {/* Left: Organization Identity */}
          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg text-[#64748B] hover:text-[#172B3A] hover:bg-[#F8FAFC]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="w-9 h-9 rounded-lg bg-[#155E8A] text-white flex items-center justify-center shadow-xs shrink-0">
              <Shield className="w-5 h-5" />
            </div>

            <div>
              <h1 className="text-sm font-bold text-[#172B3A] tracking-tight flex items-center gap-2">
                Police Digital Document Management System
                <span className="hidden sm:inline-block text-[10px] bg-[#ECFDF5] text-[#16845B] px-2 py-0.5 rounded border border-[#16845B]/20 font-mono uppercase font-bold">
                  {user?.role}
                </span>
              </h1>
              <p className="text-[11px] text-[#64748B]">Digital Records &amp; Investigation Division</p>
            </div>
          </div>

          {/* Middle: Global Search Input */}
          <div className="relative flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Global Search (Cases, Documents, Personnel)..."
                className="w-full h-9 pl-9 pr-8 bg-[#F8FAFC] text-xs text-[#172B3A] border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#155E8A]"
              />
              {searching && (
                <Loader2 className="w-3.5 h-3.5 text-[#155E8A] animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
              )}
            </div>

            {/* Global Search Results Overlay Dropdown */}
            {searchOpen && searchResults && (
              <div className="absolute top-11 left-0 right-0 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 space-y-3 max-h-96 overflow-y-auto">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-xs font-bold text-[#155E8A]">Global Search Results</span>
                  <button onClick={() => setSearchOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Cases Results */}
                {searchResults.cases.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block mb-1">
                      Matching Cases ({searchResults.cases.length})
                    </span>
                    <div className="space-y-1">
                      {searchResults.cases.map((c) => (
                        <div
                          key={c.id}
                          onClick={() => {
                            setSearchOpen(false);
                            setGlobalSearch('');
                            onNavigate('case_details', c.id);
                          }}
                          className="p-2 rounded-lg bg-[#F8FAFC] hover:bg-blue-50 cursor-pointer flex items-center justify-between text-xs"
                        >
                          <div className="min-w-0">
                            <span className="font-mono text-[11px] font-bold text-[#155E8A]">{c.caseNumber}</span>
                            <p className="font-semibold text-[#172B3A] truncate">{c.title}</p>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-[#155E8A]" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Documents Results */}
                {searchResults.documents.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block mb-1">
                      Matching Documents ({searchResults.documents.length})
                    </span>
                    <div className="space-y-1">
                      {searchResults.documents.map((d) => (
                        <div
                          key={d.id}
                          onClick={() => {
                            setSearchOpen(false);
                            setGlobalSearch('');
                            onNavigate('documents');
                          }}
                          className="p-2 rounded-lg bg-[#F8FAFC] hover:bg-blue-50 cursor-pointer flex items-center justify-between text-xs"
                        >
                          <div className="min-w-0">
                            <span className="font-mono text-[10px] bg-blue-50 text-[#155E8A] px-1.5 py-0.5 rounded border border-blue-200">{d.caseNumber}</span>
                            <p className="font-semibold text-[#172B3A] truncate">{d.title}</p>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-[#155E8A]" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.cases.length === 0 && searchResults.documents.length === 0 && (
                  <p className="text-xs text-[#64748B] text-center py-2">No matching records found.</p>
                )}
              </div>
            )}
          </div>

          {/* Right: User Profile Badge & Logout */}
          <div className="flex items-center space-x-3.5 shrink-0">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs">
              <ShieldCheck className="w-4 h-4 text-[#16845B]" />
              <span className="font-semibold text-[#172B3A]">{user?.fullName}</span>
              <span className="text-[#64748B]">({user?.employeeId})</span>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-xs font-semibold text-[#172B3A] transition-colors focus:outline-none focus:ring-2 focus:ring-[#155E8A]/20"
            >
              <LogOut className="w-3.5 h-3.5 text-[#64748B]" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>

        </div>
      </header>

      {/* BODY SHELL */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 gap-6">
        
        {/* SIDEBAR NAVIGATION */}
        <aside className={`lg:w-60 shrink-0 ${mobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white p-3 rounded-xl border border-[#E2E8F0] shadow-2xs sticky top-20">
            <p className="text-[10px] font-bold tracking-wider text-[#64748B] uppercase px-3 pt-2 pb-2">
              System Modules
            </p>
            <nav className="space-y-1">
              {filteredNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeNav === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#155E8A] text-white shadow-xs'
                        : 'text-[#64748B] hover:text-[#172B3A] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#64748B]'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* MAIN CONTENT WORKSPACE */}
        <main className="flex-1 min-w-0">
          {children}
        </main>

      </div>

      {/* FOOTER */}
      <footer className="border-t border-[#E2E8F0] bg-white py-4 text-center text-xs text-[#64748B] mt-auto">
        Police Digital Document Management System &copy; 2026 — Ministry of Home Affairs
      </footer>

    </div>
  );
}
