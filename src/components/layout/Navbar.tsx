import React, { useState } from 'react';
import {
  Shield,
  Smartphone,
  Tablet,
  Monitor,
  Globe,
  Bell,
  Settings,
  UserCheck,
  Code2,
  KeyRound,
  Download,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth, DEMO_CLIENT_2 } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { UserProfile, UserRole } from '../../types';

interface NavbarProps {
  onOpenNotifications: () => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenNotifications, onOpenSettings }) => {
  const { deviceMode, setDeviceMode, activeTab, setActiveTab, notifications } = useApp();
  const { activeRole, switchDemoUser, currentUser } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { canInstall, install } = usePWAInstall();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const visibleNotifications =
    activeRole === 'super_admin'
      ? notifications
      : notifications.filter(
          (n) => n.recipientId === currentUser?.uid || n.recipientId === 'all'
        );
  const unreadCount = visibleNotifications.filter((n) => !n.isRead).length;

  const personas: {
    id: string;
    role: UserRole;
    customUser?: UserProfile;
    label: string;
    badgeColor: string;
    description: string;
  }[] = [
    {
      id: 'client-1',
      role: 'client',
      label: 'Client 1 (Muhammad Bilal)',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      description: 'Sees ONLY Bilal apps & Client Names list (other clients private)',
    },
    {
      id: 'client-2',
      role: 'client',
      customUser: DEMO_CLIENT_2,
      label: 'Client 2 (Zainab Tariq)',
      badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
      description: 'Test Client Privacy: sees ONLY Zainab data, zero Bilal records',
    },
    {
      id: 'staff',
      role: 'staff',
      label: 'Staff (Hamza Farooq)',
      badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      description: 'Review assigned docs, internal notes, update assigned cases',
    },
    {
      id: 'super_admin',
      role: 'super_admin',
      label: 'Super Admin (Akash Jaffri)',
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      description: 'Full control, Master Vault, all clients, staff, fees & settings',
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0A1128]/95 backdrop-blur-md border-b border-white/10 px-3 py-2.5 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand Logo & Name */}
        <div
          className="flex items-center gap-2.5 cursor-pointer select-none"
          onClick={() => setActiveTab('dashboard')}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] via-[#F3E5AB] to-[#AA820A] flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Shield className="w-5 h-5 text-[#0A1128] fill-[#0A1128]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#F3E5AB]">
                GAC ADVISORS
              </span>
              <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
                PRO NATIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {t('app.tagline')}
            </p>
          </div>
        </div>

        {/* Device View Frame Toggle */}
        <div className="hidden lg:flex items-center bg-[#101F42] p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setDeviceMode('phone')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              deviceMode === 'phone'
                ? 'bg-[#D4AF37] text-[#0A1128] font-bold shadow-md shadow-amber-500/25'
                : 'text-slate-300 hover:text-white'
            }`}
            title="Android Phone View (Pixel 8 Pro)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Android Phone</span>
          </button>
          <button
            onClick={() => setDeviceMode('tablet')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              deviceMode === 'tablet'
                ? 'bg-[#D4AF37] text-[#0A1128] font-bold shadow-md shadow-amber-500/25'
                : 'text-slate-300 hover:text-white'
            }`}
            title="Android Tablet View"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>Tablet</span>
          </button>
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              deviceMode === 'desktop'
                ? 'bg-[#D4AF37] text-[#0A1128] font-bold shadow-md shadow-amber-500/25'
                : 'text-slate-300 hover:text-white'
            }`}
            title="Management Portal View"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Full Portal</span>
          </button>
        </div>

        {/* Right Actions: Role Switcher, Publish/APK, PWA Install, Language, Bell, Settings */}
        <div className="flex items-center gap-2">
          {/* Master Admin Control Vault Button — STRICTLY SUPER ADMIN ONLY */}
          {activeRole === 'super_admin' && (
            <button
              onClick={() => setActiveTab('admin_master')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                activeTab === 'admin_master'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-[#0A1128] border-[#D4AF37] shadow-md shadow-amber-500/25'
                  : 'bg-[#101F42] text-[#D4AF37] border-[#D4AF37]/50 hover:bg-[#D4AF37]/15'
              }`}
              title="Open Password-Protected Admin Master Control Block"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Master Admin Vault</span>
            </button>
          )}

          {/* Direct PWA Install Button when supported by browser */}
          {canInstall && (
            <button
              onClick={install}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all"
              title="Install GAC Advisors App on Android / Device"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Install App</span>
            </button>
          )}

          {/* Publish & Android APK / Studio Tab */}
          <button
            onClick={() => setActiveTab('android_code')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              activeTab === 'android_code'
                ? 'bg-[#D4AF37]/25 text-[#D4AF37] border-[#D4AF37]'
                : 'bg-[#101F42] text-slate-300 border-white/10 hover:border-[#D4AF37]/40'
            }`}
            title="Publish Link, Install App & Download Android APK Project"
          >
            <Code2 className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="hidden sm:inline">Publish & APK</span>
          </button>

          {/* Role Persona Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#101F42] hover:bg-[#162752] border border-white/10 text-xs text-slate-200 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="capitalize font-semibold hidden md:inline">
                {activeRole === 'client'
                  ? currentUser?.fullName?.split(' ')[0] || 'Client'
                  : activeRole.replace('_', ' ')}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </button>

            {roleDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-80 rounded-xl bg-[#0F1B3B] border border-white/15 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2"
                onClick={() => setRoleDropdownOpen(false)}
              >
                <div className="px-3 py-2 border-b border-white/10 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Test Role & Client Privacy (RBAC)
                </div>
                {personas.map((r) => {
                  const isActivePersona =
                    activeRole === r.role &&
                    (r.customUser
                      ? currentUser?.uid === r.customUser.uid
                      : r.role !== 'client' || currentUser?.uid === 'client-demo-01');
                  return (
                    <button
                      key={r.id}
                      onClick={() => switchDemoUser(r.role, r.customUser)}
                      className={`w-full text-left p-2.5 rounded-lg transition-colors my-1 ${
                        isActivePersona
                          ? 'bg-[#16254F] border border-[#D4AF37]/40'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-white">{r.label}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full border shrink-0 ${r.badgeColor}`}
                        >
                          {r.role.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{r.description}</p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#101F42] hover:bg-[#162752] border border-white/10 text-xs text-slate-200 transition-colors"
            title="Switch Language (English / اردو)"
          >
            <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="font-bold">{language === 'en' ? 'اردو' : 'EN'}</span>
          </button>

          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-lg bg-[#101F42] hover:bg-[#162752] border border-white/10 text-slate-200 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-slate-300" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-[10px] font-bold text-slate-950 flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg bg-[#101F42] hover:bg-[#162752] border border-white/10 text-slate-200 transition-colors"
            title="Settings & Company Info"
          >
            <Settings className="w-4 h-4 text-slate-300" />
          </button>
        </div>
      </div>
    </header>
  );
};
