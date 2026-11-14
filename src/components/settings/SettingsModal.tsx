import React, { useState } from 'react';
import {
  X,
  Building,
  Phone,
  Mail,
  Clock,
  Shield,
  Globe,
  KeyRound,
  LogOut,
  Save,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const { companySettings, updateCompanySettings } = useApp();
  const { currentUser, activeRole, signOut, resetPassword } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const isSuperAdmin = activeRole === 'super_admin';

  // Company info state
  const [officeAddress, setOfficeAddress] = useState(companySettings.officeAddress);
  const [pakistanWhatsApp, setPakistanWhatsApp] = useState(companySettings.pakistanWhatsApp);
  const [uaeWhatsApp, setUaeWhatsApp] = useState(companySettings.uaeWhatsApp);
  const [supportEmail, setSupportEmail] = useState(companySettings.supportEmail);
  const [workingDays, setWorkingDays] = useState(companySettings.workingDays);
  const [workingHours, setWorkingHours] = useState(companySettings.workingHours);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Password reset message
  const [passwordSent, setPasswordSent] = useState(false);

  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateCompanySettings({
      officeAddress,
      pakistanWhatsApp,
      uaeWhatsApp,
      supportEmail,
      workingDays,
      workingHours,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handlePasswordReset = async () => {
    if (currentUser?.email) {
      await resetPassword(currentUser.email);
      setPasswordSent(true);
      setTimeout(() => setPasswordSent(false), 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0F1B3B] border border-[#D4AF37]/50 shadow-2xl p-6 sm:p-8 text-white my-8 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 text-slate-300 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#AA820A] flex items-center justify-center">
            <Shield className="w-5 h-5 text-[#0A1128] fill-[#0A1128]" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">System Settings & Governance</h2>
            <p className="text-xs text-slate-400">
              Personal preferences, security credentials, and company contact details
            </p>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="p-4 rounded-2xl bg-[#0A1128] border border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#AA820A] flex items-center justify-center text-lg font-black text-[#0A1128]">
              {currentUser?.fullName?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="font-bold text-white text-sm">{currentUser?.fullName}</div>
              <div className="text-xs text-slate-400">{currentUser?.email}</div>
              <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 uppercase">
                {activeRole.replace('_', ' ')}
              </span>
            </div>
          </div>

          <button
            onClick={handlePasswordReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-slate-200 transition-colors"
          >
            <KeyRound className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Reset Password</span>
          </button>
        </div>

        {passwordSent && (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Password reset instructions sent to {currentUser?.email}</span>
          </div>
        )}

        {/* Language Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#F3E5AB] uppercase tracking-wider block">
            Interface Language / زبان کا انتخاب
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setLanguage('en')}
              className={`p-3 rounded-2xl border text-center transition-all ${
                language === 'en'
                  ? 'bg-[#162752] border-[#D4AF37] text-white font-bold'
                  : 'bg-[#0A1128] border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <div className="text-sm font-bold">English (UK / US)</div>
              <div className="text-[11px] text-slate-400">Standard Left-to-Right</div>
            </button>

            <button
              onClick={() => setLanguage('ur')}
              className={`p-3 rounded-2xl border text-center transition-all font-urdu ${
                language === 'ur'
                  ? 'bg-[#162752] border-[#D4AF37] text-white font-bold'
                  : 'bg-[#0A1128] border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <div className="text-sm font-bold">اردو (Urdu)</div>
              <div className="text-[11px] text-slate-400">دائیں سے بائیں (RTL)</div>
            </button>
          </div>
        </div>

        {/* Company Contact Information (Editable by Super Admin) */}
        <div className="space-y-3 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-[#D4AF37]" />
              <h3 className="text-xs font-bold text-[#F3E5AB] uppercase tracking-wider">
                GAC Advisors Official Company Information
              </h3>
            </div>
            {isSuperAdmin ? (
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded">
                Super Admin Editable
              </span>
            ) : (
              <span className="text-[10px] text-slate-400">View Only</span>
            )}
          </div>

          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Company details updated and synchronized across all portals.</span>
            </div>
          )}

          <form onSubmit={handleSaveCompany} className="space-y-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Islamabad Head Office Address</label>
              <input
                type="text"
                disabled={!isSuperAdmin}
                value={officeAddress}
                onChange={(e) => setOfficeAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs disabled:opacity-60 focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Pakistan WhatsApp Support</label>
                <input
                  type="text"
                  disabled={!isSuperAdmin}
                  value={pakistanWhatsApp}
                  onChange={(e) => setPakistanWhatsApp(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-emerald-400 font-mono text-xs disabled:opacity-60 focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">UAE WhatsApp Support</label>
                <input
                  type="text"
                  disabled={!isSuperAdmin}
                  value={uaeWhatsApp}
                  onChange={(e) => setUaeWhatsApp(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-emerald-400 font-mono text-xs disabled:opacity-60 focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Support Email</label>
                <input
                  type="email"
                  disabled={!isSuperAdmin}
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs disabled:opacity-60 focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Business Hours</label>
                <input
                  type="text"
                  disabled={!isSuperAdmin}
                  value={workingHours}
                  onChange={(e) => setWorkingHours(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs disabled:opacity-60 focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>

            {isSuperAdmin && (
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D4AF37] hover:brightness-110 text-[#0A1128] text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Company Information</span>
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Legal Disclaimers & About */}
        <div className="space-y-2 pt-2 border-t border-white/10 text-xs text-slate-400 leading-relaxed">
          <h4 className="font-bold text-white">About GAC Advisors</h4>
          <p>
            GAC Advisors is an internationally recognized immigration and visa advisory consultancy specializing in high-net-worth business visas, skilled work permits, study visas, and consular embassy interview preparation.
          </p>
          <p className="text-[11px] text-slate-500 pt-1">
            Version 1.0.0 (Native Android & Web Management Suite) • Built with Jetpack Compose & Firebase.
          </p>
        </div>
      </div>
    </div>
  );
};
