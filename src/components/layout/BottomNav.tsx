import React from 'react';
import {
  LayoutDashboard,
  Compass,
  FilePlus2,
  ListOrdered,
  CalendarDays,
  Users2,
  CreditCard,
  FileCheck2,
  KeyRound,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { ActiveTab } from '../../types';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();
  const { activeRole } = useAuth();
  const { t } = useLanguage();

  interface NavItem {
    id: ActiveTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }

  let items: NavItem[] = [];

  if (activeRole === 'client') {
    items = [
      { id: 'dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
      { id: 'catalog', label: t('nav.services'), icon: Compass },
      { id: 'apply', label: t('nav.apply'), icon: FilePlus2 },
      { id: 'tracking', label: t('nav.tracking'), icon: ListOrdered },
      { id: 'appointments', label: t('nav.appointments'), icon: CalendarDays },
    ];
  } else if (activeRole === 'staff') {
    items = [
      { id: 'dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
      { id: 'tracking', label: 'Cases', icon: ListOrdered },
      { id: 'documents', label: t('nav.documents'), icon: FileCheck2 },
      { id: 'appointments', label: t('nav.appointments'), icon: CalendarDays },
      { id: 'catalog', label: t('nav.services'), icon: Compass },
    ];
  } else {
    // Super Admin
    items = [
      { id: 'dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
      { id: 'admin_master', label: 'Master Vault', icon: KeyRound },
      { id: 'tracking', label: 'All Cases', icon: ListOrdered },
      { id: 'catalog', label: 'Services', icon: Compass },
      { id: 'staff', label: t('nav.staff'), icon: Users2 },
    ];
  }

  return (
    <nav className="sticky bottom-0 z-30 bg-[#0F1B3B]/95 backdrop-blur-md border-t border-white/10 px-2 py-1.5 flex items-center justify-around shrink-0">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
              isActive
                ? 'text-[#D4AF37]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div
              className={`p-1 rounded-lg transition-transform ${
                isActive ? 'scale-110 bg-[#D4AF37]/15' : ''
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <span
              className={`text-[10px] mt-0.5 tracking-tight ${
                isActive ? 'font-bold text-[#D4AF37]' : 'font-medium'
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
