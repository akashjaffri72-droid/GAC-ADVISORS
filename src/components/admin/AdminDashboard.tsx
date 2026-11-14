import React, { useState } from 'react';
import {
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  Download,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  UserPlus,
  Send,
  Lock,
  Edit,
  Eye,
  MessageSquare,
  Sparkles,
  KeyRound,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Application, ApplicationStatus } from '../../types';
import { ReceiptModal } from '../common/ReceiptModal';

export const AdminDashboard: React.FC = () => {
  const {
    applications,
    updateApplicationStatus,
    assignStaffToApplication,
    staffMembers,
    payments,
    appointments,
    services,
    setSelectedApplicationId,
    setActiveTab,
    sendBroadcastAnnouncement,
  } = useApp();
  const { activeRole, currentUser } = useAuth();

  const isSuperAdmin = activeRole === 'super_admin';

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCountry, setFilterCountry] = useState('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterStaff, setFilterStaff] = useState('all');

  // Modal State for Status & Note Editing
  const [selectedAppForEdit, setSelectedAppForEdit] = useState<Application | null>(null);
  const [editStatus, setEditStatus] = useState<ApplicationStatus>('under_initial_review');
  const [editRemarks, setEditRemarks] = useState('');
  const [editInternalNote, setEditInternalNote] = useState('');
  const [selectedAssigneeId, setSelectedAssigneeId] = useState('');

  // Announcement state
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementMsg, setAnnouncementMsg] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Filter applications: if staff, only view assigned cases (if super admin, view all)
  const scopedApps = applications.filter((app) => {
    if (isSuperAdmin) return true;
    return app.assignedStaffId === currentUser?.uid;
  });

  const filteredApps = scopedApps.filter((app) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      app.trackingNumber.toLowerCase().includes(query) ||
      app.clientName.toLowerCase().includes(query) ||
      app.clientEmail.toLowerCase().includes(query) ||
      app.country.toLowerCase().includes(query);

    const matchesCountry = filterCountry === 'all' || app.country === filterCountry;
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    const matchesStaff = filterStaff === 'all' || app.assignedStaffId === filterStaff;

    return matchesSearch && matchesCountry && matchesStatus && matchesStaff;
  });

  // Calculate high-level financial and operational analytics
  const totalApps = scopedApps.length;
  const pendingApps = scopedApps.filter((a) =>
    ['submitted', 'under_initial_review', 'documents_required', 'documents_under_review'].includes(a.status)
  ).length;
  const inProcessing = scopedApps.filter((a) =>
    ['processing', 'ready_for_submission', 'submitted_to_embassy'].includes(a.status)
  ).length;
  const completedApps = scopedApps.filter((a) => ['completed', 'decision_received'].includes(a.status)).length;

  const totalRevenue = scopedApps.reduce((acc, curr) => acc + (curr.amountPaid || 0), 0);
  const totalReceivables = scopedApps.reduce(
    (acc, curr) => acc + Math.max(0, (curr.consultancyFee || 0) - (curr.amountPaid || 0)),
    0
  );

  const countries = ['all', ...Array.from(new Set(scopedApps.map((a) => a.country)))];

  const handleExportCSV = () => {
    const headers = [
      'Tracking Number',
      'Client Name',
      'Email',
      'Country',
      'Visa Category',
      'Status',
      'Assigned Staff',
      'Consultancy Fee',
      'Amount Paid',
      'Payment Status',
      'Created Date',
    ];

    const rows = filteredApps.map((a) => [
      a.trackingNumber,
      `"${a.clientName}"`,
      a.clientEmail,
      a.country,
      a.visaCategory,
      a.status,
      `"${a.assignedStaffName || 'Unassigned'}"`,
      a.consultancyFee,
      a.amountPaid,
      a.paymentStatus,
      new Date(a.createdAt).toISOString(),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GAC_Advisors_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenEditModal = (app: Application) => {
    setSelectedAppForEdit(app);
    setEditStatus(app.status);
    setEditRemarks(app.clientRemarks || '');
    setEditInternalNote('');
    setSelectedAssigneeId(app.assignedStaffId || '');
  };

  const handleSaveStatus = async () => {
    if (!selectedAppForEdit) return;

    await updateApplicationStatus(
      selectedAppForEdit.id,
      editStatus,
      editRemarks,
      editInternalNote
    );

    if (isSuperAdmin && selectedAssigneeId !== selectedAppForEdit.assignedStaffId) {
      const staff = staffMembers.find((s) => s.uid === selectedAssigneeId);
      if (staff) {
        await assignStaffToApplication(selectedAppForEdit.id, staff.uid, staff.fullName);
      }
    }

    setSelectedAppForEdit(null);
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementTitle.trim() || !announcementMsg.trim()) return;
    await sendBroadcastAnnouncement(announcementTitle.trim(), announcementMsg.trim());
    setAnnouncementTitle('');
    setAnnouncementMsg('');
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 4000);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#101F42] via-[#162752] to-[#0A1128] border border-white/10 p-5 sm:p-7 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-[#D4AF37] text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>
                {isSuperAdmin ? 'Super Admin Management Suite' : 'Staff Case Officer Suite'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {isSuperAdmin ? 'GAC Advisors Enterprise Executive Dashboard' : 'Assigned Case Management'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Audit client applications, verify submitted biometric & financial documents, update embassy filing statuses, and govern fee transactions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:brightness-110 text-[#0A1128] text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Financial & Caseload Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-2xl bg-[#101F42] border border-white/10 p-3.5">
          <div className="text-slate-400 text-xs">Total Cases</div>
          <div className="text-2xl font-black text-white mt-1">{totalApps}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Active records</div>
        </div>

        <div className="rounded-2xl bg-[#101F42] border border-white/10 p-3.5">
          <div className="text-slate-400 text-xs">In Review</div>
          <div className="text-2xl font-black text-amber-400 mt-1">{pendingApps}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Audit needed</div>
        </div>

        <div className="rounded-2xl bg-[#101F42] border border-white/10 p-3.5">
          <div className="text-slate-400 text-xs">Processing</div>
          <div className="text-2xl font-black text-cyan-400 mt-1">{inProcessing}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Filing / Embassy</div>
        </div>

        <div className="rounded-2xl bg-[#101F42] border border-white/10 p-3.5">
          <div className="text-slate-400 text-xs">Decisions</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{completedApps}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Approved cases</div>
        </div>

        <div className="rounded-2xl bg-[#101F42] border border-white/10 p-3.5">
          <div className="text-slate-400 text-xs">Revenue Logged</div>
          <div className="text-lg font-black text-emerald-400 mt-1 truncate">
            PKR {totalRevenue.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Verified fees</div>
        </div>

        <div className="rounded-2xl bg-[#101F42] border border-white/10 p-3.5">
          <div className="text-slate-400 text-xs">Receivables</div>
          <div className="text-lg font-black text-amber-400 mt-1 truncate">
            PKR {totalReceivables.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Pending balances</div>
        </div>
      </div>

      {/* Exclusive Master Admin Control Vault Banner */}
      {isSuperAdmin && (
        <div
          onClick={() => setActiveTab('admin_master')}
          className="rounded-3xl bg-gradient-to-r from-[#1E293B] via-[#0F1B3B] to-[#1C2541] border-2 border-[#D4AF37] p-5 shadow-2xl cursor-pointer hover:border-amber-400 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#AA820A] flex items-center justify-center text-[#0A1128] shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform shrink-0">
              <KeyRound className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-widest text-[#D4AF37]">
                  Dedicated Security Block
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                  PASSWORD PROTECTED
                </span>
              </div>
              <h3 className="text-lg font-black text-white mt-0.5">
                Admin Master Control Vault & Full Overwrite Hub
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Manage and edit every client, staff member, fee, application, and system setting with password-gated access.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-[#0A1128] font-black text-xs shadow-md group-hover:brightness-110 transition-all flex items-center gap-1.5">
              <span>Open Master Vault</span>
              <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      )}

      {/* Super Admin Quick Controls: Services, Staff, Broadcasts */}
      {isSuperAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            onClick={() => setActiveTab('services')}
            className="p-4 rounded-2xl bg-[#101F42] hover:bg-[#152752] border border-white/10 cursor-pointer transition-all flex items-center justify-between"
          >
            <div>
              <div className="text-xs font-bold text-[#D4AF37] uppercase">Visa Services Catalog</div>
              <div className="text-sm font-black text-white mt-1">Manage 12 Global Countries</div>
              <div className="text-[11px] text-slate-400">Edit fees, requirements & timelines</div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          <div
            onClick={() => setActiveTab('staff')}
            className="p-4 rounded-2xl bg-[#101F42] hover:bg-[#152752] border border-white/10 cursor-pointer transition-all flex items-center justify-between"
          >
            <div>
              <div className="text-xs font-bold text-[#D4AF37] uppercase">Staff & Caseloads</div>
              <div className="text-sm font-black text-white mt-1">{staffMembers.length} Staff Officers</div>
              <div className="text-[11px] text-slate-400">Assign cases, create staff accounts</div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          <div
            onClick={() => setActiveTab('payments')}
            className="p-4 rounded-2xl bg-[#101F42] hover:bg-[#152752] border border-white/10 cursor-pointer transition-all flex items-center justify-between"
          >
            <div>
              <div className="text-xs font-bold text-[#D4AF37] uppercase">Fee Records & Accounts</div>
              <div className="text-sm font-black text-white mt-1">{payments.length} Logged Transactions</div>
              <div className="text-[11px] text-slate-400">Verify bank transfers, print receipts</div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="rounded-3xl bg-[#101F42] border border-white/10 p-4 sm:p-5 shadow-xl space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="relative sm:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search applicant, tracking ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          <div>
            <select
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
            >
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c === 'all' ? 'All Countries' : c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
            >
              <option value="all">All Application Statuses (12 Stages)</option>
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

          {isSuperAdmin && (
            <div>
              <select
                value={filterStaff}
                onChange={(e) => setFilterStaff(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
              >
                <option value="all">All Assigned Staff</option>
                {staffMembers.map((s) => (
                  <option key={s.uid} value={s.uid}>
                    {s.fullName} ({s.assignedSpecialty || 'Consultant'})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Applications Data Table */}
      <div className="rounded-3xl bg-[#101F42] border border-white/10 shadow-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#F3E5AB] uppercase tracking-wider">
            Case Registry ({filteredApps.length})
          </h2>
          <span className="text-xs text-slate-400">
            Showing real-time synced files
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0A1128] text-slate-400 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-4 py-3">Tracking & Country</th>
                <th className="px-4 py-3">Client Details</th>
                <th className="px-4 py-3">Current Status</th>
                <th className="px-4 py-3">Assigned Staff</th>
                <th className="px-4 py-3">Fee / Paid</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                    No matching applications found.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-mono font-bold text-[#D4AF37]">{app.trackingNumber}</div>
                      <div className="font-semibold text-white mt-0.5">{app.country}</div>
                      <div className="text-[10px] text-slate-400">{app.visaCategory}</div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-bold text-white">{app.clientName}</div>
                      <div className="text-[11px] text-slate-400">{app.clientPhone}</div>
                      <div className="text-[10px] text-slate-500">{app.clientEmail}</div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border border-white/10 bg-white/5 text-amber-300">
                        {app.status.toUpperCase().replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="text-white font-medium">
                        {app.assignedStaffName || 'Unassigned'}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="text-white font-mono">
                        PKR {app.consultancyFee.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-emerald-400 font-semibold">
                        Paid: PKR {app.amountPaid.toLocaleString()}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-right space-x-1.5">
                      <button
                        onClick={() => handleOpenEditModal(app)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#D4AF37] hover:brightness-110 text-[#0A1128] font-bold text-[11px] transition-all cursor-pointer shadow-sm"
                      >
                        Update Stage
                      </button>
                      <button
                        onClick={() => {
                          setSelectedApplicationId(app.id);
                          setActiveTab('tracking');
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 font-bold text-[11px] transition-all cursor-pointer"
                      >
                        Track View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Broadcast Announcement Module for Super Admin */}
      {isSuperAdmin && (
        <div className="rounded-3xl bg-[#101F42] border border-white/10 p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="text-sm font-bold text-[#F3E5AB] uppercase tracking-wider">
              Broadcast Client Announcements
            </h2>
          </div>
          <p className="text-xs text-slate-300">
            Publish real-time consular notifications, embassy appointment slot openings, and visa policy updates to all active clients.
          </p>

          {broadcastSent && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Broadcast announcement dispatched to all client notifications.</span>
            </div>
          )}

          <form onSubmit={handleSendBroadcast} className="space-y-3">
            <input
              type="text"
              placeholder="Announcement Subject (e.g., USA Embassy Summer Slot Opening)"
              value={announcementTitle}
              onChange={(e) => setAnnouncementTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
            />
            <textarea
              rows={2}
              placeholder="Detailed announcement copy and guidance for prospective applicants..."
              value={announcementMsg}
              onChange={(e) => setAnnouncementMsg(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D4AF37] hover:brightness-110 text-[#0A1128] font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Broadcast</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Status & Case Update Modal */}
      {selectedAppForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#0F1B3B] border border-[#D4AF37]/50 shadow-2xl p-6 sm:p-7 text-white my-8 animate-in zoom-in-95 space-y-4">
            <div className="border-b border-white/10 pb-3">
              <div className="font-mono text-xs text-[#D4AF37] font-bold">
                {selectedAppForEdit.trackingNumber}
              </div>
              <h3 className="text-lg font-black text-white">
                Update Case Progress & Documents
              </h3>
              <p className="text-xs text-slate-300">
                Client: {selectedAppForEdit.clientName} ({selectedAppForEdit.country})
              </p>
            </div>

            {/* Status Selector across 12 stages */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Application Status Stage (12 Lifecycle Stages) *
              </label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as ApplicationStatus)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
              >
                <option value="draft">1. Draft</option>
                <option value="submitted">2. Submitted</option>
                <option value="under_initial_review">3. Under Initial Review</option>
                <option value="documents_required">4. Documents Required</option>
                <option value="documents_under_review">5. Documents Under Review</option>
                <option value="processing">6. Processing</option>
                <option value="ready_for_submission">7. Ready for Submission</option>
                <option value="submitted_to_embassy">8. Submitted to Embassy</option>
                <option value="decision_received">9. Decision Received</option>
                <option value="completed">10. Completed</option>
                <option value="on_hold">11. On Hold</option>
                <option value="cancelled">12. Cancelled</option>
              </select>
            </div>

            {/* Staff Assignment (Super Admin Only) */}
            {isSuperAdmin && (
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Assigned Case Officer
                </label>
                <select
                  value={selectedAssigneeId}
                  onChange={(e) => setSelectedAssigneeId(e.target.value)}
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
            )}

            {/* Client-visible remark */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Client-Visible Remark (Shown on Client Dashboard & Timeline)
              </label>
              <textarea
                rows={2}
                value={editRemarks}
                onChange={(e) => setEditRemarks(e.target.value)}
                placeholder="e.g. Your DS-160 has been filed. Please bring original bank statement for mock interview."
                className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            {/* Internal Staff/Admin Note */}
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <label className="text-xs font-semibold text-amber-400">
                  Internal Private Note (Strictly Staff/Admin Only - NEVER shown to client)
                </label>
              </div>
              <textarea
                rows={2}
                value={editInternalNote}
                onChange={(e) => setEditInternalNote(e.target.value)}
                placeholder="Confidential case notes, interview coaching assessment, sponsor financial verification..."
                className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedAppForEdit(null)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveStatus}
                className="px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:brightness-110 text-[#0A1128] font-black text-xs transition-all cursor-pointer shadow-md"
              >
                Save & Notify Client
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
