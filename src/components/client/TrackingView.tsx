import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  User,
  Calendar,
  CreditCard,
  Download,
  Share2,
  ExternalLink,
  MessageCircle,
  Upload,
  Lock,
  ChevronDown,
  ArrowLeft,
  XCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { ApplicationStatus, DocumentItem } from '../../types';
import { ReceiptModal } from '../common/ReceiptModal';

interface TrackingViewProps {
  onBack?: () => void;
}

export const TrackingView: React.FC<TrackingViewProps> = ({ onBack }) => {
  const {
    applications,
    selectedApplicationId,
    setSelectedApplicationId,
    documents,
    payments,
    statusHistory,
    internalNotes,
    companySettings,
    uploadDocument,
  } = useApp();
  const { activeRole, currentUser } = useAuth();

  const [receiptModalPayment, setReceiptModalPayment] = useState<any | null>(null);
  const [reuploadDocId, setReuploadDocId] = useState<string | null>(null);
  const [reuploadFileTitle, setReuploadFileTitle] = useState('');

  // Strict privacy: Clients can ONLY see their own applications. Staff see assigned; Super Admin sees all.
  const isPrivileged = activeRole === 'staff' || activeRole === 'super_admin';
  const scopedApps =
    activeRole === 'super_admin'
      ? applications
      : activeRole === 'staff'
      ? applications.filter((a) => a.assignedStaffId === currentUser?.uid)
      : applications.filter((a) => Boolean(currentUser?.uid) && a.clientId === currentUser?.uid);

  const activeApp =
    scopedApps.find((a) => a.id === selectedApplicationId) || scopedApps[0];

  const appHistory = statusHistory.filter((h) => h.applicationId === activeApp?.id);
  const appDocs = documents.filter((d) => d.applicationId === activeApp?.id);
  const appPayments = payments.filter((p) => p.applicationId === activeApp?.id);

  // Filter internal notes: STRICTLY visible to staff & super_admin only!
  const appInternalNotes = isPrivileged
    ? internalNotes.filter((n) => n.applicationId === activeApp?.id)
    : [];

  const allStatuses: { id: ApplicationStatus; label: string; step: number }[] = [
    { id: 'submitted', label: 'Submitted', step: 1 },
    { id: 'under_initial_review', label: 'Under Initial Review', step: 2 },
    { id: 'documents_required', label: 'Documents Required', step: 3 },
    { id: 'documents_under_review', label: 'Documents Under Review', step: 4 },
    { id: 'processing', label: 'Processing & File Prep', step: 5 },
    { id: 'ready_for_submission', label: 'Ready for Submission', step: 6 },
    { id: 'submitted_to_embassy', label: 'Submitted to Embassy', step: 7 },
    { id: 'decision_received', label: 'Decision Received', step: 8 },
    { id: 'completed', label: 'Completed', step: 9 },
  ];

  const getCurrentStepIndex = (status: ApplicationStatus) => {
    const found = allStatuses.findIndex((s) => s.id === status);
    return found !== -1 ? found : 0;
  };

  const handleReuploadSubmit = async (docItem: DocumentItem) => {
    if (!reuploadFileTitle.trim() || !activeApp) return;
    await uploadDocument({
      applicationId: activeApp.id,
      clientId: activeApp.clientId,
      category: docItem.category,
      title: reuploadFileTitle.trim(),
      fileName: `${reuploadFileTitle.replace(/\s+/g, '_')}_Updated.pdf`,
      fileSize: '2.4 MB',
      fileType: 'application/pdf',
    });
    setReuploadDocId(null);
    setReuploadFileTitle('');
  };

  if (!activeApp) {
    return (
      <div className="p-8 text-center rounded-3xl bg-[#101F42] border border-white/10 space-y-2">
        <Lock className="w-8 h-8 text-[#D4AF37] mx-auto" />
        <p className="text-sm font-bold text-white">No Private Applications Found</p>
        <p className="text-xs text-slate-400">
          For your privacy, only your own visa applications are visible here.
        </p>
      </div>
    );
  }

  const currentStepIdx = getCurrentStepIndex(activeApp.status);

  return (
    <div className="space-y-6 pb-20">
      {/* Multi-Application Switcher (Strictly Scoped to Authorized Applications) */}
      {scopedApps.length > 1 && (
        <div className="rounded-2xl bg-[#101F42] border border-white/10 p-3 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-300">
            Select Application ({scopedApps.length}):
          </span>
          <select
            value={activeApp.id}
            onChange={(e) => setSelectedApplicationId(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#0A1128] border border-[#D4AF37]/40 text-xs text-white focus:outline-none"
          >
            {scopedApps.map((app) => (
              <option key={app.id} value={app.id}>
                {app.trackingNumber} — {app.country} ({activeRole === 'client' ? app.visaCategory : app.clientName})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Top Header Card */}
      <div className="rounded-3xl bg-[#101F42] border border-white/10 p-5 sm:p-7 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#D4AF37]">
                Live Case Tracking
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400">
                Lodged {new Date(activeApp.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
              {activeApp.country} – {activeApp.visaCategory}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="px-3 py-1 rounded-lg bg-[#0A1128] border border-white/15 font-mono text-sm font-extrabold text-[#D4AF37] select-all">
                {activeApp.trackingNumber}
              </span>
              <span className="text-xs text-slate-300">
                Client: <strong>{activeApp.clientName}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/${companySettings.pakistanWhatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                `Hello GAC Advisors, I am checking the status of my application: ${activeApp.trackingNumber} (${activeApp.country})`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span>Case WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Assigned Staff Banner */}
        <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Assigned Case Officer: <strong className="text-slate-200">{activeApp.assignedStaffName || 'Pending Assignment'}</strong></span>
          </div>
          <div className="text-emerald-400 font-semibold">
            Status: {activeApp.status.toUpperCase().replace(/_/g, ' ')}
          </div>
        </div>
      </div>

      {/* 12-Stage Visual Progress Stepper */}
      <div className="rounded-3xl bg-[#101F42] border border-white/10 p-5 sm:p-6 shadow-xl">
        <h2 className="text-xs font-bold text-[#F3E5AB] uppercase tracking-wider mb-4">
          Milestone Timeline
        </h2>

        {/* Horizontal Stepper for Larger Screens / Vertical for Mobile */}
        <div className="space-y-4">
          <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
            {allStatuses.map((st, idx) => {
              const isPast = idx < currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              return (
                <div key={st.id} className="flex flex-col items-center text-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      isCurrent
                        ? 'bg-[#D4AF37] text-[#0A1128] ring-4 ring-amber-500/20 scale-110 shadow-lg'
                        : isPast
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-white/5 text-slate-500 border border-white/10'
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span
                    className={`text-[10px] mt-2 font-medium leading-tight max-w-[80px] line-clamp-2 ${
                      isCurrent
                        ? 'text-[#D4AF37] font-bold'
                        : isPast
                        ? 'text-slate-200'
                        : 'text-slate-500'
                    }`}
                  >
                    {st.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Current Stage Highlight Box */}
          <div className="p-4 rounded-2xl bg-[#0A1128] border border-white/10 mt-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-xs font-bold text-white uppercase">Current Stage Notes</span>
            </div>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {activeApp.clientRemarks ||
                'Your file is actively being handled by our legal advisors. You will be notified instantly when embassy actions or documents are required.'}
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Documents & Payments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Verification Documents */}
        <div className="rounded-3xl bg-[#101F42] border border-white/10 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-[#F3E5AB] uppercase tracking-wider">
              Document Audit Status ({appDocs.length})
            </h2>
          </div>

          <div className="space-y-2.5">
            {appDocs.length === 0 ? (
              <p className="text-xs text-slate-400 py-3">No documents uploaded for this case yet.</p>
            ) : (
              appDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3 rounded-2xl bg-[#0A1128]/70 border border-white/10 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-white">{doc.title}</div>
                        <div className="text-[10px] text-slate-400">{doc.fileName}</div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        doc.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : doc.status === 'reupload_requested'
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {doc.status.toUpperCase().replace('_', ' ')}
                    </span>
                  </div>

                  {doc.rejectionReason && (
                    <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-300">
                      <strong>Audit Notice:</strong> {doc.rejectionReason}
                    </div>
                  )}

                  {doc.status === 'reupload_requested' && (
                    <div>
                      {reuploadDocId === doc.id ? (
                        <div className="space-y-2 pt-2 border-t border-white/10">
                          <input
                            type="text"
                            placeholder="e.g. Attested Bank Statement"
                            value={reuploadFileTitle}
                            onChange={(e) => setReuploadFileTitle(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-[#101F42] border border-white/15 text-xs text-white"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleReuploadSubmit(doc)}
                              className="px-3 py-1 bg-[#D4AF37] text-[#0A1128] text-xs font-bold rounded-lg cursor-pointer"
                            >
                              Upload Revised File
                            </button>
                            <button
                              onClick={() => setReuploadDocId(null)}
                              className="px-2 py-1 text-slate-400 text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setReuploadDocId(doc.id)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400 hover:text-rose-300"
                        >
                          <Upload className="w-3 h-3" />
                          <span>Re-upload Document Now</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Payment & Receipts Card */}
        <div className="rounded-3xl bg-[#101F42] border border-white/10 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-[#F3E5AB] uppercase tracking-wider">
              Fee Records & Invoices
            </h2>
            <CreditCard className="w-4 h-4 text-[#D4AF37]" />
          </div>

          <div className="p-4 rounded-2xl bg-[#0A1128] border border-white/10 space-y-2.5 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Agreed Consultancy Fee:</span>
              <strong className="text-white">PKR {activeApp.consultancyFee.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Amount Paid:</span>
              <strong className="text-emerald-400">PKR {activeApp.amountPaid.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between text-slate-300 pt-1 border-t border-white/10">
              <span>Remaining Balance:</span>
              <strong className="text-amber-400">
                PKR {Math.max(0, activeApp.consultancyFee - activeApp.amountPaid).toLocaleString()}
              </strong>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-300 uppercase">Payment Receipts</h3>
            {appPayments.length === 0 ? (
              <p className="text-xs text-slate-400">No payment receipts registered yet.</p>
            ) : (
              appPayments.map((pay) => (
                <div
                  key={pay.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#0A1128]/70 border border-white/10"
                >
                  <div>
                    <div className="text-xs font-bold text-white">{pay.receiptNumber}</div>
                    <div className="text-[10px] text-slate-400">
                      PKR {pay.amount.toLocaleString()} • {pay.method.replace('_', ' ')} • {pay.status.toUpperCase()}
                    </div>
                  </div>
                  <button
                    onClick={() => setReceiptModalPayment(pay)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-bold transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Receipt</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Internal Staff Notes: STRICTLY PROTECTED (VISIBLE TO STAFF & ADMIN ONLY) */}
      {isPrivileged && (
        <div className="rounded-3xl bg-[#1C2541]/80 border border-amber-500/30 p-5 shadow-xl space-y-3">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Internal Case Notes (Restricted Staff & Admin View)
            </h2>
          </div>
          <p className="text-[11px] text-slate-400">
            Confidential case notes are protected by Firestore security rules and are never visible to the client.
          </p>

          <div className="space-y-2">
            {appInternalNotes.length === 0 ? (
              <p className="text-xs text-slate-400">No internal notes for this file yet.</p>
            ) : (
              appInternalNotes.map((note) => (
                <div key={note.id} className="p-3 rounded-xl bg-[#0A1128] border border-white/10 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span className="font-bold text-white">{note.authorName} ({note.authorRole})</span>
                    <span>{new Date(note.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-slate-200">{note.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {receiptModalPayment && (
        <ReceiptModal
          payment={receiptModalPayment}
          application={activeApp}
          onClose={() => setReceiptModalPayment(null)}
        />
      )}
    </div>
  );
};
