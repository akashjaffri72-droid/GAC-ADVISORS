import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/layout/Navbar';
import { DeviceFrame } from './components/layout/DeviceFrame';
import { BottomNav } from './components/layout/BottomNav';
import { ClientDashboard } from './components/client/ClientDashboard';
import { ApplicationWizard } from './components/client/ApplicationWizard';
import { TrackingView } from './components/client/TrackingView';
import { VisaCatalog } from './components/client/VisaCatalog';
import { AppointmentBooking } from './components/client/AppointmentBooking';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { StaffManagement } from './components/admin/StaffManagement';
import { PaymentsManager } from './components/admin/PaymentsManager';
import { DocumentsManager } from './components/admin/DocumentsManager';
import { ServicesManager } from './components/admin/ServicesManager';
import { AdminMasterControl } from './components/admin/AdminMasterControl';
import { AndroidProjectExplorer } from './components/android-project/AndroidProjectExplorer';
import { NotificationsDrawer } from './components/common/NotificationsDrawer';
import { SettingsModal } from './components/settings/SettingsModal';
import { WhatsAppButton } from './components/common/WhatsAppButton';
import { AuthModal } from './components/auth/AuthModal';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab, setSelectedApplicationId, deviceMode } = useApp();
  const { activeRole, currentUser } = useAuth();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Reset selected application and block unauthorized tabs when switching persona/role
  useEffect(() => {
    setSelectedApplicationId(null);
    if (
      activeRole === 'client' &&
      ['admin_master', 'staff', 'payments', 'services', 'documents'].includes(activeTab)
    ) {
      setActiveTab('dashboard');
    } else if (
      activeRole === 'staff' &&
      ['admin_master', 'staff', 'payments', 'services'].includes(activeTab)
    ) {
      setActiveTab('dashboard');
    }
  }, [activeRole, currentUser?.uid]);

  const renderCurrentView = () => {
    switch (activeTab) {
      case 'dashboard':
        return activeRole === 'client' ? <ClientDashboard /> : <AdminDashboard />;
      case 'catalog':
        return <VisaCatalog />;
      case 'services':
        return activeRole === 'super_admin' ? <ServicesManager /> : <VisaCatalog />;
      case 'apply':
        return <ApplicationWizard />;
      case 'tracking':
        return <TrackingView />;
      case 'appointments':
        return <AppointmentBooking />;
      case 'documents':
        return activeRole === 'client' ? <ClientDashboard /> : <DocumentsManager />;
      case 'payments':
        return activeRole === 'super_admin' ? <PaymentsManager /> : <ClientDashboard />;
      case 'staff':
        return activeRole === 'super_admin' ? <StaffManagement /> : <ClientDashboard />;
      case 'admin_master':
        return activeRole === 'super_admin' ? (
          <AdminMasterControl />
        ) : (
          <ClientDashboard />
        );
      case 'android_code':
        return <AndroidProjectExplorer />;
      default:
        return activeRole === 'client' ? <ClientDashboard /> : <AdminDashboard />;
    }
  };

  const isMobileSim = deviceMode === 'phone' || deviceMode === 'tablet';

  return (
    <div className="min-h-screen bg-[#080D1A] text-slate-100 flex flex-col font-sans selection:bg-[#D4AF37]/30 selection:text-white">
      {/* Top Application Navbar */}
      <Navbar
        onOpenNotifications={() => setNotificationsOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col">
        {isMobileSim ? (
          <DeviceFrame>
            <div className="flex-1 p-4 sm:p-5 flex flex-col">
              {renderCurrentView()}
            </div>
            <BottomNav />
          </DeviceFrame>
        ) : (
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 flex flex-col">
            {/* Desktop Tabs Header */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 overflow-x-auto py-1">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'dashboard'
                      ? 'bg-[#D4AF37] text-[#0A1128] shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('catalog')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'catalog'
                      ? 'bg-[#D4AF37] text-[#0A1128] shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Visa Services
                </button>
                <button
                  onClick={() => setActiveTab('apply')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'apply'
                      ? 'bg-[#D4AF37] text-[#0A1128] shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Apply Online
                </button>
                <button
                  onClick={() => setActiveTab('tracking')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'tracking'
                      ? 'bg-[#D4AF37] text-[#0A1128] shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Application Tracking
                </button>
                <button
                  onClick={() => setActiveTab('appointments')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'appointments'
                      ? 'bg-[#D4AF37] text-[#0A1128] shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Appointments
                </button>

                {activeRole !== 'client' && (
                  <>
                    <button
                      onClick={() => setActiveTab('documents')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        activeTab === 'documents'
                          ? 'bg-[#D4AF37] text-[#0A1128] shadow-md'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      Audit Documents
                    </button>
                    {activeRole === 'super_admin' && (
                      <>
                        <button
                          onClick={() => setActiveTab('payments')}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            activeTab === 'payments'
                              ? 'bg-[#D4AF37] text-[#0A1128] shadow-md'
                              : 'text-slate-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          Payment Records
                        </button>
                        <button
                          onClick={() => setActiveTab('services')}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            activeTab === 'services'
                              ? 'bg-[#D4AF37] text-[#0A1128] shadow-md'
                              : 'text-slate-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          Manage Services
                        </button>
                        <button
                          onClick={() => setActiveTab('staff')}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            activeTab === 'staff'
                              ? 'bg-[#D4AF37] text-[#0A1128] shadow-md'
                              : 'text-slate-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          Staff Management
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                {activeRole === 'super_admin' && (
                  <button
                    onClick={() => setActiveTab('admin_master')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                      activeTab === 'admin_master'
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-[#0A1128] border-[#D4AF37] shadow-md shadow-amber-500/25'
                        : 'bg-[#101F42] text-[#D4AF37] border-[#D4AF37]/50 hover:bg-[#D4AF37]/15'
                    }`}
                  >
                    <span>👑 Master Admin Control Vault</span>
                  </button>
                )}

                <button
                  onClick={() => setActiveTab('android_code')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
                    activeTab === 'android_code'
                      ? 'bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]'
                      : 'bg-[#101F42] text-slate-300 border-white/10 hover:border-white/30'
                  }`}
                >
                  📱 Publish & APK / Android Studio
                </button>
              </div>
            </div>

            <div className="flex-1">{renderCurrentView()}</div>
          </div>
        )}
      </main>

      {/* Persistent Floating WhatsApp Support Button */}
      <WhatsAppButton variant="floating" />

      {/* Slide-out Drawers and Modals */}
      {notificationsOpen && (
        <NotificationsDrawer onClose={() => setNotificationsOpen(false)} />
      )}
      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
      {authModalOpen && (
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppProvider>
          <MainContent />
        </AppProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
