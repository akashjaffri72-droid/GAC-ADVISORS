import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  Shield,
  KeyRound,
  Users,
  Briefcase,
  FileText,
  CreditCard,
  Calendar,
  Settings,
  Compass,
  Edit,
  Trash2,
  Plus,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Search,
  Download,
  Building,
  Phone,
  Mail,
  UserCheck,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Application, ApplicationStatus, UserProfile, VisaService, PaymentRecord, AppointmentRecord } from '../../types';

export const AdminMasterControl: React.FC = () => {
  const {
    adminMasterUnlocked,
    unlockAdminMaster,
    lockAdminMaster,
    changeAdminMasterPassword,
    adminMasterPasswordHint,
    clients,
    createClient,
    updateClient,
    deleteClient,
    staffMembers,
    createStaffMember,
    updateStaffMember,
    deleteStaffMember,
    applications,
    updateApplicationComplete,
    deleteApplication,
    services,
    addService,
    updateService,
    deleteService,
    payments,
    recordPayment,
    updatePaymentRecord,
    deletePaymentRecord,
    appointments,
    updateAppointmentRecord,
    deleteAppointmentRecord,
    companySettings,
    updateCompanySettings,
  } = useApp();

  const { currentUser } = useAuth();

  // Password Gate State
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Active Sub-tab inside Master Control
  type MasterTab = 'clients' | 'applications' | 'staff' | 'services' | 'payments' | 'appointments' | 'settings';
  const [activeSubTab, setActiveSubTab] = useState<MasterTab>('clients');

  // Change Password Modal State
  const [changePwdOpen, setChangePwdOpen] = useState(false);
  const [oldPwd, setOldPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [pwdChangeSuccess, setPwdChangeSuccess] = useState(false);
  const [pwdChangeError, setPwdChangeError] = useState('');

  // Client Edit Modal State
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<UserProfile | null>(null);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientActive, setClientActive] = useState(true);

  // Application Master Edit Modal State
  const [appModalOpen, setAppModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [appCountry, setAppCountry] = useState('');
  const [appCategory, setAppCategory] = useState('');
  const [appTrackingNo, setAppTrackingNo] = useState('');
  const [appStatus, setAppStatus] = useState<ApplicationStatus>('under_initial_review');
  const [appFee, setAppFee] = useState('75000');
  const [appPaid, setAppPaid] = useState('0');
  const [appPaymentStatus, setAppPaymentStatus] = useState<'unpaid' | 'partial' | 'paid'>('unpaid');
  const [appClientName, setAppClientName] = useState('');
  const [appPassportNo, setAppPassportNo] = useState('');
  const [appPhone, setAppPhone] = useState('');
  const [appEmail, setAppEmail] = useState('');
  const [appStaffId, setAppStaffId] = useState('');
  const [appClientRemarks, setAppClientRemarks] = useState('');

  // Staff Edit Modal State
  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<UserProfile | null>(null);
  const [staffName, setStaffName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPhone, setStaffPhone] = useState('');
  const [staffSpecialty, setStaffSpecialty] = useState('');
  const [staffActive, setStaffActive] = useState(true);

  // Search Filter
  const [searchFilter, setSearchFilter] = useState('');

  // Handle Unlock
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const success = unlockAdminMaster(passwordInput);
    if (!success) {
      setLoginError('Invalid Master Password. Please enter the authorized administrator key.');
    } else {
      setPasswordInput('');
    }
  };

  const handleQuickUnlock = () => {
    setPasswordInput(adminMasterPasswordHint);
    unlockAdminMaster(adminMasterPasswordHint);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPwdChangeError('');
    setPwdChangeSuccess(false);
    const success = changeAdminMasterPassword(oldPwd, newPwd);
    if (success) {
      setPwdChangeSuccess(true);
      setOldPwd('');
      setNewPwd('');
      setTimeout(() => {
        setPwdChangeSuccess(false);
        setChangePwdOpen(false);
      }, 2000);
    } else {
      setPwdChangeError('Current password does not match.');
    }
  };

  // Client edit handlers
  const handleOpenClientEdit = (c: UserProfile) => {
    setEditingClient(c);
    setClientName(c.fullName);
    setClientEmail(c.email);
    setClientPhone(c.phone);
    setClientActive(c.isActive);
    setClientModalOpen(true);
  };

  const handleOpenAddClient = () => {
    setEditingClient(null);
    setClientName('');
    setClientEmail('');
    setClientPhone('+92 ');
    setClientActive(true);
    setClientModalOpen(true);
  };

  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientEmail.trim()) return;

    if (editingClient) {
      await updateClient(editingClient.uid, {
        fullName: clientName.trim(),
        email: clientEmail.trim(),
        phone: clientPhone.trim(),
        isActive: clientActive,
      });
    } else {
      await createClient({
        fullName: clientName.trim(),
        email: clientEmail.trim(),
        phone: clientPhone.trim(),
        countryCode: '+92',
        role: 'client',
        language: 'en',
        isActive: clientActive,
      });
    }
    setClientModalOpen(false);
  };

  // Application master edit handlers
  const handleOpenAppEdit = (app: Application) => {
    setEditingApp(app);
    setAppCountry(app.country);
    setAppCategory(app.visaCategory);
    setAppTrackingNo(app.trackingNumber);
    setAppStatus(app.status);
    setAppFee(app.consultancyFee.toString());
    setAppPaid(app.amountPaid.toString());
    setAppPaymentStatus(app.paymentStatus);
    setAppClientName(app.clientName);
    setAppPassportNo(app.personalInfo.passportNumber || '');
    setAppPhone(app.clientPhone);
    setAppEmail(app.clientEmail);
    setAppStaffId(app.assignedStaffId || '');
    setAppClientRemarks(app.clientRemarks || '');
    setAppModalOpen(true);
  };

  const handleSaveApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApp) return;

    const numFee = parseFloat(appFee) || 0;
    const numPaid = parseFloat(appPaid) || 0;
    const staff = staffMembers.find((s) => s.uid === appStaffId);

    await updateApplicationComplete(editingApp.id, {
      country: appCountry.trim(),
      visaCategory: appCategory.trim(),
      trackingNumber: appTrackingNo.trim(),
      status: appStatus,
      consultancyFee: numFee,
      amountPaid: numPaid,
      paymentStatus: appPaymentStatus,
      clientName: appClientName.trim(),
      clientPhone: appPhone.trim(),
      clientEmail: appEmail.trim(),
      assignedStaffId: appStaffId || undefined,
      assignedStaffName: staff?.fullName || undefined,
      clientRemarks: appClientRemarks.trim(),
      personalInfo: {
        ...editingApp.personalInfo,
        fullName: appClientName.trim(),
        passportNumber: appPassportNo.trim(),
        contactNumber: appPhone.trim(),
        email: appEmail.trim(),
      },
    });
    setAppModalOpen(false);
  };

  // Staff edit handlers
  const handleOpenStaffEdit = (staff: UserProfile) => {
    setEditingStaff(staff);
    setStaffName(staff.fullName);
    setStaffEmail(staff.email);
    setStaffPhone(staff.phone);
    setStaffSpecialty(staff.assignedSpecialty || '');
    setStaffActive(staff.isActive);
    setStaffModalOpen(true);
  };

  const handleOpenAddStaff = () => {
    setEditingStaff(null);
    setStaffName('');
    setStaffEmail('');
    setStaffPhone('+92 335 ');
    setStaffSpecialty('USA & Canada Visas');
    setStaffActive(true);
    setStaffModalOpen(true);
  };

  const handleSaveStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName.trim() || !staffEmail.trim()) return;

    if (editingStaff) {
      await updateStaffMember(editingStaff.uid, {
        fullName: staffName.trim(),
        email: staffEmail.trim(),
        phone: staffPhone.trim(),
        assignedSpecialty: staffSpecialty.trim(),
        isActive: staffActive,
      });
    } else {
      await createStaffMember({
        fullName: staffName.trim(),
        email: staffEmail.trim(),
        phone: staffPhone.trim(),
        countryCode: '+92',
        role: 'staff',
        language: 'en',
        assignedSpecialty: staffSpecialty.trim(),
        isActive: staffActive,
      });
    }
    setStaffModalOpen(false);
  };

  // IF NOT UNLOCKED: Render Dedicated Master Security Gate
  if (!adminMasterUnlocked) {
    return (
      <div className="max-w-md mx-auto my-8 p-6 sm:p-8 rounded-3xl bg-[#0F1B3B] border-2 border-[#D4AF37]/50 shadow-2xl space-y-6 text-white animate-in zoom-in-95">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4AF37] via-[#F3E5AB] to-[#AA820A] flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-500/25">
            <Lock className="w-8 h-8 text-[#0A1128] stroke-[2.5]" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-widest text-[#D4AF37]">
            Authorized Access Only
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            Admin Master Control Vault
          </h2>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Enter the master administrator password to unlock full editing control over all clients, staff, applications, payments, and system settings.
          </p>
        </div>

        {loginError && (
          <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{loginError}</span>
          </div>
        )}

        <form onSubmit={handleUnlock} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Admin Master Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter master password..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#0A1128] border border-white/20 text-white text-sm focus:border-[#D4AF37] focus:outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] hover:brightness-110 text-[#0A1128] font-black text-sm shadow-xl shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Unlock className="w-4 h-4" />
            <span>Unlock Master Control Panel</span>
          </button>
        </form>

        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span>Default Key: <strong className="text-[#D4AF37] font-mono">{adminMasterPasswordHint}</strong></span>
          <button
            onClick={handleQuickUnlock}
            className="text-[11px] font-bold text-[#D4AF37] hover:underline cursor-pointer"
          >
            Quick Unlock
          </button>
        </div>
      </div>
    );
  }

  // IF UNLOCKED: Full Master Control Center with Complete Editability
  return (
    <div className="space-y-6 pb-20 animate-in fade-in">
      {/* Top Master Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-[#162752] via-[#0F1B3B] to-[#0A1128] border-2 border-[#D4AF37]/50 p-5 sm:p-7 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold mb-2">
              <Unlock className="w-3.5 h-3.5" />
              <span>MASTER VAULT UNLOCKED • FULL WRITE ACCESS ACTIVE</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>Admin Master Control Panel</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#D4AF37] text-[#0A1128]">
                SUPER ADMIN
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Complete administrative authority: Edit any client profile, update staff, modify all application variables, record/override fees, and control global system settings.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setChangePwdOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-bold transition-all cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Change Password</span>
            </button>

            <button
              onClick={lockAdminMaster}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition-all cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock Master Vault</span>
            </button>
          </div>
        </div>

        {/* Master Sub-Navigation Bar */}
        <div className="mt-6 pt-4 border-t border-white/15 flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveSubTab('clients')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'clients'
                ? 'bg-[#D4AF37] text-[#0A1128] shadow-md'
                : 'bg-[#0A1128]/70 text-slate-300 hover:text-white border border-white/10'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Manage All Clients ({clients.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('applications')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'applications'
                ? 'bg-[#D4AF37] text-[#0A1128] shadow-md'
                : 'bg-[#0A1128]/70 text-slate-300 hover:text-white border border-white/10'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>All Applications Master Editor ({applications.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('staff')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'staff'
                ? 'bg-[#D4AF37] text-[#0A1128] shadow-md'
                : 'bg-[#0A1128]/70 text-slate-300 hover:text-white border border-white/10'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Staff Directory ({staffMembers.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('services')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'services'
                ? 'bg-[#D4AF37] text-[#0A1128] shadow-md'
                : 'bg-[#0A1128]/70 text-slate-300 hover:text-white border border-white/10'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Services & Pricing ({services.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('payments')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'payments'
                ? 'bg-[#D4AF37] text-[#0A1128] shadow-md'
                : 'bg-[#0A1128]/70 text-slate-300 hover:text-white border border-white/10'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Payment Records ({payments.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('appointments')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'appointments'
                ? 'bg-[#D4AF37] text-[#0A1128] shadow-md'
                : 'bg-[#0A1128]/70 text-slate-300 hover:text-white border border-white/10'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Appointments Controller ({appointments.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('settings')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'settings'
                ? 'bg-[#D4AF37] text-[#0A1128] shadow-md'
                : 'bg-[#0A1128]/70 text-slate-300 hover:text-white border border-white/10'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Company Global Settings</span>
          </button>
        </div>
      </div>

      {/* 👥 TAB 1: CLIENTS MASTER MANAGER */}
      {activeSubTab === 'clients' && (
        <div className="space-y-4 rounded-3xl bg-[#101F42] border border-white/10 p-5 sm:p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-[#F3E5AB] uppercase tracking-wider">
                Client Accounts Management ({clients.length})
              </h2>
              <p className="text-xs text-slate-400">
                Super Admin can edit any client's name, email, phone number, active status, or delete client.
              </p>
            </div>

            <button
              onClick={handleOpenAddClient}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D4AF37] hover:brightness-110 text-[#0A1128] text-xs font-black shadow-md transition-all cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Client</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0A1128] text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="px-4 py-3">Client Name</th>
                  <th className="px-4 py-3">Contact Email</th>
                  <th className="px-4 py-3">Phone Number</th>
                  <th className="px-4 py-3">Applications Count</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {clients.map((c) => {
                  const clientApps = applications.filter((a) => a.clientId === c.uid);
                  return (
                    <tr key={c.uid} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-white text-sm">{c.fullName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">UID: {c.uid}</div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="text-slate-200">{c.email}</span>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="font-mono text-emerald-400">{c.phone || 'Not set'}</span>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="font-bold text-[#D4AF37]">{clientApps.length} cases</span>
                      </td>

                      <td className="px-4 py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            c.isActive
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                          }`}
                        >
                          {c.isActive ? 'ACTIVE' : 'SUSPENDED'}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-right space-x-2">
                        <button
                          onClick={() => handleOpenClientEdit(c)}
                          className="px-3 py-1.5 rounded-lg bg-[#D4AF37] hover:brightness-110 text-[#0A1128] font-bold text-[11px] transition-all cursor-pointer shadow-sm"
                        >
                          Edit Profile
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete client "${c.fullName}" and all associated files?`)) {
                              deleteClient(c.uid);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 transition-colors cursor-pointer"
                          title="Delete Client"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 📁 TAB 2: APPLICATIONS MASTER EDITOR */}
      {activeSubTab === 'applications' && (
        <div className="space-y-4 rounded-3xl bg-[#101F42] border border-white/10 p-5 sm:p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-[#F3E5AB] uppercase tracking-wider">
                Applications Master Database ({applications.length})
              </h2>
              <p className="text-xs text-slate-400">
                Edit any applicant's personal info, passport number, visa category, status, consultancy fee, or amount paid.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0A1128] text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="px-4 py-3">Tracking & Country</th>
                  <th className="px-4 py-3">Client Details</th>
                  <th className="px-4 py-3">Current Status</th>
                  <th className="px-4 py-3">Fee & Paid</th>
                  <th className="px-4 py-3">Assigned Staff</th>
                  <th className="px-4 py-3 text-right">Master Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-mono font-bold text-[#D4AF37]">{app.trackingNumber}</div>
                      <div className="font-bold text-white">{app.country}</div>
                      <div className="text-[10px] text-slate-400">{app.visaCategory}</div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-bold text-white">{app.clientName}</div>
                      <div className="text-[11px] text-slate-400">{app.clientPhone}</div>
                      <div className="font-mono text-[10px] text-slate-400">Passport: {app.personalInfo.passportNumber || 'N/A'}</div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border border-white/10 bg-amber-500/20 text-amber-300">
                        {app.status.toUpperCase().replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="text-white font-mono">
                        PKR {app.consultancyFee.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-emerald-400 font-semibold">
                        Paid: PKR {app.amountPaid.toLocaleString()} ({app.paymentStatus.toUpperCase()})
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="text-white">{app.assignedStaffName || 'Unassigned'}</span>
                    </td>

                    <td className="px-4 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleOpenAppEdit(app)}
                        className="px-3 py-1.5 rounded-lg bg-[#D4AF37] hover:brightness-110 text-[#0A1128] font-black text-[11px] transition-all cursor-pointer shadow-sm"
                      >
                        Master Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete application ${app.trackingNumber}?`)) {
                            deleteApplication(app.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 transition-colors cursor-pointer"
                        title="Delete Case"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 👔 TAB 3: STAFF DIRECTORY */}
      {activeSubTab === 'staff' && (
        <div className="space-y-4 rounded-3xl bg-[#101F42] border border-white/10 p-5 sm:p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-[#F3E5AB] uppercase tracking-wider">
                Staff Consultants Management ({staffMembers.length})
              </h2>
              <p className="text-xs text-slate-400">
                Administer employee credentials, territory specialties, and activation.
              </p>
            </div>

            <button
              onClick={handleOpenAddStaff}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D4AF37] hover:brightness-110 text-[#0A1128] text-xs font-black shadow-md transition-all cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Create Staff Account</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0A1128] text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="px-4 py-3">Staff Name</th>
                  <th className="px-4 py-3">Email & Phone</th>
                  <th className="px-4 py-3">Specialty</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {staffMembers.map((s) => (
                  <tr key={s.uid} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-white text-sm">{s.fullName}</td>
                    <td className="px-4 py-3.5">
                      <div className="text-slate-200">{s.email}</div>
                      <div className="text-slate-400 text-[10px]">{s.phone}</div>
                    </td>
                    <td className="px-4 py-3.5 text-[#D4AF37] font-semibold">{s.assignedSpecialty || 'General'}</td>
                    <td className="px-4 py-3.5">
                      <span className="uppercase text-[10px] font-extrabold px-2 py-0.5 rounded bg-white/10 text-white">
                        {s.role}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          s.isActive
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                        }`}
                      >
                        {s.isActive ? 'ACTIVE' : 'DEACTIVATED'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleOpenStaffEdit(s)}
                        className="px-3 py-1.5 rounded-lg bg-[#D4AF37] hover:brightness-110 text-[#0A1128] font-bold text-[11px] transition-all cursor-pointer"
                      >
                        Edit Officer
                      </button>
                      {s.role !== 'super_admin' && (
                        <button
                          onClick={() => {
                            if (confirm(`Remove staff consultant ${s.fullName}?`)) {
                              deleteStaffMember(s.uid);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 🌐 TAB 4: SERVICES & PRICING */}
      {activeSubTab === 'services' && (
        <div className="space-y-4 rounded-3xl bg-[#101F42] border border-white/10 p-5 sm:p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#F3E5AB] uppercase tracking-wider">
                Visa Services & Price Management ({services.length})
              </h2>
              <p className="text-xs text-slate-400">
                Change consultancy fees (PKR), required documents, processing times, or add new countries.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {services.map((srv) => (
              <div key={srv.id} className="p-4 rounded-2xl bg-[#0A1128] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{srv.flagEmoji || '🌐'}</span>
                  <span className="font-mono font-bold text-[#D4AF37] text-sm">
                    PKR {srv.consultancyFee.toLocaleString()}
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm">{srv.title}</h4>
                <p className="text-xs text-slate-400 line-clamp-2">{srv.description}</p>
                <div className="text-[11px] text-slate-500">Processing: {srv.estimatedProcessing}</div>
                <div className="pt-2 border-t border-white/10 flex justify-between items-center text-xs">
                  <button
                    onClick={() => {
                      const newFee = prompt(`Enter new consultancy fee for ${srv.title} (PKR):`, srv.consultancyFee.toString());
                      if (newFee) {
                        const parsed = parseFloat(newFee);
                        if (!isNaN(parsed) && parsed > 0) {
                          updateService(srv.id, { consultancyFee: parsed });
                        }
                      }
                    }}
                    className="text-[#D4AF37] font-bold hover:underline"
                  >
                    Edit Fee
                  </button>
                  <button
                    onClick={() => updateService(srv.id, { isActive: !srv.isActive })}
                    className={`font-semibold ${srv.isActive ? 'text-emerald-400' : 'text-slate-500'}`}
                  >
                    {srv.isActive ? 'Active' : 'Disabled'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 💳 TAB 5: PAYMENTS */}
      {activeSubTab === 'payments' && (
        <div className="space-y-4 rounded-3xl bg-[#101F42] border border-white/10 p-5 sm:p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#F3E5AB] uppercase tracking-wider">
                Payment Transactions & Ledger ({payments.length})
              </h2>
              <p className="text-xs text-slate-400">
                Audit, edit amounts, transaction references, or delete invalid payments.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0A1128] text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="px-4 py-3">Receipt No.</th>
                  <th className="px-4 py-3">Client & Tracking</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Method & Ref</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3.5 font-mono font-bold text-[#D4AF37]">{p.receiptNumber}</td>
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-white">{p.clientName}</div>
                      <div className="font-mono text-[10px] text-slate-400">{p.trackingNumber}</div>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-emerald-400 text-sm">
                      PKR {p.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="text-white capitalize">{p.method.replace('_', ' ')}</div>
                      <div className="text-[10px] font-mono text-slate-400">{p.transactionReference}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {p.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => {
                          const newAmount = prompt(`Edit amount for ${p.receiptNumber} (PKR):`, p.amount.toString());
                          if (newAmount) {
                            const parsed = parseFloat(newAmount);
                            if (!isNaN(parsed) && parsed > 0) {
                              updatePaymentRecord(p.id, { amount: parsed });
                            }
                          }
                        }}
                        className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-xs text-slate-200"
                      >
                        Edit Amount
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete payment record ${p.receiptNumber}?`)) {
                            deletePaymentRecord(p.id);
                          }
                        }}
                        className="p-1 rounded bg-rose-500/20 text-rose-300"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 📅 TAB 6: APPOINTMENTS */}
      {activeSubTab === 'appointments' && (
        <div className="space-y-4 rounded-3xl bg-[#101F42] border border-white/10 p-5 sm:p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#F3E5AB] uppercase tracking-wider">
                Appointments Controller ({appointments.length})
              </h2>
              <p className="text-xs text-slate-400">
                Reschedule dates, change status, assign staff officers, or remove slots.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0A1128] text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="px-4 py-3">Client & Subject</th>
                  <th className="px-4 py-3">Date & Slot</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Assigned Staff</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {appointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-white">{apt.clientName}</div>
                      <div className="text-[10px] text-slate-400">{apt.visaCategory}</div>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-[#D4AF37]">
                      {apt.date} • {apt.timeSlot}
                    </td>
                    <td className="px-4 py-3.5 capitalize">{apt.appointmentType.replace('_', ' ')}</td>
                    <td className="px-4 py-3.5 text-slate-300">{apt.assignedStaffName || 'Unassigned'}</td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white">
                        {apt.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => {
                          const newStatus = prompt('Enter new status (pending, approved, completed, cancelled):', apt.status);
                          if (newStatus && ['pending', 'approved', 'completed', 'cancelled'].includes(newStatus)) {
                            updateAppointmentRecord(apt.id, { status: newStatus as any });
                          }
                        }}
                        className="px-2.5 py-1 rounded bg-[#D4AF37] text-[#0A1128] font-bold text-[11px]"
                      >
                        Change Status
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Delete this appointment?')) {
                            deleteAppointmentRecord(apt.id);
                          }
                        }}
                        className="p-1 rounded bg-rose-500/20 text-rose-300"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ⚙️ TAB 7: COMPANY & GLOBAL SETTINGS */}
      {activeSubTab === 'settings' && (
        <div className="rounded-3xl bg-[#101F42] border border-white/10 p-5 sm:p-7 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-[#F3E5AB] uppercase tracking-wider">
            Company & Global System Configuration
          </h2>
          <p className="text-xs text-slate-300">
            Edit office location, Pakistan WhatsApp, UAE WhatsApp, support email, and working hours.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert('Company details updated successfully across all portals!');
            }}
            className="space-y-4"
          >
            <div>
              <label className="text-xs text-slate-400 block mb-1">Islamabad Head Office Address *</label>
              <input
                type="text"
                value={companySettings.officeAddress}
                onChange={(e) => updateCompanySettings({ officeAddress: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Pakistan WhatsApp Support *</label>
                <input
                  type="text"
                  value={companySettings.pakistanWhatsApp}
                  onChange={(e) => updateCompanySettings({ pakistanWhatsApp: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-emerald-400 font-mono text-xs focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">UAE WhatsApp Support *</label>
                <input
                  type="text"
                  value={companySettings.uaeWhatsApp}
                  onChange={(e) => updateCompanySettings({ uaeWhatsApp: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-emerald-400 font-mono text-xs focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Support Email</label>
                <input
                  type="email"
                  value={companySettings.supportEmail}
                  onChange={(e) => updateCompanySettings({ supportEmail: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Working Hours</label>
                <input
                  type="text"
                  value={companySettings.workingHours}
                  onChange={(e) => updateCompanySettings({ workingHours: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Official Consular Disclaimer Copy</label>
              <textarea
                rows={2}
                value={companySettings.consultationDisclaimers}
                onChange={(e) => updateCompanySettings({ consultationDisclaimers: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </form>
        </div>
      )}

      {/* MODAL 1: CLIENT EDIT MODAL */}
      {clientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-md rounded-3xl bg-[#0F1B3B] border border-[#D4AF37]/50 shadow-2xl p-6 text-white my-8 animate-in zoom-in-95 space-y-4">
            <h3 className="text-lg font-bold text-white">
              {editingClient ? 'Edit Client Profile' : 'Add New Client Profile'}
            </h3>

            <form onSubmit={handleSaveClient} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Contact Phone *</label>
                <input
                  type="tel"
                  required
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="client-active-toggle"
                  checked={clientActive}
                  onChange={(e) => setClientActive(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500"
                />
                <label htmlFor="client-active-toggle" className="text-xs text-slate-300 cursor-pointer">
                  Account Active & Permitted to Login
                </label>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setClientModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#D4AF37] text-[#0A1128] text-xs font-black"
                >
                  Save Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: APPLICATION MASTER EDIT MODAL */}
      {appModalOpen && editingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#0F1B3B] border border-[#D4AF37]/50 shadow-2xl p-6 sm:p-7 text-white my-8 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 space-y-4">
            <h3 className="text-lg font-black text-white">
              Master Application Editor: {editingApp.trackingNumber}
            </h3>
            <p className="text-xs text-slate-300">
              Admin has full authority to override fees, paid amounts, lifecycle status, applicant identity, and passport numbers.
            </p>

            <form onSubmit={handleSaveApp} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Country *</label>
                  <input
                    type="text"
                    required
                    value={appCountry}
                    onChange={(e) => setAppCountry(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">Visa Category *</label>
                  <input
                    type="text"
                    required
                    value={appCategory}
                    onChange={(e) => setAppCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">Tracking Number *</label>
                  <input
                    type="text"
                    required
                    value={appTrackingNo}
                    onChange={(e) => setAppTrackingNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-[#D4AF37] font-mono text-xs focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Lifecycle Status *</label>
                  <select
                    value={appStatus}
                    onChange={(e) => setAppStatus(e.target.value as ApplicationStatus)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                  >
                    <option value="draft">Draft</option>
                    <option value="submitted">Submitted</option>
                    <option value="under_initial_review">Under Initial Review</option>
                    <option value="documents_required">Documents Required</option>
                    <option value="documents_under_review">Documents Under Review</option>
                    <option value="processing">Processing</option>
                    <option value="ready_for_submission">Ready for Submission</option>
                    <option value="submitted_to_embassy">Submitted to Embassy</option>
                    <option value="decision_received">Decision Received</option>
                    <option value="completed">Completed</option>
                    <option value="on_hold">On Hold</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">Consultancy Fee (PKR) *</label>
                  <input
                    type="number"
                    value={appFee}
                    onChange={(e) => setAppFee(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs font-mono focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">Amount Paid (PKR) *</label>
                  <input
                    type="number"
                    value={appPaid}
                    onChange={(e) => setAppPaid(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-emerald-400 font-mono text-xs focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Client Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={appClientName}
                    onChange={(e) => setAppClientName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">Passport Number *</label>
                  <input
                    type="text"
                    value={appPassportNo}
                    onChange={(e) => setAppPassportNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs font-mono uppercase focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Assigned Staff Consultant</label>
                  <select
                    value={appStaffId}
                    onChange={(e) => setAppStaffId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                  >
                    <option value="">Unassigned</option>
                    {staffMembers.map((s) => (
                      <option key={s.uid} value={s.uid}>
                        {s.fullName} ({s.assignedSpecialty || 'Consultant'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">Payment Status</label>
                  <select
                    value={appPaymentStatus}
                    onChange={(e) => setAppPaymentStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="partial">Partial</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Client Visible Remark</label>
                <textarea
                  rows={2}
                  value={appClientRemarks}
                  onChange={(e) => setAppClientRemarks(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAppModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#D4AF37] text-[#0A1128] text-xs font-black shadow-md"
                >
                  Apply Master Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: STAFF EDIT MODAL */}
      {staffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-md rounded-3xl bg-[#0F1B3B] border border-[#D4AF37]/50 shadow-2xl p-6 text-white my-8 animate-in zoom-in-95 space-y-4">
            <h3 className="text-lg font-bold text-white">
              {editingStaff ? 'Edit Staff Officer' : 'Create Staff Officer'}
            </h3>

            <form onSubmit={handleSaveStaff} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Corporate Email *</label>
                <input
                  type="email"
                  required
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={staffPhone}
                  onChange={(e) => setStaffPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Assigned Specialty</label>
                <input
                  type="text"
                  value={staffSpecialty}
                  onChange={(e) => setStaffSpecialty(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="staff-active-toggle"
                  checked={staffActive}
                  onChange={(e) => setStaffActive(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500"
                />
                <label htmlFor="staff-active-toggle" className="text-xs text-slate-300 cursor-pointer">
                  Officer Account Active
                </label>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setStaffModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#D4AF37] text-[#0A1128] text-xs font-black"
                >
                  Save Officer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: CHANGE MASTER PASSWORD */}
      {changePwdOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-sm rounded-3xl bg-[#0F1B3B] border border-[#D4AF37]/50 shadow-2xl p-6 text-white my-8 animate-in zoom-in-95 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-[#D4AF37]" />
              <span>Change Master Password</span>
            </h3>

            {pwdChangeSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Master password updated successfully!</span>
              </div>
            )}

            {pwdChangeError && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{pwdChangeError}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Current Password *</label>
                <input
                  type="password"
                  required
                  value={oldPwd}
                  onChange={(e) => setOldPwd(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">New Master Password *</label>
                <input
                  type="password"
                  required
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setChangePwdOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#D4AF37] text-[#0A1128] text-xs font-black"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
