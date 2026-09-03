import React, { useState } from 'react';
import { 
  Shield, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Lock, 
  FileText, 
  Search, 
  FileCheck, 
  Scale, 
  Archive,
  Loader2,
  Building2,
  AlertCircle,
  Key
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { login, error, clearError } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ identifier?: string; password?: string }>({});

  const validateForm = () => {
    const errors: { identifier?: string; password?: string } = {};
    if (!identifier.trim()) {
      errors.identifier = 'Please enter your official email or employee ID.';
    }
    if (!password) {
      errors.password = 'Please enter your password.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    clearError();
    setIsSubmitting(true);

    try {
      await login(identifier.trim(), password);
    } catch (err) {
      // Error handled by AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillSeedUser = (id: string, pwd = 'password123') => {
    setIdentifier(id);
    setPassword(pwd);
    setFieldErrors({});
    clearError();
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F8FAFC] text-[#172B3A] font-sans antialiased selection:bg-[#155E8A]/10 selection:text-[#155E8A]">
      
      {/* ========================================================================= */}
      {/* LEFT SECTION — GOVERNMENT IDENTITY & DOCUMENT LIFECYCLE (approx 48%)      */}
      {/* ========================================================================= */}
      <section className="lg:w-[48%] bg-[#F8FAFC] p-8 lg:p-12 flex flex-col justify-between border-r border-[#E2E8F0]/80">
        
        {/* Branding */}
        <div>
          <div className="flex items-center space-x-3.5 mb-8">
            <div className="w-12 h-12 rounded-full bg-[#FFFFFF] border-2 border-[#155E8A]/30 shadow-xs flex items-center justify-center p-2">
              <Building2 className="w-6 h-6 text-[#155E8A]" />
            </div>
            <div>
              <h2 className="text-xs font-bold tracking-widest text-[#172B3A] uppercase">
                MINISTRY OF HOME AFFAIRS
              </h2>
              <p className="text-xs font-medium text-[#64748B] tracking-tight">
                Digital Records &amp; Investigation Division
              </p>
            </div>
          </div>

          {/* Heading */}
          <div className="max-w-md my-6">
            <h1 className="text-3xl lg:text-4xl font-extrabold text-[#172B3A] tracking-tight leading-[1.15] mb-3">
              Secure records.<br />
              <span className="text-[#155E8A]">Trusted investigations.</span>
            </h1>
            <p className="text-xs lg:text-sm leading-relaxed text-[#64748B]">
              A secure digital platform for managing legal, investigative, evidence, and official government documents throughout their lifecycle.
            </p>
          </div>

          {/* 5-Stage Minimal Document Lifecycle Visual */}
          <div className="hidden sm:block my-6 max-w-md">
            <p className="text-[11px] font-semibold tracking-wider text-[#64748B] uppercase mb-3">
              Document Lifecycle Workflow
            </p>
            
            <div className="space-y-1.5 relative pl-2">
              <div className="flex items-center gap-3 bg-white p-2.5 px-3 rounded-lg border border-[#E2E8F0] shadow-2xs hover:border-[#155E8A]/30 transition-colors">
                <div className="p-1 rounded-md bg-[#F8FAFC] text-[#155E8A] border border-[#E2E8F0]">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-semibold text-[#172B3A]">FIR &amp; Initial Report</span>
                  <span className="text-[10px] text-[#64748B] block">Digitized case initiation</span>
                </div>
                <span className="text-[10px] font-mono text-[#155E8A] bg-[#F8FAFC] px-2 py-0.5 rounded border border-[#E2E8F0]">Stage 1</span>
              </div>

              <div className="w-[1px] h-2 bg-[#E2E8F0] ml-5"></div>

              <div className="flex items-center gap-3 bg-white p-2.5 px-3 rounded-lg border border-[#E2E8F0] shadow-2xs hover:border-[#155E8A]/30 transition-colors">
                <div className="p-1 rounded-md bg-[#F8FAFC] text-[#2B7A9B] border border-[#E2E8F0]">
                  <Search className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-semibold text-[#172B3A]">Investigation Records</span>
                  <span className="text-[10px] text-[#64748B] block">Statements &amp; case logs</span>
                </div>
                <span className="text-[10px] font-mono text-[#2B7A9B] bg-[#F8FAFC] px-2 py-0.5 rounded border border-[#E2E8F0]">Stage 2</span>
              </div>

              <div className="w-[1px] h-2 bg-[#E2E8F0] ml-5"></div>

              <div className="flex items-center gap-3 bg-white p-2.5 px-3 rounded-lg border border-[#E2E8F0] shadow-2xs hover:border-[#155E8A]/30 transition-colors">
                <div className="p-1 rounded-md bg-[#F8FAFC] text-[#155E8A] border border-[#E2E8F0]">
                  <FileCheck className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-semibold text-[#172B3A]">Evidence &amp; Forensic Vault</span>
                  <span className="text-[10px] text-[#64748B] block">Tamper-evident chain of custody</span>
                </div>
                <span className="text-[10px] font-mono text-[#155E8A] bg-[#F8FAFC] px-2 py-0.5 rounded border border-[#E2E8F0]">Stage 3</span>
              </div>

              <div className="w-[1px] h-2 bg-[#E2E8F0] ml-5"></div>

              <div className="flex items-center gap-3 bg-white p-2.5 px-3 rounded-lg border border-[#E2E8F0] shadow-2xs hover:border-[#155E8A]/30 transition-colors">
                <div className="p-1 rounded-md bg-[#F8FAFC] text-[#2B7A9B] border border-[#E2E8F0]">
                  <Scale className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-semibold text-[#172B3A]">Court Filing &amp; Judgments</span>
                  <span className="text-[10px] text-[#64748B] block">Judicial integration &amp; filings</span>
                </div>
                <span className="text-[10px] font-mono text-[#2B7A9B] bg-[#F8FAFC] px-2 py-0.5 rounded border border-[#E2E8F0]">Stage 4</span>
              </div>

              <div className="w-[1px] h-2 bg-[#E2E8F0] ml-5"></div>

              <div className="flex items-center gap-3 bg-white p-2.5 px-3 rounded-lg border border-[#E2E8F0] shadow-2xs hover:border-[#155E8A]/30 transition-colors">
                <div className="p-1 rounded-md bg-[#F8FAFC] text-[#16845B] border border-[#E2E8F0]">
                  <Archive className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-semibold text-[#172B3A]">Encrypted Archive</span>
                  <span className="text-[10px] text-[#64748B] block">Long-term audit compliant storage</span>
                </div>
                <span className="text-[10px] font-mono text-[#16845B] bg-[#ECFDF5] px-2 py-0.5 rounded border border-[#16845B]/20">Stage 5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security Badge */}
        <div className="pt-6 mt-auto border-t border-[#E2E8F0]/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-[#155E8A]" />
              <div>
                <p className="text-xs font-semibold text-[#172B3A]">Authorized Personnel Only</p>
                <p className="text-[11px] text-[#64748B]">Secure Government Infrastructure</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full border border-[#E2E8F0] text-[11px] font-medium text-[#172B3A]">
              <span className="w-2 h-2 rounded-full bg-[#16845B] animate-pulse"></span>
              <span>System Operational</span>
            </div>
          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* RIGHT SECTION — LOGIN FORM (approx 52%)                                   */}
      {/* ========================================================================= */}
      <section className="lg:w-[52%] bg-[#FFFFFF] p-8 lg:p-12 flex flex-col justify-between items-center overflow-y-auto">
        
        <div className="w-full max-w-[440px] my-auto py-2">
          
          {/* Header */}
          <div className="mb-6">
            <div className="w-10 h-10 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-center mb-3 text-[#155E8A]">
              <Lock className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-[#172B3A] tracking-tight mb-1">
              Welcome back
            </h2>
            <p className="text-xs text-[#64748B]">
              Sign in to access the secure document management system.
            </p>
          </div>

          {/* Generic Security Error Alert */}
          {error && (
            <div className="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700 leading-relaxed">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Seed Demo Accounts Shortcut */}
          <div className="mb-6 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#155E8A] uppercase tracking-wider mb-2">
              <Key className="w-3.5 h-3.5" />
              <span>Demo Accounts (Click to fill)</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => fillSeedUser('investigator@example.com')}
                className="p-2 text-left rounded-lg bg-white border border-[#E2E8F0] hover:border-[#155E8A] text-[11px] transition-colors"
              >
                <span className="font-semibold text-[#172B3A] block truncate">Investigator</span>
                <span className="text-[#64748B] text-[10px]">EMP-1002</span>
              </button>
              <button
                type="button"
                onClick={() => fillSeedUser('admin@example.com')}
                className="p-2 text-left rounded-lg bg-white border border-[#E2E8F0] hover:border-[#155E8A] text-[11px] transition-colors"
              >
                <span className="font-semibold text-[#172B3A] block truncate">Administrator</span>
                <span className="text-[#64748B] text-[10px]">EMP-1001</span>
              </button>
              <button
                type="button"
                onClick={() => fillSeedUser('legal@example.com')}
                className="p-2 text-left rounded-lg bg-white border border-[#E2E8F0] hover:border-[#155E8A] text-[11px] transition-colors"
              >
                <span className="font-semibold text-[#172B3A] block truncate">Legal Officer</span>
                <span className="text-[#64748B] text-[10px]">EMP-1003</span>
              </button>
              <button
                type="button"
                onClick={() => fillSeedUser('auditor@example.com')}
                className="p-2 text-left rounded-lg bg-white border border-[#E2E8F0] hover:border-[#155E8A] text-[11px] transition-colors"
              >
                <span className="font-semibold text-[#172B3A] block truncate">Auditor</span>
                <span className="text-[#64748B] text-[10px]">EMP-1005</span>
              </button>
            </div>
          </div>

          {/* LOGIN FORM */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="login-identifier" className="block text-xs font-semibold text-[#172B3A] mb-1.5">
                Official Email / Employee ID
              </label>
              <input
                id="login-identifier"
                type="text"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  if (fieldErrors.identifier) setFieldErrors({ ...fieldErrors, identifier: undefined });
                }}
                placeholder="employee.id@agency.gov"
                className={`w-full h-[48px] px-3.5 bg-white text-[#172B3A] text-xs border rounded-[10px] placeholder-[#94A3B8] focus:outline-none focus:border-[#155E8A] focus:ring-2 focus:ring-[#155E8A]/20 transition-all shadow-2xs ${
                  fieldErrors.identifier ? 'border-red-500 bg-red-50/20' : 'border-[#E2E8F0]'
                }`}
              />
              {fieldErrors.identifier && (
                <p className="text-[11px] text-red-600 font-medium mt-1">
                  {fieldErrors.identifier}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="login-password" className="block text-xs font-semibold text-[#172B3A] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: undefined });
                  }}
                  placeholder="Enter your password"
                  className={`w-full h-[48px] pl-3.5 pr-11 bg-white text-[#172B3A] text-xs border rounded-[10px] placeholder-[#94A3B8] focus:outline-none focus:border-[#155E8A] focus:ring-2 focus:ring-[#155E8A]/20 transition-all shadow-2xs ${
                    fieldErrors.password ? 'border-red-500 bg-red-50/20' : 'border-[#E2E8F0]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[#64748B] hover:text-[#172B3A] transition-colors rounded-md"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-[11px] text-red-600 font-medium mt-1">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#E2E8F0] text-[#155E8A] focus:ring-[#155E8A] cursor-pointer"
                />
                <span className="text-xs text-[#64748B]">Remember this device</span>
              </label>
              <a
                href="#forgot"
                onClick={(e) => { e.preventDefault(); alert("Password reset instructions have been sent to your administrator."); }}
                className="text-xs font-medium text-[#155E8A] hover:underline"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-[50px] bg-[#155E8A] hover:bg-[#10496C] active:bg-[#0C3853] text-white text-xs font-semibold rounded-[10px] shadow-sm flex items-center justify-center gap-2 transition-all focus:outline-none focus:ring-2 focus:ring-[#155E8A]/50 disabled:opacity-90 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Information Panel */}
          <div className="mt-6 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]/80 flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-[#155E8A] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-[#172B3A]">Secure connection</p>
              <p className="text-[11px] text-[#64748B] leading-normal">
                Credentials hashed with PBKDF2. Sessions protected via HttpOnly cookies.
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <footer className="w-full max-w-[440px] pt-4 border-t border-[#E2E8F0] text-center space-y-1.5">
          <p className="text-xs text-[#64748B]">
            &copy; 2026 Ministry of Home Affairs — Digital Records Division
          </p>
          <div className="flex items-center justify-center gap-4 text-xs font-medium text-[#64748B]">
            <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-[#172B3A] hover:underline">Privacy</a>
            <span>·</span>
            <a href="#security" onClick={(e) => e.preventDefault()} className="hover:text-[#172B3A] hover:underline">Security</a>
            <span>·</span>
            <a href="#accessibility" onClick={(e) => e.preventDefault()} className="hover:text-[#172B3A] hover:underline">Accessibility</a>
            <span>·</span>
            <a href="#help" onClick={(e) => e.preventDefault()} className="hover:text-[#172B3A] hover:underline">Help</a>
          </div>
          <p className="text-[11px] text-[#94A3B8]">
            For authorized personnel only. Unauthorized access is prohibited.
          </p>
        </footer>

      </section>

    </div>
  );
}
