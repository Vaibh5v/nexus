import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  Settings, 
  ShieldCheck, 
  Lock, 
  Database, 
  Server, 
  Building2, 
  Key, 
  Clock, 
  CheckCircle2,
  Save,
  Loader2
} from 'lucide-react';

export default function SettingsView() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    api.get('/settings')
      .then((res) => {
        if (res.data && res.data.success) {
          setSettings(res.data.settings);
        }
      })
      .catch((err) => console.error('Fetch settings error:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const response = await api.patch('/settings', settings);
      if (response.data && response.data.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Save settings error:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-12 rounded-xl border border-[#E2E8F0] text-center text-xs text-[#64748B] flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-[#155E8A]" />
        <span>Loading system settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-[#172B3A] tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#155E8A]" />
            System Configuration &amp; Governance
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Security parameters, cryptographic settings, session policies, and agency metadata.
          </p>
        </div>

        {savedSuccess && (
          <div className="px-3 py-1.5 bg-[#ECFDF5] text-[#16845B] border border-[#16845B]/20 rounded-lg text-xs font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Saved</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Agency Identity */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-[#172B3A] flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
            <Building2 className="w-4 h-4 text-[#155E8A]" />
            Agency Metadata &amp; Organization
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#172B3A] mb-1">
                Organization Designation
              </label>
              <input
                type="text"
                value={settings?.agencyName || ''}
                onChange={(e) => setSettings({ ...settings, agencyName: e.target.value })}
                className="w-full h-10 px-3 bg-white text-xs border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#155E8A]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B3A] mb-1">
                Storage Repository Location
              </label>
              <input
                type="text"
                value={settings?.storageProvider || ''}
                disabled
                className="w-full h-10 px-3 bg-[#F8FAFC] text-xs text-[#64748B] border border-[#E2E8F0] rounded-lg cursor-not-allowed font-mono"
              />
            </div>
          </div>
        </div>

        {/* Security & Cryptography Controls */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-[#172B3A] flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
            <ShieldCheck className="w-4 h-4 text-[#155E8A]" />
            Security &amp; Cryptographic Policies
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#172B3A] mb-1">
                Session Timeout (Minutes)
              </label>
              <input
                type="number"
                value={settings?.sessionTimeoutMinutes || 30}
                onChange={(e) => setSettings({ ...settings, sessionTimeoutMinutes: parseInt(e.target.value) })}
                className="w-full h-10 px-3 bg-white text-xs border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#155E8A]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B3A] mb-1">
                Password Expiry (Days)
              </label>
              <input
                type="number"
                value={settings?.passwordExpiryDays || 90}
                onChange={(e) => setSettings({ ...settings, passwordExpiryDays: parseInt(e.target.value) })}
                className="w-full h-10 px-3 bg-white text-xs border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#155E8A]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B3A] mb-1">
                Max Upload Limit (MB)
              </label>
              <input
                type="number"
                value={settings?.maxUploadSizeMB || 25}
                onChange={(e) => setSettings({ ...settings, maxUploadSizeMB: parseInt(e.target.value) })}
                className="w-full h-10 px-3 bg-white text-xs border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#155E8A]"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#172B3A]">SHA-256 Automatic Cryptographic Verification</span>
              <span className="font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-[#64748B]">
              Every uploaded document binary automatically computes a 64-character SHA-256 digest stored permanently in the version lineage.
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-[#155E8A] hover:bg-[#10496C] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Security Settings</span>
          </button>
        </div>

      </form>

    </div>
  );
}
